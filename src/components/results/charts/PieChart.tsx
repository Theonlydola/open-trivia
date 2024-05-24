import React from "react";
import ApexCharts from "apexcharts";

interface ChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: ChartData[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const chartOptions = {
    series: data.map((item) => item.value),
    labels: data.map((item) => item.name),
    chart: {
      width: "100%", // Adjust width as needed
      type: "pie",
    },
    title: {
      text: title, // Optional title from props
      align: "center",
    },
    legend: {
      position: "bottom", // Adjust legend position as needed
    },
    responsive: [
      {
        breakpoint: 480, // Adjust breakpoint as needed
        options: {
          chart: {
            width: "100%", // Adjust width for smaller screens
          },
          legend: {
            position: "bottom", // Adjust legend position for smaller screens
          },
        },
      },
    ],
  };

  React.useEffect(() => {
    const chart = new ApexCharts(
      document.querySelector("#pie-chart"),
      chartOptions
    );
    chart.render();

    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <div id="pie-chart" />;
};

PieChart;
