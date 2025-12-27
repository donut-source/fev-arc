"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkbench } from "@/lib/workbench-context";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Database,
  Sparkles,
  Users,
  Copy,
  Check,
  Plus,
  Mic,
  ArrowUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  Zap,
  Brain,
  Eye,
  ExternalLink,
  Folder,
  User,
  Mail,
  MessageSquare,
  Building,
  Shield,
  TrendingUp,
  Wrench,
  FileText,
  Scale,
  Gamepad2,
  Key,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    icon: Database,
    title: "Find Data Source",
    prompt: "Do we have any FX rate data for cross-border deal modeling?",
  },
  {
    icon: Database,
    title: "Find Multiple Sources",
    prompt: "Find company intelligence and valuation comps for SaaS buyouts",
  },
  {
    icon: TrendingUp,
    title: "Real Estate Signals",
    prompt: "What real estate demand signals do we have from neighborhood activity?",
  },
  {
    icon: Shield,
    title: "Find Policy",
    prompt: "Show me governance policies for alternative data usage",
  },
  {
    icon: User,
    title: "Find Person",
    prompt: "Who is Maria Alvarez and what does she work on?",
  },
  {
    icon: Users,
    title: "Find Team",
    prompt: "Show me the Private Equity Analytics team members",
  },
  {
    icon: Wrench,
    title: "Find Tool",
    prompt: "What tools can I export ARC products to (Power BI, Looker, Python, FEV AI Space)?",
  },
  {
    icon: Folder,
    title: "Find Collection",
    prompt: "Show me collections for cross-border diligence",
  },
  {
    icon: Key,
    title: "Request Access",
    prompt: "How do I request access to PE valuation comps?",
  },
  {
    icon: TrendingUp,
    title: "Data Quality",
    prompt: "Show me the highest trust score datasets for FX and valuation analysis",
  },
  {
    icon: Building,
    title: "Find by Team",
    prompt: "What data products are published by ARC – Private Equity Analytics?",
  },
  {
    icon: Scale,
    title: "Governance Info",
    prompt: "What are the compliance requirements for alternative data in diligence?",
  },
];

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const [input, setInput] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { addItem } = useWorkbench();

  // Following AI SDK best practices: Use status to control loading indicator
  // Don't track streaming manually - let the status handle it

  // Smart grid layout logic based on number of cards - optimized for readability
  const getGridLayout = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-xl mx-auto";
    if (count === 2) return "grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto";
    if (count === 3) return "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto";
    if (count <= 4) return "grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto";
    return "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput('');
    
    // Scroll to bottom immediately when user sends a message
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const hasMessages = messages.length > 0;

  // Smart auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      // Only auto-scroll if user is near the bottom or if it's a new conversation
      const scrollElement = scrollAreaRef.current;
      const isNearBottom = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 100;
      const isNewConversation = messages.length <= 2;
      
      if (isNearBottom || isNewConversation) {
        // Smooth scroll to bottom with a slight delay to ensure content is rendered
        setTimeout(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [messages]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dataset": return Database;
      case "api": return Zap;
      case "model": return Brain;
      case "warehouse": return Database;
      default: return Database;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'issues': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'deprecated': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Smart rendering for AI message parts with side-by-side layout for people + data sources
  const renderAIMessageParts = (parts: Array<Record<string, unknown>>) => {
    const textParts: Array<Record<string, unknown>> = [];
    const peopleParts: Array<Record<string, unknown>> = [];
    const dataSourceParts: Array<Record<string, unknown>> = [];
    const otherParts: Array<Record<string, unknown>> = [];

    // Categorize parts
    parts.forEach((part, index) => {
      const partWithIndex = { ...part, originalIndex: index };
      switch (part.type) {
        case 'text':
          textParts.push(partWithIndex);
          break;
        case 'data-people-grid':
          peopleParts.push(partWithIndex);
          break;
        case 'data-source-grid':
          dataSourceParts.push(partWithIndex);
          break;
        default:
          otherParts.push(partWithIndex);
          break;
      }
    });

    const renderedParts: JSX.Element[] = [];

    // Debug logging
    console.log('AI Message Parts Debug:', {
      totalParts: parts.length,
      textParts: textParts.length,
      peopleParts: peopleParts.length,
      dataSourceParts: dataSourceParts.length,
      otherParts: otherParts.length
    });

    // Render cards FIRST (above text) - Stacked vertically for better UX
    if (peopleParts.length > 0 && dataSourceParts.length > 0) {
      renderedParts.push(
        <div key="stacked-cards" className="my-8 space-y-6">
          {/* Data Owner Section */}
          <div className="bg-gradient-to-r from-blue-50/40 to-blue-50/20 rounded-xl p-5 border border-blue-100">
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Data Owner
            </h3>
            <div>
              {peopleParts.map((part) => renderMessagePart(part, part.originalIndex as number))}
            </div>
          </div>
          
          {/* Data Sources Section */}
          <div className="bg-gradient-to-r from-purple-50/40 to-purple-50/20 rounded-xl p-5 border border-purple-100">
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-purple-600" />
              Data Sources
            </h3>
            <div>
              {dataSourceParts.map((part) => renderMessagePart(part, part.originalIndex as number))}
            </div>
          </div>
        </div>
      );
    } else {
      // Render people and data source parts normally if not both present
      peopleParts.forEach((part) => {
        renderedParts.push(renderMessagePart(part, part.originalIndex as number));
      });
      dataSourceParts.forEach((part) => {
        renderedParts.push(renderMessagePart(part, part.originalIndex as number));
      });
    }

    // Render text parts AFTER cards
    textParts.forEach((part) => {
      renderedParts.push(renderMessagePart(part, part.originalIndex as number));
    });

    // Render other parts
    otherParts.forEach((part) => {
      renderedParts.push(renderMessagePart(part, part.originalIndex as number));
    });

    return renderedParts;
  };

    const renderMessagePart = (part: Record<string, unknown>, index: number) => {
      switch (part.type) {
        case 'text':
          return (
            <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  // Remove broken images
                  img: () => null,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal mb-4 space-y-1 pl-6">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2 text-foreground">{children}</h3>,
                  code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
                }}
              >
                {part.text || ''}
              </ReactMarkdown>
            </div>
          );
        
        // Removed data-thinking case to prevent flashing during loading

        // Handle data source grid (new smart grid layout)
        case 'data-source-grid':
          const sources = Array.isArray(part.data?.sources) ? part.data.sources : [];
          const gridLayout = getGridLayout(sources.length);
          return (
            <div key={index} className={`grid gap-5 ${gridLayout}`}>
              {sources.map((source: Record<string, unknown>, sourceIndex: number) => {
                const IconComponent = getTypeIcon(String(source.type || 'dataset'));
                return (
                  <Card key={sourceIndex} className="transition-all hover:shadow-lg border-2 hover:border-primary/20 h-full flex flex-col bg-white">
                    <CardHeader className="pb-3 pt-5 px-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                            source.type === 'dataset' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            source.type === 'api' ? 'text-green-600 bg-green-50 border-green-200' :
                            source.type === 'model' ? 'text-purple-600 bg-purple-50 border-purple-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-semibold line-clamp-2 mb-1 leading-tight">
                              {String(source.title || '')}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {String(source.game_title || source.gameTitle || '')} • {String(source.genre || '')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {String(source.type || '')}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-2 px-5 pb-5 space-y-3 flex-grow flex flex-col justify-between">
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {String(source.description || '')}
                      </CardDescription>

                      {/* Compact Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                        <div>
                          <span className="text-muted-foreground">Owner:</span>
                          <p className="font-medium truncate">{String(source.data_owner || source.dataOwner || '')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Trust:</span>
                          <p className="font-medium">{String(source.trust_score || source.trustScore || '')}%</p>
                        </div>
                      </div>

                      {/* Status and Category */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(String(source.status || 'ready'))}
                          <span className="capitalize">{String(source.status || '')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {String(source.category || '')}
                        </Badge>
                      </div>

                      {/* Access Level */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Your Access:</span>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Full Access
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/data-sources/${String(source.id || '')}`, '_blank')}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open("https://powerbi.microsoft.com/", "_blank")}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Power BI
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                addItem({
                                  id: String(source.id || ''),
                                  title: String(source.title || ''),
                                  description: String(source.description || ''),
                                  type: String(source.type || ''),
                                  category: String(source.category || ''),
                                  dataOwner: String(source.data_owner || source.dataOwner || ''),
                                  steward: String(source.steward || ''),
                                  techStack: Array.isArray(source.techStack) ? source.techStack : [],
                                  gameTitle: String(source.game_title || source.gameTitle || ''),
                                  genre: String(source.genre || ''),
                                  trustScore: Number(source.trust_score || source.trustScore || 0),
                                  tags: Array.isArray(source.tags) ? source.tags : [],
                                });
                                toast.success('Added to workbench!');
                              }}
                              className="px-2"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add to My Work Bench</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );

        // Handle legacy single data source cards (keep for backwards compatibility)
        case 'data-source-card':
          const IconComponent = getTypeIcon(String(part.data?.type || 'dataset'));
          return (
            <Card key={index} className="my-4 max-w-md transition-all hover:shadow-lg border-2 hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    part.data?.type === 'dataset' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                    part.data?.type === 'api' ? 'text-green-600 bg-green-50 border-green-200' :
                    part.data?.type === 'model' ? 'text-purple-600 bg-purple-50 border-purple-200' :
                    'text-gray-600 bg-gray-50 border-gray-200'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold line-clamp-1">{String(part.data?.title || '')}</h4>
                    <p className="text-sm text-muted-foreground">{String(part.data?.game_title || part.data?.gameTitle || '')}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => window.open(`/data-sources/${String(part.data?.id || '')}`, '_blank')}>
                    View Details
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="px-3">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Add to Workbench</p></TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          );

        // Handle categories overview
        case 'data-categories':
          const categories = Array.isArray(part.data?.categories) ? part.data.categories : [];
          const categoryGridLayout = getGridLayout(categories.length);
          return (
            <div key={index} className={`my-6 grid gap-4 ${categoryGridLayout}`}>
              {categories.map((category: { name: string; count: number; types: string[]; avgTrustScore: number }, catIndex: number) => (
                <Card key={catIndex} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Avg Trust: {category.avgTrustScore}%
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.types?.slice(0, 3).map((type: string, typeIndex: number) => (
                      <Badge key={typeIndex} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          );

        // Handle collection grid (new smart grid layout)
        case 'data-collection-grid':
          const collections = Array.isArray(part.data?.collections) ? part.data.collections : [];
          const collectionGridLayout = getGridLayout(collections.length);
          return (
            <div key={index} className={`my-6 grid gap-4 ${collectionGridLayout}`}>
              {collections.map((collection: Record<string, unknown>, collectionIndex: number) => (
                <Card key={collectionIndex} className="transition-all hover:shadow-lg border-2 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                          {String(collection.name || '')}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{String(collection.owner_name || '')}</span>
                        </div>
                      </div>
                      <Badge variant={String(collection.visibility) === 'public' ? 'default' : 'secondary'} className="ml-2">
                        {String(collection.visibility || '')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4">
                      {String(collection.description || '')}
                    </CardDescription>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Database className="h-3 w-3" />
                          <span>{String(collection.data_source_count || 0)} data sources</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(String(collection.updated_at)).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`/collections/${String(collection.id || '')}`, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Collection
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.info("Add to workbench functionality coming soon!")}
                              className="px-3"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add collection to workbench</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );

        // Handle suggestions for fuzzy matching
        case 'data-suggestions':
          const suggestionsData = part.data || {};
          const suggestions = Array.isArray(suggestionsData.suggestions) ? suggestionsData.suggestions : [];
          return (
            <div key={index} className="my-4 p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">?</span>
                </div>
                <h3 className="font-semibold text-amber-800">
                  No exact match found for &quot;{String(suggestionsData.searchTerm || '')}&quot;
                </h3>
              </div>
              
              <p className="text-amber-700 mb-3">Did you mean one of these?</p>
              
              <div className="grid gap-2">
                {suggestions.map((suggestion: Record<string, unknown>, suggestionIndex: number) => (
                  <button
                    key={suggestionIndex}
                    onClick={() => {
                      // Re-run search based on suggestion type
                      if (String(suggestionsData.type) === 'people') {
                        setInput(`Who is ${suggestion.name}?`);
                      } else if (String(suggestionsData.type) === 'data-sources') {
                        setInput(`Show me data sources for ${suggestion.title}`);
                      }
                      handleSubmit(new Event('submit') as React.FormEvent);
                    }}
                    className="text-left p-3 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        {String(suggestionsData.type) === 'people' ? (
                          <>
                            <div className="font-medium text-gray-900">{String(suggestion.name || '')}</div>
                            <div className="text-sm text-gray-600">{String(suggestion.title || '')} • {String(suggestion.department || '')}</div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">{String(suggestion.title || '')}</div>
                            <div className="text-sm text-gray-600">
                              {String(suggestion.game_title || '')} • {String(suggestion.category || '')}
                              {suggestion.matchType ? (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1 rounded">
                                  matched by {String(suggestion.matchType)}
                                </span>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-amber-600 font-medium">
                        {Math.round((Number(suggestion.similarity) || 0) * 100)}% match
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-amber-600">
                Click on a suggestion to search for that {String(suggestionsData.type) === 'people' ? 'person' : 'data source'}, or try a different search term.
              </div>
            </div>
          );

        // Handle games list
        case 'data-games-list':
          const gamesData = part.data || {};
          return (
            <div key={index} className="my-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    // Remove broken images
                    img: () => null,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-foreground">{children}</h2>,
                  }}
                >
                  {String(gamesData.text || '')}
                </ReactMarkdown>
              </div>
            </div>
          );

        // Handle tools grid
        case 'data-tools-grid':
          const tools = Array.isArray(part.data?.tools) ? part.data.tools : [];
          const toolGridLayout = getGridLayout(tools.length);
          return (
            <div key={index} className={`my-6 grid gap-4 ${toolGridLayout}`}>
              {tools.map((tool: Record<string, unknown>, toolIndex: number) => (
                <Card key={toolIndex} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{String(tool.name || '')}</h3>
                        <p className="text-sm text-gray-600">{String(tool.category || '')} • {String(tool.vendor || '')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {String(tool.status || 'active')}
                      </Badge>
                      {tool.trustScore && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium text-green-600">{String(tool.trustScore)}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{String(tool.description || '')}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Users: {String(tool.userCount || 0)}</span>
                    <span>{String(tool.pricingModel || '')}</span>
                  </div>
                </Card>
              ))}
            </div>
          );

        // Handle policies grid
        case 'data-policies-grid':
          const policies = Array.isArray(part.data?.policies) ? part.data.policies : [];
          const policyGridLayout = getGridLayout(policies.length);
          return (
            <div key={index} className={`my-6 grid gap-4 ${policyGridLayout}`}>
              {policies.map((policy: Record<string, unknown>, policyIndex: number) => (
                <Card key={policyIndex} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{String(policy.name || '')}</h3>
                        <p className="text-sm text-gray-600">{String(policy.category || '')} • {String(policy.policyType || '')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={policy.complianceLevel === 'mandatory' ? 'destructive' : 'outline'} className="text-xs">
                        {String(policy.complianceLevel || '')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {String(policy.status || 'active')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{String(policy.description || '')}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Enforcement: {String(policy.enforcementLevel || '')}</span>
                    {policy.relatedRegulations && Array.isArray(policy.relatedRegulations) && (
                      <span>{policy.relatedRegulations.join(', ')}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          );

        // Handle people/experts grid
        case 'data-people-grid':
          const people = Array.isArray(part.data?.people) ? part.data.people : [];
          const peopleGridLayout = getGridLayout(people.length);
          return (
            <div key={index} className={`grid gap-5 ${peopleGridLayout}`}>
              {people.map((person: Record<string, unknown>, personIndex: number) => (
                <Card key={personIndex} className="transition-all hover:shadow-lg border-2 hover:border-primary/20 h-full flex flex-col bg-white">
                  <CardHeader className="pb-4 pt-5 px-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {String(person.name || '').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold line-clamp-1 mb-1">
                          {String(person.name || '')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {String(person.title || '')}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{String(person.department || '')}</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {String(person.years_experience || 0)}+ yrs
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-5 pb-5 flex-grow flex flex-col justify-between">
                    <CardDescription className="line-clamp-3 mb-4 text-sm leading-relaxed">
                      {String(person.bio || '')}
                    </CardDescription>

                    <div className="space-y-3 pt-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(person.expertise_areas) ? person.expertise_areas.slice(0, 3).map((area: string, areaIndex: number) => (
                            <Badge key={areaIndex} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          )) : null}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            const slackHandle = String(person.slack_handle || person.name?.toLowerCase().replace(/\s+/g, '.') || 'user');
                            const slackUrl = `slack://user?team=T1234567&id=${slackHandle.replace('@', '')}`;
                            window.open(slackUrl, '_blank');
                            toast.success('Opening Slack...', { description: `Starting conversation with ${person.name}` });
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Slack
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.open(`mailto:${person.email}?subject=ARC%20Inquiry`, '_blank');
                            toast.success('Opening Email...', { description: `Composing email to ${person.name}` });
                          }}
                          className="px-3"
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );

        // Handle legacy single collection cards (keep for backwards compatibility)
        case 'data-collection-card':
          return (
            <Card key={index} className="my-4 max-w-md transition-all hover:shadow-lg border-2 hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Folder className="h-6 w-6 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold line-clamp-1">{String(part.data?.name || '')}</h4>
                    <p className="text-sm text-muted-foreground">by {String(part.data?.owner_name || '')}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`/collections/${String(part.data?.id || '')}`, '_blank')}>
                    View Collection
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="px-3">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Add to Workbench</p></TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          );
        
        // Handle tool calls
        case 'tool-call':
          return (
            <div key={index} className="my-4 p-3 rounded-lg tool-indicator">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Calling {part.toolName}...
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                {JSON.stringify(part.args, null, 2)}
              </div>
            </div>
          );
          
        case 'tool-result':
          return null; // Hide tool results since we're showing custom UI instead
          
        default:
          return null;
      }
    };

  const getMessageText = (message: Record<string, unknown>) => {
    return (message.parts as Array<{type: string; text: string}>)
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('') || '';
  };

  return (
    <div className="bg-background" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Main Content - Account for header height and fixed input */}
      <div className="h-full flex flex-col relative">
        {!hasMessages ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 pb-80">
              <div className="max-w-6xl w-full space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="mx-auto flex flex-col items-center">
                  <div className="relative w-48 h-24 mb-2">
                    <Image 
                      src="/fev-logo.svg" 
                      alt="FEV Analytics" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">FEV AI Assistant</h2>
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
                    How can I help you today?
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover alternative data sources, understand governance, request access, and build collections for your private equity analysis
                  </p>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {SUGGESTED_PROMPTS.map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePromptSelect(suggestion.prompt)}
                      className="text-left p-4 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-all duration-200 group hover:shadow-md hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground mb-1">{suggestion.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{suggestion.prompt}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full chat-scroll" ref={scrollAreaRef}>
              <div className="max-w-6xl mx-auto pb-80 px-4 pt-6 min-h-full">
              {messages.map((message, messageIndex) => (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-4 p-6 hover:bg-muted/30 transition-colors">
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                          : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                      }`}>
                        {message.role === 'user' ? 'U' : 'AI'}
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="text-foreground">
                          {message.role === 'user' ? (
                            // Render user messages from parts
                            <div className="user-message">
                              {message.parts?.filter(part => part.type === 'text').map((part, index) => (
                                <p key={index} className="mb-4 leading-relaxed">{part.text}</p>
                              ))}
                            </div>
                          ) : (
                            // Render AI messages from parts with smart side-by-side layout
                            <div className="ai-message">
                              {renderAIMessageParts(message.parts || [])}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Message Actions */}
                      {message.role === 'assistant' && getMessageText(message) && (
                        <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(getMessageText(message), message.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Separator */}
                  {messageIndex < messages.length - 1 && (
                    <div className="border-b border-border/50"></div>
                  )}
                </div>
              ))}
              
              {/* Simple loading indicator: just change avatar color when loading */}
              {status === 'submitted' && (
                <div className="group">
                  <div className="flex items-start space-x-4 p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-sm font-medium animate-pulse">
                        AI
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 mt-1">
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* ChatGPT-Style Input - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-background rounded-3xl border-2 border-border shadow-xl p-3 hover:border-primary/30 transition-colors">
              <TooltipProvider>
                {/* Plus Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors"
                      onClick={() => {/* Add attachment functionality later */}}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add attachments (coming soon)</p>
                  </TooltipContent>
                </Tooltip>

                {/* Input Field */}
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about FX, company intel, valuation, or real estate signals..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground h-10 pr-20"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as React.FormEvent);
                      }
                    }}
                  />

                  {/* Right Side Buttons */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    {/* Microphone Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 hover:bg-accent transition-colors"
                          onClick={() => {/* Add voice input functionality later */}}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voice input (coming soon)</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Send Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!input?.trim() || isLoading}
                          className="h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 hover:shadow-md"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <ArrowUp className="h-4 w-4 text-primary-foreground" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isLoading ? "Generating response..." : "Send message"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-3">
            ARC is a demo and can make mistakes. Validate important info.
          </p>
        </div>
      </div>
    </div>
  );
}