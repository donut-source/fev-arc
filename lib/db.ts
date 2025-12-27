import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface DataSource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  game_title: string;
  genre: string;
  data_owner: string;
  steward: string;
  trust_score: number;
  status: string;
  access_level: string;
  sla_percentage: string;
  data_quality: number;
  compliance: number;
  lineage: number;
  freshness: number;
  tech_stack: string[];
  tags: string[];
  integrations: string[];
  created_at?: string;
  updated_at?: string;
  last_updated_at?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  visibility: string;
  is_published: boolean;
  data_sources: DataSource[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  team: string;
  department: string;
}

export class DatabaseService {
  static async getDataSources(filters?: {
    type?: string;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<DataSource[]> {
    let query = `
      SELECT 
        ds.id,
        ds.title,
        ds.description,
        ds.type,
        ds.category,
        g.name as game_title,
        g.genre,
        u.name as data_owner,
        u2.name as steward,
        ds.trust_score,
        ds.status,
        ds.access_level,
        ds.sla_percentage,
        gm.data_quality,
        gm.compliance,
        gm.lineage,
        gm.freshness,
        ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
        ARRAY_AGG(DISTINCT i.name) FILTER (WHERE i.name IS NOT NULL) as integrations,
        ds.created_at,
        ds.updated_at,
        ds.last_updated_at
      FROM data_sources ds
      JOIN games g ON ds.game_id = g.id
      JOIN users u ON ds.data_owner_id = u.id
      JOIN users u2 ON ds.steward_id = u2.id
      LEFT JOIN governance_metrics gm ON ds.id = gm.data_source_id
      LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
      LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
      LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
      LEFT JOIN tags t ON dst.tag_id = t.id
      LEFT JOIN data_source_integrations dsi ON ds.id = dsi.data_source_id
      LEFT JOIN integrations i ON dsi.integration_id = i.id
    `;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters?.type && filters.type !== 'All Types') {
      conditions.push(`ds.type = $${params.length + 1}`);
      params.push(filters.type);
    }

    if (filters?.category && filters.category !== 'All Categories') {
      conditions.push(`ds.category = $${params.length + 1}`);
      params.push(filters.category);
    }

    if (filters?.status && filters.status !== 'All Status') {
      conditions.push(`ds.status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (filters?.search) {
      conditions.push(`(
        ds.title ILIKE $${params.length + 1} OR 
        ds.description ILIKE $${params.length + 1} OR 
        g.name ILIKE $${params.length + 1} OR
        u.name ILIKE $${params.length + 1} OR
        u2.name ILIKE $${params.length + 1}
      )`);
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY ds.id, ds.title, ds.description, ds.type, ds.category, g.name, g.genre, 
               u.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage, 
               gm.data_quality, gm.compliance, gm.lineage, gm.freshness, ds.created_at, 
               ds.updated_at, ds.last_updated_at
      ORDER BY ds.trust_score DESC, ds.created_at DESC
    `;

    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      ...row,
      tech_stack: row.tech_stack || [],
      tags: row.tags || [],
      integrations: row.integrations || [],
    }));
  }

  static async getDataSourceById(id: string): Promise<DataSource | null> {
    const dataSources = await this.getDataSources();
    return dataSources.find(ds => ds.id === id) || null;
  }

  static async getCollections(userId?: string): Promise<Collection[]> {
    let query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        u.name as owner_name,
        c.visibility,
        c.is_published,
        c.created_at,
        c.updated_at
      FROM collections c
      JOIN users u ON c.owner_id = u.id
    `;

    const params: string[] = [];
    if (userId) {
      query += ` WHERE c.owner_id = $1 OR c.visibility = 'public'`;
      params.push(userId);
    } else {
      query += ` WHERE c.is_published = true`;
    }

    query += ` ORDER BY c.updated_at DESC`;

    const result = await pool.query(query, params);
    
    // Get data sources for each collection
    const collections = await Promise.all(
      result.rows.map(async (collection) => {
        const dataSourcesQuery = `
          SELECT ds.*
          FROM collection_data_sources cds
          JOIN data_sources ds ON cds.data_source_id = ds.id
          WHERE cds.collection_id = $1
        `;
        const dsResult = await pool.query(dataSourcesQuery, [collection.id]);
        
        return {
          ...collection,
          data_sources: dsResult.rows,
        };
      })
    );

    return collections;
  }

  static async getUsers(): Promise<User[]> {
    const query = `
      SELECT id, email, name, role, team, department
      FROM users
      ORDER BY name
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async getCategories(): Promise<string[]> {
    const query = `
      SELECT DISTINCT category
      FROM data_sources
      ORDER BY category
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => row.category);
  }

  static async getTags(): Promise<Array<{name: string, color: string}>> {
    const query = `
      SELECT name, color
      FROM tags
      ORDER BY name
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }
}

export default pool;
