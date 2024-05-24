import React from "react";
import ApexCharts from "apexcharts";

type IChartData = {
  name: string;
  data: number[];
};

type IBarChartProps = {
  data: IChartData[];
  title?: string;
  xaxisLabel?: string;
  yaxisLabel?: string;
};

const Labels = ["Correct", "Wrong", "Skipped"];
export function BarChart({
  data,
  title,
  xaxisLabel,
  yaxisLabel,
}: IBarChartProps) {
  const chartOptions = {
    series: data.map((item, index) => ({
      name: Labels[index],
      data: item.data,
    })),
    chart: {
      width: "100%",
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: title,
      align: "center",
    },
    xaxis: {
      categories: data.map((item) => item.name),
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
      labels: {
        formatter: function (val: number) {
          return Math.round(val);
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
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
      document.querySelector("#bar-chart"),
      chartOptions
    );
    chart.render();

    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <div id="bar-chart" />;
}
