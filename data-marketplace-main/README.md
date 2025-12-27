# Data Marketplace

The ultimate gaming data marketplace where developers, analysts, and creators discover, curate, and leverage game data to power next-level experiences.

## Features

- 🎮 **AI-Powered Data Discovery**: ChatGPT-like interface for natural language data queries
- 📊 **Gaming Data Sources**: Datasets, APIs, ML models, and data warehouses for game analytics
- 🔍 **Smart Search**: Find data by game title, category, data owner, or technical stack
- 🛠️ **Workbench**: Curate and organize data collections
- 🤖 **OpenAI Integration**: Intelligent responses powered by GPT-4o-mini
- 🗄️ **Neon Database**: PostgreSQL backend with real gaming data

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4o-mini, Vercel AI SDK 5
- **Database**: Neon PostgreSQL with MCP integration
- **UI**: shadcn/ui components
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Neon PostgreSQL database
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd data-marketplace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your actual values:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (required)
   - `OPENAI_API_KEY`: Your OpenAI API key (required for chat functionality)
   
   **Getting your DATABASE_URL:**
   1. Sign up at [Neon Console](https://console.neon.tech/)
   2. Create a new project
   3. Copy the connection string from your dashboard
   4. It should look like: `postgresql://username:password@hostname/database?sslmode=require`
   
   **Getting your OPENAI_API_KEY:**
   1. Sign up at [OpenAI Platform](https://platform.openai.com/)
   2. Go to API Keys section
   3. Create a new API key
   4. Copy the key (starts with `sk-`)

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

This project uses Neon PostgreSQL with the following key tables:
- `data_sources` - Gaming datasets and APIs
- `collections` - Curated data collections
- `insights` - Analytics dashboards and charts
- `teams` - Data publishing teams
- `users` - Data owners and stewards

The database schema includes sample gaming data for demonstration purposes.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Neon database (optional: Neon API key for remote MCP)

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd data-marketplace
pnpm install
```

2. **Environment Variables:**
Create `.env.local` with:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Neon Database Configuration  
DATABASE_URL=postgresql://neondb_owner:your-password@your-endpoint.neon.tech/neondb?sslmode=require

# Optional: Neon MCP Configuration (for production deployment)
NEON_API_KEY=your-neon-api-key-here
USE_REMOTE_MCP=false
```

3. **Run development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment on Vercel

### Environment Variables for Production

Add these environment variables in your Vercel dashboard:

```bash
# Required
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=your-neon-database-url

# Optional: For Remote MCP (recommended for production)
NEON_API_KEY=your-neon-api-key-here
USE_REMOTE_MCP=true
```

### Remote MCP Integration

For production deployment, the app can use Neon's hosted MCP server instead of local API endpoints:

- **Local Development**: Uses local API routes (`/api/data-sources`, `/api/categories`, `/api/collections`)
- **Production**: Automatically switches to Neon's remote MCP server (`https://mcp.neon.tech/mcp`)

This provides:
- ✅ Better performance and reliability
- ✅ Automatic updates and new features
- ✅ No need to manage MCP server infrastructure
- ✅ OAuth-based authentication (when available)

### Deploy Steps

1. **Connect to Vercel:**
```bash
npx vercel
```

2. **Set Environment Variables** in Vercel dashboard

3. **Deploy:**
```bash
npx vercel --prod
```

## Project Structure

```
├── app/
│   ├── api/          # API routes for data fetching
│   ├── catalog/      # Data marketplace browse page
│   ├── workbench/    # Data collection curation
│   └── page.tsx      # ChatGPT-like homepage
├── components/
│   ├── chat/         # Chat interface components
│   ├── layout/       # Header and navigation
│   └── ui/           # shadcn/ui components
└── lib/              # Utilities and context
```

## Usage

### Chat Interface

Ask natural language questions about your gaming data:

- "Show me player analytics for Battle Royale games"
- "What revenue data is available?"
- "Find ML models for churn prediction"

### Browse & Search

- Browse all data sources in the catalog
- Filter by type, category, or status
- Search across titles, descriptions, and metadata

### Workbench

- Create curated data collections
- Organize datasets for specific projects
- Share collections with team members

## API Reference

### Data Sources API
- `GET /api/data-sources` - Fetch data sources with filtering
- `GET /api/categories` - Get data categories
- `GET /api/collections` - Get curated collections

### Chat API
- `POST /api/chat` - AI-powered chat with tool calling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `pnpm dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
