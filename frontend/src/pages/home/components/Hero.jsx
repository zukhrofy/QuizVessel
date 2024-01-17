import { Link } from "react-router-dom";
import heroImage from "@/common/assets/hero.jpg";

const Hero = () => {
  return (
    <section className="mt-16 bg-[url('src/common/assets/wave.svg')] bg-bottom bg-no-repeat">
      <div className="container mx-auto grid items-center px-4 py-8 lg:grid-cols-2 lg:px-24 xl:px-52">
        {/* Jumbotron left */}
        <div className="rounded-lg bg-slate-200/10 px-6 py-12 text-center shadow-md shadow-slate-500/50 backdrop-blur-2xl md:px-12 lg:-mr-14 lg:text-left">
          <h1 className="mb-5 text-3xl font-bold sm:text-4xl md:mb-10 lg:mb-14 xl:text-5xl">
            Pilihan Terbaik untuk{" "}
            <span className="text-blue-500">Proses Penilaian Anda</span>
          </h1>
          <Link
            className="inline-block rounded bg-blue-500 px-4 py-2 text-sm font-medium uppercase text-white shadow-md transition duration-150 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-0 active:bg-blue-700 md:mb-0 lg:px-8 lg:py-4"
            to="/auth/login"
          >
            Get started
          </Link>
        </div>
        {/* right image */}
        <img
          src={heroImage}
          className="hidden h-[calc(100vh-4rem-4rem)] max-h-[650px] w-full rounded-lg lg:block"
          alt=""
        />
      </div>
    </section>
  );
};

export default Hero;
