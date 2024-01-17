import { useEffect, useState } from "react";
// asset
import logo from "@/common/assets/logo.png";
import logoWithDesc from "@/common/assets/logo-with-desc.png";
// libraries
import classNames from "classnames";
import {
  faArrowRight,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

// navbar
const Navigation = () => {
  // state untuk mengatur navbar responsif pada layar hp
  const [onMobile, setOnMobile] = useState(false);

  return (
    <>
      <DesktopNavigation setOnMobile={setOnMobile} />
      <MobileNavigation onMobile={onMobile} setOnMobile={setOnMobile} />
    </>
  );
};

// nav menu
const navMenu = [
  { path: "#", text: "About" },
  { path: "#", text: "Feature" },
  { path: "#", text: "Pricing" },
];

// navbar pada desktop
const DesktopNavigation = ({ setOnMobile }) => {
  useEffect(() => {
    // fungsi untuk navbar responsif sesuai ukuran layar
    const onResizeEvent = () => window.innerWidth > 640 && setOnMobile(false);
    window.addEventListener("resize", onResizeEvent);

    return () => {
      window.removeEventListener("resize", onResizeEvent);
    };
  });

  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-sm shadow-neutral-700/10">
      {/* container navbar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 transition-all duration-200">
        {/* brand logo navbar */}
        <Link to="/" reloadDocument>
          <img
            src={logo}
            alt="logo Nav"
            className="origin-left scale-75 md:scale-105"
          />
        </Link>
        {/* navbar menu on wide screen, hidden saat layar kecil */}
        <nav className="hidden items-center gap-x-6 sm:flex md:gap-x-10">
          <div className="space-x-8 lg:text-lg">
            {navMenu.map((menu) => (
              <Link
                to={menu.path}
                className="text-neutral-600 transition duration-150 hover:text-neutral-700 focus:text-neutral-700"
              >
                {menu.text}
              </Link>
            ))}
          </div>
          {/* tombol login */}
          <Link
            className="flex items-center gap-1 rounded bg-blue-500 px-6 py-2 font-medium uppercase text-white hover:bg-blue-600"
            to="/auth/login"
          >
            Log in <Icon icon={faArrowRight} size="sm" />
          </Link>
        </nav>
        {/* hamburger icon show on smaller screen */}
        <Icon
          className="block sm:hidden"
          icon={faBars}
          size="lg"
          fixedWidth
          onClick={() => setOnMobile(true)}
        />
      </div>
    </header>
  );
};

// navbar layar hp
const MobileNavigation = ({ onMobile, setOnMobile }) => {
  return (
    <header
      className={classNames(
        {
          "w-full scale-100 ease-in": onMobile,
          "w-0 scale-95 opacity-0 ease-out": !onMobile,
        },
        "fixed top-0 z-20 h-full bg-white px-5 transition-all duration-500",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b-2">
        {/* mobile nav logo */}
        <Link to="/" reloadDocument>
          <img
            src={logoWithDesc}
            alt="logo Nav Mobile"
            className="origin-left scale-75"
          />
        </Link>
        {/* cancel nav menu icon */}
        <Icon
          icon={faXmark}
          size="lg"
          fixedWidth
          onClick={() => setOnMobile(false)}
        />
      </div>
      {/* mobile nav menu */}
      <nav className="mb-12 mt-6 flex flex-col">
        {navMenu.map((menu) => (
          <Link to={menu.path} className="border-b-2 border-slate-100 py-4">
            {menu.text}
          </Link>
        ))}
      </nav>
      <div className="mx-auto flex max-w-xs flex-col gap-1.5">
        <Link
          className="w-full rounded border-2 border-blue-600 px-2 py-2 text-center text-sm font-medium text-blue-600"
          to="/auth/login"
        >
          Login
        </Link>
        <div className="flex w-full items-center justify-between">
          <span className="w-1/5 border-b" />
          <p>or</p>
          <span className="w-1/5 border-b" />
        </div>
        <Link
          className="w-full max-w-xs rounded border-2 bg-blue-700 px-2 py-2 text-center text-sm font-medium text-white"
          to="/auth/signup"
        >
          signup
        </Link>
      </div>
    </header>
  );
};

export default Navigation;
