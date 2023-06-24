// import third library
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader";
// import hooks
import { useSignup } from "../../hooks/useSignup";
// import from schema
import { signupSchema } from "./authSchema";
// import local library
import { useState } from "react";

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // react hook form config
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(signupSchema),
  });
  const { signup, error } = useSignup();

  // event submit form
  const onSubmit = async ({ email, username, password }) => {
    setIsSubmitting(true);
    // register user
    await signup(email, username, password);
    setIsSubmitting(false);
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
      {/* left side */}
      <div className="lg:col-span-5 xl:col-span-6 relative lg:flex lg:items-end h-24 lg:h-full bg-gray-600">
        {/* background image */}
        <img
          src="/image/auth/login-register.jpg"
          alt="signup page background"
          className="absolute w-full h-full object-cover opacity-60"
        />
        {/* hidden in mobile screen */}
        <div className="hidden lg:block relative p-12">
          {/* title */}
          <h2 className="text-4xl font-bold text-white">Quiz Vessel</h2>
          {/* desc */}
          <p className="mt-4 text-white/90">
            Penilaian menjadi mudah dengan Quiz Vessel. Menyediakan Berbagai
            Timer Quiz untuk Memudahkan Penilaian
          </p>
        </div>
      </div>

      {/* right side or main part */}
      <main className="lg:col-span-7 xl:col-span-6 flex justify-center items-center px-8 py-8">
        <div className="w-full max-w-md">
          {/* logo show in mobile screen */}
          <Link
            className="lg:hidden relative flex justify-center items-center -mt-16 h-16 sm:h-20 w-16 sm:w-20 bg-white rounded-full"
            to="/">
            <img src="/image/logo/logo.png" alt="logo Login" />
          </Link>
          {/* title */}
          <h1 className="flex items-center mt-2 gap-2 text-lg sm:text-3xl font-bold text-gray-900">
            Signup{" "}
            <img
              src="/image/logo/logo.png"
              alt="brand logo on signup"
              className="hidden lg:block"
            />
          </h1>
          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* email */}
            <div>
              <label htmlFor="email" className="text-xs font-medium">
                email
              </label>
              <input
                type="text"
                id="email"
                className="w-full text-sm text-gray-800 rounded-md border-gray-400 shadow-sm"
                {...register("email")}
              />
              <span className="text-xs text-red-500">
                {errors.email?.message}
              </span>
            </div>
            {/* username */}
            <div>
              <label htmlFor="username" className="text-xs font-medium">
                username
              </label>
              <input
                type="text"
                id="username"
                className="w-full text-sm text-gray-800 rounded-md border-gray-400 shadow-sm"
                {...register("username")}
              />
              <span className="text-xs text-red-500">
                {errors.username?.message}
              </span>
            </div>
            {/* password */}
            <div>
              <label htmlFor="password" className="text-xs font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full text-sm text-gray-800 rounded-md border-gray-400 shadow-sm"
                {...register("password")}
              />
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              {/* submit button */}
              <button
                type="submit"
                disabled={!isValid}
                className="inline-flex justify-center items-center gap-1 px-12 py-3 text-sm font-medium text-white hover:text-blue-600 disabled:hover:text-white bg-blue-600 hover:bg-transparent disabled:bg-blue-600/60 hover:border-blue-600 disabled:hover:border-0 rounded-md transition">
                Signup <Icon icon={faArrowRight} />
              </button>
              <p className="text-sm text-center text-gray-500">
                Already have an account ?{" "}
                <Link to="/auth/Login" className="underline text-gray-700">
                  Login
                </Link>
                .
              </p>
            </div>
          </form>
          {isSubmitting && (
            <div className="flex justify-center mt-4">
              <ClipLoader color="#000000" loading={isSubmitting} />
            </div>
          )}
          {!isSubmitting && error && (
            <div className="text-center mt-3 text-red-700">
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Signup;
