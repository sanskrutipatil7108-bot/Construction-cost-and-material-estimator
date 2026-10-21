export type StructureType = 'Wall' | 'Room' | 'House';
export type MaterialType = 'Bricks' | 'Cement' | 'Sand' | 'Steel';

export interface RawMaterialRow {
  Project_ID: string;
  Structure_Type: StructureType;
  Length_m: number;
  Width_m: number;
  Height_m: number;
  Thickness_m: number;
  Area_m2: number;
  Volume_m3: number;
  Material: MaterialType;
  Quantity: number;
  Unit: string;
  Unit_Price_INR: number;
  Material_Cost_INR: number;
  Total_Project_Cost_INR: number;
}

export interface ProjectRecord {
  Project_ID: string;
  Structure_Type: StructureType;
  Length_m: number;
  Width_m: number;
  Height_m: number;
  Thickness_m: number;
  Area_m2: number;
  Volume_m3: number;
  Total_Project_Cost_INR: number;
  materials: RawMaterialRow[];
}

export interface MaterialPricingInfo {
  material: MaterialType;
  unit: string;
  medianUnitPrice: number;
  meanUnitPrice: number;
  minUnitPrice: number;
  maxUnitPrice: number;
  totalQuantity: number;
  totalCost: number;
}

export interface StructureMaterialRatio {
  structureType: StructureType;
  material: MaterialType;
  medianRatio: number;
  meanRatio: number;
  sampleCount: number;
}

export interface EstimationInputs {
  structureType: StructureType;
  length_m: number;
  width_m: number;
  height_m: number;
  thickness_m: number;
}

export interface EstimatedMaterialItem {
  material: MaterialType;
  quantity: number;
  unit: string;
  unitPrice: number;
  cost: number;
  percentage: number;
  consumptionRatioUsed: number;
  isFallbackRatio: boolean;
}

export interface EstimationResult {
  inputs: EstimationInputs;
  calculatedArea_m2: number;
  calculatedVolume_m3: number;
  items: EstimatedMaterialItem[];
  totalEstimatedCost: number;
  timestamp: string;
}

export interface DataQualityReport {
  totalRows: number;
  uniqueProjects: number;
  uniqueMaterials: number;
  uniqueStructures: number;
  missingValuesCount: number;
  duplicateRowsCount: number;
  isValid: boolean;
  notes: string[];
}

export interface DatasetInsights {
  mostCommonStructure: { type: StructureType; count: number; percentage: number };
  highestCostMaterial: { material: MaterialType; totalCost: number; percentage: number };
  highestQuantityMaterial: { material: MaterialType; totalQuantity: number; unit: string };
  highestAvgCostStructure: { type: StructureType; avgCost: number };
  averageProjectCost: number;
  largestProjectByArea: { id: string; type: StructureType; area: number; cost: number };
  largestProjectByVolume: { id: string; type: StructureType; volume: number; cost: number };
  areaCostCorrelation: { r: number; interpretation: string };
  volumeCostCorrelation: { r: number; interpretation: string };
}
