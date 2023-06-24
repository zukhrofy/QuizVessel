import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "axios";

const PlayQuizResult = () => {
  const { quizToken } = useParams();
  const { user } = useAuthContext();
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`/play/${quizToken}/result`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.data;
          setResult(data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchResult();
    }
  }, [user, quizToken]);
  const { nilaiAkhir, result: userResult } = result.participant
    ? result.participant[0]
    : {};
  return (
    <>
      {loading && "loading..."}
      {!loading && result.quiz_type === "regular" && (
        <div className="h-screen w-full flex justify-center items-center">
          <div className="w-1/2 bg-white p-8 rounded-lg border border-slate-400 shadow-md">
            <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
            <p className="text-lg">Nilai Anda: {nilaiAkhir}</p>
            <h2 className="text-lg font-semibold mt-6 mb-2">Detail Jawaban</h2>
            {Object.keys(userResult).map((questionIndex) => {
              const { selectedAnswer, isCorrect } = userResult[questionIndex];
              return (
                <div
                  key={questionIndex}
                  className={`flex items-center gap-3 mb-2 p-2 border ${
                    isCorrect ? "bg-green-200" : "bg-red-200"
                  }`}>
                  <p className="font-semibold">{Number(questionIndex) + 1}.</p>
                  <p>
                    Selected Answer:{" "}
                    {selectedAnswer
                      ? result.questions[questionIndex].answer[selectedAnswer]
                      : "tidak dijawab"}
                  </p>
                  {isCorrect ? (
                    <span className="">&#10004;</span>
                  ) : (
                    <span className="">x</span>
                  )}
                </div>
              );
            })}
            <button
              className="px-4 py-2 mt-4 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-md"
              onClick={handlePlayAgain}>
              back
            </button>
          </div>
        </div>
      )}

      {!loading && result.quiz_type === "sectioned" && (
        <div className="h-screen w-full flex justify-center items-center">
          <div className="w-1/2 bg-white p-8 rounded-lg border border-slate-400 shadow-md">
            <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
            <h2 className="text-lg font-semibold mt-6 mb-2">Detail Jawaban</h2>
            {Object.keys(userResult).map((sectionId) => {
              const section = userResult[sectionId];

              return (
                <div key={sectionId}>
                  <h2 className="text-xl font-semibold">
                    {result.sections[sectionId].sectionTitle}
                  </h2>
                  {Object.keys(section).map((questionId) => {
                    const { selectedAnswer, isCorrect } = section[questionId];
                    return (
                      <div
                        key={questionId}
                        className={`flex items-center gap-3 mb-2 p-2 border rounded-lg ${
                          isCorrect ? "bg-green-200" : "bg-red-200"
                        } shadow-md`}>
                        <p className="font-semibold text-lg">{questionId}.</p>
                        <p className="text-base">
                          Selected Answer:{" "}
                          {selectedAnswer ? selectedAnswer : "tidak dijawab"}
                        </p>
                        {isCorrect ? (
                          <span className="text-green-500 text-2xl">
                            &#10004;
                          </span>
                        ) : (
                          <span className="text-red-500 text-2xl">x</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <button
              className="px-4 py-2 mt-4 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-md"
              onClick={handlePlayAgain}>
              back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayQuizResult;
