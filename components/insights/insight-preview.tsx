"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BarChart3, PieChart, FileText, Brain } from "lucide-react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-pulse bg-slate-200 rounded w-full h-full"></div>
    </div>
  ),
});

interface InsightPreviewProps {
  insightType: 'dashboard' | 'chart' | 'report' | 'analysis';
  title: string;
  metrics: { [key: string]: string | number };
}

export function InsightPreview({ insightType, title, metrics }: InsightPreviewProps) {
  const [plotData, setPlotData] = useState<unknown>(null);
  const [plotLayout, setPlotLayout] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    generatePreview();
  }, [insightType, title, metrics]);

  const generatePreview = () => {
    const commonLayout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, system-ui, sans-serif', size: 10, color: '#6B7280' },
      margin: { l: 20, r: 20, t: 20, b: 20 },
      showlegend: false,
      height: 120,
      xaxis: { showgrid: false, showticklabels: false, zeroline: false },
      yaxis: { showgrid: false, showticklabels: false, zeroline: false },
    };

    switch (insightType) {
      case 'dashboard':
        // Mini gauge for dashboard
        const data = [
          {
            type: 'indicator',
            mode: 'gauge',
            value: 78,
            gauge: {
              axis: { range: [null, 100], visible: false },
              bar: { color: '#3B82F6', thickness: 0.3 },
              bgcolor: '#F1F5F9',
              borderwidth: 0,
              steps: [
                { range: [0, 100], color: '#F1F5F9' }
              ]
            }
          }
        ];
        setPlotData(data);
        setPlotLayout(commonLayout);
        break;

      case 'chart':
        // Mini line chart
        const chartData = [
          {
            x: [1, 2, 3, 4, 5, 6],
            y: [10, 15, 13, 17, 16, 20],
            type: 'scatter',
            mode: 'lines',
            line: { color: '#10B981', width: 2 },
            fill: 'tonexty',
            fillcolor: 'rgba(16, 185, 129, 0.1)'
          }
        ];
        setPlotData(chartData);
        setPlotLayout(commonLayout);
        break;

      case 'report':
        // Mini bar chart
        const reportData = [
          {
            x: ['A', 'B', 'C', 'D'],
            y: [20, 35, 30, 25],
            type: 'bar',
            marker: { color: '#8B5CF6' }
          }
        ];
        setPlotData(reportData);
        setPlotLayout(commonLayout);
        break;

      case 'analysis':
        // Mini scatter plot
        const analysisData = [
          {
            x: Array.from({ length: 15 }, () => Math.random() * 10),
            y: Array.from({ length: 15 }, () => Math.random() * 10),
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 6,
              color: '#F59E0B',
              opacity: 0.7
            }
          }
        ];
        setPlotData(analysisData);
        setPlotLayout(commonLayout);
        break;
    }
  };

  if (!plotData || !plotLayout) {
    const IconComponent = insightType === 'dashboard' ? BarChart3 : 
                         insightType === 'chart' ? BarChart3 :
                         insightType === 'report' ? FileText : Brain;
    
    return (
      <div className="flex items-center justify-center h-32 bg-slate-50 rounded">
        <IconComponent className="h-8 w-8 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-32">
      <Plot
        data={plotData}
        layout={plotLayout}
        config={{
          displayModeBar: false,
          staticPlot: true
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
