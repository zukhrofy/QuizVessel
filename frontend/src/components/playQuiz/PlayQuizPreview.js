// local library
import { useEffect, useState } from "react";
// third library
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import axios from "axios";
// use context
import { useAuthContext } from "../../contexts/authContext";
import { RingLoader } from "react-spinners";

const PlayQuizPreview = () => {
  // store the quiz detail
  const [quiz, setQuiz] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const { quizToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // get quiz preview
    const fetchQuiz = async () => {
      // get quiz information
      try {
        const response = await axios(`/play/${quizToken}/preview`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          const quiz = await response.data;
          setQuiz(quiz);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchQuiz();
    }
  }, [user, quizToken]);

  const handlePlayGame = async () => {
    if (!user) {
      navigate("/auth/login");
    }

    navigate(`/play/${quizToken}/start`);
  };

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex justify-center items-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {!loading && quiz.finished === false && (
        <div className="flex justify-center items-center h-screen bg-slate-200">
          {/* container */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="mb-4 text-3xl text-center font-bold">
              Quiz Entrance
            </h1>
            <div className="mb-7 px-4 py-3 border">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-lg">
                Deadline :{" "}
                {format(fromUnixTime(Number(quiz.deadline)), "dd-MM-yyyy")}
              </p>
              {quiz.time_limit && (
                <p className="text-lg">Time Limit : {quiz.time_limit} menit</p>
              )}
              <p className="text-lg">Tipe Quiz : {quiz.quiz_type}</p>
              {quiz.quiz_type === "regular" && (
                <p className="text-lg">
                  Jumlah Pertanyaan : {quiz.questions.length}
                </p>
              )}
              {quiz.quiz_type === "sectioned" && (
                <p className="text-lg">
                  Jumlah Section : {quiz.sections.length}
                </p>
              )}
            </div>
            <p className="text-lg text-gray-600 mb-2">
              Selamat datang di quiz! Harap baca petunjuk berikut sebelum
              memulai:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pastikan Anda memiliki koneksi internet yang stabil.</li>
              <li>
                Pastikan Anda telah mengalokasikan waktu yang cukup untuk
                menyelesaikan quiz.
              </li>
              <li>
                Jangan menutup browser atau me-refresh halaman selama quiz
                berlangsung.
              </li>
            </ul>
            <div className="mt-8">
              <button
                onClick={handlePlayGame}
                className="px-4 py-2 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-md">
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && quiz.finished === true && (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="mb-2 text-3xl font-bold">
            Maaf Quiz Telah Melewati Deadline
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            Batas waktu untuk quiz ini telah berakhir. Anda tidak dapat
            bergabung lagi.
          </p>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-white font-semibold bg-indigo-600 rounded-md">
            Go Back
          </Link>
        </div>
      )}
    </>
  );
};

export default PlayQuizPreview;
