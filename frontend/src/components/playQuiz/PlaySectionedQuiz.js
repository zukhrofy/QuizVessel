// local library
import { useEffect, useState } from "react";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";
// use context hooks
import useAuthContext from "../../hooks/useAuthContext";

const PlaySectionedQuiz = ({ quiz, quizToken }) => {
  const section = quiz.sections;
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [userResponse, setResponse] = useState({});
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `/play/${quizToken}/processAnswer`,
        userResponse,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        // take response data
        const data = await response.data;
        // jika quiz marked as finished or pass the deadlin
        if (data.response === "baruSiapUjian") {
          // navigate to preview page
          return navigate(`/play/${quizToken}/finish`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Set remaining time for each section
  useEffect(() => {
    const currentSection = section[currentSectionIndex];
    // convert minute to second for time interval function
    setRemainingTime(currentSection.sectionTimeLimit * 60);
  }, [currentSectionIndex]);

  // set the timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          handleNextSection();
          clearInterval(timer);
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [section, currentSectionIndex]);

  // change section manually or triggered when time section is 0
  const handleNextSection = () => {
    if (currentSectionIndex < section.length - 1) {
      setCurrentSectionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Quiz finished
      console.log("Quiz finished");
      handleSubmit();
    }
  };

  // for development only, check the user response
  useEffect(() => {
    console.log(userResponse);
  }, [userResponse]);

  // handle ketika answer menjawab
  const handleAnswerChange = (sectionId, questionIndex, answer) => {
    setResponse((prevAnswers) => ({
      ...prevAnswers,
      [sectionId]: { ...prevAnswers[sectionId], [questionIndex]: answer },
    }));
  };

  // function untuk format waktu timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // untuk progress section
  const answeredQuestions = userResponse[currentSectionIndex]
    ? Object.keys(userResponse[currentSectionIndex]).length
    : 0;
  const totalQuestions = section[currentSectionIndex].questionSet.length;
  const progress =
    answeredQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  return (
    <>
      <div className="grid grid-cols-[auto,1fr] min-h-screen bg-gray-100">
        <aside className="h-full p-3 bg-slate-200">
          <h2 className="mb-1 text-3xl text-center font-bold">
            {quiz.namaQuiz}
          </h2>
          <h2 className="text-2xl text-center font-bold">
            Section {currentSectionIndex + 1}{" "}
          </h2>
          <h2 className="mb-4 text-2xl text-center font-bold">
            {section[currentSectionIndex].sectionTitle}
          </h2>
          {/* remaining time */}
          <div className="mb-4 text-center text-4xl font-bold">
            {formatTime(remainingTime)}
          </div>
          {/* progress indicator */}
          <div className="flex items-center mb-4">
            <div className="flex-grow h-2 bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}></div>
            </div>
            <div className="ml-2 text-gray-600">{`${progress}% completed`}</div>
          </div>
          <div className="grid grid-cols-5 p-3 gap-3 border border-slate-500">
            {section[currentSectionIndex].questionSet.map(
              (question, questionIndex) => (
                <div
                  key={`${currentSectionIndex}-${questionIndex}`}
                  className={`flex justify-center p-2 border border-slate-500 ${
                    userResponse[currentSectionIndex]?.hasOwnProperty(
                      questionIndex
                    ) && "bg-green-500"
                  }`}>
                  <span className="text-sm font-semibold">
                    {questionIndex + 1}
                  </span>
                </div>
              )
            )}
          </div>
        </aside>
        <div className="p-4">
          {/* questions */}
          {section[currentSectionIndex].questionSet.map(
            (question, questionIndex) => (
              <div
                key={`${currentSectionIndex}-${questionIndex}`}
                className="mb-2 p-4 border border-slate-400">
                {/* question text */}
                <h2 className="mb-2 text-lg font-bold">
                  {questionIndex + 1}. {question.questionText}
                </h2>
                {/* option */}
                <ul className="space-y-1">
                  {question.answer.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={optionIndex}
                          name={`section-${currentSectionIndex}-question-${questionIndex}`}
                          onChange={(e) =>
                            handleAnswerChange(
                              currentSectionIndex,
                              questionIndex,
                              e.target.value
                            )
                          }
                        />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleNextSection}>
            Next Section
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaySectionedQuiz;
