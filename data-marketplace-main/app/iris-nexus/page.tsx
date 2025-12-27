"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Database,
  Folder,
  Sparkles,
  BarChart3,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Target,
  Brain,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading chart...</p>
      </div>
    </div>
  ),
});

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chart?: any;
  recommendations?: string[];
}

const PREDEFINED_PROMPTS = [
  "Show me players who have gaming accounts that have preordered Operation Killshot in July 2025 and also played Shadow Strike in July 2025 in the state of Texas that are 20-34 years old.",
  "What are the top 3 game genres preferred by players aged 25-35 in California?",
  "Analyze player retention rates for Operation Killshot vs Shadow Strike in Q2 2025."
];

const MOCK_COLLECTIONS = [
  {
    id: "1",
    name: "Preorder & Sentiment Analytics Kit",
    description: "Comprehensive preorder tracking and user sentiment analysis for upcoming releases",
    dataSourceCount: 6,
    dataSources: [
      { name: "Operation Killshot Preorder Analytics", type: "dataset" },
      { name: "Shadow Strike Player Sessions", type: "dataset" },
      { name: "User Sentiment & Community Engagement", type: "dataset" },
      { name: "Market Research & Demographics", type: "dataset" },
      { name: "Conversion Rate Analytics", type: "dataset" },
      { name: "Social Media Sentiment API", type: "api" }
    ]
  }
];

const CHART_DATA = {
  data: [
    {
      x: ['Shadow Strike DAU', 'Cross-Game DAU', 'Market Opportunity'],
      y: [15420, 9750, 15420],
      type: 'bar',
      marker: {
        color: ['#8b5cf6', '#10b981', '#f59e0b'],
        line: {
          color: 'rgba(255,255,255,0.9)',
          width: 2
        }
      },
      text: ['15,420<br><b>Active Players</b>', '9,750<br><b>Already Converted</b>', '15,420<br><b>Conversion Target</b>'],
      textposition: 'inside',
      textfont: {
        color: 'white',
        size: 13,
        family: 'Inter, sans-serif',
        weight: 'bold'
      },
      hovertemplate: '<b>%{x}</b><br>Daily Active Users: %{y:,}<extra></extra>',
      name: ''
    }
  ],
  layout: {
    title: {
      text: '<b>Shadow Strike Daily Active Users Analysis</b><br><sub>Operation Killshot Market Opportunity Assessment</sub>',
      font: { 
        size: 18,
        family: 'Inter, sans-serif',
        color: '#1f2937'
      },
      x: 0.5,
      xanchor: 'center'
    },
    xaxis: { 
      title: {
        text: '<b>User Segments</b>',
        font: { size: 13, family: 'Inter, sans-serif', color: '#374151' }
      },
      tickfont: { 
        size: 11, 
        family: 'Inter, sans-serif',
        color: '#6b7280'
      },
      showgrid: false,
      zeroline: false
    },
    yaxis: { 
      title: {
        text: '<b>Daily Active Users (DAU)</b>',
        font: { size: 13, family: 'Inter, sans-serif', color: '#374151' }
      },
      tickfont: { 
        size: 11, 
        family: 'Inter, sans-serif',
        color: '#6b7280'
      },
      showgrid: true,
      gridcolor: 'rgba(156, 163, 175, 0.15)',
      zeroline: false,
      tickformat: ',d'
    },
    plot_bgcolor: 'rgba(249, 250, 251, 0.6)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif' },
    margin: { t: 85, r: 50, b: 70, l: 90 },
    showlegend: false,
    annotations: [
      {
        x: 0,
        y: 16500,
        text: '<b>Core Player Base</b><br>Shadow Strike loyalists',
        showarrow: true,
        arrowhead: 2,
        arrowcolor: '#8b5cf6',
        arrowwidth: 2,
        font: { size: 10, color: '#8b5cf6', family: 'Inter, sans-serif' },
        bgcolor: 'rgba(139, 92, 246, 0.08)',
        bordercolor: '#8b5cf6',
        borderwidth: 1
      },
      {
        x: 1,
        y: 11000,
        text: '<b>Cross-Game Success</b><br>63% conversion rate',
        showarrow: true,
        arrowhead: 2,
        arrowcolor: '#10b981',
        arrowwidth: 2,
        font: { size: 10, color: '#10b981', family: 'Inter, sans-serif' },
        bgcolor: 'rgba(16, 185, 129, 0.08)',
        bordercolor: '#10b981',
        borderwidth: 1
      },
      {
        x: 2,
        y: 16500,
        text: '<b>Untapped Potential</b><br>Prime conversion target',
        showarrow: true,
        arrowhead: 2,
        arrowcolor: '#f59e0b',
        arrowwidth: 2,
        font: { size: 10, color: '#f59e0b', family: 'Inter, sans-serif' },
        bgcolor: 'rgba(245, 158, 11, 0.08)',
        bordercolor: '#f59e0b',
        borderwidth: 1
      }
    ]
  },
  config: {
    displayModeBar: false,
    responsive: true
  }
};

export default function IrisNexusPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Iris/Nexus! I\'m your AI data analyst. I can help you explore player data, analyze trends, and generate insights. Try one of the suggested prompts below or ask me anything about your gaming data.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I've analyzed the Shadow Strike Daily Active Users (DAU) to assess the Operation Killshot market opportunity. Here's what the data reveals:

**DAU Market Segmentation:**
• **Shadow Strike DAU:** 15,420 daily active users - Core player base with strong engagement
• **Cross-Game DAU:** 9,750 users actively playing both Shadow Strike AND have preordered Operation Killshot
• **Market Opportunity:** 15,420 Shadow Strike DAU who haven't yet preordered Operation Killshot

**Key Performance Insights:**
• **Conversion Success Rate:** 63% of engaged Shadow Strike players have already preordered Operation Killshot
• **Untapped Market Potential:** 15,420 highly engaged daily users represent prime conversion targets
• **Cross-Game Retention:** Players who preorder show 2.3x higher daily engagement patterns

**Strategic DAU Optimization:**
• Focus marketing efforts on the 15,420 daily active Shadow Strike users without preorders
• Leverage cross-game DAU (9,750) as community advocates and referral sources
• The high conversion rate among engaged users indicates strong product-market alignment`,
        timestamp: new Date(),
        chart: CHART_DATA,
        recommendations: [
          "Launch targeted DAU conversion campaigns for the 15,420 Shadow Strike daily active users",
          "Implement cross-game engagement rewards to boost the 9,750 dual-game DAU retention",
          "Develop in-game Operation Killshot previews during peak Shadow Strike DAU hours",
          "Create community-driven referral programs leveraging high-engagement cross-game DAU"
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 flex flex-col z-20">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Iris/Nexus</h1>
              <p className="text-sm text-gray-500">AI Data Analytics</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                Active Collection
              </h3>
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{MOCK_COLLECTIONS[0].name}</CardTitle>
                  <CardDescription className="text-xs">
                    {MOCK_COLLECTIONS[0].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    {MOCK_COLLECTIONS[0].dataSourceCount} Data Sources
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Sources
              </h3>
              <div className="space-y-2">
                {MOCK_COLLECTIONS[0].dataSources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${
                      source.type === 'dataset' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <span className="text-xs text-gray-600 truncate">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative ml-80">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Gaming Analytics Chat</h2>
              <p className="text-sm text-gray-500">Ask questions about your player data and get instant insights</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Connected
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-sm`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Iris/Nexus</span>
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    <p className={`whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                      {message.content}
                    </p>
                  </div>

                  {message.chart && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <Plot
                        data={message.chart.data}
                        layout={message.chart.layout}
                        config={message.chart.config || { displayModeBar: false, responsive: true }}
                        style={{ width: '100%', height: '400px' }}
                        useResizeHandler={true}
                      />
                    </div>
                  )}

                  {message.recommendations && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Recommended Next Steps
                      </h4>
                      <div className="space-y-2">
                        {message.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <ArrowRight className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-blue-800">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white animate-pulse" />
                    </div>
                    <span className="text-sm text-gray-500">Analyzing data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sticky Input Area */}
        <div className="fixed bottom-0 left-80 right-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-gray-200 backdrop-blur-sm z-10">
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {/* Predefined Prompts */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Try these example queries:</p>
                  <div className="grid gap-2">
                    {PREDEFINED_PROMPTS.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto p-3 text-xs"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        <Target className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="flex space-x-3 items-end">
                <div className="flex-1 max-w-2xl">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about player data, trends, or analytics..."
                    className="w-full h-12 px-4 text-sm border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(input);
                      }
                    }}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="h-12 w-12 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
