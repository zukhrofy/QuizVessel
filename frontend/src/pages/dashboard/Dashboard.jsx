import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { toast } from "react-toastify";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faArrowRightFromBracket,
  faBars,
  faBookAtlas,
  faChartBar,
  faFileAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from "@headlessui/react";

import useAuthContext from "@/hooks/auth/useAuthContext";
import useLogout from "@/hooks/auth/useLogout";
import ModalPlayQuiz from "./components/ModalPlayQuiz";

const Dashboard = ({ children }) => {
  const { user } = useAuthContext();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // welcome message
  useEffect(() => {
    if (user) {
      toast.success(`Welcome, ${user.username}!`, {
        toastId: "welcome-toast",
      });
    }
  }, [user]);

  return (
    <>
      <div className="flex bg-gray-100">
        <Sidebar
          mobileSidebar={mobileSidebar}
          setMobileSidebar={setMobileSidebar}
        />
        {/* main */}
        <div className="h-screen flex-1 flex-col overflow-y-auto">
          <TopNav setMobileSidebar={setMobileSidebar} />
          <main className="w-full p-8">{children}</main>
        </div>
      </div>
    </>
  );
};

const Sidebar = ({ mobileSidebar, setMobileSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [maximizeSidebar, setMaximizeSidebar] = useState(true);
  const { logout } = useLogout();

  // fungsi untuk navbar memastikan isMobile true saat layar kecil
  useEffect(() => {
    const onResizeEvent = () => {
      if (window.innerWidth <= 1024) {
        setIsMobile(true);
        setMaximizeSidebar(true);
      } else {
        setIsMobile(false);
      }
    };
    onResizeEvent();
    window.addEventListener("resize", onResizeEvent);
    return () => window.removeEventListener("resize", onResizeEvent);
  });

  // menu list
  const menuGroups = [
    {
      title: "Main",
      items: [
        { path: "/dashboard", icon: faChartBar, text: "Dashboard", end: true },
        { path: "/quiz/", icon: faBookAtlas, text: "Library" },
        { path: "/report", icon: faFileAlt, text: "Report" },
      ],
    },
  ];

  // condition class for mobile or desktop sidebar
  const commonClass =
    "h-screen whitespace-nowrap bg-blue-800 transition-all duration-300 flex flex-col";
  const mobileClass = `${commonClass} fixed z-20 w-72 p-7`;
  const desktopClass = `${commonClass} relative`;

  return (
    <>
      <aside
        className={classNames(
          { [mobileClass]: isMobile, [desktopClass]: !isMobile },
          isMobile
            ? mobileSidebar
              ? "ml-0"
              : "-ml-96"
            : maximizeSidebar
              ? "w-72 p-6"
              : "w-20 px-4 py-6",
        )}
      >
        {/* sidebar toggle button */}
        <button
          className="absolute -right-4 top-8 cursor-pointer rounded-full border-2 border-blue-800 bg-white p-1"
          onClick={() => {
            isMobile
              ? setMobileSidebar(false)
              : setMaximizeSidebar(!maximizeSidebar);
          }}
        >
          <Icon
            icon={faAngleLeft}
            size="lg"
            className={`${
              isMobile
                ? !mobileSidebar && "rotate-180"
                : !maximizeSidebar && "rotate-180"
            } transition-all duration-300`}
            fixedWidth
          />
        </button>
        {/* sidebar title */}
        <h1
          className={`${
            !maximizeSidebar && "text-center"
          } text-3xl tracking-tighter text-white`}
        >
          {maximizeSidebar ? "Quiz Vessel" : "QV"}
        </h1>
        {/* play quiz button */}
        <ModalPlayQuiz maximizeSidebar={maximizeSidebar} />
        {/* nav menu */}
        <nav className="no-scrollbar grow space-y-4 overflow-y-auto font-semibold text-white">
          {menuGroups.map((group, groupIndex) => (
            <div key={`sidebarGroup-${groupIndex}`} className="space-y-2">
              {/* group title */}
              {group.title && (
                <p className="text-xs uppercase text-white/60">{group.title}</p>
              )}
              {/* group menu */}
              {group.items.map((item, itemIndex) => (
                <SidebarMenu
                  key={`sidebarGroupItem-${itemIndex}`}
                  path={item.path}
                  icon={item.icon}
                  maximizeSidebar={maximizeSidebar}
                >
                  {item.text}
                </SidebarMenu>
              ))}
              {/* group divider */}
              {groupIndex < menuGroups.length - 1 && (
                <hr className="border-white" />
              )}
            </div>
          ))}
          {/* logout button */}
          <button
            onClick={logout}
            className={`flex w-full items-center justify-center gap-3 rounded bg-white px-6 py-2 text-blue-800 hover:bg-slate-300`}
          >
            <Icon icon={faSignOutAlt} />
            {maximizeSidebar && "logout"}
          </button>
        </nav>
      </aside>
      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebar && (
        <div
          className="fixed inset-0 z-10 bg-black/25"
          onClick={() => setMobileSidebar(false)}
        />
      )}
    </>
  );
};

const SidebarMenu = ({
  path,
  end = false,
  icon,
  children,
  maximizeSidebar,
}) => {
  const navMenuClass = `flex items-center gap-3 p-2 text-white hover:bg-blue-400 transition-all duration-200 ${
    !maximizeSidebar && "justify-center"
  }`;

  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        isActive ? `bg-blue-600 ${navMenuClass}` : `${navMenuClass}`
      }
    >
      <Icon icon={icon} />
      {maximizeSidebar && children}
    </NavLink>
  );
};

const TopNav = ({ setMobileSidebar }) => {
  const { user } = useAuthContext();

  return (
    <header className="flex justify-between bg-white px-8 py-2 shadow lg:justify-end">
      {/* show on mobile screen */}
      <button
        onClick={() => setMobileSidebar((prev) => !prev)}
        className="lg:hidden"
      >
        <Icon icon={faBars} size="lg" fixedWidth />
      </button>
      <div>
        {user && (
          <div className="mr-3 flex items-center gap-3 font-medium">
            {user.username}
            <AvatarProfile />
          </div>
        )}
      </div>
    </header>
  );
};

const AvatarProfile = () => {
  const { logout } = useLogout();

  return (
    <Menu as={"div"} className="relative ">
      <Menu.Button className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
        <svg
          class="top-0 h-12 w-12 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <div
                onClick={logout}
                className={classNames(
                  {
                    "bg-gray-100 text-gray-900": active,
                    "text-gray-700": !active,
                  },
                  "flex items-center gap-2 px-4 py-2 text-sm",
                )}
              >
                <span>logout</span>
                <Icon icon={faArrowRightFromBracket} />
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dashboard;
