export interface DashboardModel {
    totalEquipment: number;
    totalBorrow: number;
    equipmentByCategory: EquipmentByCategoryModel[];
    equipmentByStatus: EquipmentByStatusModel[];
  }
  
  export interface EquipmentByCategoryModel {
    categoryId: number;
    categoryName: string;
    count: number;
  }
  
  export interface EquipmentByStatusModel {
    status: number;
    statusName: string;
    count: number;
  }
  
  export interface BorrowReturnChartModel {
    period: string;
    borrowCount: number;
  }
  
  export interface UserRankingTopModel {
    userId: number;
    userName: string;
    department: string;
    ownedCount: number;
    borrowedCount: number;
    totalCount: number;
  }
  