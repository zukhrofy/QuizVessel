// import local library
import { useState } from "react";
// import use context hook
import useAuthContext from "../hooks/useAuthContext";
// import third library
import axios from "axios";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, username, password) => {
    // send register to server
    try {
      const response = await axios.post("/users/signup", {
        email,
        username,
        password,
      });
      const data = await response.data;
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(data));
      // update the auth context
      dispatch({ type: "LOGIN", payload: data });
      // catch error
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return { signup, error };
};
