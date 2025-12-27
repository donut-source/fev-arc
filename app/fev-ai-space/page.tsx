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
  Brain,
  Lightbulb,
  ArrowRight,
  Target,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
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
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  chart?: {
    type: string;
    data: unknown;
    config?: Record<string, unknown>;
  };
  recommendations?: string[];
}

const PREDEFINED_PROMPTS = [
  "Summarize FX risk for a cross-border acquisition: which currency pairs matter most and what hedging costs should we expect?",
  "Show valuation comp ranges for SaaS buyouts in North America and highlight any outliers.",
  "What do our synthetic 'Nextdoor' real estate signals suggest about demand in Austin vs Dallas over the last 90 days?",
];

const MOCK_COLLECTIONS = [
  {
    id: "1",
    name: "IC Pack – Cross-Border Diligence (Demo)",
    description: "FX + company intelligence + valuation comps + real estate signals",
    dataSourceCount: 4,
    dataSources: [
      { name: "FX Spot + Forward Curves (G10) – Daily", type: "dataset" },
      { name: "Company Intelligence – Private Market Profiles", type: "dataset" },
      { name: "Private Equity Valuation Comps – Quarterly", type: "dataset" },
      { name: "Real Estate Signals – Neighborhood Activity (Synthetic)", type: "dataset" },
    ],
  },
];

const CHART_DATA = {
  data: [
    {
      x: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CAD", "AUD/USD"],
      y: [42, 18, 25, 9, 6],
      type: "bar",
      marker: {
        color: ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"],
        line: { color: "rgba(255,255,255,0.9)", width: 2 },
      },
      text: ["42%", "18%", "25%", "9%", "6%"],
      textposition: "inside",
      textfont: { color: "white", size: 13, family: "Inter, sans-serif", weight: "bold" },
      hovertemplate: "<b>%{x}</b><br>Exposure: %{y}%<extra></extra>",
      name: "",
    },
  ],
  layout: {
    title: {
      text: "<b>FX Exposure Snapshot</b><br><sub>Portfolio-weighted currency exposure (demo)</sub>",
      font: { size: 18, family: "Inter, sans-serif", color: "#1f2937" },
      x: 0.5,
      xanchor: "center",
    },
    xaxis: { title: { text: "<b>Currency Pair</b>" }, showgrid: false, zeroline: false },
    yaxis: {
      title: { text: "<b>Exposure (%)</b>" },
      showgrid: true,
      gridcolor: "rgba(156, 163, 175, 0.15)",
      zeroline: false,
      tickformat: ",d",
    },
    plot_bgcolor: "rgba(249, 250, 251, 0.6)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: { family: "Inter, sans-serif" },
    margin: { t: 85, r: 40, b: 60, l: 70 },
    showlegend: false,
  },
  config: { displayModeBar: false, responsive: true },
};

export default function FEVAIspacePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Welcome to FEV AI Space (Demo). I’m your deal-team copilot for alternative-data analysis. Ask about FX rates, company intelligence, valuation comps, or real estate signals—and I’ll suggest next steps and artifacts you can export to Power BI, Looker, or Python.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Here’s a demo FX exposure readout for an IC-ready snapshot.\n\n**What it shows:**\n- Top currency pairs driving exposure\n- Relative weights (portfolio-weighted)\n\n**How to use it:**\n- Stress scenarios (±5%, ±10%)\n- Hedge cost estimates using forward points\n- Sensitivity tables for the IC memo\n\nBelow is a synthetic chart for demonstration.",
        timestamp: new Date(),
        chart: CHART_DATA,
        recommendations: [
          "Export this view to Power BI for stakeholder distribution",
          "Open in Looker to drill down by portfolio company and region",
          "Generate a Python notebook template for scenario analysis",
          "Publish a snapshot to FEV AI Space workspace for the deal room",
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handlePromptClick = (prompt: string) => setInput(prompt);

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
              <h1 className="text-xl font-bold text-gray-900">FEV AI Space</h1>
              <p className="text-sm text-gray-500">Deal Team Copilot (Demo)</p>
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
                  <CardDescription className="text-xs">{MOCK_COLLECTIONS[0].description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    {MOCK_COLLECTIONS[0].dataSourceCount} Data Products
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Products
              </h3>
              <div className="space-y-2">
                {MOCK_COLLECTIONS[0].dataSources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        source.type === "dataset" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    />
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
              <h2 className="text-lg font-semibold text-gray-900">Alternative Data Analysis</h2>
              <p className="text-sm text-gray-500">Ask questions and generate IC-ready insights</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Connected (Demo)
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-3xl ${
                    message.type === "user" ? "bg-purple-600 text-white" : "bg-white border border-gray-200"
                  } rounded-2xl p-4 shadow-sm`}
                >
                  {message.type === "assistant" && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">FEV AI Space</span>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none">
                    <p className={`whitespace-pre-wrap ${message.type === "user" ? "text-white" : "text-gray-700"}`}>
                      {message.content}
                    </p>
                  </div>

                  {message.chart && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <Plot
                        data={message.chart.data}
                        layout={message.chart.layout}
                        config={message.chart.config || { displayModeBar: false, responsive: true }}
                        style={{ width: "100%", height: "400px" }}
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
                    <span className="text-sm text-gray-500">Synthesizing…</span>
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

              <div className="flex space-x-3 items-end">
                <div className="flex-1 max-w-2xl">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about FX, company intel, valuation, real estate signals..."
                    className="w-full h-12 px-4 text-sm border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
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


