// import axios from "axios";
import { Link } from "react-router-dom";
// import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// import { useEffect } from "react";
// import AuthConsumer from "../../contexts/authContext";

yup.setLocale({
  mixed: {
    required: ({ path, label }) => `${label ? label : path} tidak boleh kosong`,
  },
  string: {
    min: ({ path, min }) => `${path} harus berisi minimal ${min}`,
    max: ({ path, max }) => `${path} melebihi batas ${max} karakter`,
  },
});

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required().min(8).max(32),
  })
  .required();

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // const navigate = useNavigate();

  // const useAuth = AuthConsumer();
  // const { login } = useAuth;

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   const form = e.target;
  //   const user = {
  //     username: form[0].value,
  //     password: form[1].value,
  //   };
  //   axios
  //     .post("http://localhost:8000/auth/login", user)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .then((data) => {
  //       localStorage.setItem("token", data.token);
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  // };

  const onSubmit = (data) => console.log(data);
  const onErrors = (err) => console.log(err);

  // useEffect(() => {
  //   axios("http://localhost:8000/auth/login", {
  //     headers: {
  //       "x-access-token": localStorage.getItem("token"),
  //     },
  //   })
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .then((data) => {
  //       data.isLoggedIn && navigate("/dashboard");
  //     });
  // });

  return (
    <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
      {/* left side */}
      <div className="lg:col-span-5 xl:col-span-6 relative lg:flex lg:items-end h-24 lg:h-full bg-gray-600">
        {/* background image */}
        <img
          src="/image/auth/login.jpg"
          alt="login page background"
          className="absolute w-full h-full object-cover opacity-60"
        />
        {/* hidden in mobile screen (logo, title, and desc) */}
        <div className="hidden bg- lg:block relative p-12">
          <Link to="/" reloadDocument>
            <img
              src="/image/logo/logo.png"
              alt="brand logo on login"
              className="origin-top-left scale-125"
            />
          </Link>
          <h2 className="mt-6 text-4xl font-bold text-white">Quiz Vessel</h2>
          <p className="mt-4 text-white/90">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
        </div>
      </div>

      {/* right side or main part */}
      <main className="lg:col-span-7 xl:col-span-6 flex justify-center items-center px-8 py-8">
        <div className="w-full max-w-md">
          {/* logo show in mobile screen */}
          <Link
            className="lg:hidden relative -mt-16 flex justify-center items-center h-16 sm:h-20 w-16 sm:w-20 bg-white rounded-full"
            to="/">
            <img src="/image/logo/logo.png" alt="logo Login" />
          </Link>
          <h1 className="mt-2 text-lg sm:text-3xl font-bold text-gray-900">
            Sign in to Quiz Vessel
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit, onErrors)}
            className="space-y-5 mt-8">
            <div>
              <label
                htmlFor="username"
                className="text-xs font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full text-sm text-gray-700 bg-white rounded-md border-gray-200 shadow-sm"
                {...register("username")}
              />
              <span className="text-xs text-red-500">
                {errors.username?.message}
              </span>
            </div>
            <div>
              <label
                htmlFor="Password"
                className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="Password"
                className="w-full text-sm text-gray-700 bg-white rounded-md border-gray-200 shadow-sm"
                {...register("password")}
              />
            </div>
            {/* not yet working */}
            <Link className="block text-xs text-sky-600" to="">
              Forget Password?
            </Link>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <button
                type="submit"
                disabled={!isValid}
                className="px-12 py-3 text-sm font-medium text-white hover:text-blue-600 disabled:hover:text-white bg-blue-600 hover:bg-transparent disabled:bg-blue-600/60 hover:border-blue-600 disabled:hover:border-0 rounded-md transition">
                Login
              </button>
              <p className="text-sm text-center text-gray-500">
                Already have an account ?{" "}
                <Link to="/auth/register" className="underline text-gray-700">
                  register
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
