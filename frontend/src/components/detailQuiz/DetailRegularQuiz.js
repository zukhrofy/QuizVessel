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
  // state untuk modal
  const [showModalAssign, setShowModalAssign] = useState(false);
  // state untuk show option onClick
  const [showOptions, setShowOptions] = useState([]);
  const toggleOptions = (index) => {
    const updatedShowOptions = [...showOptions];
    updatedShowOptions[index] = !showOptions[index];
    setShowOptions(updatedShowOptions);
  };
  const getAnswerLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index];
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-slate-400">
      {/* left side */}
      <div className="col-span-3 h-screen p-4 overflow-y-auto border border-slate-400 bg-white">
        {/* nama kuis */}
        <h1 className="mb-5 text-3xl font-bold text-center">{quiz.title}</h1>
        {/* time limit */}
        <h1 className="mb-2 text-lg">
          Waktu Pengerjaan : {quiz.time_limit} Menit
        </h1>
        {/* tipe quiz */}
        <h1 className="mb-2 text-lg">Tipe Quiz : {quiz.quiz_type}</h1>
        {/* jumlah pertanyaan */}
        <h1 className="mb-5 text-lg">
          Jumlah Pertanyaan: {quiz.questions.length}
        </h1>
        {/* edit quiz */}
        <Link
          to={`/dashboard/library/${quiz._id}/edit`}
          className="flex justify-center items-center gap-3 mb-3 px-4 py-2 text-lg font-bold text-center text-white bg-red-400 hover:bg-red-600 rounded">
          Edit Quiz <Icon icon={faCopy} />
        </Link>
        {/* assign kuis */}
        <button
          className="flex justify-center items-center gap-3 w-full px-4 py-2 text-lg font-bold text-white bg-blue-400 hover:bg-blue-600 rounded"
          onClick={() => setShowModalAssign(true)}>
          Assign Quiz <Icon icon={faPenToSquare} />
        </button>
      </div>

      {/* right side */}
      <div className="col-span-9 p-4 overflow-y-auto border bg-white border-slate-400">
        {quiz.questions.map((element, index) => (
          <div
            className="mb-4 p-4 border border-slate-300 shadow-md"
            key={index}>
            {/* pertanyaan */}
            <div
              className="flex justify-between items-center pb-2 border-b cursor-pointer"
              onClick={() => toggleOptions(index)}>
              <span className="text-xl font-bold">
                Question {index + 1} : {element.questionText}
              </span>
              <Icon icon={showOptions[index] ? faChevronUp : faChevronDown} />
            </div>
            {/* options */}
            {showOptions[index] && (
              <div className="mt-2">
                {element.answer.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center gap-2">
                    {/* letter */}
                    <span>{getAnswerLetter(answerIndex)}</span>
                    {/* answer option */}
                    <div
                      className={`grow flex justify-between items-center p-3 border border-slate-500 ${
                        element.correctAnswer.toString() ===
                          answerIndex.toString() && "bg-green-300"
                      }`}>
                      <span>{answer}</span>
                      {element.correctAnswer.toString() ===
                        answerIndex.toString() && (
                        <span className="text-white">&#10004;</span>
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

  const [deadline, setDeadline] = useState("");

  // handle assign quiz
  const handleAssign = async () => {
    if (!user) {
      navigate("auth/login");
    }

    try {
      const response = await axios.post(
        `/quiz/asign/${id}`,
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
    <>
      <div className="fixed flex justify-center items-center inset-0 z-50">
        {/* container */}
        <div className="rounded-lg shadow-lg bg-white" onSubmit={handleAssign}>
          {/* upper */}
          <div className="p-6">
            <h1>player should complete it before : </h1>
            <input
              className="w-full"
              type="date"
              required
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          {/*footer*/}
          <div className="flex justify-between items-center p-2 border-t border-slate-500">
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
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default DetailRegularQuiz;
