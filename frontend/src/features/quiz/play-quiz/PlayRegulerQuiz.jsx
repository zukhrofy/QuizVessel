// local library
import { useEffect, useState } from "react";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
// use context hook
import useAuthContext from "@/hooks/auth/useAuthContext";

const PlayRegulerQuiz = ({ quiz, quizToken }) => {
  const { user } = useAuthContext();
  // untuk menyimpan jawaban user
  const [responses, setResponses] = useState({});
  // menyimpan waktu pengerjaan quiz
  const [remainingTime, setRemainingTime] = useState(quiz.time_limit * 60);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // handle perubahan jawaban user
  const handleAnswerChange = (e) => {
    const selectedOption = e.target.value;
    const questionSelectionId = e.target.name;
    setResponses((prevResponse) => ({
      ...prevResponse,
      [questionSelectionId]: selectedOption,
    }));
  };

  // handle event ketika submit quiz
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/play/${quizToken}/processAnswer`,
        responses,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.status === 200) {
        return navigate(`/play/${quizToken}/finish`);
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // event tombol submit untuk show modal
  const handleLeavePage = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // jika setuju submit
  const handleConfirmSubmit = () => {
    handleSubmit();
    setShowConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  // use effect untuk timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // use effect ketika waktu habis
  useEffect(() => {
    console.log("run pengecekan timer");
    if (remainingTime <= 0) {
      handleSubmit();
    }
  }, [remainingTime]);

  // use effect ketika ingin refresh (belum bekerja)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // helper function untuk ui timer
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // helper function untuk ui progress
  const progress = () => {
    const totalQuestions = quiz.questions.length;
    const answeredQuestions = Object.keys(responses).length;
    return answeredQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  // helper function untuk mendapatkan abjad option
  const answerLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index];
  };
  return (
    <>
      <div className="flex h-screen">
        {/* sidebar */}
        <aside className="h-full max-w-sm overflow-y-auto bg-stone-300 p-4">
          {/* title */}
          <h2 className="mb-4 text-center text-3xl font-bold">{quiz.title}</h2>
          {/* timer */}
          <div className="mb-4 text-center text-4xl font-bold">
            {formatTime(remainingTime)}
          </div>
          {/* progress indicator */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 grow bg-gray-400">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress()}%` }}
              />
            </div>
            <div className="text-gray-600">{`${progress()}% completed`}</div>
          </div>
          {/* question pointer */}
          <div className="grid grid-cols-5 gap-3 bg-white p-3 shadow-md">
            {quiz.questions.map((question, questionIndex) => (
              <div
                key={question.questionIndex}
                className={`cursor-pointer border border-slate-400 p-3 ${
                  responses.hasOwnProperty(questionIndex) &&
                  "border-white bg-green-400 text-white"
                }`}
                onClick={() => {
                  document.getElementById(`${questionIndex}`).scrollIntoView();
                }}
              >
                <span className="text-sm font-semibold">
                  {questionIndex + 1}
                </span>
              </div>
            ))}
          </div>
        </aside>
        {/* main part */}
        <div className="grow overflow-y-auto bg-stone-100 p-5">
          {/* questions */}
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              id={questionIndex}
              className="mb-2 border bg-white p-5 shadow-lg"
            >
              {/* question number */}
              <div className="bg-slate-300 p-2 font-semibold">
                Pertanyaan {questionIndex + 1}
              </div>
              {/* question text */}
              <ReactQuill
                value={question.questionText}
                theme="bubble"
                readOnly
                className="mb-2 border border-slate-400 font-bold"
              />
              {/* option */}
              <ul>
                {question.answer.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <div className="ml-5 flex items-center gap-2">
                      <span className="font-medium">
                        {answerLetter(optionIndex)}
                      </span>
                      <input
                        type="radio"
                        value={optionIndex}
                        name={question.questionId}
                        onChange={handleAnswerChange}
                      />
                      <ReactQuill
                        value={option}
                        theme="bubble"
                        readOnly
                        className="grow"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* submit button */}
          <button
            onClick={handleLeavePage}
            className={`mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600`}
          >
            Submit Answer
          </button>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmDialog
          message="Apa kamu yakin ingin submit?"
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </>
  );
};

// confirm dialog saat user submit
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="rounded-lg bg-white p-6">
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayRegulerQuiz;
