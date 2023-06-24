import { createContext, useReducer } from "react";

export const quizContext = createContext();

export const quizReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUIZ":
      return { ...state, quiz: action.payload };
    case "GET_QUIZ":
      return { ...state, filteredQuiz: action.payload };
    case "CREATE_QUIZ":
      return { ...state, quiz: [action.payload, ...state.quiz] };
    case "DELETE_QUIZ":
      return {
        ...state,
        quiz: state.quiz.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const QuizContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, {
    quiz: [],
    filteredQuiz: {},
  });

  return (
    <quizContext.Provider value={{ state, dispatch }}>
      {children}
    </quizContext.Provider>
  );
};
