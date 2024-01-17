import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { differenceInDays, format } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import { id } from "date-fns/locale";
import axios from "axios";
import { RingLoader } from "react-spinners";

import { ReactComponent as NotFoundSvg } from "@/common/assets/notfound.svg";
import useAuthContext from "@/hooks/auth/useAuthContext";

const PlayQuizPreview = () => {
  // store the quiz detail
  const { user } = useAuthContext();
  const { quizToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [backendError, setBackendError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios(`/api/play/${quizToken}/preview`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          const quiz = await response.data;
          setQuiz(quiz);
        }
      } catch (err) {
        const resStatus = err.response.status;
        const resData = err.response.data.error;
        // handle jika kuis sudah melewati batas waktu dan token quiz tidak ditemukan
        if (resStatus === 403 || resStatus === 404) {
          setBackendError({
            type: resStatus,
            error: resData,
          });
        } else {
          console.log(err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuiz();
    }
  }, [user, quizToken]);

  const handleStartQuiz = async () => {
    if (!user) navigate("/auth/login");

    navigate(`/play/${quizToken}/start`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RingLoader color="#007BFF" loading={loading} size={150} />
      </div>
    );
  }

  if (!backendError) {
    console.log("masuk sini bro gk ada errornay");
    return (
      <div className="flex h-screen items-center justify-center bg-blue-400">
        {/* container */}
        <div className="bg-white p-10 shadow-2xl">
          {/* title */}
          <h1 className="mb-4 text-center text-3xl font-bold">
            Quiz Entrance ({quiz.quiz_type}) Quiz
          </h1>
          <div className="mb-7 border border-slate-500 px-4 py-3">
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
                Date.now(),
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
                <div className="border border-slate-400 p-2">
                  {quiz.sections.map((section) => (
                    <div>
                      {section.sectionTitle} : {section.questionSet.length} soal
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
          <ul className="list-inside list-disc space-y-1">
            <li>Pastikan Anda memiliki koneksi internet yang stabil.</li>
            <li>
              Pastikan Anda memiliki waktu yang cukup untuk menyelesaikan quiz.
            </li>
            <li>
              Jangan menutup browser atau me-refresh halaman selama quiz
              berlangsung.
            </li>
          </ul>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (backendError["type"] === 403) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-1 text-3xl font-bold">
          {backendError.error.message}
        </h1>
        <p className="mb-4 text-lg text-gray-600">
          {backendError.error.description}
        </p>
        <Link
          to="/dashboard"
          className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white"
        >
          Go Back
        </Link>
      </div>
    );
  }

  // jika quiz tidak ditemukan
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <NotFoundSvg />
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {backendError.error}
        </h1>
      </div>
    </div>
  );
};

export default PlayQuizPreview;
