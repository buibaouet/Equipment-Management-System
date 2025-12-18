import UserEquipmentTable from "./UserEquipmentTable";
import BorrowStatisticsChart from "./BorrowStatisticsChart";
import EquipmentByStatusChart from "./EquipmentByStatusChart";
import OverviewInfomation from "./OverviewInfomation";
import EquipmentByCategoryChart from "./EquipmentByCategoryChart";
import LoanRequestReportTable from "./LoanRequestReportTable";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-4">
        <OverviewInfomation />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <BorrowStatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <EquipmentByStatusChart />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <EquipmentByCategoryChart />
      </div>

      <div className="col-span-12">
        <UserEquipmentTable />
      </div>

      <div className="col-span-12">
        <LoanRequestReportTable />
      </div>
    </div>
  );
}
