import { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import ChartTab from "../../components/common/ChartTab";
import { useGetDashboardBorrowQuery } from "../../api/useDashboardApi";
import { ChartPeriodType } from "../../utils/enumerations";

export default function BorrowStatisticsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriodType>(
    ChartPeriodType.Month
  );

  const { data, isFetching } = useGetDashboardBorrowQuery({
    periodType: selectedPeriod,
  });

  const chartData = data?.data ?? [];

  const categories = chartData.map((item) => item.period);
  const seriesData = chartData.map((item) => item.borrowCount);

  const options: ApexOptions = useMemo(
    () => ({
      colors: ["#465fff"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "bar",
        height: 180,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "39%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Outfit",
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          show: true,
        },
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
    }),
    [categories]
  );

  const series = useMemo(
    () => [
      {
        name: "Lượt mượn",
        data: seriesData,
      },
    ],
    [seriesData]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thống kê lượt mượn thiết bị
          </h3>
        </div>
        <ChartTab selected={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartOne" className="-ml-4  min-w-[650px] xl:min-w-full pl-2">
          <Chart
            options={options}
            series={series}
            type="bar"
            height={226}
          />
          {!isFetching && seriesData.length === 0 && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Không có dữ liệu cho giai đoạn này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
