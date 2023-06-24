import { useContext } from "react";
import { reportContext } from "../contexts/reportContext";

export const useReportContext = () => {
  const context = useContext(reportContext);
  return context;
};
