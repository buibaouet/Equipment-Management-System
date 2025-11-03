import UserInfoCard from "./UserInfoCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import RoleEnum from "../../utils/enumerations";
import { UserCircleIcon } from "lucide-react";

export default function UserProfiles() {
  const { currentUser } = useAuth();

  return (
    <>
      <PageMeta
        title="Thông tin tài khoản"
        description="Thông tin tài khoản"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Thông tin tài khoản
        </h3>
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <UserCircleIcon className="h-20 w-20" />
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                    {`${currentUser?.userName}`}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Vai trò: {
                        currentUser?.role == RoleEnum.Admin
                          ? 'Quản trị viên'
                          : currentUser?.role == RoleEnum.Manager
                            ? 'Quản lý dự án'
                            : 'Người dùng'
                      }
                    </p>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Dự án: {currentUser && currentUser?.departmentName ? `${currentUser?.departmentName}` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
