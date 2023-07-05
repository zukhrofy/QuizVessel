// local library
import { useEffect, useState } from "react";
// third library
import { Link, useNavigate, useParams } from "react-router-dom";
import { differenceInDays, format } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import { id } from "date-fns/locale";
import axios from "axios";
import { RingLoader } from "react-spinners";
// use context
import { useAuthContext } from "../../contexts/authContext";

const PlayQuizPreview = () => {
  // store the quiz detail
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({});
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
        if (err.response.status === 403) {
          const isFinished = err.response.data.isFinished;
          setQuiz({ isFinished });
          setLoading(false);
        } else if (err.response.status === 404) {
          setQuiz({ message: err.response.data.message });
          setLoading(false);
        } else {
          console.log(err.response.data);
        }
      }
    };

    if (user) {
      fetchQuiz();
    }
  }, [user, quizToken]);

  const handleStartQuiz = async () => {
    if (!user) {
      navigate("/auth/login");
    }
    navigate(`/play/${quizToken}/start`);
  };

  return (
    <>
      {/* loading spinner */}
      {loading && (
        <div className="h-screen w-full flex justify-center items-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {/* jika quiz masih tersedia */}
      {!loading && quiz.finished === false && (
        <div className="h-screen flex justify-center items-center bg-blue-400">
          {/* container */}
          <div className="p-10 bg-white shadow-2xl">
            {/* title */}
            <h1 className="mb-4 text-3xl font-bold text-center">
              Quiz Entrance ({quiz.quiz_type}) Quiz
            </h1>
            <div className="mb-7 px-4 py-3 border border-slate-500">
              {/* quiz information */}
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-lg">
                Deadline :{" "}
                {format(fromUnixTime(Number(quiz.deadline)), "dd MMMM yyyy", {
                  locale: id,
                })}
                , berakhir dalam{" "}
                {differenceInDays(
                  fromUnixTime(Number(quiz.deadline)),
                  Date.now()
                )}{" "}
                hari lagi.
              </p>
              {/* time limit tersedia dalam quiz regular */}
              {quiz.time_limit && (
                <p className="text-lg">Time Limit : {quiz.time_limit} menit</p>
              )}
              {quiz.quiz_type === "regular" && (
                <p className="text-lg">
                  Jumlah Pertanyaan : {quiz.questions.length} soal
                </p>
              )}
              {quiz.quiz_type === "sectioned" && (
                <>
                  <p className="text-lg">
                    Jumlah Section : {quiz.sections.length} section
                  </p>
                  <div className="p-2 border border-slate-400">
                    {quiz.sections.map((section) => (
                      <div>
                        {section.sectionTitle} : {section.questionSet.length}{" "}
                        soal
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* rules */}
            <p className="mb-2 text-lg text-gray-600">
              Harap baca petunjuk berikut sebelum memulai:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pastikan Anda memiliki koneksi internet yang stabil.</li>
              <li>
                Pastikan Anda memiliki waktu yang cukup untuk menyelesaikan
                quiz.
              </li>
              <li>
                Jangan menutup browser atau me-refresh halaman selama quiz
                berlangsung.
              </li>
            </ul>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartQuiz}
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      {/* jika deadline quiz sudah berakhir */}
      {!loading && quiz.isFinished && (
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="mb-1 text-3xl font-bold">
            Maaf Quiz Telah Melewati Deadline
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            Batas waktu untuk quiz ini telah berakhir. Anda tidak dapat
            bergabung lagi.
          </p>
          <Link
            to="/dashboard"
            className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md">
            Go Back
          </Link>
        </div>
      )}
      {/* jika quiz tidak ditemukan */}
      {!loading && quiz.message && (
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="mb-1 text-3xl font-bold">Error</h1>
          <p className="mb-4 text-lg text-gray-600">{quiz.message}</p>
          <Link
            to="/dashboard"
            className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md">
            Go Back
          </Link>
        </div>
      )}
    </>
  );
};

export default PlayQuizPreview;
