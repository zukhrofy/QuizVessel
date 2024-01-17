// local library
import { useState } from "react";
// use context hooks
import useAuthContext from "@/hooks/auth/useAuthContext";
// use third library
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCopy,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const DetailRegularQuiz = ({ quiz }) => {
  // state untuk modal assign quiz
  const [showModalAssign, setShowModalAssign] = useState(false);
  // state untuk show option onClick
  const [showOptions, setShowOptions] = useState([]);
  const toggleOptions = (index) => {
    const updatedShowOptions = [...showOptions];
    updatedShowOptions[index] = !showOptions[index];
    setShowOptions(updatedShowOptions);
  };
  const answerLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index];
  };

  return (
    <div className="grid h-screen grid-cols-12 gap-4 bg-slate-400">
      {/* left side */}
      <div className="col-span-3 h-full bg-white p-4">
        {/* nama kuis */}
        <h1 className="mb-5 text-center text-3xl font-bold">{quiz.title}</h1>
        <div className="mb-5 border border-slate-400 p-2">
          {/* time limit */}
          <h1 className="mb-1 text-lg font-medium">
            Waktu Pengerjaan : {quiz.time_limit} Menit
          </h1>
          {/* tipe quiz */}
          <h1 className="mb-1 text-lg font-medium">
            Tipe Quiz : {quiz.quiz_type}
          </h1>
          {/* jumlah pertanyaan */}
          <h1 className="mb-1 text-lg font-medium">
            Jumlah Pertanyaan: {quiz.questions.length}
          </h1>
        </div>
        {/* edit quiz */}
        <Link
          to={`/quiz/${quiz._id}/edit`}
          className="mb-3 flex items-center justify-center gap-3 bg-red-400 px-4 py-2 text-lg font-bold text-white hover:bg-red-600"
        >
          Edit Quiz <Icon icon={faCopy} />
        </Link>
        {/* assign kuis */}
        <button
          className="flex w-full items-center justify-center gap-3 bg-blue-400 px-4 py-2 text-lg font-bold text-white hover:bg-blue-600"
          onClick={() => setShowModalAssign(true)}
        >
          Assign Quiz <Icon icon={faPenToSquare} />
        </button>
      </div>

      {/* right side */}
      <div className="col-span-9 overflow-y-auto bg-white p-5">
        {quiz.questions.map((element, index) => (
          <div
            key={index}
            className="mb-4 border border-slate-500 bg-slate-100 p-4"
          >
            {/* nomor soal dan toggle */}
            <div
              className="mb-3 flex cursor-pointer items-center justify-between"
              onClick={() => toggleOptions(index)}
            >
              <div className="text-xl font-semibold">Question {index + 1}</div>
              <Icon icon={showOptions[index] ? faChevronUp : faChevronDown} />
            </div>
            {/* question text */}
            <ReactQuill
              value={element.questionText}
              theme="bubble"
              readOnly
              className="mb-3 border border-slate-400 bg-white"
            />
            {/* options */}
            {showOptions[index] && (
              <div>
                {element.answer.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center gap-2">
                    {/* letter */}
                    <span>{answerLetter(answerIndex)}</span>
                    {/* answer option */}
                    <div
                      className={`flex grow items-center justify-between border border-slate-400 p-2 ${
                        element.correctAnswer.toString() ===
                        answerIndex.toString()
                          ? "bg-green-300"
                          : "bg-white"
                      }`}
                    >
                      <ReactQuill value={answer} theme="bubble" readOnly />
                      {element.correctAnswer.toString() ===
                        answerIndex.toString() && (
                        <span className="text-black">&#10004;</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModalAssign && <ModalAssign setModal={setShowModalAssign} />}
    </div>
  );
};

const ModalAssign = ({ setModal }) => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const minimumDeadline = () => {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    return tomorrow.toISOString().split("T")[0];
  };

  const [deadline, setDeadline] = useState("");

  // handle assign quiz
  const handleAssign = async () => {
    if (!user) {
      navigate("auth/login");
    }

    try {
      const response = await axios.post(
        `/api/quiz/assign/${id}`,
        { deadline },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.status === 200) {
        navigate("/report");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
      {/* container */}
      <div className="rounded-lg bg-white shadow-lg">
        {/* body */}
        <div className="p-8">
          <h1>player should complete it before : </h1>
          <input
            required
            className="w-full"
            type="date"
            min={minimumDeadline()}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        {/*footer*/}
        <div className="flex justify-between border-t border-black p-2">
          <button
            onClick={handleAssign}
            className="px-6 py-2 text-sm font-bold uppercase text-blue-600"
          >
            Assign
          </button>
          <button
            className="px-6 py-2 text-sm font-bold uppercase text-red-600"
            type="button"
            onClick={() => setModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailRegularQuiz;
