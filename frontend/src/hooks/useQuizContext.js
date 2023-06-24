import { useContext } from "react";
import { quizContext } from "../contexts/quizContext";

const useQuizContext = () => {
  const context = useContext(quizContext);
  return context;
};

export default useQuizContext;
