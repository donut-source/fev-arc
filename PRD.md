# Product Requirements Document (PRD)
# FEV's Alternatives AI Ready Catalog (ARC)

**Version:** 1.0  
**Last Updated:** December 27, 2025  
**Product Owner:** FEV Analytics  
**Status:** Demo / MVP

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Vision & Goals](#vision--goals)
4. [Target Audience](#target-audience)
5. [Product Overview](#product-overview)
6. [Core Features](#core-features)
7. [User Stories](#user-stories)
8. [Technical Architecture](#technical-architecture)
9. [Success Metrics](#success-metrics)
10. [Roadmap](#roadmap)
11. [Risks & Mitigations](#risks--mitigations)

---

## 1. Executive Summary

**FEV's Alternatives AI Ready Catalog (ARC)** is a data discovery and governance platform designed for private equity firms to discover, understand, and operationalize alternative data products for deal diligence, portfolio monitoring, and LP reporting.

### Key Value Propositions:
- **Data Discovery**: Natural language search for FX, company intel, valuations, and real estate signals
- **Governance**: Trust scores, lineage, ownership, and compliance tracking
- **Operationalization**: Export to Power BI, Looker, Python, or FEV AI Space
- **Collaboration**: Curate and share data collections across investment teams

---

## 2. Problem Statement

### The Challenge

Private equity firms struggle with:

1. **Data Fragmentation**: Alternative data is scattered across vendors, files, and systems
2. **Discovery Friction**: No central catalog to find "what data do we have for X?"
3. **Trust Issues**: Unclear provenance, quality, and compliance status
4. **Operational Silos**: Data products aren't connected to BI tools or workflows
5. **Team Misalignment**: Analysts rediscover the same data or use inconsistent sources

### Current State Pain Points

| Persona | Pain Point |
|---------|-----------|
| **Investment Analyst** | "I waste 40% of my time searching for data for IC memos" |
| **Portfolio Operations** | "We have FX data *somewhere* but I don't know where or if it's current" |
| **Data Governance Lead** | "I can't track who has access to what alternative data" |
| **LP Reporting Manager** | "We need consistent, governed data for quarterly reports" |

---

## 3. Vision & Goals

### Vision Statement

> "Make alternative data as easy to discover, trust, and use as a Google search — purpose-built for private equity workflows."

### Product Goals (6-12 months)

| Goal | Metric | Target |
|------|--------|--------|
| **Discovery Efficiency** | Time to find relevant data | < 2 minutes (from 20+ minutes) |
| **Data Trust** | % of data with trust scores | 100% |
| **Adoption** | Monthly active users | 50+ analysts |
| **Operationalization** | Data products exported to BI | 30+ products |
| **Collaboration** | Published collections | 10+ collections |

---

## 4. Target Audience

### Primary Personas

#### 1. **Investment Analyst (Sarah)**
- **Role**: Associate / VP on deal team
- **Goals**: Find FX, valuation, and company data for IC memos quickly
- **Pain**: Spends too much time hunting for data; unsure of data quality
- **Needs**: Fast discovery, clear metadata, export to Excel/Power BI

#### 2. **Portfolio Operations Manager (David)**
- **Role**: Monitors 10-15 portfolio companies
- **Goals**: Track real-time signals (FX exposure, market trends, real estate)
- **Pain**: Data is fragmented; hard to create monitoring dashboards
- **Needs**: Curated collections for portfolio tracking; Looker integration

#### 3. **Data Governance Lead (Maria)**
- **Role**: Ensures compliance and data quality
- **Goals**: Track data lineage, access, and regulatory compliance
- **Pain**: No visibility into alternative data usage
- **Needs**: Ownership tracking, trust scores, audit logs

#### 4. **LP Reporting Manager (James)**
- **Role**: Prepares quarterly reports for LPs
- **Goals**: Consistent, governed data for portfolio performance
- **Pain**: Different teams use different data sources
- **Needs**: Certified data products, version control, export to reporting tools

---

## 5. Product Overview

### What is ARC?

ARC is a **data catalog + AI assistant** that:
1. **Indexes** alternative data products (FX, company intel, valuations, real estate)
2. **Enriches** them with metadata (owner, steward, trust score, SLA, compliance)
3. **Enables discovery** via natural language search (FEV AI Assistant)
4. **Operationalizes** data with exports to Power BI, Looker, Python, FEV AI Space

### Product Positioning

| Aspect | Description |
|--------|-------------|
| **Category** | Data Catalog + Governance Platform |
| **Market** | Private Equity Firms (mid-market to mega-funds) |
| **Differentiator** | PE-native alternative data focus (not general enterprise catalog) |
| **Competitors** | Alation, Collibra, Atlan (ARC is simpler, PE-specific, AI-first) |

---

## 6. Core Features

### 6.1 Data Catalog & Discovery

**Description**: Central catalog of alternative data products with rich metadata.

#### Features:
- **Browse by Category**: FX Rates, Company Intelligence, PE Valuation, Real Estate
- **Filter by Coverage**: G10 FX, SaaS Companies, US Metro Areas, etc.
- **Trust Score**: 0-100% quality rating
- **Ownership**: Data Owner + Data Steward
- **SLA Tracking**: Uptime % (e.g., 99.9%)
- **Tech Stack**: Platform (Snowflake, S3, API), tools (Python, dbt)
- **Status**: Ready, Issues, Pending, Deprecated

#### Video Placeholder:
```
🎥 [VIDEO: Data Catalog Overview]
   → Show browsing marketplace
   → Filter by category (FX Rates)
   → Click on "FX Spot + Forward Curves"
   → View metadata (trust score, owner, SLA, tech stack)
   Duration: 1:30
```

---

### 6.2 FEV AI Assistant (Natural Language Search)

**Description**: ChatGPT-like interface for asking questions about data in plain English.

#### Features:
- **Suggested Prompts**: Pre-built queries for common use cases
- **Natural Language Understanding**: "Do we have FX data for cross-border deals?"
- **Smart Responses**: Returns data sources + people + policies
- **Tool Integration**: Connects to data APIs, not just text responses
- **Context Awareness**: Understands PE terminology (IC memos, diligence, valuations)

#### Example Queries:
- "Show me valuation comps for SaaS buyouts"
- "What real estate demand signals do we have from neighborhood activity?"
- "Who is Maria Alvarez and what does she work on?"
- "What are the compliance requirements for alternative data?"

#### Video Placeholder:
```
🎥 [VIDEO: FEV AI Assistant in Action]
   → Open FEV AI Space
   → Type: "Do we have FX rate data for cross-border deal modeling?"
   → AI responds with FX Spot + Forward Curves dataset
   → Click "View Details" on data card
   → Add to Workbench
   Duration: 2:00
```

---

### 6.3 Workbench (Data Collection Curation)

**Description**: Curate, organize, and share collections of data products.

#### Features:
- **Add to Workbench**: One-click add from any data source
- **Organize Collections**: Group by theme (e.g., "Cross-Border Diligence Pack")
- **Publish Collections**: Share with team or make public
- **Collection Metadata**: Name, description, tags, visibility (public/team/private)
- **Export**: Download as JSON or sync to BI tools

#### Use Cases:
- **IC Memo Pack**: FX + Valuation + Company Intel for a specific deal
- **Portfolio Monitoring**: Real estate + macro signals for 10 companies
- **LP Reporting**: Certified data products for quarterly reports

#### Video Placeholder:
```
🎥 [VIDEO: Building a Diligence Collection]
   → Navigate to Marketplace
   → Add "FX Spot + Forward Curves" to Workbench
   → Add "Company Intelligence – Private Market Profiles" to Workbench
   → Go to Workbench → View 2 items
   → Click "Publish Collection"
   → Name: "Cross-Border Diligence Pack (Q1 2025)"
   → Publish as "Team" visibility
   → Collection appears in "My Collections"
   Duration: 2:30
```

---

### 6.4 Data Product Detail Page

**Description**: Comprehensive metadata view for each data product.

#### Sections:
1. **Overview**: Title, description, business context
2. **Data Health**: Trust Score, SLA Performance, Data Freshness
3. **Business Context**: Coverage, Focus, Business Process, Business Impact
4. **Usage & Adoption**: Active users (47), Monthly queries (12.3K), Primary use cases
5. **Technical Details**: Platform, tech stack, data tags, update frequency
6. **Governance**: Data owner, steward, compliance (GDPR, SOC2), policies
7. **Integrations**: Export to Power BI, Looker, Python, FEV AI Space

#### Video Placeholder:
```
🎥 [VIDEO: Data Product Deep Dive]
   → Click on "FX Spot + Forward Curves (G10) – Daily"
   → Scroll through sections:
     - Data Health (94% trust, 99.9% uptime)
     - Business Context (cross-border deals, IC memos)
     - Usage (47 active users, 12.3K queries/month)
     - Governance (Maria Alvarez owner, Ben Carter steward)
   → Click "Export to Power BI"
   → Click "Add to Workbench"
   Duration: 2:00
```

---

### 6.5 Insights & Analytics

**Description**: Browse published PE-focused analytics and case studies.

#### Features:
- **Published Insights**: Real-world examples of alternative data in action
- **Filter by Strategy**: Buyout, Growth Equity, Real Estate, Infrastructure
- **View Details**: Methodology, data sources used, key findings
- **Export**: Download reports or connect to dashboards

#### Example Insights:
- "UC Endowment's Connecticut RE Valuation (Dec 2025) + WalkScore"
- "KKR SaaS Portfolio FX Hedging Analysis Q1 2025"
- "Apollo Infrastructure – NextDoor Demand Signals for Site Selection"

#### Video Placeholder:
```
🎥 [VIDEO: Exploring Published Insights]
   → Navigate to Insights page
   → Browse cards: "UC Endowment RE Valuation", "KKR FX Hedging"
   → Click on "UC Endowment RE Valuation"
   → View report details, data sources, methodology
   → See visualization (map + WalkScore overlay)
   → Click "View Data Sources" → Links to Real Estate + WalkScore products
   Duration: 1:45
```

---

### 6.6 Integrations & Exports

**Description**: Connect ARC data products to downstream tools.

#### Supported Integrations:
1. **Power BI**: IC-ready dashboards and portfolio monitoring
2. **Looker**: Governed exploration and semantic modeling
3. **Python**: Notebook analysis for diligence models and scenarios
4. **FEV AI Space**: AI-powered insights and scenario planning

#### Export Formats:
- JSON (collection manifest)
- CSV (data product metadata)
- SQL (connection strings for direct query)
- API (programmatic access)

#### Video Placeholder:
```
🎥 [VIDEO: Exporting to Power BI]
   → On data product detail page
   → Click "Export to Power BI"
   → Opens Power BI connector dialog
   → Shows connection string + authentication
   → (Cut to Power BI) → Data source appears in Power BI
   → Build simple dashboard with FX data
   Duration: 2:00
```

---

### 6.7 Governance & Access Control

**Description**: Track ownership, access, and compliance for all data products.

#### Features:
- **Data Ownership**: Every product has a Data Owner (accountable)
- **Data Stewardship**: Data Steward (manages access, quality)
- **Trust Scores**: Quality rating (0-100%) based on lineage, tests, SLA
- **Access Levels**: Full, Read-only, Request-only
- **Compliance Tags**: GDPR, SOC2, Alternative Data Regs
- **Policies**: Linked governance policies (e.g., "Alternative Data Usage Policy")

#### Video Placeholder:
```
🎥 [VIDEO: Governance Dashboard (Future Feature)]
   → Navigate to Governance page
   → View table of all data products with ownership
   → Filter by "No Data Steward" → See gaps
   → Click "Access Audit Log" → See who accessed what data
   → View "Policy Compliance" → All products tagged for GDPR
   Duration: 1:30
```

---

## 7. User Stories

### Priority 1: Discovery

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-1 | As an **Investment Analyst**, I want to **search for FX data using natural language** so that I can **quickly find data for my IC memo**. | - AI Assistant returns FX data products<br>- Results show trust score & owner<br>- Can add to Workbench in 1 click |
| US-2 | As an **Analyst**, I want to **browse data by category** so that I can **explore what's available in Company Intelligence**. | - Category filter works<br>- Results paginate<br>- Can sort by trust score |
| US-3 | As an **Analyst**, I want to **view detailed metadata** for a data product so that I can **decide if it's suitable for my analysis**. | - Metadata includes owner, trust score, SLA, tech stack<br>- Business context explains use cases<br>- Primary use cases listed |

### Priority 2: Curation & Collaboration

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-4 | As an **Portfolio Ops Manager**, I want to **create a collection** of real estate + macro data so that I can **monitor my 10 portfolio companies**. | - Can add multiple products to Workbench<br>- Can publish collection with name & description<br>- Collection appears in "My Collections" |
| US-5 | As a **Team Lead**, I want to **share my collection** with my team so that **everyone uses the same data sources**. | - Can set visibility to "Team"<br>- Team members see collection in "Shared with Me"<br>- Can clone collection to own Workbench |

### Priority 3: Operationalization

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-6 | As an **Analyst**, I want to **export data to Power BI** so that I can **build a dashboard for IC presentation**. | - "Export to Power BI" button works<br>- Opens Power BI with connection string<br>- Data loads in Power BI |
| US-7 | As a **Data Engineer**, I want to **access data via Python** so that I can **build custom diligence models**. | - Python export provides connection code<br>- Code includes auth & query examples<br>- Data loads in Jupyter notebook |

### Priority 4: Governance

| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-8 | As a **Governance Lead**, I want to **see who owns each data product** so that I can **hold them accountable for quality**. | - Every product shows Data Owner<br>- Can filter by owner<br>- Can contact owner via email/Slack |
| US-9 | As a **Compliance Officer**, I want to **see GDPR compliance status** for all data so that I can **prepare for audits**. | - Compliance tags visible on detail page<br>- Can filter by compliance type<br>- Linked policies explain requirements |

---

## 8. Technical Architecture

### High-Level Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Next.js Frontend (Vercel)       │
│  - React 19 + TypeScript + Tailwind     │
│  - shadcn/ui components                 │
│  - Client-side routing                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│       API Routes (/api/*)               │
│  - /api/data-sources (GET)              │
│  - /api/collections (GET, POST)         │
│  - /api/chat (POST, streaming)          │
│  - /api/insights (GET)                  │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────────┐
│ Mock   │  │ Neon PostgreSQL  │
│ Data   │  │  - data_sources  │
│ (JSON) │  │  - collections   │
│        │  │  - insights      │
└────────┘  │  - people/teams  │
            └──────────────────┘
                    │
                    ▼
            ┌────────────────┐
            │  OpenAI API    │
            │  (GPT-4o-mini) │
            └────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript | Server-rendered UI with client interactivity |
| **Styling** | Tailwind CSS, shadcn/ui | Rapid UI development with accessible components |
| **AI** | OpenAI GPT-4o-mini, Vercel AI SDK 5 | Natural language understanding + tool calling |
| **Database** | Neon PostgreSQL | Production data storage (or mock data for demo) |
| **Deployment** | Vercel | Edge deployment with automatic CI/CD |
| **State** | React Context API | Workbench state management |

### Data Models

#### `data_sources` Table
```typescript
{
  id: string;
  title: string;
  description: string;
  business_description: string;
  type: 'dataset' | 'api' | 'model' | 'warehouse';
  category: string; // 'FX Rates', 'Company Intelligence', etc.
  game_title: string; // Repurposed as "Coverage"
  genre: string; // Repurposed as "Sector/Strategy"
  data_owner: string;
  steward: string;
  trust_score: number; // 0-100
  status: 'ready' | 'issues' | 'pending' | 'deprecated';
  access_level: 'full' | 'read' | 'request';
  sla_percentage: string; // '99.9'
  platform: string; // 'Snowflake', 'S3', 'API'
  team_name: string;
  tags: string[];
  tech_stack: string[];
  created_at: timestamp;
  updated_at: timestamp;
}
```

---

## 9. Success Metrics

### North Star Metric
**"Time to find and export relevant data for IC memo"**  
Target: **< 5 minutes** (from baseline of 30+ minutes)

### Product Metrics

| Metric | Baseline | 3-Month Target | 6-Month Target |
|--------|----------|----------------|----------------|
| **Discovery** |
| Monthly Active Users | 0 | 20 | 50+ |
| Avg. search time | 20 min | 5 min | 2 min |
| AI chat queries/user | - | 10 | 25 |
| **Curation** |
| Collections created | 0 | 5 | 20 |
| Avg. items/collection | - | 5 | 8 |
| Published collections | 0 | 3 | 10 |
| **Operationalization** |
| Data products exported | 0 | 10 | 30+ |
| Power BI connections | 0 | 5 | 15 |
| Python exports | 0 | 8 | 20 |
| **Governance** |
| Products with trust scores | 0% | 80% | 100% |
| Products with owners | 50% | 90% | 100% |

### Business Impact Metrics

| Metric | Target |
|--------|--------|
| **Efficiency**: Time saved per analyst per week | 2+ hours |
| **Quality**: % of IC memos using governed data | 80%+ |
| **Adoption**: % of investment team using ARC | 70%+ |
| **ROI**: Cost savings from reduced data hunting | $500K+/year |

---

## 10. Roadmap

### Phase 1: MVP (Months 1-3) ✅ *Complete*

- [x] Data catalog with browse & filter
- [x] FEV AI Assistant (ChatGPT-like interface)
- [x] Workbench (add to collection)
- [x] Data product detail pages
- [x] Mock data for demo
- [x] Deployment to Vercel

### Phase 2: Operationalization (Months 4-6)

- [ ] **Power BI Integration**: Direct export with auth
- [ ] **Looker Integration**: Semantic layer connection
- [ ] **Python SDK**: `pip install fev-arc` for programmatic access
- [ ] **FEV AI Space**: Deep integration with scenario planning
- [ ] **Collection Sharing**: Granular permissions (view/edit/admin)
- [ ] **Usage Analytics**: Track who uses what data

### Phase 3: Governance & Scale (Months 7-12)

- [ ] **Access Control**: Request access workflow
- [ ] **Audit Logs**: Track data access for compliance
- [ ] **Trust Score Automation**: Auto-calculate from lineage + tests
- [ ] **Policy Management**: Link data products to governance policies
- [ ] **Data Lineage**: Visualize upstream/downstream dependencies
- [ ] **Notifications**: Alerts for deprecated data or quality issues
- [ ] **SSO Integration**: Okta, Azure AD
- [ ] **API Keys**: Programmatic access for data engineers

### Phase 4: AI-Powered Insights (Months 13-18)

- [ ] **AI-Suggested Collections**: "People who used FX data also used..."
- [ ] **Automated Data Profiling**: AI summarizes data quality issues
- [ ] **Smart Tagging**: Auto-tag data products with keywords
- [ ] **Predictive Recommendations**: "For your SaaS deal, consider these data sources"
- [ ] **Natural Language Queries**: Query data directly from chat (not just metadata)

---

## 11. Risks & Mitigations

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **OpenAI API costs scale unpredictably** | High | - Implement rate limiting<br>- Cache common queries<br>- Offer "mock mode" for demos |
| **Neon database downtime** | Medium | - Use mock data fallback<br>- Implement retry logic<br>- Monitor uptime (99.9% SLA) |
| **Slow semantic search** | Medium | - Pre-compute embeddings<br>- Use vector indexes<br>- Implement result caching |

### Product Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Low user adoption** | High | - User interviews before launch<br>- Training sessions for analysts<br>- Embed in IC memo workflow |
| **Data quality issues** | High | - Start with high-trust data only<br>- Clear trust score thresholds<br>- Owner accountability |
| **Governance pushback** | Medium | - Partner with compliance early<br>- Demonstrate audit capabilities<br>- Get exec sponsorship |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Competitive catalog exists** | High | - Focus on PE-specific use cases<br>- Emphasize AI-first UX<br>- Fast time-to-value |
| **Budget constraints** | Medium | - Demonstrate ROI (time saved)<br>- Start with free tier (mock data)<br>- Phase rollout to control costs |

---

## 12. Open Questions

| Question | Owner | Due Date |
|----------|-------|----------|
| What's the pricing model? (Free tier? Per-user? Per-data-source?) | Product | Q1 2025 |
| How do we onboard existing data vendors (Bloomberg, PitchBook, etc.)? | Partnerships | Q1 2025 |
| Should we support on-prem deployment for highly regulated firms? | Engineering | Q2 2025 |
| What's the go-to-market strategy? (Direct sales? PLG?) | Marketing | Q1 2025 |

---

## 13. Appendix: Demo Script

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a detailed 1.5-minute walkthrough for the UC Berkeley Endowment presentation.

---

## 14. Video Placeholders Summary

For product marketing and documentation, we need video recordings of:

### 🎥 Video Checklist

- [ ] **Video 1: Data Catalog Overview** (1:30)  
      *Browse marketplace → Filter by category → View data product details*

- [ ] **Video 2: FEV AI Assistant in Action** (2:00)  
      *Ask "Do we have FX data?" → AI responds with data cards → Add to Workbench*

- [ ] **Video 3: Building a Diligence Collection** (2:30)  
      *Add 2 data products → Go to Workbench → Publish collection*

- [ ] **Video 4: Data Product Deep Dive** (2:00)  
      *Click on FX data → Scroll through metadata sections → Export to Power BI*

- [ ] **Video 5: Exploring Published Insights** (1:45)  
      *Browse insights → Click UC Endowment RE analysis → View data sources*

- [ ] **Video 6: Exporting to Power BI** (2:00)  
      *Click export button → Copy connection string → Load in Power BI*

- [ ] **Video 7: Governance Dashboard** (1:30) *[Future Feature]*  
      *View ownership table → Access audit logs → Policy compliance*

---

**Total Video Time Needed:** ~12 minutes  
**Format:** Screen recording with voiceover  
**Resolution:** 1920x1080 @ 60fps  
**Export:** MP4 (H.264)

---

## Contact

**Product Owner**: FEV Analytics Team  
**Email**: contact@fevanalytics.com  
**Website**: [fevanalytics.com](https://fevanalytics.com/)  

---

*Last updated: December 27, 2025*

