// use local library
import { useEffect, useState } from "react";
// use context hooks
import useAuthContext from "@/hooks/auth/useAuthContext";
// use third libary
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RingLoader } from "react-spinners";
import ReactQuill from "react-quill";

const PlayQuizResult = () => {
  const [loading, setLoading] = useState(true);
  const { quizToken } = useParams();
  const { user } = useAuthContext();

  const [quiz, setQuiz] = useState({});
  const [participantData, setParticipantData] = useState({});
  const [participantResult, setParticipantResult] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // get result from server
    const fetchResult = async () => {
      try {
        const response = await axios.get(`/api/play/${quizToken}/result`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.data;
          setQuiz(data.assignedQuiz);
          setParticipantData(data.participant);
          setParticipantResult(data.participant.result);
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

  return (
    <>
      {/* loading */}
      {loading && (
        <div className="flex h-screen w-full items-center justify-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {/* regular quiz result */}
      {!loading && quiz.quiz_type === "regular" && (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
          <div className="w-1/2 rounded-lg border border-slate-400 bg-white p-8 shadow-md">
            <h1 className="text-2xl font-bold">Quiz Result</h1>
            <p className="mb-4 text-xl font-medium">{quiz.title}</p>
            <p className="text-lg">Participant Name: {user.username}</p>
            <p className="text-lg">Your Score: {participantData.nilaiAkhir}</p>
            <h2 className="mb-1 mt-6 text-lg font-semibold">Detail Jawaban</h2>
            {Object.keys(participantResult).map((questionId, questionIndex) => {
              const { selectedAnswer, isCorrect } =
                participantResult[questionId];
              return (
                <div
                  key={questionIndex}
                  className={`mb-2 flex items-center gap-3 border p-2 ${
                    isCorrect ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <span className="font-semibold">{questionIndex + 1}.</span>
                  <div className="grow">
                    <span>Jawaban yang dipilih:</span>
                    {selectedAnswer ? (
                      <ReactQuill
                        value={
                          quiz.questions[questionIndex].answer[selectedAnswer]
                        }
                        theme="bubble"
                        className="bg-white"
                        readOnly
                      />
                    ) : (
                      <span>"tidak dijawab"</span>
                    )}
                  </div>
                  {isCorrect ? (
                    <span className="text-3xl text-green-500">&#10004;</span>
                  ) : (
                    <span className="text-3xl text-red-500">x</span>
                  )}
                </div>
              );
            })}
            <button
              className="mt-4 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
      {/* sectioned quiz result */}
      {!loading && quiz.quiz_type === "sectioned" && (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
          <div className="w-1/2 rounded-lg border border-slate-400 bg-white p-8 shadow-md">
            <h1 className="text-2xl font-bold">Quiz Result</h1>
            <h1 className="mb-4 text-xl font-medium">{quiz.title}</h1>
            <p className="text-lg">Participant Name: {user.username}</p>
            <p className="text-lg">Your Score: {participantData.nilaiAkhir}</p>
            <h2 className="mb-1 mt-6 text-lg font-semibold">Detail Jawaban</h2>
            {Object.keys(participantResult).map((sectionId) => {
              const section = participantResult[sectionId];
              return (
                <div
                  key={`section-${sectionId}`}
                  className="mb-4 border border-slate-500 p-5"
                >
                  <h2 className="text-lg font-medium">
                    Judul Section : {quiz.sections[sectionId].sectionTitle}
                  </h2>
                  <h2 className="mb-2 text-lg font-medium">
                    Score Section : {section.sectionScore}
                  </h2>
                  {Object.keys(section).map((questionId) => {
                    if (questionId === "sectionScore") {
                      return null;
                    }
                    const { selectedAnswer, isCorrect } = section[questionId];
                    return (
                      <div
                        key={`question-${questionId}`}
                        className={`mb-2 flex items-center gap-3 border p-2 ${
                          isCorrect ? "bg-green-200" : "bg-red-200"
                        }`}
                      >
                        <span className="font-semibold">
                          {Number(questionId) + 1}.
                        </span>
                        <div className="grow">
                          <span>Jawaban yang dipilih:</span>
                          {selectedAnswer ? (
                            <ReactQuill
                              value={
                                quiz.sections[sectionId].questionSet[questionId]
                                  .answer[selectedAnswer]
                              }
                              theme="bubble"
                              className="bg-white"
                              readOnly
                            />
                          ) : (
                            <span>"tidak dijawab"</span>
                          )}
                        </div>
                        {isCorrect ? (
                          <span className="text-3xl text-green-500">
                            &#10004;
                          </span>
                        ) : (
                          <span className="text-3xl text-red-500">x</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <button
              className="mt-4 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayQuizResult;
