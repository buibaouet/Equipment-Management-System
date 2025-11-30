import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useGetDashboardDataQuery } from "../../api/useDashboardApi";
import { EquipmentByStatusModel } from "../../types/Dashboard";

const STATUS_COLORS = ["#22c55e", "#f97316", "#0ea5e9", "#475467", "#a855f7", ];

export default function EquipmentByStatusChart() {
  const { data, isFetching } = useGetDashboardDataQuery();
  const statusData = useMemo(
    () => data?.data?.equipmentByStatus ?? [],
    [data?.data?.equipmentByStatus]
  );

  const totalEquipment = useMemo(
    () =>
      statusData.reduce(
        (total: number, item: EquipmentByStatusModel) => total + item.count,
        0
      ),
    [statusData]
  );

  const series = useMemo(
    () => statusData.map((item) => item.count),
    [statusData]
  );

  const options: ApexOptions = useMemo(
    () => ({
      colors: STATUS_COLORS,
      labels: statusData.map((item) => item.statusName),
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "donut",
        width: 280,
        height: 280,
      },
      stroke: {
        show: false,
        width: 4,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 0,
                color: "#1D2939",
                fontSize: "12px",
                fontWeight: "normal",
              },
              value: {
                show: true,
                offsetY: 10,
                color: "#667085",
                fontSize: "14px",
                formatter: (val) => (val ? `${val}` : "0"),
              },
              total: {
                show: true,
                label: "Tổng",
                color: "#000000",
                fontSize: "20px",
                fontWeight: "bold",
                formatter: () => `${totalEquipment}`,
              },
            },
          },
        },
      },
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "darken",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value: number, opts) => {
            const label = opts.w.globals.labels[opts.seriesIndex];
            const percentage =
              totalEquipment > 0
                ? ((value / totalEquipment) * 100).toFixed(1)
                : "0";
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              width: 280,
              height: 280,
            },
          },
        },
        {
          breakpoint: 2600,
          options: {
            chart: {
              width: 240,
              height: 240,
            },
          },
        },
      ],
    }),
    [statusData, totalEquipment]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Thống kê theo trạng thái
        </h3>
      </div>
      <div className="flex flex-col items-center gap-8 xl:flex-row">
        <div id="chartDarkStyle">
          <Chart
            options={options}
            series={series}
            type="donut"
            height={280}
          />
          {!isFetching && series.length === 0 && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Không có dữ liệu về trạng thái.
            </p>
          )}
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row xl:flex-col w-full h-80 overflow-y-auto pr-1">
          {statusData.map((item, index) => {
            const percentage =
              totalEquipment > 0
                ? ((item.count / totalEquipment) * 100).toFixed(1)
                : "0";
            const color = STATUS_COLORS[index % STATUS_COLORS.length];

            return (
              <div className="flex items-start gap-2.5" key={item.status}>
                <div
                  className="mt-1.5 h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <div>
                  <h5 className="mb-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {item.statusName}
                  </h5>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                      {percentage}%
                    </p>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.count} Thiết bị
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {!isFetching && statusData.length === 0 && (
            <p className="text-sm text-gray-500">Không có dữ liệu hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
}
