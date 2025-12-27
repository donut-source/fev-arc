# FEV's Alternatives AI Ready Catalog (ARC)

**Powered by [FEV Analytics](https://fevanalytics.com/)**

A governed catalog of alternative-data products for private equity workflows: FX rates, company intelligence, PE valuation comps, and real estate demand signals.

---

## 🎯 What is ARC?

ARC (Alternatives AI Ready Catalog) is a data discovery and governance platform purpose-built for **private equity firms** to:
- **Discover** alternative data products (FX, company intel, valuations, real estate)
- **Understand** data lineage, quality, and compliance
- **Curate** collections for deal diligence and portfolio monitoring
- **Export** to Power BI, Looker, Python, or FEV AI Space

---

## ✨ Key Features

### 🤖 **FEV AI Assistant**
ChatGPT-like interface for natural language data discovery:
- "Do we have FX rate data for cross-border deal modeling?"
- "Show me valuation comps for SaaS buyouts"
- "What real estate demand signals do we have?"

### 📊 **Alternative Data Catalog**
Curated datasets, APIs, ML models for PE analysis:
- **FX & Macro**: G10 spot/forward curves, hedging cost estimates
- **Company Intelligence**: Private market profiles, competitive analysis
- **PE Valuation**: Transaction comps, quality checks, industry benchmarks
- **Real Estate**: NextDoor activity, WalkScore, neighborhood demand signals

### 🔍 **Smart Discovery**
Find data by:
- Coverage area (G10 FX, SaaS companies, etc.)
- Category (FX Rates, Valuation, Company Intel)
- Data owner, steward, or team
- Trust score, SLA, compliance requirements

### 🛠️ **Workbench**
Curate and share data collections:
- Build diligence packs for IC memos
- Create portfolio monitoring dashboards
- Publish collections for team collaboration
- Export to Power BI, Looker, Python, or FEV AI Space

### 📈 **Insights & Analytics**
Browse published PE-focused insights:
- "UC Endowment's Connecticut RE Valuation (Dec 2025) + WalkScore"
- "KKR SaaS Portfolio FX Hedging Analysis Q1 2025"
- Cross-functional analytics for LP reporting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **AI** | OpenAI GPT-4o-mini, Vercel AI SDK 5 |
| **Database** | Neon PostgreSQL (with mock data fallback) |
| **UI** | shadcn/ui components |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Database Required)

Perfect for exploring the app with pre-loaded PE alternative data.

1. **Clone the repository**
   ```bash
   git clone https://github.com/donut-source/fev-arc.git
   cd fev-arc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local`:
   ```bash
   USE_MOCK_DATA=true
   # OPENAI_API_KEY=sk-... (optional for AI chat)
   # DATABASE_URL=... (not needed in mock mode)
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

### Option 2: Production Mode (with Database)

For connecting to a real Neon PostgreSQL database.

**Prerequisites:**
- Node.js 18+ and pnpm
- [Neon PostgreSQL account](https://console.neon.tech/) (free tier available)
- [OpenAI API key](https://platform.openai.com/) (optional, for AI chat)

**Setup:**

1. **Get your Neon DATABASE_URL:**
   - Sign up at [Neon Console](https://console.neon.tech/)
   - Create a new project
   - Copy the connection string: `postgresql://username:password@hostname/database?sslmode=require`

2. **Get your OPENAI_API_KEY (optional):**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create a new API key (starts with `sk-`)

3. **Configure `.env.local`:**
   ```bash
   USE_MOCK_DATA=false
   DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/neondb?sslmode=require
   OPENAI_API_KEY=sk-...
   ```

4. **Run database migrations** (if needed):
   ```bash
   # Schema is in lib/db.ts
   # Seed data examples in lib/mock-data.ts
   ```

5. **Start the app:**
   ```bash
   pnpm dev
   ```

---

## 📦 Deploy to Production

Want to share ARC with your team or LP investors?

**👉 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions!**

### Quick Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel** at [vercel.com](https://vercel.com)
3. **Set environment variables** in Vercel dashboard:
   ```
   USE_MOCK_DATA=true
   ```
4. **Deploy!** Takes ~2 minutes

Your app will be live at `your-project.vercel.app` (or custom domain like `arc.fev.com`)

---

## 📁 Project Structure

```
fev-arc/
├── app/
│   ├── api/               # API routes (data sources, collections, chat)
│   ├── marketplace/       # Browse data catalog
│   ├── workbench/         # Curate collections
│   ├── insights/          # Published analytics
│   ├── fev-ai-space/      # FEV AI Assistant interface
│   └── page.tsx           # Homepage
├── components/
│   ├── chat/              # FEV AI Assistant UI
│   ├── layout/            # Header, navigation
│   ├── home/              # Homepage sections
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── mock-data.ts       # Demo PE alternative data
│   ├── runtime-config.ts  # Mock/prod mode switching
│   ├── db.ts              # Database connection
│   └── workbench-context.tsx  # Workbench state
└── public/
    ├── fev-logo.svg       # FEV Analytics logo
    ├── fev-arc-logo.svg   # FEV ARC unified logo
    └── fev-ai-assistant-logo.svg  # AI Assistant branding
```

---

## 💡 Usage

### 1. **Browse the Catalog**
   - Navigate to **Marketplace** → Browse all alternative data products
   - Filter by: Coverage, Category, Trust Score, Team
   - View detailed metadata: Owner, Steward, SLA, Tech Stack

### 2. **Chat with FEV AI Assistant**
   - Click **FEV AI Space** in the navigation
   - Ask natural language questions:
     - "Find FX data for cross-border deals"
     - "Show me company intelligence for SaaS"
     - "Who owns the PE valuation comps?"

### 3. **Build Collections**
   - Add data products to **My Workbench**
   - Organize into thematic collections (e.g., "Cross-Border Diligence Pack")
   - Publish collections for team sharing

### 4. **Export Data**
   - Export to **Power BI** for IC dashboards
   - Connect to **Looker** for semantic modeling
   - Use **Python** notebooks for custom analysis
   - Open in **FEV AI Space** for AI-powered insights

### 5. **Explore Insights**
   - Browse published analytics (e.g., "UC Endowment RE Valuation")
   - View PE-focused use cases and case studies
   - Filter by industry, strategy, or data type

---

## 🔐 Security & Governance

- **Trust Scores**: Data quality ratings (0-100%)
- **Data Owners**: Clear accountability for each product
- **Data Stewards**: Governance and access control
- **SLA Tracking**: Uptime and freshness monitoring
- **Access Levels**: Full, Read-only, Request-only
- **Compliance**: GDPR, SOC2, alternative data regulations

---

## 🛠️ API Reference

### Data Sources API
```typescript
GET /api/data-sources
  ?category=FX Rates
  &coverage=G10
  &trust_score=80
  &status=ready
```

### Collections API
```typescript
GET /api/collections
GET /api/collections/:id
```

### Chat API
```typescript
POST /api/chat
  body: { messages: [...] }
```

### Insights API
```typescript
GET /api/insights
GET /api/insights/:id
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/donut-source/fev-arc/issues)
- **Website**: [fevanalytics.com](https://fevanalytics.com/)

---

**Built with ❤️ by [FEV Analytics](https://fevanalytics.com/)**
