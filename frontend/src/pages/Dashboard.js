// import local library
import { useEffect, useState } from "react";
// use context hook
import useAuthContext from "../hooks/useAuthContext";
import useLogout from "../hooks/useLogout";
// third Library
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faChartBar,
  faFileAlt,
  faSignOutAlt,
  faPlus,
  faBookAtlas,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [modalPlayQuiz, setModalPlayQuiz] = useState(false);

  // welcome message
  useEffect(() => {
    if (user) {
      toast(`Welcome, ${user.username}!`);
    }
  }, [user]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex bg-gray-100 font-family-karla">
        {/* sidebar, hidden at mobile screen */}
        <Sidebar setModalPlayQuiz={setModalPlayQuiz} />
        {/* main */}
        <div className="w-full flex flex-col h-screen">
          {/* top navbar, hidden at mobile screen */}
          <TopNav user={user} />
          {/* mobile nav, hidden at bigger screen */}
          <MobileNav setModalPlayQuiz={setModalPlayQuiz} />
          {/* main content */}
          <Main />
        </div>
      </div>
      {/* modal */}
      {modalPlayQuiz && <ModalPlayQuiz setModal={setModalPlayQuiz} />}
    </>
  );
};

const Sidebar = ({ setModalPlayQuiz }) => {
  return (
    <aside className="hidden sm:block h-screen w-64 bg-blue-600 shadow-xl">
      {/* sidebar header */}
      <div className="p-6">
        <button
          onClick={() => setModalPlayQuiz(true)}
          className="w-full flex justify-center items-center gap-2 mt-5 py-2 text-lg font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300">
          <span>Play Quiz</span>
          <Icon icon={faCirclePlay} />
        </button>
      </div>
      {/* nav menu */}
      <nav className="mt-3 text-white text-base font-semibold">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Dashboard
          <Icon icon={faChartBar} />
        </NavLink>
        <NavLink
          to="/dashboard/library"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Library
          <Icon icon={faBookAtlas} />
        </NavLink>
        <NavLink
          to="/dashboard/report"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-4 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Report
          <Icon icon={faFileAlt} />
        </NavLink>
      </nav>
    </aside>
  );
};

export const TopNav = ({ user }) => {
  const { logout } = useLogout();

  return (
    <header className="hidden sm:flex justify-end w-full px-6 py-2 bg-white shadow-md">
      {user && (
        <div>
          <span className="mr-3 font-medium">{user.username}</span>
          <button
            className="inline-flex items-center gap-2 p-3 rounded text-white bg-blue-600 hover:bg-blue-500"
            onClick={logout}>
            <span className="text-sm font-medium">Logout</span>
            <Icon icon={faSignOutAlt} />
          </button>
        </div>
      )}
    </header>
  );
};

export const MobileNav = ({ setModalPlayQuiz }) => {
  return (
    <header className="sm:hidden w-full px-6 py-5 bg-blue-600">
      <nav>
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Dashboard
          <Icon icon={faChartBar} />
        </NavLink>
        <NavLink
          to="/dashboard/library"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Library
          <Icon icon={faBookAtlas} />
        </NavLink>
        <NavLink
          to="/dashboard/report"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
              : "flex items-center gap-2 py-2 pl-6 text-white opacity-75 hover:opacity-100 hover:bg-blue-500"
          }>
          Report
          <Icon icon={faFileAlt} />
        </NavLink>
      </nav>
      <button
        onClick={() => setModalPlayQuiz(true)}
        className="w-full flex justify-center items-center gap-2 mt-5 py-2 text-lg font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-300">
        Play Quiz
      </button>
    </header>
  );
};

export const Main = () => {
  const [modalCreateQuiz, setModalCreateQuiz] = useState(false);
  const location = useLocation();

  return (
    <main className="w-full p-8">
      {location.pathname === "/dashboard" ? (
        <>
          <h1 className="mb-6 text-xl sm:text-3xl text-black text-center sm:text-left">
            Quick Action
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg text-gray-800 cursor-pointer"
              onClick={() => setModalCreateQuiz(true)}>
              <Icon icon={faPlus} size="2xl" />
              <h2 className="text-lg font-medium">Create Quiz</h2>
              <p className="text-sm text-center">Mari buat kuis sekarang</p>
            </div>

            <Link
              to="/dashboard/library"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg text-gray-800 cursor-pointer">
              <Icon icon={faFileAlt} size="2xl" />
              <h2 className="text-lg font-medium">Library</h2>
              <p className="text-sm text-center">Pengelolaan kuis</p>
            </Link>

            <Link
              to="/dashboard/report"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg text-gray-800 cursor-pointer">
              <Icon icon={faBookAtlas} size="2xl" />
              <h2 className="text-lg font-medium">View Reports</h2>
              <p className="text-sm text-center">
                lihat report kuis yang sudah kamu bagikan
              </p>
            </Link>
          </div>
        </>
      ) : (
        <Outlet />
      )}
      {modalCreateQuiz && <ModalCreateQuiz setModal={setModalCreateQuiz} />}
    </main>
  );
};

export const ModalCreateQuiz = ({ setModal }) => {
  return (
    <>
      <div className="fixed flex justify-center items-center inset-0 z-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg">
          {/* Body */}
          <div className="p-8">
            <div className="flex flex-col rounded-md border border-gray-400 shadow-sm">
              <Link
                to="/create/regular-quiz"
                className="px-12 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-b">
                Regular Quiz
              </Link>
              <Link
                to="/create/sectioned-quiz"
                className="px-12 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Section Quiz
              </Link>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-4 border-t border-gray-300">
            <button
              className="px-6 py-2 text-sm text-red-500 font-bold uppercase hover:text-red-600"
              type="button"
              onClick={() => setModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export const ModalPlayQuiz = ({ setModal }) => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const onPlayQuiz = () => {
    navigate(`/play/${token}/preview/`);
  };

  return (
    <>
      <div className="fixed flex justify-center items-center inset-0 z-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg">
          {/* Body */}
          <form onSubmit={onPlayQuiz} className="p-6">
            {/* input token */}
            <input
              required
              placeholder="Quiz Token"
              className="w-full mb-4 px-4 py-2 border border-gray-500 rounded-md"
              onChange={(e) => setToken(e.target.value)}
            />
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-300">
              <button
                className="px-6 py-2 text-sm text-blue-500 font-bold uppercase"
                type="button"
                onClick={onPlayQuiz}>
                Play
              </button>
              <button
                className="px-6 py-2 text-sm text-red-500 font-bold uppercase"
                type="button"
                onClick={() => setModal(false)}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Dashboard;
