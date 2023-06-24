// local library
import { useEffect, useState } from "react";
// use context hook
import { useAuthContext } from "../../contexts/authContext";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // handle event ketika submit
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
        const data = await response.data;
        if (data.response === "baruSiapUjian") {
          // navigate to halaman selesai
          return navigate(`/play/${quizToken}/finish`);
        }
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // event tombol submit
  const handleLeavePage = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

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
    if (remainingTime <= 0) {
      handleSubmit();
    }
  }, [remainingTime]);

  // use effect ketika ingin refresh (belum bekerja)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };

    const handleUnload = () => {
      handleSubmit();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  // format deadline to timer
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const remainingSeconds = remainingTime % 60;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

  // proggress bar
  const answeredQuestions = Object.keys(responses).length;
  const totalQuestions = quiz.questions.length;
  const progress =
    answeredQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  return (
    <>
      <div className="grid grid-cols-[auto,1fr] min-h-screen">
        {/* question list sidebar */}
        <aside className="h-full p-4 bg-stone-300 overflow-y-auto">
          <h2 className="mb-4 text-2xl text-center font-bold">{quiz.title}</h2>
          <div className="mb-4 text-center text-4xl font-bold">
            {formattedTime}
          </div>
          {/* progress indicator */}
          <div className="flex items-center mb-4 gap-2">
            <div className="flex-grow h-2 bg-gray-300">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-gray-600">{`${progress}% completed`}</div>
          </div>
          {/* question pointer */}
          <div className="grid grid-cols-5 gap-3 p-3 bg-white shadow-md">
            {quiz.questions.map((question, questionIndex) => (
              <div
                key={question.questionIndex}
                className={`flex justify-center p-4 border border-slate-500 ${
                  responses.hasOwnProperty(questionIndex) &&
                  "bg-green-400 border-0"
                }`}>
                <span className="text-sm font-semibold">
                  {questionIndex + 1}
                </span>
              </div>
            ))}
          </div>
        </aside>
        {/* main part */}
        <div className="p-5 overflow-y-auto bg-stone-100">
          {/* questions */}
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="mb-2 p-5 bg-white border shadow-lg">
              {/* question text */}
              <h2 className="mb-2 text-xl font-bold">
                {questionIndex + 1}. {question.questionText}
              </h2>
              {/* option */}
              <ul className="space-y-1">
                {question.answer.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={optionIndex}
                        name={question.questionId}
                        onChange={handleAnswerChange}
                      />
                      <span>{option}</span>
                    </label>
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
          message="Are you sure you want to leave the page?"
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </>
  );
};

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayRegulerQuiz;
