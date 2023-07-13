// local library
import { useEffect, useState } from "react";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
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
        return navigate(`/play/${quizToken}/finish`);
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // Set remaining time for each section, berjalan setiap perubahan index section
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
  }, [currentSectionIndex]);

  // change section manually or triggered when time section is 0
  const handleNextSection = () => {
    if (currentSectionIndex < section.length - 1) {
      window.scrollTo({
        top: 0,
      });
      setCurrentSectionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Quiz finished
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

  //helper function untuk format waktu timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // helper function untuk progress section
  const progress = () => {
    const answeredQuestions = userResponse[currentSectionIndex]
      ? Object.keys(userResponse[currentSectionIndex]).length
      : 0;
    const totalQuestions = section[currentSectionIndex].questionSet.length;
    const progress =
      answeredQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0;
    return progress;
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
        <aside className="h-full max-w-sm p-4 bg-stone-300 overflow-y-auto">
          {/* title */}
          <h2 className="mb-5 text-3xl text-center font-bold">{quiz.title}</h2>
          {/* section number and title */}
          <h2 className="text-xl text-center font-semibold">
            Section {currentSectionIndex + 1}
          </h2>
          <h2 className="mb-4 text-xl text-center font-medium">
            {section[currentSectionIndex].sectionTitle}
          </h2>
          {/* timer */}
          <div className="mb-4 text-4xl font-bold text-center">
            {formatTime(remainingTime)}
          </div>
          {/* progress indicator */}
          <div className="flex items-center mb-4 gap-2">
            {/* bar indicator */}
            <div className="grow h-2 bg-gray-400">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress()}%` }}
              />
            </div>
            <div className="text-gray-600">{`${progress()}% completed`}</div>
          </div>
          {/* section question pointer */}
          <div className="grid grid-cols-5 gap-3 p-3 bg-white shadow-md">
            {section[currentSectionIndex].questionSet.map(
              (question, questionIndex) => (
                <div
                  key={`pointer-${currentSectionIndex}-${questionIndex}`}
                  className={`p-3 border border-slate-400 cursor-pointer ${
                    userResponse[currentSectionIndex]?.hasOwnProperty(
                      questionIndex
                    ) && "bg-green-400 border-white text-white"
                  }`}
                  onClick={() =>
                    document
                      .getElementById(
                        `section-${currentSectionIndex}-question-${questionIndex}`
                      )
                      .scrollIntoView()
                  }>
                  <span className="text-sm font-semibold">
                    {questionIndex + 1}
                  </span>
                </div>
              )
            )}
          </div>
        </aside>
        {/* main part */}
        <div className="grow p-5 bg-stone-100 overflow-y-auto">
          {/* questions */}
          {section[currentSectionIndex].questionSet.map(
            (question, questionIndex) => (
              <div
                key={`soal-${currentSectionIndex}-${questionIndex}`}
                id={`section-${currentSectionIndex}-question-${questionIndex}`}
                className="mb-2 p-5 bg-white border shadow-lg">
                {/* question number */}
                <div className="p-2 font-semibold bg-slate-300">
                  Pertanyaan {questionIndex + 1}
                </div>
                {/* question text */}
                <ReactQuill
                  value={question.questionText}
                  theme="bubble"
                  readOnly
                  className="mb-2 font-bold border border-slate-400"
                />
                {/* option */}
                <ul>
                  {question.answer.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <div className="flex items-center ml-5 gap-2">
                        <span className="font-medium">
                          {answerLetter(optionIndex)}
                        </span>
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
            )
          )}
          <button
            onClick={handleNextSection}
            className="mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded">
            Next Section
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaySectionedQuiz;
