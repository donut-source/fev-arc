"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-muted-foreground">Loading visualization...</p>
      </div>
    </div>
  ),
});

interface InsightVisualizationProps {
  insightType: 'dashboard' | 'chart' | 'report' | 'analysis';
  title: string;
  metrics: { [key: string]: string | number };
}

export function InsightVisualization({ insightType, title, metrics }: InsightVisualizationProps) {
  const [plotData, setPlotData] = useState<unknown>(null);
  const [plotLayout, setPlotLayout] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    generateVisualization();
  }, [insightType, title, metrics]);

  const generateVisualization = () => {
    const commonLayout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, system-ui, sans-serif', size: 12, color: '#374151' },
      margin: { l: 60, r: 40, t: 60, b: 60 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
    };

    switch (insightType) {
      case 'dashboard':
        generateDashboard(commonLayout);
        break;
      case 'chart':
        generateChart(commonLayout);
        break;
      case 'report':
        generateReport(commonLayout);
        break;
      case 'analysis':
        generateAnalysis(commonLayout);
        break;
    }
  };

  const generateDashboard = (commonLayout: Record<string, unknown>) => {
    if (title.includes('Player Engagement')) {
      // Multi-chart dashboard for analysis
      const data = [
        {
          type: 'indicator',
          mode: 'gauge+number+delta',
          value: 78,
          domain: { x: [0, 0.48], y: [0.5, 1] },
          title: { text: 'Retention Rate (%)' },
          delta: { reference: 75 },
          gauge: {
            axis: { range: [null, 100] },
            bar: { color: '#3B82F6' },
            steps: [
              { range: [0, 50], color: '#FEE2E2' },
              { range: [50, 80], color: '#FEF3C7' },
              { range: [80, 100], color: '#D1FAE5' }
            ],
            threshold: {
              line: { color: '#EF4444', width: 4 },
              thickness: 0.75,
              value: 90
            }
          }
        },
        {
          type: 'indicator',
          mode: 'number+delta',
          value: 125000,
          domain: { x: [0.52, 1], y: [0.5, 1] },
          title: { text: 'Total Players' },
          delta: { reference: 120000, increasing: { color: '#10B981' } },
          number: { font: { size: 40 } }
        },
        {
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          y: [85000, 92000, 88000, 95000, 102000, 118000, 125000],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Daily Active Users',
          line: { color: '#8B5CF6', width: 3 },
          marker: { size: 8, color: '#8B5CF6' },
          xaxis: 'x2',
          yaxis: 'y2'
        },
        {
          x: ['0-1h', '1-2h', '2-4h', '4-8h', '8h+'],
          y: [15, 25, 35, 20, 5],
          type: 'bar',
          name: 'Session Duration',
          marker: { color: '#F59E0B' },
          xaxis: 'x3',
          yaxis: 'y3'
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'Player Engagement Dashboard', x: 0.5, font: { size: 18, color: '#1F2937' } },
        grid: { rows: 2, columns: 2, pattern: 'independent' },
        xaxis2: { domain: [0, 0.48], anchor: 'y2', title: 'Day of Week' },
        yaxis2: { domain: [0, 0.48], anchor: 'x2', title: 'Active Users' },
        xaxis3: { domain: [0.52, 1], anchor: 'y3', title: 'Session Length' },
        yaxis3: { domain: [0, 0.48], anchor: 'x3', title: 'Percentage (%)' },
        height: 500
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else if (title.includes('Server Performance')) {
      // Server performance dashboard
      const data = [
        {
          type: 'indicator',
          mode: 'gauge+number',
          value: 99.8,
          domain: { x: [0, 0.33], y: [0.5, 1] },
          title: { text: 'Uptime (%)' },
          gauge: {
            axis: { range: [95, 100] },
            bar: { color: '#10B981' },
            steps: [
              { range: [95, 98], color: '#FEE2E2' },
              { range: [98, 99.5], color: '#FEF3C7' },
              { range: [99.5, 100], color: '#D1FAE5' }
            ]
          }
        },
        {
          type: 'indicator',
          mode: 'number+delta',
          value: 120,
          domain: { x: [0.34, 0.66], y: [0.5, 1] },
          title: { text: 'Avg Response Time (ms)' },
          delta: { reference: 150, decreasing: { color: '#10B981' } },
          number: { suffix: 'ms', font: { size: 32 } }
        },
        {
          type: 'indicator',
          mode: 'number',
          value: 24,
          domain: { x: [0.67, 1], y: [0.5, 1] },
          title: { text: 'Active Servers' },
          number: { font: { size: 40, color: '#3B82F6' } }
        },
        {
          x: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          y: Array.from({ length: 24 }, () => Math.random() * 50 + 100),
          type: 'scatter',
          mode: 'lines',
          name: 'Response Time',
          line: { color: '#EF4444', width: 2 },
          fill: 'tonexty',
          fillcolor: 'rgba(239, 68, 68, 0.1)',
          xaxis: 'x2',
          yaxis: 'y2'
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'Server Performance Dashboard', x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis2: { domain: [0, 1], anchor: 'y2', title: 'Hour of Day' },
        yaxis2: { domain: [0, 0.45], anchor: 'x2', title: 'Response Time (ms)' },
        height: 500
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else {
      // Generic dashboard
      generateGenericDashboard(commonLayout);
    }
  };

  const generateChart = (commonLayout: Record<string, unknown>) => {
    if (title.includes('Revenue')) {
      // Revenue trends line chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = [
        {
          x: months,
          y: [1.8, 2.1, 2.3, 2.0, 2.4, 2.6, 2.8, 2.5, 2.7, 2.9, 3.1, 2.4],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Revenue ($M)',
          line: { color: '#10B981', width: 4 },
          marker: { size: 10, color: '#10B981' }
        },
        {
          x: months,
          y: [1.6, 1.9, 2.0, 1.8, 2.2, 2.3, 2.5, 2.2, 2.4, 2.6, 2.8, 2.1],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Target ($M)',
          line: { color: '#6B7280', width: 2, dash: 'dash' },
          marker: { size: 6, color: '#6B7280' }
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'Monthly Revenue Trends', x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis: { title: 'Month' },
        yaxis: { title: 'Revenue (Millions USD)' },
        height: 400
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else {
      // Generic chart
      const data = [
        {
          x: ['Q1', 'Q2', 'Q3', 'Q4'],
          y: [20, 35, 30, 45],
          type: 'bar',
          marker: {
            color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            line: { color: 'rgba(0,0,0,0.2)', width: 1 }
          }
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: title, x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis: { title: 'Quarter' },
        yaxis: { title: 'Value' },
        height: 400
      };

      setPlotData(data);
      setPlotLayout(layout);
    }
  };

  const generateReport = (commonLayout: Record<string, unknown>) => {
    if (title.includes('Quality')) {
      // Quality metrics report with multiple visualizations
      const data = [
        {
          labels: ['Critical', 'High', 'Medium', 'Low'],
          values: [3, 8, 12, 15],
          type: 'pie',
          domain: { x: [0, 0.48], y: [0.52, 1] },
          marker: {
            colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981']
          },
          textinfo: 'label+percent',
          textposition: 'outside'
        },
        {
          x: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          y: [0.15, 0.12, 0.08, 0.10],
          type: 'bar',
          name: 'Crash Rate (%)',
          marker: { color: '#EF4444' },
          xaxis: 'x2',
          yaxis: 'y2'
        },
        {
          x: ['Unit Tests', 'Integration', 'E2E', 'Manual'],
          y: [95, 88, 92, 85],
          type: 'bar',
          name: 'Test Coverage (%)',
          marker: { color: '#10B981' },
          xaxis: 'x3',
          yaxis: 'y3'
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'Quality Metrics Report', x: 0.5, font: { size: 18, color: '#1F2937' } },
        annotations: [
          { text: 'Bug Distribution', x: 0.24, y: 1.05, xref: 'paper', yref: 'paper', showarrow: false, font: { size: 14 } },
          { text: 'Weekly Crash Rate', x: 0.24, y: 0.45, xref: 'paper', yref: 'paper', showarrow: false, font: { size: 14 } },
          { text: 'Test Coverage', x: 0.76, y: 0.45, xref: 'paper', yref: 'paper', showarrow: false, font: { size: 14 } }
        ],
        xaxis2: { domain: [0, 0.48], anchor: 'y2' },
        yaxis2: { domain: [0, 0.45], anchor: 'x2', title: 'Crash Rate (%)' },
        xaxis3: { domain: [0.52, 1], anchor: 'y3' },
        yaxis3: { domain: [0, 0.45], anchor: 'x3', title: 'Coverage (%)' },
        height: 500
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else {
      // Generic report
      const data = [
        {
          x: ['Category A', 'Category B', 'Category C', 'Category D'],
          y: [65, 78, 82, 91],
          type: 'bar',
          marker: { color: '#3B82F6' }
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: title, x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis: { title: 'Categories' },
        yaxis: { title: 'Performance Score' },
        height: 400
      };

      setPlotData(data);
      setPlotLayout(layout);
    }
  };

  const generateAnalysis = (commonLayout: Record<string, unknown>) => {
    if (title.includes('User Acquisition')) {
      // Funnel analysis
      const data = [
        {
          type: 'funnel',
          y: ['Awareness', 'Interest', 'Consideration', 'Trial', 'Purchase', 'Active User'],
          x: [100000, 45000, 25000, 12000, 8500, 6800],
          textinfo: 'value+percent initial',
          marker: {
            color: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554', '#0F172A']
          },
          connector: {
            line: { color: '#6B7280', width: 2 }
          }
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'User Acquisition Funnel Analysis', x: 0.5, font: { size: 18, color: '#1F2937' } },
        height: 500
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else if (title.includes('Financial')) {
      // Financial analysis with multiple metrics
      const data = [
        {
          x: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
          y: [6.8, 7.1, 7.5, 7.2, 7.8],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Revenue ($M)',
          line: { color: '#10B981', width: 3 },
          marker: { size: 8 },
          yaxis: 'y'
        },
        {
          x: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
          y: [15, 17, 18, 16, 19],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Profit Margin (%)',
          line: { color: '#3B82F6', width: 3 },
          marker: { size: 8 },
          yaxis: 'y2'
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: 'Financial Performance Analysis', x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis: { title: 'Quarter' },
        yaxis: { title: 'Revenue ($M)', side: 'left', color: '#10B981' },
        yaxis2: { title: 'Profit Margin (%)', side: 'right', overlaying: 'y', color: '#3B82F6' },
        height: 400
      };

      setPlotData(data);
      setPlotLayout(layout);
    } else {
      // Generic analysis - scatter plot
      const data = [
        {
          x: Array.from({ length: 50 }, () => Math.random() * 100),
          y: Array.from({ length: 50 }, () => Math.random() * 100),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: 12,
            color: Array.from({ length: 50 }, () => Math.random() * 100),
            colorscale: 'Viridis',
            showscale: true
          }
        }
      ];

      const layout = {
        ...commonLayout,
        title: { text: title, x: 0.5, font: { size: 18, color: '#1F2937' } },
        xaxis: { title: 'Variable X' },
        yaxis: { title: 'Variable Y' },
        height: 400
      };

      setPlotData(data);
      setPlotLayout(layout);
    }
  };

  const generateGenericDashboard = (commonLayout: Record<string, unknown>) => {
    const data = [
      {
        type: 'indicator',
        mode: 'gauge+number',
        value: 85,
        domain: { x: [0, 0.5], y: [0.5, 1] },
        title: { text: 'Performance Score' },
        gauge: {
          axis: { range: [null, 100] },
          bar: { color: '#3B82F6' },
          steps: [
            { range: [0, 50], color: '#FEE2E2' },
            { range: [50, 80], color: '#FEF3C7' },
            { range: [80, 100], color: '#D1FAE5' }
          ]
        }
      },
      {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        y: [20, 35, 30, 45, 40, 50],
        type: 'bar',
        marker: { color: '#10B981' },
        xaxis: 'x2',
        yaxis: 'y2'
      }
    ];

    const layout = {
      ...commonLayout,
      title: { text: 'Dashboard Overview', x: 0.5, font: { size: 18, color: '#1F2937' } },
      xaxis2: { domain: [0.5, 1], anchor: 'y2', title: 'Month' },
      yaxis2: { domain: [0.5, 1], anchor: 'x2', title: 'Value' },
      height: 500
    };

    setPlotData(data);
    setPlotLayout(layout);
  };

  if (!plotData || !plotLayout) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Generating visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Plot
        data={plotData}
        layout={plotLayout}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
          responsive: true
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
}
