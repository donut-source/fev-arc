# Burgiss Data Demo Features

## Overview
This document describes the comprehensive Burgiss data experience added to the FEV ARC application, demonstrating data quality management, dataset combining, and UC Endowment reporting workflows.

---

## 🎯 New Features

### 1. **Burgiss Private Credit Data (LOW Quality)**
- **ID**: `burgiss-credit-001`
- **Trust Score**: 67% (Low)
- **SLA**: 92.3% (Below target)
- **Status**: Issues flagged
- **Platform**: BigQuery

**Key Characteristics:**
- Demonstrates data quality issues in real-world scenarios
- Shows incomplete attribution data and delayed quarterly updates
- Provides actionable improvement tips via tooltip

**Data Quality Tips Provided:**
1. Contact Burgiss support to negotiate more frequent data refresh (currently 45-day lag)
2. Work with internal Data Engineering to implement automated completeness checks
3. Request attribution data backfill from Burgiss for Q2-Q3 2024 missing records
4. Consider switching to Burgiss API feed instead of quarterly file drops for real-time updates

---

### 2. **Burgiss Private Real Estate Data (HIGH Quality)**
- **ID**: `burgiss-realestate-001`
- **Trust Score**: 96% (Excellent)
- **SLA**: 99.8% (Industry-leading)
- **Status**: Ready
- **Platform**: Snowflake
- **Join Key**: `uc_endowment_fund_id = 'A'`

**Key Characteristics:**
- Premium property-level real estate valuations
- NOI, cap rates, and transaction data
- Daily updates with comprehensive coverage
- Pre-configured for UC Endowment portfolio analysis

**Compatible Datasets:**
- WalkScore Geographic Intelligence
- CoStar Property Valuations
- MSCI Real Estate Index Data

---

### 3. **Complementary Real Estate Datasets**

#### **WalkScore Geographic Intelligence**
- **ID**: `walkscore-geo-001`
- **Trust Score**: 91%
- **Coverage**: 200+ US metro areas
- **Join Key**: `uc_endowment_fund_id`
- **Metrics**: Walk Score, Transit Score, Bike Score
- **Use Case**: Neighborhood livability and location quality analysis

#### **CoStar Property Valuations**
- **ID**: `costar-property-001`
- **Trust Score**: 94%
- **Coverage**: 5M+ US commercial properties
- **Join Key**: `uc_endowment_fund_id`
- **Data**: Lease rates, occupancy, tenant data
- **Use Case**: Commercial real estate valuation and leasing analysis

#### **MSCI Real Estate Index Data**
- **ID**: `msci-realestate-001`
- **Trust Score**: 93%
- **Coverage**: 35+ countries
- **Join Key**: `uc_endowment_fund_id`
- **Data**: Index returns, volatility, sector performance
- **Use Case**: Performance attribution and risk benchmarking

---

## 🎨 UI/UX Enhancements

### **Data Quality Warning Cards**
- Automatically displayed on low-quality datasets (Trust Score < 75% or SLA < 95%)
- Yellow/orange gradient with alert icon
- Hover tooltip shows 4 actionable improvement tips
- Prominent placement at top of data cards

**Visual Design:**
```
┌─────────────────────────────────────────┐
│ ⚠️ Data Quality Issues Detected         │
│ Trust: 67% • SLA: 92.3%                 │
│ Hover for improvement tips 📈           │
└─────────────────────────────────────────┘
```

### **Dataset Combining UI**
- Displayed on detail pages for datasets with `join_key`
- Shows unified join key with example value
- Grid of compatible datasets with trust scores
- One-click "Combine All" button to add to workbench

**Visual Design:**
```
┌─────────────────────────────────────────┐
│ 🔗 Joinable Datasets                    │
│                                         │
│ Unified Join Key:                       │
│ ┌─────────────────────────────────────┐ │
│ │ uc_endowment_fund_id = 'A'          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌──────────────┬──────────────┐        │
│ │ WalkScore    │ CoStar       │        │
│ │ 91% Trust    │ 94% Trust    │        │
│ └──────────────┴──────────────┘        │
│                                         │
│ [Combine All 4 Datasets in Workbench]  │
└─────────────────────────────────────────┘
```

### **UC Endowment Board Report PowerPoint Button**
- Appears in Actions card for Burgiss real estate data and compatible datasets
- Gradient indigo-to-purple styling
- Shows toast notification with progress
- Simulates PowerPoint generation and download

**Location**: Data source detail page → Actions card → UC Endowment Reports section

---

## 🔄 User Workflow

### **Scenario: UC Berkeley Endowment Head Demo**

1. **Login & Browse**
   - User logs in as Warren Durrett
   - Navigates to ARC Catalog (Marketplace)

2. **Discover Low-Quality Data**
   - Sees Burgiss Private Credit Data with yellow warning card
   - Hovers over warning to see improvement tips
   - Learns about data quality issues and remediation steps

3. **Find High-Quality Alternative**
   - Searches for "Burgiss Real Estate"
   - Finds high-quality dataset (96% trust, 99.8% SLA)
   - Clicks to view details

4. **Explore Combining Capabilities**
   - Sees "Joinable Datasets" card with 3 compatible datasets
   - Reviews join key: `uc_endowment_fund_id = 'A'`
   - Understands all datasets share UC Endowment fund identifier

5. **Combine Datasets**
   - Clicks "Combine All 4 Datasets in Workbench"
   - All datasets added to workbench for unified analysis
   - Can now join Burgiss valuations + WalkScore + CoStar + MSCI

6. **Export to Tools**
   - Opens in Power BI for interactive dashboards
   - Exports to Python for custom analysis
   - Sends to FEV AI Space for AI-powered insights
   - Builds agents with combined data

7. **Generate Board Report**
   - Clicks "Create UC Endowment Board Report PowerPoint"
   - System combines all 4 datasets
   - Downloads: `UC_Endowment_Board_Report_Dec2024.pptx`
   - Ready for board presentation

---

## 📊 Collections

### **UC Endowment – Private Real Estate Portfolio Analysis**
- **ID**: `uc-endowment-realestate`
- **Owner**: Warren Durrett
- **Datasets**: 4 pre-combined datasets
  1. Burgiss Private Real Estate Data
  2. WalkScore Geographic Intelligence
  3. CoStar Property Valuations
  4. MSCI Real Estate Index Data

**Description**: Unified real estate data collection combining Burgiss valuations, WalkScore livability, CoStar commercial data, and MSCI benchmarks. Pre-joined on `uc_endowment_fund_id = A` for seamless cross-dataset analysis.

---

## 🔧 Technical Implementation

### **Mock Data Structure**
```typescript
export type MockDataSource = {
  // ... existing fields
  join_key?: string;                    // e.g., "uc_endowment_fund_id"
  compatible_datasets?: string[];       // Array of compatible dataset IDs
  data_quality_tips?: string[];         // Array of improvement tips
};
```

### **API Routes**
- `/api/data-sources` - Returns all datasets including new Burgiss data
- `/api/data-sources/[id]` - Returns individual dataset with join_key and compatible_datasets
- Compatible datasets are fetched in parallel on detail page load

### **Components Updated**
1. **`components/ui/data-card.tsx`**
   - Added quality warning tooltip
   - Shows trust score and SLA in warning
   - Displays improvement tips on hover

2. **`app/data-sources/[id]/page.tsx`**
   - Added data quality tips section
   - Added joinable datasets section with join key display
   - Added UC Endowment Board Report button
   - Fetches compatible datasets in parallel

3. **`lib/mock-data.ts`**
   - Added 5 new datasets (Burgiss Credit, Burgiss Real Estate, WalkScore, CoStar, MSCI)
   - Added join_key and compatible_datasets fields
   - Added data_quality_tips for low-quality datasets
   - Created UC Endowment collection

---

## 🎯 Demo Script (1.5 minutes)

**For UC Berkeley Endowment Head:**

1. **[0:00-0:15] Introduction**
   - "Welcome to FEV's Alternatives AI Ready Catalog"
   - "This is your unified data platform for private equity and real estate analytics"

2. **[0:15-0:30] Data Quality Management**
   - "Here's Burgiss Private Credit data - notice the quality warning"
   - "Hover to see specific improvement tips"
   - "This helps you proactively manage data quality"

3. **[0:30-0:50] High-Quality Data Discovery**
   - "Now let's look at Burgiss Real Estate - 96% trust score, 99.8% SLA"
   - "This is production-ready data for your portfolio"

4. **[0:50-1:10] Dataset Combining**
   - "Notice these 3 compatible datasets - all joinable on UC Endowment fund ID"
   - "WalkScore for livability, CoStar for commercial data, MSCI for benchmarks"
   - "One click to combine all 4 datasets in your workbench"

5. **[1:10-1:25] Export & Integration**
   - "Export to Power BI for dashboards"
   - "Send to Python for custom analysis"
   - "Use FEV AI Space for AI-powered insights"

6. **[1:25-1:30] Board Reporting**
   - "Create UC Endowment Board Report PowerPoint with one click"
   - "Combines all datasets into a ready-to-present deck"
   - "That's the power of FEV ARC!"

---

## 🚀 Next Steps

### **For Production Deployment:**
1. Replace mock data with live Burgiss API integration
2. Implement real data quality monitoring and alerting
3. Build actual PowerPoint generation service
4. Add user authentication and access controls
5. Deploy to Vercel with custom domain (arc.fev.com)

### **For Further Enhancement:**
1. Add more alternative data sources (Preqin, PitchBook, etc.)
2. Build AI agent capabilities for automated analysis
3. Create more pre-built collections for common use cases
4. Add collaboration features for team-based analysis
5. Implement version control and data lineage tracking

---

## 📝 Notes

- All data is currently synthetic/mock for demo purposes
- Join key `uc_endowment_fund_id = 'A'` is a placeholder
- PowerPoint generation is simulated with toast notifications
- Data quality tips are illustrative examples
- Compatible datasets are pre-configured in mock data

---

**Created**: December 31, 2024  
**Author**: Warren Durrett  
**Version**: 1.0.0

