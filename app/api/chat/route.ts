import { openai } from '@ai-sdk/openai';
import { streamText, tool, createUIMessageStream, createUIMessageStreamResponse, stepCountIs } from 'ai';
import { z } from 'zod';
import { performSemanticSearch } from '@/lib/semantic-search';
import { queryPeople } from '@/lib/query-people';
import { queryDataSources } from '@/lib/query-data-sources';
import { shouldUseMockData } from '@/lib/runtime-config';
import { getMockDataSources, getMockPeople } from '@/lib/mock-data';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    console.log('=== CHAT API CALLED ===');
    console.log('Messages received:', messages?.length || 0);

    // ARC demo mode: avoid requiring DB embeddings + OpenAI. Provide a lightweight "catalog search" experience.
    if (shouldUseMockData()) {
      const last = Array.isArray(messages) ? messages[messages.length - 1] : undefined;
      const text =
        typeof last?.content === 'string'
          ? last.content
          : Array.isArray(last?.parts)
            ? last.parts.filter((p: { type: string }) => p.type === 'text').map((p: { text: string }) => p.text).join('')
            : '';

      const query = (text || '').trim();
      const matched = getMockDataSources({ search: query });
      const top = (matched.length > 0 ? matched : getMockDataSources({})).slice(0, 3);

      const owners = Array.from(new Set(top.map((ds) => ds.data_owner).filter(Boolean)));
      const people = owners
        .map((name) => getMockPeople({ search: name })[0])
        .filter(Boolean);

      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          if (people.length > 0) {
            writer.write({
              type: 'data-people-grid',
              id: 'people-grid',
              data: {
                count: people.length,
                people: people.map((p: { id: string; name: string; title: string; department: string; expertise_areas: string[]; bio: string; email: string; years_experience: number; specializations: string[]; slack_handle: string; contact_preference: string; availability_status: string }) => ({
                  id: p.id,
                  name: p.name,
                  title: p.title,
                  department: p.department,
                  expertise_areas: p.expertise_areas,
                  bio: p.bio,
                  email: p.email,
                  years_experience: p.years_experience,
                  specializations: p.specializations,
                  slack_handle: p.slack_handle,
                  contact_preference: p.contact_preference,
                  availability_status: p.availability_status,
                })),
              },
            });
          }

          writer.write({
            type: 'data-source-grid',
            id: 'data-sources-grid',
            data: {
              count: top.length,
              sources: top.map((ds) => ({
                id: ds.id,
                title: ds.title,
                description: ds.description,
                type: ds.type,
                category: ds.category,
                game_title: ds.game_title,
                genre: ds.genre,
                data_owner: ds.data_owner,
                steward: ds.steward,
                trust_score: ds.trust_score,
                status: ds.status,
                access_level: ds.access_level,
              })),
            },
          });

          writer.write({
            type: 'text',
            text:
              top.length > 0
                ? `Here are the most relevant ARC data products for **"${query || 'your request'}"**.\n\nIf you want, tell me which one you’re analyzing and I’ll suggest an export path to **Power BI**, **Looker**, **Python**, or **FEV AI Space**.`
                : `I couldn’t find a close match. Try searching for **FX**, **valuation**, **company intelligence**, or **real estate signals**.`,
          });
        },
      });

      return createUIMessageStreamResponse({ stream });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        console.log('=== STARTING STREAM EXECUTION ===');
        
        // Convert messages to proper format for AI SDK
        const modelMessages = messages.map((msg: Record<string, unknown>) => {
          if (msg.parts) {
            // Handle new format with parts
            const textParts = (msg.parts as Array<{type: string; text: string}>).filter((part) => part.type === 'text');
          return {
              role: msg.role,
              content: textParts.map((part) => part.text).join('')
            };
          }
          // Handle old format
          return {
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
          };
        });

        const result = streamText({
          model: openai('gpt-4o'),
          messages: modelMessages,
          stopWhen: stepCountIs(5),
          system: `You are an intelligent assistant for ARC (Alternatives AI Ready Catalog), an alternative-data discovery platform for private equity.

🚨🚨🚨 CRITICAL WORKFLOW - FOLLOW EXACTLY 🚨🚨🚨

MANDATORY STEPS:
1. ALWAYS use semanticSearch FIRST for every query
2. IMMEDIATELY after semanticSearch, check ALL content_types in results:
   - If ANY result has content_type="people" → MUST call queryPeople
   - If ANY result has content_type="data_sources" → MUST call queryDataSources (automatically includes data owner people cards)
   - If ANY result has content_type="tools" or "policies" → UI cards auto-generated
3. CALL ALL APPLICABLE TOOLS based on semantic search results
4. Provide helpful response with ALL UI cards + text

🚨 CRITICAL RULES: 
- If semanticSearch finds data_sources, you MUST call queryDataSources (it will automatically fetch data owners too)!
- queryDataSources now automatically generates BOTH data source cards AND data owner people cards!
- For standalone people queries, use queryPeople directly

EXAMPLE FOR DATA SOURCE QUERIES:
User: "Show me FX rate data for cross-border deal modeling"
1. Call semanticSearch with query "FX rate data cross-border deal modeling"
2. If results contain content_type="data_sources":
   - Call queryDataSources (automatically generates BOTH data source cards AND data owner people cards)
3. Respond with BOTH data source and data owner cards side by side + helpful text

NEVER stop after just semanticSearch - always follow through with ALL appropriate query tools!
- NEVER include images, links, or markdown image syntax in responses`,

          tools: {
            // 🔍 STEP 1: SEMANTIC SEARCH (MANDATORY FIRST STEP)
            semanticSearch: tool({
              description: 'Search all content by meaning - people, coverage areas, data sources, tools, policies. ALWAYS use this first!',
              inputSchema: z.object({
                query: z.string().describe('Search query to find relevant content'),
                limit: z.number().optional().default(10).describe('Maximum number of results'),
                threshold: z.number().optional().default(0.3).describe('Similarity threshold (0-1)'),
              }),
              execute: async ({ query, limit = 10, threshold = 0.3 }) => {
                try {
                  console.log('=== SEMANTIC SEARCH CALLED ===');
                  console.log('Query:', query);
                  
                  // Use direct function call instead of HTTP request to avoid production issues
                  const result = await performSemanticSearch({
                    query,
                    limit,
                    threshold
                  });

                  if (!result.success) {
                    return { error: result.error };
                  }

                  // Auto-generate UI cards for policies and tools
                  if (result.results && result.results.length > 0) {
                    const policies = result.results.filter((item: Record<string, unknown>) => item.content_type === 'policies');
                    const tools = result.results.filter((item: Record<string, unknown>) => item.content_type === 'tools');

                    // Generate policy cards
                    if (policies.length > 0) {
                      writer.write({
                        type: 'data-policies-grid',
                        id: 'policies-grid',
                        data: {
                          count: policies.length,
                          policies: policies.map((policy: Record<string, unknown>) => ({
                            id: policy.content_id,
                            name: policy.metadata.name,
                            description: policy.content_text.split('. ')[5] || 'Policy description',
                            category: policy.metadata.category,
                            policyType: policy.metadata.policy_type,
                            complianceLevel: policy.metadata.compliance_level,
                            status: policy.metadata.status,
                            enforcementLevel: policy.metadata.enforcement_level,
                            relatedRegulations: policy.metadata.related_regulations,
                          })),
                        },
                      });
                    }

                    // Generate tool cards
                    if (tools.length > 0) {
                      writer.write({
                        type: 'data-tools-grid',
                        id: 'tools-grid',
                        data: {
                          count: tools.length,
                          tools: tools.map((tool: Record<string, unknown>) => ({
                            id: tool.content_id,
                            name: tool.metadata.name,
                            description: tool.content_text.split('. ')[2] || 'Tool description',
                            category: tool.metadata.category,
                            vendor: tool.metadata.vendor,
                            trustScore: tool.metadata.trust_score,
                            status: tool.metadata.status,
                            pricingModel: tool.metadata.pricing_model,
                            businessValue: tool.metadata.business_value,
                          })),
                        },
                      });
                    }
                  }

          return {
            success: true,
                    query,
                    results: result.results || [],
                    total_found: result.total_found || 0,
                    message: result.message || `Found ${result.results?.length || 0} semantically similar items`
                  };
      } catch (error) {
                  console.error('Semantic search error:', error);
        return {
                    error: error instanceof Error ? error.message : 'Failed to perform semantic search'
                  };
                }
              },
            }),

            // 🎯 STEP 2: QUERY PEOPLE (AFTER SEMANTIC SEARCH)
            queryPeople: tool({
              description: 'Search for people/experts. Use after semanticSearch finds people.',
              inputSchema: z.object({
                search: z.string().optional().describe('Name or general search term'),
                expertise: z.string().optional().describe('Specific expertise area to filter by'),
                department: z.string().optional().describe('Department to filter by'),
              }),
              execute: async (params) => {
                try {
                  console.log('=== QUERY PEOPLE CALLED ===');
                  console.log('Params:', params);
                  
                  // Use direct function call instead of HTTP request to avoid production issues
                  const result = await queryPeople({
                    search: params.search,
                    expertise: params.expertise,
                    department: params.department
                  });

                  if (result.success && result.data && result.data.length > 0) {
                    // Generate people cards
                    writer.write({
                      type: 'data-people-grid',
                      id: 'people-grid',
                      data: {
                        count: result.data.length,
                        people: result.data.map((person: Record<string, unknown>) => ({
                          id: person.id,
                          name: person.name,
                          title: person.title,
                          department: person.department,
                          expertise_areas: person.expertise_areas,
                          bio: person.bio,
                          email: person.email,
                          years_experience: person.years_experience,
                          specializations: person.specializations,
                          slack_handle: person.slack_handle,
                          contact_preference: person.contact_preference,
                          availability_status: person.availability_status,
                        })),
                      },
                    });
                  }
                  
                  return `Found ${result.data?.length || 0} people matching your criteria`;
                } catch (error) {
                  console.error('Query people error:', error);
                  return 'Failed to search people';
                }
              },
            }),

            // 📊 STEP 3: QUERY DATA SOURCES (AFTER SEMANTIC SEARCH)
            queryDataSources: tool({
              description: 'Search data products in ARC (alternative-data catalog). Use after semanticSearch finds data_sources.',
              inputSchema: z.object({
                search: z.string().optional().describe('Search term to filter data sources'),
                type: z.string().optional().describe('Type of data source'),
                category: z.string().optional().describe('Category to filter by'),
                status: z.string().optional().describe('Status filter'),
              }),
              execute: async (params) => {
                // Smart redirect: If this looks like a people query, redirect to people API
                const searchTerm = params.search?.toLowerCase() || '';
                const peopleIndicators = ['sarah chen', 'john doe', 'alex kim', 'lisa wang', 'jordan smith', 'david rodriguez', 'who is', 'person', 'people', 'expert', 'analyst', 'scientist', 'manager', 'director'];
                
                if (peopleIndicators.some(indicator => searchTerm.includes(indicator))) {
                  // This is clearly a people query - use direct function call
                  const result = await queryPeople({
                    search: params.search
                  });

                  if (result.success && result.data && result.data.length > 0) {
                    // Generate people cards
                    writer.write({
                      type: 'data-people-grid',
                      id: 'people-grid',
                      data: {
                        count: result.data.length,
                        people: result.data.map((person: Record<string, unknown>) => ({
                          id: person.id,
                          name: person.name,
                          title: person.title,
                          department: person.department,
                          expertise_areas: person.expertise_areas,
                          bio: person.bio,
                          email: person.email,
                          years_experience: person.years_experience,
                          specializations: person.specializations,
                          slack_handle: person.slack_handle,
                          contact_preference: person.contact_preference,
                          availability_status: person.availability_status,
                        })),
                      },
                    });
                  }
                  
                  return `Found ${result.data?.length || 0} people matching "${params.search}"`;
                }

                // Regular data sources search - use direct function call
                try {
                  console.log('=== QUERY DATA SOURCES CALLED ===');
                  console.log('Search params:', params);
                  
                  const result = await queryDataSources({
                    search: params.search,
                    type: params.type,
                    category: params.category
                  });
                  
                  console.log('Data sources query result:', result.success, 'Found:', result.data?.length || 0);
                
                // Generate UI cards for exact matches OR fuzzy match suggestions
                let dataToShow: Array<Record<string, unknown>> = [];
                let resultMessage = '';
                
                if (result.success && result.data && result.data.length > 0) {
                  // Use exact matches
                  dataToShow = result.data.slice(0, 3);
                  resultMessage = `Found ${result.data.length} data sources`;
                } else if (result.success && result.suggestions && result.suggestions.length > 0) {
                  // Use fuzzy match suggestions - show only the best match
                  dataToShow = result.suggestions.slice(0, 1);
                  resultMessage = `Found the most relevant data source`;
                }

                if (dataToShow.length > 0) {
                  // Generate data source cards
                  writer.write({
                    type: 'data-source-grid',
                    id: 'data-sources-grid',
                    data: {
                      count: dataToShow.length,
                      sources: dataToShow.map((ds: Record<string, unknown>) => ({
                        id: ds.id,
                        title: ds.title,
                        description: ds.description,
                        type: ds.type,
                        category: ds.category,
                        gameTitle: ds.game_title || ds.game_name,
                        genre: ds.genre,
                        trustScore: ds.trust_score,
                        status: ds.status,
                        accessLevel: ds.access_level,
                      })),
                    },
                  });

                  // Automatically fetch and generate data owner people cards
                  const dataOwnerNames = [...new Set(dataToShow
                    .map((ds: Record<string, unknown>) => ds.data_owner as string)
                    .filter(Boolean))];

                  if (dataOwnerNames.length > 0) {
                    console.log('=== FETCHING DATA OWNERS ===');
                    console.log('Data owner names:', dataOwnerNames);

                    for (const ownerName of dataOwnerNames) {
                      try {
                        const ownerResult = await queryPeople({
                          search: ownerName
                        });

                        if (ownerResult.success && ownerResult.data && ownerResult.data.length > 0) {
                          console.log(`Found data owner: ${ownerName}`);
                  writer.write({
                            type: 'data-people-grid',
                            id: `people-grid-${ownerName.replace(/\s+/g, '-').toLowerCase()}`,
                    data: {
                              count: ownerResult.data.length,
                              people: ownerResult.data.map((person: Record<string, unknown>) => ({
                                id: person.id,
                                name: person.name,
                                title: person.title,
                                department: person.department,
                                expertise_areas: person.expertise_areas,
                                bio: person.bio,
                                email: person.email,
                                years_experience: person.years_experience,
                                specializations: person.specializations,
                                slack_handle: person.slack_handle,
                                contact_preference: person.contact_preference,
                                availability_status: person.availability_status,
                      })),
                    },
                  });
                        } else {
                          console.log(`No data owner found for: ${ownerName}`);
                        }
                      } catch (error) {
                        console.error(`Error fetching data owner ${ownerName}:`, error);
                      }
                    }
                  }
                }

                return resultMessage || 'No data sources found';
                } catch (error) {
                  console.error('Query data sources error:', error);
                  return 'Failed to search data sources';
                }
              },
            }),
          },
        });

        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
