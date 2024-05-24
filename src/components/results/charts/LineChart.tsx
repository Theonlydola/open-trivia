import React from "react";
import ApexCharts from "apexcharts";

type IChartData = {
  name: string;
  data: number[];
};

type ILineChartProps = {
  data: IChartData[];
  title?: string;
  xaxisLabel?: string;
  yaxisLabel?: string;
};

export function LineChart({
  data,
  title,
  xaxisLabel,
  yaxisLabel,
}: ILineChartProps) {
  const chartOptions = {
    series: data.map((item) => ({
      name: item.name,
      data: item.data,
    })),
    chart: {
      width: "100%",
      type: "line",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: title,
      align: "center",
    },
    xaxis: {
      title: {
        text: xaxisLabel,
        align: "left",
      },
    },
    yaxis: {
      title: {
        text: yaxisLabel,
        align: "left",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          xaxis: {
            labels: {
              rotate: -90,
            },
          },
        },
      },
    ],
  };

  React.useEffect(() => {
    const chart = new ApexCharts(
      document.querySelector("#line-chart"),
      chartOptions
    );
    chart.render();

    return () => chart.destroy();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return <div id="line-chart" />;
}
