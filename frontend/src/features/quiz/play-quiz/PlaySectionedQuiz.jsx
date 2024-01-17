// local library
import { useEffect, useState } from "react";
// third library
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
// use context hooks
import useAuthContext from "@/hooks/auth/useAuthContext";

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
        `/api/play/${quizToken}/processAnswer`,
        userResponse,
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
      <div className="flex h-screen">
        {/* sidebar */}
        <aside className="h-full max-w-sm overflow-y-auto bg-stone-300 p-4">
          {/* title */}
          <h2 className="mb-5 text-center text-3xl font-bold">{quiz.title}</h2>
          {/* section number and title */}
          <h2 className="text-center text-xl font-semibold">
            Section {currentSectionIndex + 1}
          </h2>
          <h2 className="mb-4 text-center text-xl font-medium">
            {section[currentSectionIndex].sectionTitle}
          </h2>
          {/* timer */}
          <div className="mb-4 text-center text-4xl font-bold">
            {formatTime(remainingTime)}
          </div>
          {/* progress indicator */}
          <div className="mb-4 flex items-center gap-2">
            {/* bar indicator */}
            <div className="h-2 grow bg-gray-400">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress()}%` }}
              />
            </div>
            <div className="text-gray-600">{`${progress()}% completed`}</div>
          </div>
          {/* section question pointer */}
          <div className="grid grid-cols-5 gap-3 bg-white p-3 shadow-md">
            {section[currentSectionIndex].questionSet.map(
              (question, questionIndex) => (
                <div
                  key={`pointer-${currentSectionIndex}-${questionIndex}`}
                  className={`cursor-pointer border border-slate-400 p-3 ${
                    userResponse[currentSectionIndex]?.hasOwnProperty(
                      questionIndex,
                    ) && "border-white bg-green-400 text-white"
                  }`}
                  onClick={() =>
                    document
                      .getElementById(
                        `section-${currentSectionIndex}-question-${questionIndex}`,
                      )
                      .scrollIntoView()
                  }
                >
                  <span className="text-sm font-semibold">
                    {questionIndex + 1}
                  </span>
                </div>
              ),
            )}
          </div>
        </aside>
        {/* main part */}
        <div className="grow overflow-y-auto bg-stone-100 p-5">
          {/* questions */}
          {section[currentSectionIndex].questionSet.map(
            (question, questionIndex) => (
              <div
                key={`soal-${currentSectionIndex}-${questionIndex}`}
                id={`section-${currentSectionIndex}-question-${questionIndex}`}
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
                          name={`section-${currentSectionIndex}-question-${questionIndex}`}
                          onChange={(e) =>
                            handleAnswerChange(
                              currentSectionIndex,
                              questionIndex,
                              e.target.value,
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
            ),
          )}
          <button
            onClick={handleNextSection}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Next Section
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaySectionedQuiz;
