export enum EditMode {
  View = 0,
  Add = 1,
  Edit = 2,
}

export enum BorrowEditMode {
  Create = 0,
  Edit = 1,
  Reborrow = 2,
}

export enum RoleEnum {
  Admin = 1,
  Manager = 2,
  User = 3,
}

export enum EquipmentStatusEnum {
  Available = 1, // Còn sử dụng
  Borrowed = 2, // Đang mượn
  Maintenance = 3, // Đang bảo dưỡng
  Lost = 4, // Đã mất
  BrokenPart = 5, // Hỏng một phần
  Broken = 6, // Đã hỏng
}

export enum BorrowEquipmentStatusEnum {
  Pending = 0, // Chờ duyệt
  Borrowed = 1, // Đã duyệt mượn
  Rejected = 2, // Đã từ chối mượn
  Returned = 3, // Đã trả
}

export enum ProcessingFormEnum {
  Repair = 1,
  BuyNew = 2,
  Compensation = 3,
}

export enum EquipmentHistoryAction {
  Created = 1, // Tạo mới
  Updated = 2, // Cập nhật thông tin
  BorrowRequested = 3, // Yêu cầu mượn thiết bị
  BorrowApproved = 4, // Duyệt Yêu cầu mượn thiết bị
  BorrowRejected = 5, // Từ chối Yêu cầu mượn thiết bị
  Returned = 6, // Trả thiết bị
}

export enum ChartPeriodType {
  Week = 1,
  Month = 2,
  Quarter = 3,
}

export default {
  EditMode,
  BorrowEditMode,
  RoleEnum,
  EquipmentStatusEnum,
  BorrowEquipmentStatusEnum,
  ProcessingFormEnum,
  EquipmentHistoryAction,
  ChartPeriodType,
};

export const PAGINATION_CONFIG = {
  // Item per page
  PAGE_SIZE: 10,
} as const;
