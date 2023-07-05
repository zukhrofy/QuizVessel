// local library
import { useEffect, useState } from "react";
// use context hook
import useAuthContext from "../../hooks/useAuthContext";
// third library
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { BarLoader } from "react-spinners";

const ReportQuiz = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState([]);

  const { user } = useAuthContext();

  useEffect(() => {
    // get all quiz that assigned
    const fetchReport = async () => {
      try {
        const response = await axios("/report", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.data;
        setReport(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      fetchReport();
    }
  }, [user]);

  return (
    <>
      {loading && <BarLoader color="#007BFF" loading={loading} />}
      {!loading && (
        <>
          <h1 className="mb-5 text-2xl font-bold">Report Quiz</h1>
          <table className="min-w-full divide-y-2 divide-black text-sm bg-white">
            <thead>
              <tr className="text-lg text-gray-900">
                <th className="p-4">Nama kuis</th>
                <th className="p-4">Token</th>
                <th className="p-4">Tipe kuis</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assign at</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">jumlah peserta</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-400 text-lg">
              {report.map((element) => (
                <tr key={element._id}>
                  <td className="p-3">{element.title}</td>
                  <td className="p-3">{element.token}</td>
                  <td className="p-3">{element.quiz_type}</td>
                  <td className="p-3">
                    {element.finished ? "Finished" : "Ongoing"}
                  </td>
                  <td className="p-3">
                    {format(new Date(element.createdAt), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </td>
                  <td className="p-3">
                    {format(new Date(element.deadline * 1000), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </td>
                  <td className="p-3">{element.participant.length}</td>
                  <td className="p-3">
                    <Link
                      to={`/report/${element._id}`}
                      className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default ReportQuiz;
