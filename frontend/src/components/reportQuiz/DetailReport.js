// local library
import { useEffect, useState } from "react";
// third library
import axios from "axios";
import { useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
// import use context hooks
import useAuthContext from "../../hooks/useAuthContext";
// import component
import DetailRegularReport from "./DetailRegularReport";
import DetailSectionedReport from "./DetailSectionedReport";

const DetailReport = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get all report that assigned
    const fetchReport = async () => {
      try {
        const response = await axios(`/report/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.data;

        if (response.status === 200) {
          setReport(data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchReport();
    }
  }, [user, id]);

  return (
    <>
      {loading && (
        <div className="h-full w-full flex justify-center items-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {!loading && report.quiz_type === "regular" && (
        <DetailRegularReport report={report} />
      )}
      {!loading && report.quiz_type === "sectioned" && (
        <DetailSectionedReport report={report} />
      )}
    </>
  );
};

export default DetailReport;
