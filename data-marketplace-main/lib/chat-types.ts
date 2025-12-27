import { UIMessage } from 'ai';

// Define custom data part types for enhanced chat UI
export type DataMarketplaceUIMessage = UIMessage<
  never, // metadata type
  {
    'search-status': {
      status: 'searching' | 'complete' | 'error';
      message: string;
    };
    'source-card': {
      id: string;
      title: string;
      description: string;
      type: string;
      category: string;
      gameTitle: string;
      genre: string;
      dataOwner: string;
      steward: string;
      trustScore: number;
      status: string;
      tags: string[];
      techStack: string[];
    };
    'action-buttons': {
      actions: Array<{
        label: string;
        action: string;
        count?: number;
      }>;
    };
    'category-overview': {
      categories: Array<{
        name: string;
        count: number;
        types: string[];
        avgTrustScore: number;
      }>;
    };
    'collection-list': {
      collections: Array<{
        id: string;
        name: string;
        description: string;
        owner_name: string;
        data_source_count: number;
        visibility: string;
      }>;
    };
  } // data parts type
>;

