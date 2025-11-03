export enum RoleEnum {
  Admin = 1,
  Manager = 2,
  User = 3,
}

export default RoleEnum;

export const PAGINATION_CONFIG = {
    // Item per page
    PAGE_SIZE: 10,
} as const;
