// local library
import { useEffect, useState } from "react";
// third library
import { Link } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <Feature />
      <Footer />
    </>
  );
};

// navbar
export const Navigation = () => {
  // state untuk mengatur navbar responsif pada layar hp
  const [onMobile, setOnMobile] = useState(false);

  return (
    <>
      <DesktopNav setOnMobile={setOnMobile} />
      <MobileNav onMobile={onMobile} setOnMobile={setOnMobile} />
    </>
  );
};

// navbar pada desktop
const DesktopNav = ({ setOnMobile }) => {
  useEffect(() => {
    // fungsi untuk navbar responsif sesuai ukuran layar
    const onResizeEvent = () => window.innerWidth > 640 && setOnMobile(false);
    window.addEventListener("resize", onResizeEvent);

    return () => {
      window.removeEventListener("resize", onResizeEvent);
    };
  });

  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-md">
      {/* container navbar*/}
      <div className="flex justify-between items-center max-w-screen-2xl h-16 md:h-20 mx-5 sm:mx-8 md:mx-12 lg:mx-24 2xl:mx-auto transition-all duration-200">
        {/* brand logo navbar */}
        <Link to="/" reloadDocument>
          <img
            src="/image/logo/logo-with-desc.png"
            alt="logo Nav"
            className="scale-75 md:scale-105 origin-left"
          />
        </Link>
        {/* navbar menu on wide screen, hidden saat layar kecil */}
        <nav className="hidden sm:flex items-center gap-x-6 md:gap-x-10">
          {/* <div className="space-x-6 md:space-x-10 text-base lg:text-lg font-medium capitalize text-[#474554]">
            <Link to="#" className="hover:text-[#474554]/75">
              About
            </Link>
            <Link to="#" className="hover:text-[#474554]/75">
              Feature
            </Link>
            <Link to="#" className="hover:text-[#474554]/75">
              Pricing
            </Link>
          </div> */}
          {/* tombol login */}
          <Link
            className="flex items-center gap-1 px-6 py-1 md:py-2 text-base lg:text-lg font-medium text-white rounded-md bg-[#E70021] hover:bg-[#E70021]/75"
            to="/auth/login">
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
const MobileNav = ({ onMobile, setOnMobile }) => {
  return (
    <header
      className={`fixed top-0 z-20 h-full px-5 bg-white transition-all duration-500 ${
        onMobile ? "w-full" : "w-0 opacity-0"
      }`}>
      {/* above part */}
      <div className="flex justify-between items-center h-16 border-b-2">
        {/* mobile nav logo */}
        <Link to="/" reloadDocument>
          <img
            src="/image/logo/logo-with-desc.png"
            alt="logo Nav Mobile"
            className="scale-75 origin-left"
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
      <nav className="flex flex-col mt-6 mb-12 text-gray-800">
        <Link to="#" className="py-4 border-b">
          About
        </Link>
        <Link to="#" className="py-4 border-b">
          Feature
        </Link>
        <Link to="#" className="py-4 border-b">
          Pricing
        </Link>
      </nav>
      <div className="flex flex-col items-center gap-2">
        <Link
          className="w-3/4 py-2 text-center font-medium text-[#1554FF] border-2 border-[#1554FF] rounded-lg"
          to="/auth/login">
          Login
        </Link>
        <p>or</p>
        <Link
          className="w-3/4 py-2 text-center font-medium text-white border-2 bg-[#1554FF] rounded-lg"
          to="/auth/signup">
          signup
        </Link>
      </div>
    </header>
  );
};

// section hero dibawah navbar
const HeroSection = () => {
  return (
    <section className="mt-16 md:mt-20 bg-teal-50">
      <div className="grid md:grid-cols-2 gap-6 py-8 sm:py-16 mx-5 sm:mx-8 md:mx-12 lg:mx-24 2xl:mx-auto max-w-screen-2xl">
        {/* left side */}
        <div className="md:flex md:flex-col md:justify-center md:items-start text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-medium md:font-semibold lg:font-extrabold">
            Penilaian menjadi mudah dengan{" "}
            <span className="text-[#1554ff]">Quiz Vessel.</span>
          </h1>
          <p className="mt-2 md:mt-4 text-xs sm:text-base lg:text-xl">
            Menyediakan Berbagai Timer Quiz untuk Memudahkan Penilaian
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center mt-4 md:mt-8 py-2 lg:py-4 px-4 lg:px-8 gap-1 font-medium sm:font-semibold text-white rounded-lg bg-orange-500">
            Get Started <Icon icon={faArrowLeft} />
          </Link>
        </div>
        {/* right side or below side on mobile screen */}
        <img
          src="/image/landingPage/heroImage.png"
          alt="hero landing"
          className="h-48 md:h-80 w-full max-w-sm md:max-w-lg mx-auto md:mr-0 md:ml-auto"
        />
      </div>
    </section>
  );
};

// section feature quiz
const Feature = () => {
  return (
    <section className="bg-[#1c1a27]">
      {/* container */}
      <div className="max-w-screen-2xl mx-5 sm:mx-8 md:mx-12 lg:mx-24 2xl:mx-auto py-8 sm:py-16">
        {/* section title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center md:text-left font-bold capitalize text-white">
          What makes us special
        </h2>
        {/* section description */}
        <p className="mt-2 md:mt-4 text-xs sm:text-base text-center md:text-left text-gray-300">
          Menyediakan Berbagai Timer Quiz untuk Memudahkan Penilaian
        </p>
        {/* feature list container */}
        <div className="grid gap-8 2xl:gap-12 sm:grid-cols-2 xl:grid-cols-3 mt-8 md:mt-16">
          {/* feature list */}
          <div className="grid sm:grid-cols-4 gap-4 sm:gap-1 p-6 sm:p-1 bg-white rounded-lg overflow-hidden">
            {/* title and desc feature */}
            <div className="sm:col-span-3 order-2 sm:order-1 self-center sm:p-6 sm:pr-0">
              <h3 className="mb-1 text-lg font-bold capitalize">
                Regular Time Quiz
              </h3>
              <p className="text-sm leading-6 text-gray-600">
                pilihan quiz untuk membantu pengguna mengembangkan kemampuan
                mengelola waktu dan keputusan peserta secara efektif.
              </p>
            </div>
            {/* image feature */}
            <img
              src="/image/landingPage/standardlimit.svg"
              alt="standard limitation"
              className="order-1 sm:order-2 h-24 sm:h-auto sm:self-stretch mx-auto pt-3 sm:bg-gray-100 sm:rounded-tl-full sm:rounded-bl-full"
            />
          </div>
          {/* feature list */}
          <div className="grid sm:grid-cols-4 gap-4 sm:gap-1 p-6 sm:p-0 bg-white rounded-lg overflow-hidden">
            {/* title and desc feature */}
            <div className="sm:col-span-3 order-2 sm:order-1 self-center sm:p-6 sm:pr-0">
              <h3 className="mb-1 text-lg font-bold capitalize">
                Section Time Quiz
              </h3>
              <p className="text-sm leading-6 text-gray-600">
                pilihan quiz dengan membagi quiz dalam beberapa bagian dengan
                pembagian waktunya sendiri, memudahkan pengguna berkonsentrasi
                pada topik tertentu
              </p>
            </div>
            {/* image feature */}
            <img
              src="/image/landingPage/sectionlimit.svg"
              alt="time limit on seperate section"
              className="order-1 sm:order-2 h-24 sm:h-auto sm:self-stretch mx-auto pt-3 sm:bg-gray-100 sm:rounded-tl-full sm:rounded-bl-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="px-4 sm:px-8 md:px-12 lg:px-24 py-4 sm:flex sm:justify-between sm:items-center bg-gray-50">
      <Link to="/" reloadDocument>
        <img
          src="/image/logo/logo-with-desc.png"
          alt="logo Footer"
          className="mx-auto"
        />
      </Link>
      <p className="mt-4 sm:mt-0 text-sm text-center text-gray-500">
        Copyright &copy; 2023. All rights reserved.
      </p>
    </footer>
  );
};

export default Home;
