import * as yup from "yup";
import "../../utils/yupLocale";

// skema validasi form
export const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export const signupSchema = yup
  .object({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required().min(8).max(32),
  })
  .required();
