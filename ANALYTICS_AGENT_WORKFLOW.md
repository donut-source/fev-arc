# Analytics Agent Workflow

## Overview
This document describes the Analytics Agent feature that enables natural language queries on combined datasets in the FEV ARC application.

---

## 🤖 What is the Analytics Agent?

The Analytics Agent is an AI-powered assistant that can analyze multiple combined datasets through natural language queries. When you combine datasets with compatible join keys, you can create an Analytics Agent to:

- Ask questions about the data in plain English
- Generate insights across multiple data sources
- Find patterns and correlations
- Create summaries and recommendations
- Query specific metrics and dimensions

---

## 🔄 Complete User Workflow

### **Step 1: Discover Low-Quality Data**
1. Browse ARC Catalog
2. Find **Burgiss Private Credit Data** (67% trust score)
3. See **yellow quality warning** with tooltip
4. Review improvement tips for data quality issues

### **Step 2: Find High-Quality Alternative**
1. Search for "**Burgiss Real Estate**"
2. Click on **Burgiss Private Real Estate Data** (96% trust score)
3. View detail page

### **Step 3: Discover Compatible Datasets**
On the detail page, you'll see the **"Joinable Datasets"** section showing:
- **Unified Join Key**: `uc_endowment_fund_id = 'A'`
- **3 Compatible Datasets**:
  1. WalkScore Geographic Intelligence (91% trust)
  2. CoStar Property Valuations (94% trust)
  3. MSCI Real Estate Index Data (93% trust)

### **Step 4A: Create Analytics Agent (Quick)**
Click **"Create Analytics Agent from Combined Data"** button:
- Purple/pink gradient button in the Joinable Datasets section
- Automatically combines all 4 datasets
- Opens chat interface in Agent Mode
- Auto-triggers initial analysis query

### **Step 4B: Create Analytics Agent (From Actions)**
Alternative path from the Actions card:
1. Scroll to **"UC Endowment Analysis"** section
2. Click **"Create Analytics Agent"** button
3. Same result as 4A

### **Step 5: Analytics Agent Interface**

You're now in the **Chat Interface with Agent Mode**:

#### **Visual Indicators:**
- **"Analytics Agent Mode"** badge (purple gradient)
- **Active Datasets section** showing all 4 datasets with badges
- **Updated welcome message**: "Analyze 4 Combined Datasets"
- **Subtitle**: "Ask questions about your data, find patterns, generate insights..."

#### **Initial Auto-Query:**
The agent automatically sends an initial analysis:
```
Analyze the 4 datasets I've combined: 
- Burgiss Private Real Estate Data – Property-Level Valuations
- WalkScore Geographic Intelligence – Neighborhood Livability
- CoStar Property Valuations – Commercial Real Estate
- MSCI Real Estate Index Data – Market Benchmarks

What insights can you provide about this combined data?
```

### **Step 6: Natural Language Queries**

Ask questions like:

**Real Estate Analysis:**
- "What properties in the UC Endowment portfolio have the highest Walk Scores?"
- "Compare Burgiss valuations vs MSCI benchmark returns for Q4 2024"
- "Show me properties with cap rates above 6% in high walkability areas"
- "Which neighborhoods have the best combination of WalkScore and NOI growth?"

**Portfolio Monitoring:**
- "Identify underperforming properties compared to MSCI benchmarks"
- "What's the average cap rate by property type in the portfolio?"
- "Show correlation between Transit Score and occupancy rates"

**Investment Opportunities:**
- "Find properties with below-market valuations in high-growth neighborhoods"
- "Which metros have the best risk-adjusted returns?"
- "Compare CoStar lease rates to Burgiss valuation multiples"

**Risk Analysis:**
- "What properties have declining NOI and low walkability scores?"
- "Show me geographic concentration risk in the portfolio"
- "Identify properties trading at premiums to MSCI benchmarks"

### **Step 7: Export Options**

From the Analytics Agent chat, you can:
1. **Export to Power BI** - Create interactive dashboards
2. **Export to Python** - Run custom analysis scripts
3. **Send to FEV AI Space** - Advanced AI modeling
4. **Create Board Report PPT** - Generate presentation for UC Endowment board

---

## 🎨 UI Components

### **1. Analytics Agent Button (Detail Page - Actions Card)**

**Location**: Data source detail page → Actions card → UC Endowment Analysis section

**Design:**
```
┌────────────────────────────────────┐
│ UC Endowment Analysis              │
├────────────────────────────────────┤
│ [Create Board Report PPT]          │  ← Indigo/Purple
│ [Create Analytics Agent]           │  ← Purple/Pink
└────────────────────────────────────┘
```

**Behavior:**
- Combines current dataset + all compatible datasets
- Navigates to `/chat?datasets=[...]&agent=true`
- Shows toast: "Creating Analytics Agent..."

### **2. Analytics Agent Button (Joinable Datasets Section)**

**Location**: Data source detail page → Joinable Datasets card → Actions

**Design:**
```
┌─────────────────────────────────────────┐
│ 🔗 Joinable Datasets                    │
│ Unified Join Key: uc_endowment_fund_id  │
│ [4 compatible datasets displayed]       │
├─────────────────────────────────────────┤
│ [Add to Workbench for Combining]        │  ← Blue/Indigo
│ [Create Analytics Agent from Combined]  │  ← Purple (outline)
└─────────────────────────────────────────┘
```

**Behavior:**
- Same as above
- More prominent placement in workflow
- Emphasizes "from Combined Data" messaging

### **3. Chat Interface - Agent Mode**

**Header Components:**

```
┌─────────────────────────────────────────────────┐
│ [FEV Logo] FEV AI Assistant [Agent Badge]       │
├─────────────────────────────────────────────────┤
│ ┌─Active Datasets (4)─────────────────────────┐ │
│ │ [Database Icon] Burgiss Private Real Estate  │ │
│ │ [Database Icon] WalkScore Geographic Intel   │ │
│ │ [Database Icon] CoStar Property Valuations   │ │
│ │ [Database Icon] MSCI Real Estate Index       │ │
│ │                                               │ │
│ │ AI assistant will focus analysis on these    │ │
│ │ datasets and their join keys                 │ │
│ └──────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Ask natural language questions about your       │
│ combined datasets...                            │
└─────────────────────────────────────────────────┘
```

**Welcome Screen:**

```
┌─────────────────────────────────────────────────┐
│                 [FEV Logo]                       │
│           FEV AI Assistant [Agent]               │
│                                                  │
│           [Active Datasets Display]              │
│                                                  │
│      Analyze 4 Combined Datasets                 │
│                                                  │
│  Ask questions about your data, find patterns,   │
│  generate insights, and create visualizations    │
│                                                  │
│           [Suggested Prompts Grid]               │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### **URL Parameters**

```typescript
/chat?datasets=[...encodeURIComponent(JSON.stringify(datasets))]&agent=true
```

**Parameters:**
- `datasets`: JSON array of dataset objects `[{ id, title, type, category }]`
- `agent`: Boolean flag to enable agent mode (`true` | `false`)

### **Chat Interface Props**

```typescript
interface ChatInterfaceProps {
  initialDatasets?: Array<{
    id: string;
    title: string;
    type: string;
    category: string;
  }>;
  agentMode?: boolean;
}
```

### **State Management**

```typescript
const [activeDatasets, setActiveDatasets] = useState(initialDatasets || []);

// Load from URL params on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const datasetsParam = params.get('datasets');
  const agentParam = params.get('agent');
  
  if (datasetsParam) {
    const datasets = JSON.parse(decodeURIComponent(datasetsParam));
    setActiveDatasets(datasets);
    
    if (agentParam === 'true') {
      // Auto-send initial analysis query
      sendMessage({ text: initialPrompt });
    }
  }
}, []);
```

### **Auto-Trigger Initial Analysis**

When `agent=true` and datasets are loaded:
1. Wait 500ms for UI to render
2. Send initial prompt:
   ```
   Analyze the N datasets I've combined: [titles]. 
   What insights can you provide about this combined data?
   ```
3. AI responds with overview and suggested questions

---

## 📊 Example Queries & Expected Responses

### **Query 1: Property Performance**
**User**: "What properties in the UC Endowment portfolio have the highest Walk Scores?"

**Agent Response**:
- Joins Burgiss property data + WalkScore data on `uc_endowment_fund_id`
- Ranks properties by Walk Score
- Shows top 10 properties with scores, locations, and valuations
- Provides data owner and steward contact info

### **Query 2: Benchmark Comparison**
**User**: "Compare Burgiss valuations vs MSCI benchmark returns for Q4 2024"

**Agent Response**:
- Joins Burgiss + MSCI data
- Calculates valuation changes vs MSCI returns
- Shows outperformance/underperformance by property type
- Highlights properties trading at premiums or discounts

### **Query 3: Risk Analysis**
**User**: "Identify properties with declining NOI and low walkability scores"

**Agent Response**:
- Joins Burgiss NOI trends + WalkScore data
- Filters for negative NOI growth + Walk Score < 50
- Shows risk-flagged properties
- Suggests remediation: improve transit access, renegotiate leases

### **Query 4: Investment Opportunities**
**User**: "Find properties with below-market valuations in high-growth neighborhoods"

**Agent Response**:
- Joins Burgiss + CoStar + WalkScore
- Compares cap rates to market averages
- Filters for neighborhoods with rising Walk Scores
- Presents investment opportunities ranked by potential upside

---

## 🎯 Business Value

### **For UC Berkeley Endowment Head:**

1. **Faster Insights**: Natural language queries vs manual SQL/Excel
2. **Cross-Dataset Analysis**: Automatically joins 4 data sources
3. **Data Quality Visibility**: See which datasets need improvement
4. **Export Flexibility**: Push to Power BI, Python, or presentations
5. **Audit Trail**: All queries and responses are logged

### **For Data Teams:**

1. **Democratized Access**: Non-technical users can query data
2. **Reduced Support**: Self-service analytics vs data requests
3. **Standardized Joins**: Pre-configured join keys prevent errors
4. **Quality Feedback Loop**: Tooltips guide data improvement

### **For Investment Committees:**

1. **Board-Ready Reports**: One-click PowerPoint generation
2. **Real-Time Analysis**: Ask questions during IC meetings
3. **Multi-Source Validation**: Cross-reference Burgiss, CoStar, MSCI
4. **Scenario Planning**: "What if" queries on combined data

---

## 🚀 Future Enhancements

### **Phase 2: Advanced Agent Capabilities**

1. **Saved Queries**: Bookmark frequent analyses
2. **Scheduled Reports**: Auto-run queries on new data
3. **Collaborative Agents**: Share agents with team members
4. **Agent Memory**: Remember previous conversations
5. **Custom Visualizations**: Generate charts from queries

### **Phase 3: Multi-Agent Workflows**

1. **Specialist Agents**: Real estate agent, credit agent, FX agent
2. **Agent Pipelines**: Chain multiple agents for complex analysis
3. **Agent Marketplace**: Share and discover pre-built agents
4. **Agent Training**: Fine-tune on your specific data patterns

---

## 📝 Notes

- All datasets must share the same join key (`uc_endowment_fund_id`)
- Agent mode currently supports up to 10 datasets simultaneously
- Initial analysis query auto-triggers after 500ms delay
- Active datasets are displayed prominently throughout chat session
- Suggested prompts adapt to available datasets

---

**Created**: January 1, 2026  
**Author**: Warren Durrett  
**Version**: 1.0.0

