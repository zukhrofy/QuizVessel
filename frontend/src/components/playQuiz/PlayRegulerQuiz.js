// local library
import { useEffect, useState } from "react";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";
// use context hook
import { useAuthContext } from "../../contexts/authContext";

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
        `/play/${quizToken}/processAnswer`,
        responses,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
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
      "0"
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
      <div className="h-screen flex">
        {/* sidebar */}
        <aside className="h-full p-4 bg-stone-300 overflow-y-auto">
          {/* title */}
          <h2 className="mb-4 text-3xl text-center font-bold">{quiz.title}</h2>
          {/* timer */}
          <div className="mb-4 text-4xl font-bold text-center">
            {formatTime(remainingTime)}
          </div>
          {/* progress indicator */}
          <div className="flex items-center mb-4 gap-2">
            <div className="grow h-2 bg-gray-400">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress()}%` }}
              />
            </div>
            <div className="text-gray-600">{`${progress()}% completed`}</div>
          </div>
          {/* question pointer */}
          <div className="grid grid-cols-5 gap-3 p-3 bg-white shadow-md">
            {quiz.questions.map((question, questionIndex) => (
              <div
                key={question.questionIndex}
                className={`p-3 border border-slate-400 cursor-pointer ${
                  responses.hasOwnProperty(questionIndex) &&
                  "bg-green-400 border-white text-white"
                }`}
                onClick={() => {
                  document.getElementById(`${questionIndex}`).scrollIntoView();
                }}>
                <span className="text-sm font-semibold">
                  {questionIndex + 1}
                </span>
              </div>
            ))}
          </div>
        </aside>
        {/* main part */}
        <div className="grow p-5 bg-stone-100 overflow-y-auto">
          {/* questions */}
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              id={questionIndex}
              className="mb-2 p-5 bg-white border shadow-lg">
              {/* question text */}
              <h2 className="mb-2 text-xl font-bold">
                {questionIndex + 1}. {question.questionText}
              </h2>
              {/* option */}
              <ul className="space-y-1">
                {question.answer.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <div className="flex items-center ml-5 gap-2">
                      <span className="font-medium">
                        {answerLetter(optionIndex)}
                      </span>
                      <input
                        type="radio"
                        value={optionIndex}
                        name={question.questionId}
                        onChange={handleAnswerChange}
                      />
                      <span>{option}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* submit button */}
          <button
            onClick={handleLeavePage}
            className={`mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded`}>
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="p-6 bg-white rounded-lg">
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-white hover:bg-gray-100 border border-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayRegulerQuiz;
