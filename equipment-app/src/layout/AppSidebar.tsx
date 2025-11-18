import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  User2,
  ChartNoAxesColumn,
  RotateCwSquareIcon,
  AlignEndVertical,
  BookMarked,
  Computer,
  ListChecksIcon
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { RoleEnum } from "../utils/enumerations";

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  activePath?: string[];
};

const commonItems: MenuItem[] = [
  {
    icon: <ChartNoAxesColumn />,
    name: "Thống kê",
    path: "/",
  },
  {
    icon: <LayoutDashboard />,
    name: "Danh sách thiết bị",
    path: "/equipment-list",
    activePath: ["/equipment-list", "/equipment-detail"],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  let menuItems: MenuItem[];

  const { currentUser } = useAuth();

  if (!currentUser) menuItems = [];

  if (currentUser?.role === RoleEnum.Admin) {
    menuItems = [
      ...commonItems,
      {
        icon: <ListChecksIcon />,
        name: "Duyệt yêu cầu mượn",
        path: "/borrow-request",
      },
      {
        icon: <BookMarked />,
        name: "Danh mục thiết bị",
        path: "/category",
      },
      {
        icon: <Computer />,
        name: "Danh sách phòng ban",
        path: "/department",
      },
      {
        icon: <User2 />,
        name: "Danh sách người dùng",
        path: "/user",
      },
    ];
  }
  else
    if (currentUser?.role === RoleEnum.Manager) {
      menuItems = [
        ...commonItems,
        {
          icon: <AlignEndVertical />,
          name: "Thiết bị của tôi",
          path: "/my-equipment",
        },
        {
          icon: <RotateCwSquareIcon />,
          name: "Mượn trả thiết bị",
          path: "/borrow-return",
        },
        {
          icon: <ListChecksIcon />,
          name: "Duyệt yêu cầu mượn",
          path: "/borrow-request",
        },
      ];
    }
    else {
      menuItems = [
        ...commonItems,
        {
          icon: <AlignEndVertical />,
          name: "Thiết bị của tôi",
          path: "/my-equipment",
        },
        {
          icon: <RotateCwSquareIcon />,
          name: "Mượn trả thiết bị",
          path: "/borrow-return",
        },
        {
          icon: <ListChecksIcon />,
          name: "Duyệt yêu cầu mượn",
          path: "/borrow-request",
        },
      ];
    }

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (nav: MenuItem) => nav.activePath?.some(path => location.pathname.startsWith(path)) || location.pathname === nav.path,
    [location.pathname]
  );

  const renderMenuItems = (
    items: MenuItem[],
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          {(
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="text-2xl">Quản lý thiết bị</h1>
            </>
          ) : (
            <img
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
              </h2>
              {renderMenuItems(menuItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
