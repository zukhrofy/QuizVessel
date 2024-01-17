import { useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import logo from "@/common/assets/logo.png";
import ErrorContainer from "./components/ErrorContainer";
import FormInputField from "./components/FormInputField";
import { loginSchema } from "@/schema/authSchema";
import useAuthContext from "@/hooks/auth/useAuthContext";

const Login = () => {
  const [backendError, setBackendError] = useState(null);

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-sm rounded-lg bg-white shadow-lg lg:max-w-4xl lg:grid-cols-2">
        {/* left image */}
        <div className="hidden bg-[url('src/common/assets/hero.jpg')] bg-cover lg:block" />
        <Form setBackendError={setBackendError} />
        <ErrorContainer backendError={backendError} />
      </div>
    </section>
  );
};

const Form = ({ setBackendError }) => {
  const { dispatch } = useAuthContext();

  // react hook config
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(loginSchema),
  });

  // api request
  const loginUser = async (email, password) => {
    const response = await axios.post("/api/users/login", { email, password });
    return await response.data;
  };

  // event submit form
  const onSubmit = async ({ email, password }) => {
    try {
      setBackendError(null);
      // request and save server response
      const responseData = await loginUser(email, password);
      // save user info to local storage and context
      localStorage.setItem("user", JSON.stringify(responseData));
      dispatch({ type: "LOGIN", payload: responseData });
    } catch (err) {
      // show server errors
      setBackendError(err.response.data.error);
    }
  };

  return (
    <form className="px-6 py-8 md:px-8" onSubmit={handleSubmit(onSubmit)}>
      {/* title */}
      <div className="flex items-center justify-center gap-4">
        <img className="h-8" src={logo} alt="login form logo" />
        <p className="text-xl text-gray-600">Welcome back!</p>
      </div>
      <div className="mt-8 space-y-4">
        <FormInputField
          id={"email"}
          name={"email"}
          type={"email"}
          register={register}
          errors={errors}
        >
          email
        </FormInputField>
        <FormInputField
          id={"password"}
          name={"password"}
          type={"password"}
          register={register}
          errors={errors}
        >
          Password
        </FormInputField>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={!isValid}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium capitalize text-white duration-300 hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:bg-gray-800/60"
        >
          Sign In
          {isSubmitting ? (
            <ClipLoader size={20} color="#FFFFFF" loading={isSubmitting} />
          ) : (
            <Icon icon={faArrowRight} />
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="w-1/5 border-b" />
        <Link
          to="/auth/signup"
          className="text-xs uppercase text-gray-500 hover:underline"
        >
          or sign up
        </Link>
        <span className="w-1/5 border-b" />
      </div>
    </form>
  );
};

export default Login;
