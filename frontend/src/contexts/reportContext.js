import { createContext, useReducer } from "react";

export const reportContext = createContext();

export const reportReducer = (state, action) => {
  switch (action.type) {
    case "SET_REPORT":
      return { ...state, report: action.payload };
    case "GET_REPORT":
      return { ...state, filteredReport: action.payload };
    case "CREATE_QUIZ":
      return { ...state, report: [action.payload, ...state.report] };
    default:
      return state;
  }
};

export const ReportContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportReducer, {
    report: [],
    filteredReport: {},
  });

  return (
    <reportContext.Provider value={{ state, dispatch }}>
      {children}
    </reportContext.Provider>
  );
};
