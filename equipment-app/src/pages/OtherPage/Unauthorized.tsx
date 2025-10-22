import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import {
  BanIcon
} from "lucide-react";
export default function Unauthorized() {
  return (
    <>
      <PageMeta
        title="Lỗi truy cập"
        description="Lỗi truy cập"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">

        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[562px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            Unauthorized
          </h1>

          <BanIcon className="w-14 h-14 text-red-500 justify-self-center" />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </>
  );
}

