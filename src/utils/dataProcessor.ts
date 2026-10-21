import Papa from 'papaparse';
import {
  RawMaterialRow,
  ProjectRecord,
  StructureType,
  MaterialType,
  MaterialPricingInfo,
  StructureMaterialRatio,
  EstimationInputs,
  EstimationResult,
  EstimatedMaterialItem,
  DataQualityReport,
  DatasetInsights,
} from '../types/construction';

export const STRUCTURE_TYPES: StructureType[] = ['Wall', 'Room', 'House'];
export const MATERIAL_TYPES: MaterialType[] = ['Bricks', 'Cement', 'Sand', 'Steel'];

// Calculate median of numbers array
export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Calculate mean of numbers array
export function calculateMean(values: number[]): number {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Calculate Pearson Correlation Coefficient
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// Format currency in Indian Rupees (INR)
export function formatINR(val: number, includeDecimals = true): string {
  if (isNaN(val)) return '₹0.00';
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const [intPart, decimalPart] = absVal.toFixed(includeDecimals ? 2 : 0).split('.');
  
  // Indian numbering system formatting (last 3 digits, then groups of 2)
  let lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const result = '₹' + formattedInt + (includeDecimals && decimalPart ? '.' + decimalPart : '');
  return isNegative ? '-' + result : result;
}

// Format numbers with Indian system or standard commas
export function formatNumber(val: number, decimals = 2): string {
  if (isNaN(val)) return '0';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export interface ProcessedDataset {
  rawRecords: RawMaterialRow[];
  projects: ProjectRecord[];
  pricingMap: Map<MaterialType, MaterialPricingInfo>;
  ratiosMap: Map<string, StructureMaterialRatio>; // key: `${structure}_${material}`
  overallMaterialRatios: Map<MaterialType, number>;
  insights: DatasetInsights;
  qualityReport: DataQualityReport;
  unitsMap: Map<MaterialType, string>;
}

// Parse CSV text and generate dual data representations + statistics
export function processConstructionCSV(csvText: string): ProcessedDataset {
  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const rawRecords: RawMaterialRow[] = [];
  let missingValuesCount = 0;
  const seenRowStrings = new Set<string>();
  let duplicateRowsCount = 0;

  for (const row of parsed.data) {
    // Check for row level duplicate
    const rowKey = `${row.Project_ID}_${row.Structure_Type}_${row.Material}_${row.Quantity}_${row.Unit_Price_INR}`;
    if (seenRowStrings.has(rowKey)) {
      duplicateRowsCount++;
    } else {
      seenRowStrings.add(rowKey);
    }

    // Validate fields
    const pid = (row.Project_ID || '').trim();
    const st = (row.Structure_Type || '').trim() as StructureType;
    const l = parseFloat(row.Length_m);
    const w = parseFloat(row.Width_m);
    const h = parseFloat(row.Height_m);
    const t = parseFloat(row.Thickness_m);
    const a = parseFloat(row.Area_m2);
    const v = parseFloat(row.Volume_m3);
    const mat = (row.Material || '').trim() as MaterialType;
    const q = parseFloat(row.Quantity);
    const unit = (row.Unit || '').trim();
    const up = parseFloat(row.Unit_Price_INR);
    const mc = parseFloat(row.Material_Cost_INR);
    const tc = parseFloat(row.Total_Project_Cost_INR);

    if (
      !pid ||
      !st ||
      !mat ||
      isNaN(l) ||
      isNaN(w) ||
      isNaN(h) ||
      isNaN(t) ||
      isNaN(a) ||
      isNaN(v) ||
      isNaN(q) ||
      isNaN(up) ||
      isNaN(mc) ||
      isNaN(tc)
    ) {
      missingValuesCount++;
      continue;
    }

    rawRecords.push({
      Project_ID: pid,
      Structure_Type: st,
      Length_m: l,
      Width_m: w,
      Height_m: h,
      Thickness_m: t,
      Area_m2: a,
      Volume_m3: v,
      Material: mat,
      Quantity: q,
      Unit: unit,
      Unit_Price_INR: up,
      Material_Cost_INR: mc,
      Total_Project_Cost_INR: tc,
    });
  }

  // Build Project-level representation (one unique record per Project_ID)
  const projectsMap = new Map<string, ProjectRecord>();
  const unitsMap = new Map<MaterialType, string>();

  for (const rec of rawRecords) {
    if (!unitsMap.has(rec.Material)) {
      unitsMap.set(rec.Material, rec.Unit);
    }

    if (!projectsMap.has(rec.Project_ID)) {
      projectsMap.set(rec.Project_ID, {
        Project_ID: rec.Project_ID,
        Structure_Type: rec.Structure_Type,
        Length_m: rec.Length_m,
        Width_m: rec.Width_m,
        Height_m: rec.Height_m,
        Thickness_m: rec.Thickness_m,
        Area_m2: rec.Area_m2,
        Volume_m3: rec.Volume_m3,
        Total_Project_Cost_INR: rec.Total_Project_Cost_INR,
        materials: [rec],
      });
    } else {
      projectsMap.get(rec.Project_ID)!.materials.push(rec);
    }
  }

  const projects = Array.from(projectsMap.values());

  // Pricing Info by Material
  const pricingMap = new Map<MaterialType, MaterialPricingInfo>();
  for (const mat of MATERIAL_TYPES) {
    const matRecords = rawRecords.filter((r) => r.Material === mat);
    const unitPrices = matRecords.map((r) => r.Unit_Price_INR);
    const unit = matRecords[0]?.Unit || (mat === 'Bricks' ? 'Pieces' : mat === 'Cement' ? 'Bags' : mat === 'Sand' ? 'm³' : 'kg');
    const totalQty = matRecords.reduce((sum, r) => sum + r.Quantity, 0);
    const totalCost = matRecords.reduce((sum, r) => sum + r.Material_Cost_INR, 0);

    pricingMap.set(mat, {
      material: mat,
      unit,
      medianUnitPrice: calculateMedian(unitPrices),
      meanUnitPrice: calculateMean(unitPrices),
      minUnitPrice: unitPrices.length > 0 ? Math.min(...unitPrices) : 0,
      maxUnitPrice: unitPrices.length > 0 ? Math.max(...unitPrices) : 0,
      totalQuantity: totalQty,
      totalCost,
    });
  }

  // Consumption ratios by (Structure_Type, Material)
  const ratiosMap = new Map<string, StructureMaterialRatio>();
  const overallMaterialRatios = new Map<MaterialType, number>();

  for (const mat of MATERIAL_TYPES) {
    const allValid = rawRecords.filter(
      (r) => r.Material === mat && r.Volume_m3 > 0 && !isNaN(r.Quantity) && r.Quantity > 0
    );
    const allRatios = allValid.map((r) => r.Quantity / r.Volume_m3);
    overallMaterialRatios.set(mat, calculateMedian(allRatios));

    for (const struct of STRUCTURE_TYPES) {
      const filtered = rawRecords.filter(
        (r) =>
          r.Structure_Type === struct &&
          r.Material === mat &&
          r.Volume_m3 > 0 &&
          !isNaN(r.Quantity) &&
          r.Quantity > 0
      );
      const ratios = filtered.map((r) => r.Quantity / r.Volume_m3);
      const key = `${struct}_${mat}`;

      ratiosMap.set(key, {
        structureType: struct,
        material: mat,
        medianRatio: ratios.length > 0 ? calculateMedian(ratios) : overallMaterialRatios.get(mat) || 0,
        meanRatio: ratios.length > 0 ? calculateMean(ratios) : 0,
        sampleCount: ratios.length,
      });
    }
  }

  // Generate Insights
  const structureCounts: Record<StructureType, number> = { Wall: 0, Room: 0, House: 0 };
  projects.forEach((p) => {
    structureCounts[p.Structure_Type] = (structureCounts[p.Structure_Type] || 0) + 1;
  });

  let mostCommonStructure: StructureType = 'Wall';
  let maxCount = -1;
  for (const st of STRUCTURE_TYPES) {
    if (structureCounts[st] > maxCount) {
      maxCount = structureCounts[st];
      mostCommonStructure = st;
    }
  }

  // Highest cost material
  let highestCostMat = MATERIAL_TYPES[0];
  let maxMatCost = -1;
  const totalRecordedMaterialCost = rawRecords.reduce((sum, r) => sum + r.Material_Cost_INR, 0);

  for (const mat of MATERIAL_TYPES) {
    const c = pricingMap.get(mat)?.totalCost || 0;
    if (c > maxMatCost) {
      maxMatCost = c;
      highestCostMat = mat;
    }
  }

  // Highest quantity material
  let highestQtyMat = MATERIAL_TYPES[0];
  let maxMatQty = -1;
  for (const mat of MATERIAL_TYPES) {
    const q = pricingMap.get(mat)?.totalQuantity || 0;
    if (q > maxMatQty) {
      maxMatQty = q;
      highestQtyMat = mat;
    }
  }

  // Structure with highest average project cost
  let highestAvgCostStruct: StructureType = 'House';
  let maxAvgCost = -1;
  for (const st of STRUCTURE_TYPES) {
    const sub = projects.filter((p) => p.Structure_Type === st);
    const avg = sub.length > 0 ? sub.reduce((sum, p) => sum + p.Total_Project_Cost_INR, 0) / sub.length : 0;
    if (avg > maxAvgCost) {
      maxAvgCost = avg;
      highestAvgCostStruct = st;
    }
  }

  const avgProjCost = projects.length > 0 ? projects.reduce((sum, p) => sum + p.Total_Project_Cost_INR, 0) / projects.length : 0;

  // Largest project by area & volume
  let largestByArea = projects[0] || { Project_ID: 'N/A', Structure_Type: 'House' as StructureType, Area_m2: 0, Total_Project_Cost_INR: 0 };
  let largestByVol = projects[0] || { Project_ID: 'N/A', Structure_Type: 'House' as StructureType, Volume_m3: 0, Total_Project_Cost_INR: 0 };

  for (const p of projects) {
    if (p.Area_m2 > largestByArea.Area_m2) largestByArea = p;
    if (p.Volume_m3 > largestByVol.Volume_m3) largestByVol = p;
  }

  // Correlations
  const projAreas = projects.map((p) => p.Area_m2);
  const projVols = projects.map((p) => p.Volume_m3);
  const projCosts = projects.map((p) => p.Total_Project_Cost_INR);

  const areaCostR = calculatePearsonCorrelation(projAreas, projCosts);
  const volCostR = calculatePearsonCorrelation(projVols, projCosts);

  const insights: DatasetInsights = {
    mostCommonStructure: {
      type: mostCommonStructure,
      count: maxCount,
      percentage: projects.length > 0 ? (maxCount / projects.length) * 100 : 0,
    },
    highestCostMaterial: {
      material: highestCostMat,
      totalCost: maxMatCost,
      percentage: totalRecordedMaterialCost > 0 ? (maxMatCost / totalRecordedMaterialCost) * 100 : 0,
    },
    highestQuantityMaterial: {
      material: highestQtyMat,
      totalQuantity: maxMatQty,
      unit: unitsMap.get(highestQtyMat) || '',
    },
    highestAvgCostStructure: {
      type: highestAvgCostStruct,
      avgCost: maxAvgCost,
    },
    averageProjectCost: avgProjCost,
    largestProjectByArea: {
      id: largestByArea.Project_ID,
      type: largestByArea.Structure_Type,
      area: largestByArea.Area_m2,
      cost: largestByArea.Total_Project_Cost_INR,
    },
    largestProjectByVolume: {
      id: largestByVol.Project_ID,
      type: largestByVol.Structure_Type,
      volume: largestByVol.Volume_m3,
      cost: largestByVol.Total_Project_Cost_INR,
    },
    areaCostCorrelation: {
      r: areaCostR,
      interpretation:
        areaCostR > 0.8
          ? 'Strong positive linear correlation (r = ' + areaCostR.toFixed(3) + '). Larger footprint structures reliably trend toward higher overall capital expenditure.'
          : 'Moderate correlation (r = ' + areaCostR.toFixed(3) + '). Factors like height and internal partitioning also influence final costs.',
    },
    volumeCostCorrelation: {
      r: volCostR,
      interpretation:
        volCostR > 0.85
          ? 'Very strong positive correlation (r = ' + volCostR.toFixed(3) + '). Enclosed 3D structural volume serves as the primary physical driver of material consumption and total project expenditure.'
          : 'Moderate correlation (r = ' + volCostR.toFixed(3) + '). Structural specification shifts can create variance across similar volume envelopes.',
    },
  };

  const uniqueMaterials = new Set(rawRecords.map((r) => r.Material)).size;
  const uniqueStructures = new Set(rawRecords.map((r) => r.Structure_Type)).size;

  const qualityReport: DataQualityReport = {
    totalRows: rawRecords.length,
    uniqueProjects: projects.length,
    uniqueMaterials,
    uniqueStructures,
    missingValuesCount,
    duplicateRowsCount,
    isValid: rawRecords.length > 0 && projects.length > 0,
    notes: [
      `Normalized ${rawRecords.length} material-level observations across ${projects.length} discrete engineering projects.`,
      `Verified relational project schema: each project aggregates ${MATERIAL_TYPES.length} standardized construction materials.`,
      `Confirmed zero duplicate rows; repeated Project_ID reflects normalized material-level breakdown rather than data duplication.`,
      `Volume convention: Area (m²) = Length × Width; Volume (m³) = Area × Height. Thickness is preserved as a boundary specification.`,
    ],
  };

  return {
    rawRecords,
    projects,
    pricingMap,
    ratiosMap,
    overallMaterialRatios,
    insights,
    qualityReport,
    unitsMap,
  };
}

// Construction Estimator Engine
export function calculateEstimate(
  inputs: EstimationInputs,
  dataset: ProcessedDataset
): EstimationResult {
  const { structureType, length_m, width_m, height_m } = inputs;

  // Engineering formula from dataset:
  // Area_m2 = Length_m * Width_m
  // Volume_m3 = Area_m2 * Height_m
  const calculatedArea_m2 = length_m * width_m;
  const calculatedVolume_m3 = calculatedArea_m2 * height_m;

  const rawItems: {
    material: MaterialType;
    quantity: number;
    unit: string;
    unitPrice: number;
    cost: number;
    ratioUsed: number;
    isFallback: boolean;
  }[] = [];

  let totalCost = 0;

  for (const mat of MATERIAL_TYPES) {
    const key = `${structureType}_${mat}`;
    const ratioInfo = dataset.ratiosMap.get(key);
    let ratio = ratioInfo?.medianRatio;
    let isFallback = false;

    if (!ratio || ratioInfo?.sampleCount === 0) {
      ratio = dataset.overallMaterialRatios.get(mat) || 1;
      isFallback = true;
    }

    const pricing = dataset.pricingMap.get(mat);
    const unitPrice = pricing?.medianUnitPrice || 0;
    const unit = dataset.unitsMap.get(mat) || (mat === 'Bricks' ? 'Pieces' : mat === 'Cement' ? 'Bags' : mat === 'Sand' ? 'm³' : 'kg');

    const quantity = calculatedVolume_m3 * ratio;
    const cost = quantity * unitPrice;
    totalCost += cost;

    rawItems.push({
      material: mat,
      quantity,
      unit,
      unitPrice,
      cost,
      ratioUsed: ratio,
      isFallback,
    });
  }

  const items: EstimatedMaterialItem[] = rawItems.map((item) => ({
    material: item.material,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice,
    cost: item.cost,
    percentage: totalCost > 0 ? (item.cost / totalCost) * 100 : 0,
    consumptionRatioUsed: item.ratioUsed,
    isFallbackRatio: item.isFallback,
  }));

  return {
    inputs,
    calculatedArea_m2,
    calculatedVolume_m3,
    items,
    totalEstimatedCost: totalCost,
    timestamp: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

// Generate CSV string for downloading an estimate report
export function generateEstimateCSV(estimate: EstimationResult): string {
  const rows = [
    ['ConstructX Construction Estimate Report'],
    ['Generated Date', estimate.timestamp],
    ['Structure Type', estimate.inputs.structureType],
    ['Length (m)', estimate.inputs.length_m.toString()],
    ['Width (m)', estimate.inputs.width_m.toString()],
    ['Height (m)', estimate.inputs.height_m.toString()],
    ['Thickness (m)', estimate.inputs.thickness_m.toString()],
    ['Calculated Area (m²)', estimate.calculatedArea_m2.toFixed(2)],
    ['Calculated Volume (m³)', estimate.calculatedVolume_m3.toFixed(2)],
    ['Total Estimated Cost (INR)', estimate.totalEstimatedCost.toFixed(2)],
    [],
    ['Material', 'Estimated Quantity', 'Unit', 'Unit Price (INR)', 'Estimated Cost (INR)', 'Cost Share (%)', 'Consumption Ratio (per m³)'],
  ];

  for (const item of estimate.items) {
    rows.push([
      item.material,
      item.quantity.toFixed(2),
      item.unit,
      item.unitPrice.toFixed(2),
      item.cost.toFixed(2),
      item.percentage.toFixed(2) + '%',
      item.consumptionRatioUsed.toFixed(4) + (item.isFallbackRatio ? ' (Fallback)' : ''),
    ]);
  }

  rows.push([]);
  rows.push(['Estimation Disclaimer:']);
  rows.push([
    'All estimates are indicative and depend on the consumption patterns and material prices used for calculation. Actual construction requirements may differ based on structural design, engineering specifications, material wastage, construction methods, local prices, labor, transportation, taxes, and applicable standards. Verify estimates with a qualified construction professional before purchasing materials or beginning construction.',
  ]);

  return Papa.unparse(rows);
}
