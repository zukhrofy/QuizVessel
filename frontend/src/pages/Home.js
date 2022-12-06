import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export const Navigation = () => {
  const [onMobile, setOnMobile] = useState(false);

  return (
    <>
      <DesktopNav setOnMobile={setOnMobile} />
      <MobileNav onMobile={onMobile} setOnMobile={setOnMobile} />
    </>
  );
};

const DesktopNav = ({ setOnMobile }) => {
  useEffect(() => {
    const onResizeEvent = () => window.innerWidth > 640 && setOnMobile(false);
    window.addEventListener("resize", onResizeEvent);

    return () => {
      window.removeEventListener("resize", onResizeEvent);
    };
  });

  return (
    <div className="fixed top-0 z-10 flex justify-between items-center w-full h-16 md:h-20 px-4 sm:px-8 md:px-12 lg:px-24 transition-all duration-200 bg-white shadow-md">
      <Link to="/" reloadDocument>
        <img
          src="/image/logo/logo.png"
          alt="logo Nav"
          className="scale-75 md:scale-105 origin-left"
        />
      </Link>
      <div className="hidden sm:flex items-center gap-x-6 md:gap-x-10">
        <div className="space-x-6 md:space-x-10 text-base lg:text-lg font-medium capitalize text-[#474554]">
          <Link to="#" className="hover:text-[#474554]/75">
            About
          </Link>
          <Link to="#" className="hover:text-[#474554]/75">
            Feature
          </Link>
          <Link to="#" className="hover:text-[#474554]/75">
            Pricing
          </Link>
        </div>
        <Link
          className="block px-6 py-1 md:py-2 text-base lg:text-lg font-medium capitalize text-white rounded-md bg-[#E70021] hover:bg-[#E70021]/75"
          to="/">
          Login
        </Link>
      </div>
      <Icon
        className="block sm:hidden"
        icon={faBars}
        size="2x"
        fixedWidth
        onClick={() => setOnMobile(true)}
      />
    </div>
  );
};

const MobileNav = ({ onMobile, setOnMobile }) => {
  return (
    <div
      className={`fixed top-0 z-20 h-full px-4 bg-white transition-all duration-500 ${
        onMobile ? "w-full" : "w-0 opacity-0"
      }`}>
      <div className="flex justify-between items-center h-16 border-b-2">
        <Link to="/" reloadDocument>
          <img
            src="/image/logo/logo.png"
            alt="logo Nav Mobile"
            className="scale-75 origin-left"
          />
        </Link>
        <Icon
          icon={faXmark}
          size="2x"
          fixedWidth
          onClick={() => setOnMobile(false)}
        />
      </div>
      <div className="flex flex-col mt-7 mb-14 px-2">
        <Link to="#" className="py-4 border-b">
          About
        </Link>
        <Link to="#" className="py-4 border-b">
          Feature
        </Link>
        <Link to="#" className="py-4 border-b">
          Pricing
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <Link
          className="w-3/4 py-2 text-center font-medium capitalize text-[#1554FF] border border-[#1554FF] rounded-sm"
          to="/">
          Login
        </Link>
        <p>or</p>
        <Link
          className="w-3/4 py-2 text-center font-medium capitalize text-white bg-[#1554FF] rounded-sm"
          to="/">
          Register
        </Link>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row mt-20 py-12 px-7 md:px-12 lg:px-24 gap-8">
      <div className="md:basis-1/2 flex flex-col md:justify-center items-start gap-2 sm:gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium">
          Assessment easier with <strong>Quiz Vessel</strong>.
        </h1>
        <p className="text-xs sm:text-base">
          provides various types of quiz models and quiz time models
        </p>
        <Link
          to="/"
          className="py-3 lg:py-4 px-4 lg:px-12 text-white font-medium sm:font-semibold rounded-lg bg-orange-500 hover:shadow-orange-md mx-auto">
          Get Started
        </Link>
      </div>
      <div className="h-48 md:h-80 md:basis-1/2">
        <img
          src="/image/landingPage/heroImage.png"
          alt=""
          className="mx-auto h-full w-full max-w-sm sm:max-w-3xl"
        />
      </div>
    </div>
  );
};

const Benefit = () => {
  return (
    <div className="h-96 flex flex-wrap justify-center px-10 bg-lime-200 gap-x-8 gap-y-4 [&>*]:grow [&>*]:max-w-[450px] [&>*]:min-w-[350px]">
      <div className=" bg-red-50">a</div>
      <div className=" bg-red-100">b</div>
      <div className=" bg-red-200">c</div>
      <div className=" bg-red-300">d</div>
      <div className=" bg-red-300">d</div>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <Benefit />
    </>
  );
};

export default Home;
