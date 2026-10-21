# ConstructX — Construction Material Quantity & Cost Estimation Platform

> **Build Smarter. Estimate Better.**

ConstructX is an interactive, full-stack construction estimation and data visualization platform. It calculates structural material requirements (Bricks, Cement, Sand, Steel) and anticipates project costs using empirical consumption patterns and pricing models derived directly from verified Indian construction dataset records.

---

## 1. Features

- **Interactive Construction Estimator**:
  - Supports Wall, Room, and House structural archetypes.
  - Dimension input validation for Length, Width, Height, and Thickness (metres).
  - Formula convention grounded in historical data:
    $$\text{Area } (m^2) = \text{Length} \times \text{Width}$$
    $$\text{Volume } (m^3) = \text{Area} \times \text{Height}$$
  - Dynamic material quantity estimation using structure-specific median consumption ratios.
  - Indian Rupee (INR ₹) formatted cost schedules with percentage contributions.
  - Quick dimension presets (Boundary Wall, Master Bedroom, Residential Villa).
- **Interactive Estimator Charts**:
  - **Chart A**: Material Cost Distribution (Doughnut chart with percentage and currency tooltips).
  - **Chart B**: Estimated Material Quantities (Bar chart with units like pieces, bags, $m^3$, kg).
  - **Chart C**: Estimated Material Cost Comparison (Horizontal bar chart).
- **Analytics Dashboard (8 Charts & Reactive Filters)**:
  - Structure filter (All, Wall, Room, House).
  - Material filter (All, Bricks, Cement, Sand, Steel).
  - Project ID search and instant filter reset.
  - **Chart 1**: Total Material Cost by Material.
  - **Chart 2**: Total Material Quantity with units.
  - **Chart 3**: Material Cost Share Distribution.
  - **Chart 4**: Average Project Cost by Structure Type (unique projects only).
  - **Chart 5**: Construction Area vs. Project Cost (Scatter plot of 75 unique projects).
  - **Chart 6**: Construction Volume vs. Project Cost (Scatter plot of 75 unique projects).
  - **Chart 7**: Material Median Unit Price Comparison.
  - **Chart 8**: Project Cost Distribution (Histogram across expenditure brackets).
- **Projects Explorer**:
  - Searchable, sortable, and paginated table of 75 unique projects.
  - Click-to-inspect material schedule modal showing original dataset rows.
- **Construction Insights**:
  - Dynamically calculated econometric takeaways (most common structure, cost drivers, Pearson correlations $r$).
- **Data Quality & Audit Panel**:
  - Real-time audit metrics (300 rows, 75 projects, 0 missing, 0 duplicates).
  - Download original CSV (`construction_material_cost_dataset_300_records(2).csv`).
  - Upload custom CSV file with instant dynamic recalculation.
- **Export & Print**:
  - Download estimate report as CSV.
  - Print-friendly formal report with ConstructX branding, date, dimensions, material breakdown, and disclaimer (navigation and UI controls hidden in print mode).

---

## 2. Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Google Fonts (Plus Jakarta Sans, JetBrains Mono)
- **Data Visualization**: Chart.js
- **Data Parsing & Export**: Papa Parse
- **Icons**: Lucide React
- **Architecture**: Static frontend compatible with GitHub Pages or Cloud hosting without server database requirements.

---

## 3. Project File Structure

```
ConstructX/
├── index.html                    # Entry point with SEO meta tags & font imports
├── metadata.json                 # AI Studio applet metadata & permissions
├── package.json                  # Dependencies & scripts
├── public/
│   ├── data/
│   │   └── construction_data.csv # Bundled 300-record dataset
│   └── construction_material_cost_dataset_300_records(2).csv
├── src/
│   ├── assets/images/            # High-fidelity architectural blueprint assets
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky top bar with 3-zone contract
│   │   ├── Hero.tsx              # Hero banner with dynamic KPI strip
│   │   ├── Estimator.tsx         # Dimension inputs & estimation dashboard
│   │   ├── EstimatorCharts.tsx   # Estimator Chart A, B, C components
│   │   ├── Analytics.tsx         # 8 interactive dashboard charts & filters
│   │   ├── ProjectExplorer.tsx   # 75-project table with drill-down modal
│   │   ├── ConstructionInsights.tsx # Dynamic statistical conclusions
│   │   ├── DataQualityPanel.tsx  # Verification panel & custom CSV upload
│   │   ├── PrintReportModal.tsx  # Print/PDF preview & CSV export
│   │   ├── About.tsx             # Official platform description & disclaimer
│   │   └── Footer.tsx            # Brand footer
│   ├── types/
│   │   └── construction.ts       # TypeScript interfaces
│   ├── utils/
│   │   ├── chartSetup.ts         # Chart.js registry & aesthetic defaults
│   │   └── dataProcessor.ts      # Statistical medians, ratios & calculations
│   ├── App.tsx                   # Root state orchestration
│   ├── index.css                 # Global CSS & print media queries
│   └── main.tsx                  # React DOM mount
└── README.md
```

---

## 4. How the CSV Dataset is Loaded and Processed

1. On application startup, `App.tsx` fetches the CSV from `/data/construction_data.csv`.
2. Papa Parse parses the 300 material rows.
3. The engine creates two parallel data models:
   - **Material-level data (300 records)**: For material quantity, unit price, and itemized material cost analysis.
   - **Project-level data (75 unique projects)**: Grouped by `Project_ID`. Retains one record per project with structure type, dimensions, area, volume, and total project cost.
4. **Critical Rule Enforced**: `Total_Project_Cost_INR` is repeated across the 4 material rows for each project. The engine never sums the repeated project totals across 300 rows; all project-level stats (average cost, area-cost correlation, project histograms) are computed solely from the 75 unique projects.

---

## 5. Estimation Engine Formulas

1. **Calculated Area & Volume**:
   $$\text{Area } (m^2) = \text{Length } (m) \times \text{Width } (m)$$
   $$\text{Volume } (m^3) = \text{Area } (m^2) \times \text{Height } (m)$$
2. **Consumption Ratio per Material**:
   $$\text{Ratio} = \text{median}\left(\frac{\text{Quantity}}{\text{Volume}_{m^3}}\right)_{\text{Structure, Material}}$$
3. **Estimated Quantity**:
   $$\text{Quantity} = \text{Calculated Volume } (m^3) \times \text{Ratio}$$
4. **Representative Unit Price**:
   $$\text{Unit Price} = \text{median}\left(\text{Unit\_Price\_INR}\right)_{\text{Material}}$$
5. **Estimated Material Cost & Total**:
   $$\text{Cost} = \text{Quantity} \times \text{Unit Price}$$
   $$\text{Total Cost} = \sum_{\text{Materials}} \text{Cost}$$

---

## 6. How to Run Locally

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

---

## 7. How to Deploy on GitHub Pages

1. In `vite.config.ts`, ensure `base: './'` is set or configured for your repository name.
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy the resulting `dist/` directory to GitHub Pages via Git branch or GitHub Actions. The dataset in `public/` will automatically be copied to `dist/data/construction_data.csv`.

---

## 8. Estimation Disclaimer

All estimates are indicative and depend on the consumption patterns and material prices used for calculation. Actual construction requirements may differ based on structural design, engineering specifications, material wastage, construction methods, local prices, labor, transportation, taxes, and applicable standards. Verify estimates with a qualified construction professional before purchasing materials or beginning construction.
