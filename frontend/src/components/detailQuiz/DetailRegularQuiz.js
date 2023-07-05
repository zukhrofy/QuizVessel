// local library
import { useState } from "react";
// use context hooks
import { useAuthContext } from "../../contexts/authContext";
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
    <div className="grid grid-cols-12 gap-4 h-screen bg-slate-400">
      {/* left side */}
      <div className="col-span-3 h-full p-4 bg-white">
        {/* nama kuis */}
        <h1 className="mb-5 text-3xl font-bold text-center">{quiz.title}</h1>
        <div className="mb-5 p-2 border border-slate-400">
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
          to={`/dashboard/library/${quiz._id}/edit`}
          className="flex justify-center items-center gap-3 mb-3 px-4 py-2 text-lg font-bold text-white bg-red-400 hover:bg-red-600">
          Edit Quiz <Icon icon={faCopy} />
        </Link>
        {/* assign kuis */}
        <button
          className="flex justify-center items-center gap-3 w-full px-4 py-2 text-lg font-bold text-white bg-blue-400 hover:bg-blue-600"
          onClick={() => setShowModalAssign(true)}>
          Assign Quiz <Icon icon={faPenToSquare} />
        </button>
      </div>

      {/* right side */}
      <div className="col-span-9 p-5 bg-white overflow-y-auto">
        {quiz.questions.map((element, index) => (
          <div key={index} className="mb-4 p-4 border border-slate-500">
            {/* pertanyaan */}
            <div
              className="flex justify-between items-center pb-1 border-b border-slate-300 cursor-pointer"
              onClick={() => toggleOptions(index)}>
              <span className="text-xl font-semibold">
                Question {index + 1} : {element.questionText}
              </span>
              <Icon icon={showOptions[index] ? faChevronUp : faChevronDown} />
            </div>
            {/* options */}
            {showOptions[index] && (
              <div className="mt-2 p-2">
                {element.answer.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center gap-2">
                    {/* letter */}
                    <span>{answerLetter(answerIndex)}</span>
                    {/* answer option */}
                    <div
                      className={`grow flex justify-between items-center p-3 border border-slate-400 ${
                        element.correctAnswer.toString() ===
                          answerIndex.toString() && "bg-green-300"
                      }`}>
                      <span>{answer}</span>
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
        `/quiz/assign/${id}`,
        { deadline },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/dashboard/report");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  return (
    <div className="fixed flex justify-center items-center inset-0 z-50 bg-black bg-opacity-25">
      {/* container */}
      <div className="rounded-lg shadow-lg bg-white">
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
        <div className="flex justify-between p-2 border-t border-black">
          <button
            onClick={handleAssign}
            className="px-6 py-2 text-sm font-bold uppercase text-blue-600">
            Assign
          </button>
          <button
            className="px-6 py-2 text-sm font-bold uppercase text-red-600"
            type="button"
            onClick={() => setModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailRegularQuiz;
