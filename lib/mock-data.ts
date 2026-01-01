/* eslint-disable @typescript-eslint/no-explicit-any */

export type AccessLevel = 'none' | 'read-only' | 'full';

export type MockDataSource = {
  id: string;
  title: string;
  description: string;
  business_description: string;
  type: 'dataset' | 'api' | 'model' | 'warehouse';
  category: string;
  /** Reused field name from the original app; treated as "Coverage" or "Entity" in ARC UI. */
  game_title: string;
  /** Reused field name from the original app; treated as "Sector / Strategy / Asset Class" in ARC UI. */
  genre: string;
  data_owner: string;
  steward: string;
  trust_score: number;
  status: 'ready' | 'issues' | 'pending' | 'deprecated';
  access_level: string;
  sla_percentage: string;
  platform: 'Snowflake' | 'BigQuery' | 'Databricks' | 'PostgreSQL' | 'S3' | 'PowerBI' | 'Looker';
  team_name: string;
  tags: string[];
  tech_stack: string[];
  created_at?: string;
  updated_at?: string;
  join_key?: string;
  compatible_datasets?: string[];
  data_quality_tips?: string[];
};

export type MockCategory = {
  id: string;
  name: string;
  count: number;
  types: string[];
  avgTrustScore: number;
};

export type MockPerson = {
  id: string;
  name: string;
  title: string;
  department: string;
  expertise_areas: string[];
  bio: string;
  email: string;
  slack_handle: string;
  years_experience: number;
  specializations: string[];
  contact_preference: string;
  availability_status: string;
  avatar_url?: string;
};

export type MockTeam = {
  id: string;
  name: string;
  description: string;
  team_type: string;
  department: string;
  is_active: boolean;
  lead_person_id?: string;
  created_at: string;
  updated_at: string;
};

export type MockTeamMembership = {
  id: string;
  team_id: string;
  person_id: string;
  role: string;
  joined_at: string;
  is_active: boolean;
};

export type MockCollection = {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  visibility: 'public' | 'private';
  is_published: boolean;
  created_at: string;
  updated_at: string;
  data_source_ids: string[];
};

export type MockInsight = {
  id: string;
  title: string;
  description: string;
  insight_type: 'dashboard' | 'report' | 'model' | 'notebook';
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'private';
  metrics: Record<string, unknown>;
  chart_config: Record<string, unknown>;
  thumbnail_url?: string;
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
  publisher_name: string;
  team_name: string;
  team_department: string;
  data_sources: string[];
  collections: string[];
};

export type MockTool = {
  id: string;
  name: string;
  description: string;
  category: string;
  vendor: string;
  access_level: string;
  pricing_model: string;
  integration_complexity: string;
  business_value: string;
  technical_requirements: string;
  setup_time: string;
  user_count: number;
  trust_score: number;
  status: 'active' | 'deprecated';
  last_updated: string;
  created_at: string;
};

export type MockPolicy = {
  id: string;
  name: string;
  description: string;
  category: string;
  policy_type: string;
  compliance_level: 'mandatory' | 'recommended' | 'optional';
  effective_date: string;
  review_date: string;
  enforcement_level: string;
  scope: string;
  exceptions: string;
  related_regulations: string[];
  status: 'active' | 'draft' | 'retired';
  last_updated: string;
  created_at: string;
};

export const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

const nowIso = () => new Date().toISOString();

export const mockPeople: MockPerson[] = [
  {
    id: CURRENT_USER_ID,
    name: 'Warren Durrett',
    title: 'Alternative Data Analyst',
    department: 'Private Equity',
    expertise_areas: ['FX', 'portfolio monitoring', 'data products'],
    bio: 'Builds repeatable alternative-data products for deal teams and portfolio ops.',
    email: 'john.doe@arc-demo.com',
    slack_handle: '@john.doe',
    years_experience: 5,
    specializations: ['Python', 'SQL', 'Power BI'],
    contact_preference: 'slack',
    availability_status: 'available',
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Maria Alvarez',
    title: 'Head of Data Products',
    department: 'Private Equity',
    expertise_areas: ['governance', 'LP reporting', 'valuation'],
    bio: 'Owns ARC’s product roadmap and enterprise governance standards.',
    email: 'maria.alvarez@arc-demo.com',
    slack_handle: '@maria.alvarez',
    years_experience: 12,
    specializations: ['Product', 'Governance'],
    contact_preference: 'email',
    availability_status: 'available',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Ben Carter',
    title: 'Data Steward',
    department: 'Data Governance',
    expertise_areas: ['access controls', 'data quality', 'compliance'],
    bio: 'Ensures auditability, quality SLAs, and access workflows for ARC products.',
    email: 'ben.carter@arc-demo.com',
    slack_handle: '@ben.carter',
    years_experience: 9,
    specializations: ['Controls', 'Risk'],
    contact_preference: 'slack',
    availability_status: 'busy',
  },
];

export const mockTeams: MockTeam[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'ARC – Private Equity Analytics',
    description: 'Alternative-data products for deal teams, IC memos, and portfolio monitoring.',
    team_type: 'team',
    department: 'Private Equity',
    is_active: true,
    lead_person_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    created_at: '2024-01-10T12:00:00.000Z',
    updated_at: nowIso(),
  },
];

export const mockTeamMemberships: MockTeamMembership[] = [
  {
    id: 'tm-1',
    team_id: '33333333-3333-3333-3333-333333333333',
    person_id: CURRENT_USER_ID,
    role: 'member',
    joined_at: '2024-02-01T12:00:00.000Z',
    is_active: true,
  },
  {
    id: 'tm-2',
    team_id: '33333333-3333-3333-3333-333333333333',
    person_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    role: 'lead',
    joined_at: '2024-01-10T12:00:00.000Z',
    is_active: true,
  },
  {
    id: 'tm-3',
    team_id: '33333333-3333-3333-3333-333333333333',
    person_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    role: 'steward',
    joined_at: '2024-01-15T12:00:00.000Z',
    is_active: true,
  },
];

export const mockDataSources: MockDataSource[] = [
  {
    id: '77777777-7777-7777-7777-777777777777',
    title: 'FX Spot + Forward Curves (G10) – Daily',
    description: 'Daily FX spot + forward points for G10 pairs with derived carry/roll metrics.',
    business_description:
      'Use for cross-border deal modeling, cash repatriation, and hedging cost scenarios in IC memos.',
    type: 'dataset',
    category: 'FX Rates',
    game_title: 'Coverage: G10 FX (EUR/USD, GBP/USD, USD/JPY...)',
    genre: 'Asset Class: FX',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 94,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.9',
    platform: 'Snowflake',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['carry', 'hedging', 'ic-ready', 'daily'],
    tech_stack: ['Snowflake', 'Python', 'Power BI'],
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    title: 'Company Intelligence – Private Market Profiles',
    description: 'Unified company profiles: ownership, key executives, subsidiaries, locations, and risk flags.',
    business_description:
      'Accelerate diligence: quickly align on entity identity, org structure, and risk posture.',
    type: 'dataset',
    category: 'Company Intelligence',
    game_title: 'Entity: Private + Public Companies (global)',
    genre: 'Coverage: Ownership + Org + Risk',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 91,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.5',
    platform: 'Databricks',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['diligence', 'entity-resolution', 'risk'],
    tech_stack: ['Databricks', 'Python', 'PostgreSQL'],
    created_at: '2024-07-15T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    title: 'Private Equity Valuation Comps – Quarterly',
    description: 'Comparable multiples for private-market transactions by sector, size, and region.',
    business_description:
      'Support valuation ranges, sensitivity analysis, and comparable selection for investment theses.',
    type: 'dataset',
    category: 'PE Valuation',
    game_title: 'Coverage: Sector x Region x Size (private comps)',
    genre: 'Metric Set: EV/EBITDA, EV/ARR, Rev, Growth',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 89,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.0',
    platform: 'BigQuery',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['comps', 'valuation', 'quarterly', 'ic-ready'],
    tech_stack: ['BigQuery', 'Looker', 'Python'],
    created_at: '2024-06-30T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '10101010-1010-1010-1010-101010101010',
    title: 'Real Estate Signals – “Nextdoor” Neighborhood Activity (Synthetic)',
    description: 'Synthetic neighborhood engagement signals for real estate demand + sentiment analysis.',
    business_description:
      'Use as a demo proxy for community-driven demand signals around target geographies and assets.',
    type: 'dataset',
    category: 'Real Estate Signals',
    game_title: 'Coverage: Neighborhood / ZIP / Metro',
    genre: 'Asset Class: Real Estate',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 86,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '98.9',
    platform: 'S3',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['geo', 'sentiment', 'demand', 'synthetic'],
    tech_stack: ['S3', 'Python', 'Power BI'],
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '20202020-2020-2020-2020-202020202020',
    title: 'FX Stress Scenarios API',
    description: 'API that returns scenario paths for FX shocks + implied hedging costs for a portfolio.',
    business_description:
      'Power model-driven risk scenarios across a portfolio: base / bear / shock paths.',
    type: 'api',
    category: 'FX Rates',
    game_title: 'Coverage: G10 + Select EM FX',
    genre: 'Use Case: Risk + Hedging',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 88,
    status: 'pending',
    access_level: 'restricted',
    sla_percentage: '99.2',
    platform: 'PostgreSQL',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['api', 'scenario', 'risk'],
    tech_stack: ['PostgreSQL', 'Python'],
    created_at: '2024-10-10T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '30303030-3030-3030-3030-303030303030',
    title: 'Valuation Quality Checks (Model)',
    description: 'ML model that flags outlier multiples and inconsistent comp selection.',
    business_description:
      'Reduce “human error” risk in valuation work: surface anomalies before IC.',
    type: 'model',
    category: 'PE Valuation',
    game_title: 'Coverage: Transactions + private comps',
    genre: 'Model Type: anomaly detection',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 92,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.7',
    platform: 'Databricks',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['model', 'quality', 'ic-ready'],
    tech_stack: ['Databricks', 'Python'],
    created_at: '2024-05-20T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: '40404040-4040-4040-4040-404040404040',
    title: 'Deal Room Warehouse (Synthetic)',
    description: 'Synthetic warehouse for deals: pipeline, diligence checklist, memos, and approvals.',
    business_description:
      'Demo data warehouse for sharing, collaboration, and standardized reporting workflows.',
    type: 'warehouse',
    category: 'Deal Ops',
    game_title: 'Coverage: Pipeline + diligence + approvals',
    genre: 'Workflow: Deal Team / IC',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 84,
    status: 'issues',
    access_level: 'restricted',
    sla_percentage: '97.5',
    platform: 'Snowflake',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['warehouse', 'workflow', 'synthetic'],
    tech_stack: ['Snowflake', 'Looker', 'Power BI'],
    created_at: '2024-04-05T00:00:00.000Z',
    updated_at: nowIso(),
  },
  {
    id: 'burgiss-credit-001',
    title: 'Burgiss Private Credit Data – Quarterly Performance',
    description: 'Quarterly private credit fund performance benchmarks, returns, and risk metrics from Burgiss. Data quality issues flagged.',
    business_description:
      'Private credit performance data for benchmarking and portfolio analysis. Current data quality issues include incomplete attribution data and delayed quarterly updates. Contact Burgiss support or internal DE team to improve refresh cadence and completeness.',
    type: 'dataset',
    category: 'Private Credit',
    game_title: 'Coverage: Private Credit Funds (North America + Europe)',
    genre: 'Asset Class: Private Credit',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 67,
    status: 'issues',
    access_level: 'restricted',
    sla_percentage: '92.3',
    platform: 'BigQuery',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['private-credit', 'benchmarking', 'quarterly', 'data-quality-issues'],
    tech_stack: ['BigQuery', 'Python', 'Power BI'],
    created_at: '2024-11-01T00:00:00.000Z',
    updated_at: nowIso(),
    data_quality_tips: [
      'Contact Burgiss support to negotiate more frequent data refresh (currently 45-day lag)',
      'Work with internal Data Engineering to implement automated completeness checks',
      'Request attribution data backfill from Burgiss for Q2-Q3 2024 missing records',
      'Consider switching to Burgiss API feed instead of quarterly file drops for real-time updates',
    ],
  },
  {
    id: 'burgiss-realestate-001',
    title: 'Burgiss Private Real Estate Data – Property-Level Valuations',
    description: 'High-quality property-level real estate valuations, NOI, cap rates, and transaction data from Burgiss. Enriched with UC Endowment fund identifiers.',
    business_description:
      'Premium real estate valuation data covering commercial, residential, and mixed-use properties. Includes standardized join key (uc_endowment_fund_id) for cross-dataset analysis with complementary real estate signals. Industry-leading data quality with daily updates and comprehensive coverage.',
    type: 'dataset',
    category: 'Private Real Estate',
    game_title: 'Coverage: US Commercial + Residential Properties',
    genre: 'Asset Class: Private Real Estate',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 96,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.8',
    platform: 'Snowflake',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['real-estate', 'valuations', 'daily', 'high-quality', 'uc-endowment', 'joinable'],
    tech_stack: ['Snowflake', 'Python', 'Power BI', 'Looker'],
    created_at: '2024-10-15T00:00:00.000Z',
    updated_at: nowIso(),
    join_key: 'uc_endowment_fund_id',
    compatible_datasets: ['walkscore-geo-001', 'costar-property-001', 'msci-realestate-001'],
  },
  {
    id: 'walkscore-geo-001',
    title: 'WalkScore Geographic Intelligence – Neighborhood Livability',
    description: 'Walk Score, Transit Score, and Bike Score metrics by address and neighborhood. Enriched with UC Endowment fund identifiers for real estate portfolio analysis.',
    business_description:
      'Location intelligence data quantifying walkability, transit access, and bikeability for real estate investment decisions. Combines seamlessly with Burgiss real estate data via uc_endowment_fund_id join key for comprehensive neighborhood-level diligence.',
    type: 'dataset',
    category: 'Private Real Estate',
    game_title: 'Coverage: US Metro Areas (200+ cities)',
    genre: 'Signal Type: Livability + Location Quality',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 91,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.3',
    platform: 'Databricks',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['real-estate', 'geo-intelligence', 'livability', 'uc-endowment', 'joinable'],
    tech_stack: ['Databricks', 'Python', 'Power BI'],
    created_at: '2024-10-20T00:00:00.000Z',
    updated_at: nowIso(),
    join_key: 'uc_endowment_fund_id',
    compatible_datasets: ['burgiss-realestate-001', 'costar-property-001', 'msci-realestate-001'],
  },
  {
    id: 'costar-property-001',
    title: 'CoStar Property Valuations – Commercial Real Estate',
    description: 'Comprehensive commercial property valuations, lease rates, occupancy, and tenant data from CoStar. Includes UC Endowment fund mapping.',
    business_description:
      'Industry-standard commercial real estate data covering office, retail, industrial, and multifamily properties. Pre-joined to UC Endowment portfolio via uc_endowment_fund_id for streamlined analysis alongside Burgiss and other real estate datasets.',
    type: 'dataset',
    category: 'Private Real Estate',
    game_title: 'Coverage: US Commercial Properties (5M+ listings)',
    genre: 'Asset Class: Commercial Real Estate',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 94,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.6',
    platform: 'Snowflake',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['real-estate', 'commercial', 'leasing', 'uc-endowment', 'joinable'],
    tech_stack: ['Snowflake', 'Python', 'Looker', 'Power BI'],
    created_at: '2024-10-18T00:00:00.000Z',
    updated_at: nowIso(),
    join_key: 'uc_endowment_fund_id',
    compatible_datasets: ['burgiss-realestate-001', 'walkscore-geo-001', 'msci-realestate-001'],
  },
  {
    id: 'msci-realestate-001',
    title: 'MSCI Real Estate Index Data – Market Benchmarks',
    description: 'MSCI real estate index returns, volatility, and sector performance data by geography and property type. Aligned with UC Endowment holdings.',
    business_description:
      'Real estate market benchmarks for performance attribution and risk analysis. Standardized on uc_endowment_fund_id to enable seamless comparison of portfolio returns against MSCI benchmarks alongside Burgiss property valuations and location intelligence.',
    type: 'dataset',
    category: 'Private Real Estate',
    game_title: 'Coverage: Global Real Estate Markets (35+ countries)',
    genre: 'Benchmark: MSCI Real Estate Indices',
    data_owner: 'Maria Alvarez',
    steward: 'Ben Carter',
    trust_score: 93,
    status: 'ready',
    access_level: 'restricted',
    sla_percentage: '99.4',
    platform: 'BigQuery',
    team_name: 'ARC – Private Equity Analytics',
    tags: ['real-estate', 'benchmarks', 'msci', 'uc-endowment', 'joinable'],
    tech_stack: ['BigQuery', 'Python', 'Looker'],
    created_at: '2024-10-22T00:00:00.000Z',
    updated_at: nowIso(),
    join_key: 'uc_endowment_fund_id',
    compatible_datasets: ['burgiss-realestate-001', 'walkscore-geo-001', 'costar-property-001'],
  },
];

export const mockCollections: MockCollection[] = [
  {
    id: '12121212-1212-1212-1212-121212121212',
    name: 'IC Pack – Cross-Border Diligence (Demo)',
    description: 'Core alt-data products for cross-border deal underwriting (FX + comps + company intel).',
    owner_name: 'Warren Durrett',
    visibility: 'public',
    is_published: true,
    created_at: '2024-09-15T00:00:00.000Z',
    updated_at: nowIso(),
    data_source_ids: [
      '77777777-7777-7777-7777-777777777777',
      '88888888-8888-8888-8888-888888888888',
      '99999999-9999-9999-9999-999999999999',
    ],
  },
  {
    id: 'uc-endowment-realestate',
    name: 'UC Endowment – Private Real Estate Portfolio Analysis',
    description: 'Unified real estate data collection combining Burgiss valuations, WalkScore livability, CoStar commercial data, and MSCI benchmarks. Pre-joined on uc_endowment_fund_id = A for seamless cross-dataset analysis.',
    owner_name: 'Warren Durrett',
    visibility: 'public',
    is_published: true,
    created_at: '2024-12-15T00:00:00.000Z',
    updated_at: nowIso(),
    data_source_ids: [
      'burgiss-realestate-001',
      'walkscore-geo-001',
      'costar-property-001',
      'msci-realestate-001',
    ],
  },
];

export const mockInsights: MockInsight[] = [
  {
    id: '15151515-1515-1515-1515-151515151515',
    title: 'Austin Multi-Family Valuation Model – Real Estate Signals + FX Hedging (December 2024)',
    description: 'Combined Nextdoor neighborhood activity signals with FX forward curves to value a multi-family portfolio acquisition in Austin, adjusting for foreign investor hedging costs.',
    insight_type: 'dashboard',
    status: 'published',
    visibility: 'public',
    metrics: { properties: 8, neighborhoods: 12, fxPairs: 3, updated: nowIso() },
    chart_config: {},
    view_count: 284,
    favorite_count: 47,
    created_at: '2024-12-15T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'Maria Alvarez',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['Real Estate Signals – "Nextdoor" Neighborhood Activity (Synthetic)', 'FX Spot + Forward Curves (G10) – Daily'],
    collections: ['IC Pack – Cross-Border Diligence (Demo)'],
  },
  {
    id: '16161616-1616-1616-1616-161616161616',
    title: 'SaaS Buyout Valuation: Revenue Growth vs. Comp Multiples (Q4 2024)',
    description: 'Integrated company intelligence revenue metrics with PE valuation comps to identify mispriced SaaS targets in North America. Highlighted 3 outlier opportunities trading below sector median.',
    insight_type: 'report',
    status: 'published',
    visibility: 'public',
    metrics: { companies: 47, sectors: 3, regions: 2, outliers: 3, updated: nowIso() },
    chart_config: {},
    view_count: 312,
    favorite_count: 58,
    created_at: '2024-12-10T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'Maria Alvarez',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['Company Intelligence – Private Market Profiles', 'Private Equity Valuation Comps – Quarterly'],
    collections: ['IC Pack – Cross-Border Diligence (Demo)'],
  },
  {
    id: '17171717-1717-1717-1717-171717171717',
    title: 'Cross-Border Manufacturing Deal: FX Risk + Regional Comp Analysis (November 2024)',
    description: 'Built a full valuation framework for a European manufacturing buyout, incorporating EUR/USD forward curves for repatriation modeling and regional valuation comps for EBITDA multiple benchmarking.',
    insight_type: 'model',
    status: 'published',
    visibility: 'public',
    metrics: { scenarios: 5, currencies: 4, comparables: 18, updated: nowIso() },
    chart_config: {},
    view_count: 189,
    favorite_count: 34,
    created_at: '2024-11-22T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'David Park',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['FX Spot + Forward Curves (G10) – Daily', 'Private Equity Valuation Comps – Quarterly'],
    collections: ['IC Pack – Cross-Border Diligence (Demo)'],
  },
  {
    id: '18181818-1818-1818-1818-181818181818',
    title: 'Dallas vs. Phoenix Real Estate Demand: 90-Day Trend Analysis (Q4 2024)',
    description: 'Comparative analysis of neighborhood-level activity signals across Dallas and Phoenix metros to inform regional allocation strategy for a $200M real estate fund deployment.',
    insight_type: 'dashboard',
    status: 'published',
    visibility: 'public',
    metrics: { cities: 2, neighborhoods: 28, dataPoints: 90, updated: nowIso() },
    chart_config: {},
    view_count: 156,
    favorite_count: 29,
    created_at: '2024-12-01T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'James Wong',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['Real Estate Signals – "Nextdoor" Neighborhood Activity (Synthetic)'],
    collections: [],
  },
  {
    id: '19191919-1919-1919-1919-191919191919',
    title: 'Healthcare Services Roll-Up: Valuation Multiple Dispersion by Geography (Q3 2024)',
    description: 'Identified 12 undervalued healthcare services targets across 6 states using company intelligence and regional valuation comp analysis. Average discount to sector median: 18%.',
    insight_type: 'report',
    status: 'published',
    visibility: 'public',
    metrics: { targets: 12, states: 6, discount: '18%', updated: nowIso() },
    chart_config: {},
    view_count: 243,
    favorite_count: 41,
    created_at: '2024-10-15T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'Sarah Martinez',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['Company Intelligence – Private Market Profiles', 'Private Equity Valuation Comps – Quarterly'],
    collections: [],
  },
  {
    id: '20202020-2020-2020-2020-202020202020',
    title: 'Emerging Markets PE Entry: FX Volatility Impact on IRR Projections (2024 Vintage)',
    description: 'Scenario analysis showing how FX volatility in EM currencies affects expected IRRs for 2024 vintage funds. Modeled 8 emerging markets with 3-year, 5-year, and 7-year hold periods.',
    insight_type: 'model',
    status: 'published',
    visibility: 'public',
    metrics: { markets: 8, scenarios: 24, holdPeriods: 3, updated: nowIso() },
    chart_config: {},
    view_count: 201,
    favorite_count: 38,
    created_at: '2024-09-10T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'David Park',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['FX Spot + Forward Curves (G10) – Daily'],
    collections: [],
  },
  {
    id: '21212121-2121-2121-2121-212121212121',
    title: 'Tech Sector Valuation Deep Dive: ARR Growth + Multiple Compression Analysis (2024 YTD)',
    description: 'Integrated real-time company intelligence ARR data with quarterly valuation comps to track multiple compression across 85 SaaS and vertical software companies. Key finding: Premium for >40% growth sustained.',
    insight_type: 'dashboard',
    status: 'published',
    visibility: 'public',
    metrics: { companies: 85, quarters: 4, segments: 7, updated: nowIso() },
    chart_config: {},
    view_count: 367,
    favorite_count: 62,
    created_at: '2024-12-20T00:00:00.000Z',
    updated_at: nowIso(),
    publisher_name: 'Sarah Martinez',
    team_name: 'ARC – Private Equity Analytics',
    team_department: 'Private Equity',
    data_sources: ['Company Intelligence – Private Market Profiles', 'Private Equity Valuation Comps – Quarterly'],
    collections: ['IC Pack – Cross-Border Diligence (Demo)'],
  },
];

export const mockTools: MockTool[] = [
  {
    id: 'tool-1',
    name: 'Power BI',
    description: 'Interactive dashboards for IC-ready reporting and portfolio monitoring.',
    category: 'BI',
    vendor: 'Microsoft',
    access_level: 'read-only',
    pricing_model: 'enterprise',
    integration_complexity: 'low',
    business_value: 'Fast distribution of IC-ready dashboards.',
    technical_requirements: 'Workspace access + dataset permissions.',
    setup_time: '1 day',
    user_count: 1200,
    trust_score: 92,
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'tool-2',
    name: 'Looker',
    description: 'Semantic layer + governed exploration for alternative data products.',
    category: 'BI',
    vendor: 'Google',
    access_level: 'read-only',
    pricing_model: 'enterprise',
    integration_complexity: 'medium',
    business_value: 'Self-serve exploration with governance guardrails.',
    technical_requirements: 'LookML model + warehouse connection.',
    setup_time: '1-2 weeks',
    user_count: 320,
    trust_score: 88,
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'tool-3',
    name: 'Python',
    description: 'Programmatic analysis for diligence models, notebooks, and reproducible research.',
    category: 'Analysis',
    vendor: 'Open Source',
    access_level: 'full',
    pricing_model: 'free',
    integration_complexity: 'low',
    business_value: 'Flexible modeling and automation for advanced workflows.',
    technical_requirements: 'Notebook runtime + credentials.',
    setup_time: 'same day',
    user_count: 540,
    trust_score: 90,
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'tool-4',
    name: 'FEV AI Space',
    description: 'Internal AI workspace for structured deal research and portfolio monitoring.',
    category: 'AI Workspace',
    vendor: 'FEV',
    access_level: 'read-only',
    pricing_model: 'internal',
    integration_complexity: 'medium',
    business_value: 'Accelerate synthesis and decisioning with AI copilots.',
    technical_requirements: 'ARC connector + workspace access.',
    setup_time: '2-3 days',
    user_count: 95,
    trust_score: 86,
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-01-01T00:00:00.000Z',
  },
];

export const mockPolicies: MockPolicy[] = [
  {
    id: 'policy-1',
    name: 'Alternative Data Usage – Deal Team',
    description: 'Rules for use of third-party alternative data in diligence and investment decisions.',
    category: 'Governance',
    policy_type: 'Data Handling',
    compliance_level: 'mandatory',
    effective_date: '2024-01-01',
    review_date: '2025-12-31',
    enforcement_level: 'strict',
    scope: 'All deal teams consuming external alternative data sources.',
    exceptions: 'Requires compliance approval.',
    related_regulations: ['SEC', 'SOC2'],
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'policy-2',
    name: 'PII Redaction for Company Intelligence',
    description: 'PII must be redacted or minimized in any shareable data product outputs.',
    category: 'Privacy',
    policy_type: 'PII',
    compliance_level: 'mandatory',
    effective_date: '2024-02-01',
    review_date: '2026-02-01',
    enforcement_level: 'strict',
    scope: 'Company intelligence, contact data, and employee-related signals.',
    exceptions: 'Legal-approved exceptions only.',
    related_regulations: ['GDPR', 'CCPA'],
    status: 'active',
    last_updated: nowIso(),
    created_at: '2024-02-01T00:00:00.000Z',
  },
];

export function getMockDataSources(filters?: {
  search?: string;
  type?: string;
  category?: string;
  status?: string;
}): MockDataSource[] {
  const search = filters?.search?.trim().toLowerCase();
  return mockDataSources.filter((ds) => {
    if (filters?.type && filters.type !== 'All Types' && ds.type !== filters.type) return false;
    if (filters?.category && filters.category !== 'All Categories' && ds.category !== filters.category) return false;
    if (filters?.status && filters.status !== 'All Status' && ds.status !== filters.status) return false;
    if (search) {
      const hay = `${ds.title} ${ds.description} ${ds.business_description} ${ds.category} ${ds.game_title} ${ds.genre} ${ds.data_owner} ${ds.steward}`.toLowerCase();
      return hay.includes(search);
    }
    return true;
  });
}

export function getMockDataSourceById(id: string): MockDataSource | undefined {
  return mockDataSources.find((d) => d.id === id);
}

export function getMockCategories(): MockCategory[] {
  const byCat = new Map<string, MockDataSource[]>();
  for (const ds of mockDataSources) {
    if (ds.status !== 'ready') continue;
    byCat.set(ds.category, [...(byCat.get(ds.category) || []), ds]);
  }
  const categories: MockCategory[] = Array.from(byCat.entries()).map(([name, items]) => {
    const types = Array.from(new Set(items.map((i) => i.type)));
    const avgTrustScore = Math.round(items.reduce((a, b) => a + b.trust_score, 0) / Math.max(1, items.length));
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return { id, name, count: items.length, types, avgTrustScore };
  });
  categories.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return categories;
}

export function getMockCollections(): Array<Record<string, any>> {
  return mockCollections
    .filter((c) => c.is_published && c.visibility === 'public')
    .map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      owner_name: c.owner_name,
      visibility: c.visibility,
      is_published: c.is_published,
      created_at: c.created_at,
      updated_at: c.updated_at,
      data_source_count: c.data_source_ids.length,
    }))
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
}

export function getMockCollectionById(id: string): { collection: MockCollection; data_sources: MockDataSource[] } | undefined {
  const collection = mockCollections.find((c) => c.id === id && c.is_published);
  if (!collection) return undefined;
  const data_sources = collection.data_source_ids
    .map((dsId) => getMockDataSourceById(dsId))
    .filter(Boolean) as MockDataSource[];
  return { collection, data_sources };
}

export function getMockPeople(params?: { search?: string; expertise?: string; department?: string }): MockPerson[] {
  const search = params?.search?.trim().toLowerCase();
  const department = params?.department?.trim().toLowerCase();
  const expertise = params?.expertise?.trim().toLowerCase();

  return mockPeople
    .filter((p) => {
      if (department && !p.department.toLowerCase().includes(department)) return false;
      if (expertise) {
        const terms = expertise.split(',').map((t) => t.trim()).filter(Boolean);
        if (terms.length > 0 && !terms.some((t) => p.expertise_areas.map((e) => e.toLowerCase()).includes(t))) return false;
      }
      if (search) {
        const hay = `${p.name} ${p.title} ${p.bio} ${p.department} ${p.email}`.toLowerCase();
        return hay.includes(search);
      }
      return true;
    })
    .sort((a, b) => b.years_experience - a.years_experience || a.name.localeCompare(b.name));
}

export function getMockTeams(params?: { search?: string; type?: string; department?: string; includeMembers?: boolean }) {
  const search = params?.search?.trim().toLowerCase();
  const department = params?.department?.trim().toLowerCase();
  const type = params?.type?.trim().toLowerCase();

  const base = mockTeams
    .filter((t) => t.is_active)
    .filter((t) => {
      if (search) {
        const hay = `${t.name} ${t.description}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (department && !t.department.toLowerCase().includes(department)) return false;
      if (type && t.team_type.toLowerCase() !== type) return false;
      return true;
    })
    .map((t) => {
      const lead = t.lead_person_id ? mockPeople.find((p) => p.id === t.lead_person_id) : undefined;
      const memberCount = mockTeamMemberships.filter((m) => m.team_id === t.id && m.is_active).length;
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        teamType: t.team_type,
        department: t.department,
        isActive: t.is_active,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        lead: lead
          ? { name: lead.name, title: lead.title, email: lead.email }
          : null,
        memberCount,
        members: [] as any[],
      };
    })
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  if (!params?.includeMembers) return base;

  const withMembers = base.map((team) => {
    const memberships = mockTeamMemberships.filter((m) => m.team_id === team.id && m.is_active);
    const members = memberships
      .map((m) => {
        const p = mockPeople.find((x) => x.id === m.person_id);
        if (!p) return undefined;
        return {
          personId: p.id,
          name: p.name,
          title: p.title,
          department: p.department,
          email: p.email,
          avatarUrl: p.avatar_url,
          expertiseAreas: p.expertise_areas,
          availabilityStatus: p.availability_status,
          role: m.role,
          joinedAt: m.joined_at,
        };
      })
      .filter(Boolean);
    return { ...team, members };
  });

  return withMembers;
}

export function getMockTeamMembers(teamId: string) {
  const memberships = mockTeamMemberships.filter((m) => m.team_id === teamId && m.is_active);
  return memberships
    .map((m) => {
      const p = mockPeople.find((x) => x.id === m.person_id);
      if (!p) return undefined;
      return {
        membership_id: m.id,
        role: m.role,
        joined_at: m.joined_at,
        is_active: m.is_active,
        person_id: p.id,
        name: p.name,
        title: p.title,
        department: p.department,
        email: p.email,
        avatar_url: p.avatar_url,
        expertise_areas: p.expertise_areas,
        specializations: p.specializations,
        availability_status: p.availability_status,
        contact_preference: p.contact_preference,
      };
    })
    .filter(Boolean);
}

export function getMockInsights(params?: { search?: string; type?: string; visibility?: string; status?: string }) {
  const search = params?.search?.trim().toLowerCase();
  const type = params?.type?.trim().toLowerCase();
  const visibility = params?.visibility?.trim().toLowerCase();
  const status = params?.status?.trim().toLowerCase();

  return mockInsights
    .filter((i) => (status ? i.status === status : true))
    .filter((i) => (type && type !== 'all' ? i.insight_type === type : true))
    .filter((i) => (visibility && visibility !== 'all' ? i.visibility === visibility : true))
    .filter((i) => {
      if (!search) return true;
      const hay = `${i.title} ${i.description} ${i.publisher_name} ${i.team_name}`.toLowerCase();
      return hay.includes(search);
    })
    .sort((a, b) => b.view_count - a.view_count || String(b.created_at).localeCompare(String(a.created_at)))
    .map((i) => ({ ...i }));
}

export function getMockInsightById(id: string) {
  const found = mockInsights.find((i) => i.id === id);
  if (!found) return undefined;
  return { ...found };
}

export function getMockTools(params?: { search?: string; category?: string; vendor?: string; access_level?: string }) {
  const search = params?.search?.trim().toLowerCase();
  const category = params?.category?.trim().toLowerCase();
  const vendor = params?.vendor?.trim().toLowerCase();
  const access_level = params?.access_level?.trim().toLowerCase();

  return mockTools
    .filter((t) => (t.status === 'active'))
    .filter((t) => (category ? t.category.toLowerCase().includes(category) : true))
    .filter((t) => (vendor ? t.vendor.toLowerCase().includes(vendor) : true))
    .filter((t) => (access_level ? t.access_level.toLowerCase() === access_level : true))
    .filter((t) => {
      if (!search) return true;
      const hay = `${t.name} ${t.description} ${t.vendor} ${t.business_value}`.toLowerCase();
      return hay.includes(search);
    })
    .sort((a, b) => b.trust_score - a.trust_score || b.user_count - a.user_count);
}

export function getMockPolicies(params?: { search?: string; category?: string; policy_type?: string; compliance_level?: string }) {
  const search = params?.search?.trim().toLowerCase();
  const category = params?.category?.trim().toLowerCase();
  const policy_type = params?.policy_type?.trim().toLowerCase();
  const compliance_level = params?.compliance_level?.trim().toLowerCase();

  return mockPolicies
    .filter((p) => (p.status === 'active'))
    .filter((p) => (category ? p.category.toLowerCase().includes(category) : true))
    .filter((p) => (policy_type ? p.policy_type.toLowerCase().includes(policy_type) : true))
    .filter((p) => (compliance_level ? p.compliance_level === compliance_level : true))
    .filter((p) => {
      if (!search) return true;
      const hay = `${p.name} ${p.description} ${p.scope} ${p.policy_type}`.toLowerCase();
      return hay.includes(search);
    })
    .sort((a, b) => String(b.effective_date).localeCompare(String(a.effective_date)));
}

export function getMockUserAccess(dataSourceIds: string[]): Record<string, { access_level: AccessLevel }> {
  // Demo logic: most products are full access except those flagged as pending/issues.
  const map: Record<string, { access_level: AccessLevel }> = {};
  for (const id of dataSourceIds) {
    const ds = getMockDataSourceById(id);
    if (!ds) {
      map[id] = { access_level: 'none' };
      continue;
    }
    if (ds.status === 'pending') map[id] = { access_level: 'read-only' };
    else if (ds.status === 'issues') map[id] = { access_level: 'read-only' };
    else map[id] = { access_level: 'full' };
  }
  return map;
}


