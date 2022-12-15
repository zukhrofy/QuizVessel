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
    <div className="grid md:grid-cols-2 mt-16 md:mt-20 py-8 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-24 gap-4 md:gap-8 bg-gray-50">
      <div className="flex flex-col justify-center items-center text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-medium md:font-semibold lg:font-extrabold">
          Assessment easier with{" "}
          <strong className="text-[#1554ff]">Quiz Vessel.</strong>
        </h1>
        <p className="mt-2 md:mt-4 text-xs sm:text-base lg:text-xl">
          provides various types of quiz models and quiz time models
        </p>
        <Link
          to="/"
          className="md:self-start mt-4 md:mt-8 py-3 lg:py-4 px-4 lg:px-12 text-white font-medium sm:font-semibold rounded-lg bg-orange-500">
          Get Started
        </Link>
      </div>
      <img
        src="/image/landingPage/heroImage.png"
        alt=""
        className="h-48 md:h-80 mx-auto md:mr-0 md:ml-auto w-full max-w-sm md:max-w-md"
      />
    </div>
  );
};

const Feature = () => {
  return (
    <section class="px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-16 bg-[#1c1a27]">
      <h2 class="text-2xl sm:text-4xl font-bold capitalize text-center md:text-left text-white">
        What makes us special
      </h2>
      <p class="mt-4 text-gray-300">
        Menyediakan berbagai tipe quiz atau ujian sesuai dengan berbagai
        keperluan
      </p>
      <div class="mt-8 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <div class="p-6 bg-gray-100 rounded-lg">
          <img
            className="w-1/2 h-20 mb-2 mx-auto"
            alt="standard limitation"
            src="/image/landingPage/standardlimit.svg"
          />
          <h3 class="mb-2 text-lg font-bold capitalize">
            standard time limitation
          </h3>
          <p class="text-sm leading-6 text-gray-600">
            suatu opsi ujian yang digunakan pada umumnya, menggunakan batasan
            waktu pada keseluruhan quiz
          </p>
        </div>

        <div class="p-6 bg-gray-100 rounded-lg">
          <img
            className="w-1/2 h-20 mb-2 mx-auto"
            alt="time limit on each question"
            src="/image/landingPage/eachquestionlimit.svg"
          />
          <h3 class="mb-2 text-lg font-bold capitalize">
            time limit on each question
          </h3>
          <p class="text-sm leading-6 text-gray-600">
            suatu opsi ujian dengan limitasi waktu pada tiap pertanyaan
          </p>
        </div>

        <div class="p-6 bg-gray-100 rounded-lg">
          <img
            className="w-1/2 h-20 mb-2 mx-auto"
            alt="time limit on seperate section"
            src="/image/landingPage/sectionlimit.svg"
          />
          <h3 class="mb-2 text-lg font-bold capitalize">
            section time limitation
          </h3>
          <p class="text-sm leading-6 text-gray-600">
            suatu opsi ujian dengan limitasi waktu pada beberapa sesi, dapat
            digunakan jika ingin membagi quiz menjadi beberapa bagian
          </p>
        </div>

        <div class="p-6 bg-gray-100 rounded-lg">
          <img
            className="w-1/2 h-20 mb-2 mx-auto"
            alt="untime quiz"
            src="/image/landingPage/untimequiz.svg"
          />
          <h3 class="mb-2 text-lg font-bold capitalize">untimed quiz</h3>
          <p class="text-sm leading-6 text-gray-600">
            opsi ujian dengan tanpa menggunakan batasan waktu ujian
          </p>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer class="px-4 sm:px-8 md:px-12 lg:px-24 py-4 sm:flex sm:justify-between sm:items-center bg-gray-50">
      <Link to="/" reloadDocument>
        <img src="/image/logo/logo.png" alt="logo Footer" className="mx-auto" />
      </Link>
      <p class="mt-4 sm:mt-0 text-sm text-center text-gray-500">
        Copyright &copy; 2022. All rights reserved.
      </p>
    </footer>
  );
};

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

export default Home;
