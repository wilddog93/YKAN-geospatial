import { CarbonSoilsStatisticsProp } from "@/api/carbon-stocks.api";
import React, { FC } from "react";
import BarCharts from "../../BarCharts";

interface NMGSoilChartsProps {
  data: CarbonSoilsStatisticsProp[];
}

const NMGSoilCharts: FC<NMGSoilChartsProps> = ({ data }) => {
  // color
  const getColor = (value: string) => {
    let color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;

    switch (value) {
      case "Primary Forest":
        color = "#576CBC";
        break;
      case "PF":
        color = "#576CBC";
        break;
      case "Secondary Forest":
        color = "#E2703A";
        break;
      case "SF":
        color = "#E2703A";
        break;
      case "Oil Palm":
        color = "#4E9F3D";
        break;
      case "OP":
        color = "#4E9F3D";
        break;
      case "Shrubs":
        color = "#A12568";
        break;
      case "S":
        color = "#A12568";
        break;
      default:
        return color;
    }
    return color;
  };

  const groupedData = data.reduce((acc: any, item) => {
    const key = `${item.site}-${item.land_cover}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Extract unique regions and land_covers values
  const regions = Array.from(new Set(data.map((item) => item.region)));
  const sites = Array.from(new Set(data.map((item) => item.site)));
  const landCovers = Array.from(new Set(data.map((item) => item.land_cover)));
  // Prepare datasets for stacked bar chart
  const datasets = landCovers.map((landCover) => ({
    label: landCover.length > 0 ? landCover : ["all"],
    data:
      sites.length > 0
        ? sites.map((site) => {
            const key = `${site}-${landCover}`;
            return (
              groupedData[key]?.reduce(
                (sum: any, item: any) => sum + item.avg_nMgHa,
                0
              ) || 0
            );
          })
        : [],
    backgroundColor: getColor(landCover),
    borderColor: getColor(landCover),
    tension: 0.4,
    borderRadius: 5,
    boxSize: "1rem"
  }));

  const chartData = {
    labels: sites,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          borderRadius: 3,
          boxWidth: 16,
          useBorderRadius: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: false,
        position: "top" as const,
        text: "Chart.js Line Chart",
        align: "start" as const,
      },
      tooltip: {
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function (item: any) {
            return `${item?.dataset?.label} : ${item?.raw?.toFixed(2)} Mg/ha`
          }
        }
      },
    },
    // barThickness: 60,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Mg/ha',
        },
      },
    },
  };

  //   console.log(JSON.stringify(chartData, null, 2), "summary-chart");

  return <BarCharts height="300" data={chartData} options={options} />;
};

export default NMGSoilCharts;
