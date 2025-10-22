import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Không tìm thấy trang"
        description="Không tìm thấy trang"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h3 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            Not found
          </h3>

          <img src="/images/404.svg" alt="404" className="dark:hidden" />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            Trang bạn tìm kiếm không tồn tại hoặc không còn khả dụng.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </>
  );
}
