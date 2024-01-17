import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ErrorContainer = ({ backendError }) => {
  if (backendError) {
    let errorMessage;
    if (Array.isArray(backendError)) {
      errorMessage = backendError.map((item) => item.msg).join("\n");
    } else {
      errorMessage = backendError;
    }
    toast.error(errorMessage, {
      toastId: "backend-error",
    });
  }
};

export default ErrorContainer;
