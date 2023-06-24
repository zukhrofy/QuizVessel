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

const DetailSectionedQuiz = ({ quiz }) => {
  // state untuk modal
  const [showModalAssign, setShowModalAssign] = useState(false);
  // state untuk show section onClick
  const [showSection, setShowSection] = useState([]);
  const toggleSection = (sectionIndex) => {
    const updatedShowSection = [...showSection];
    updatedShowSection[sectionIndex] = !updatedShowSection[sectionIndex];
    setShowSection(updatedShowSection);
  };
  // state untuk show option onClick
  const [showOptions, setShowOptions] = useState([]);
  const toggleOptions = (sectionIndex, pertanyaanIndex) => {
    const updatedShowOptions = [...showOptions];
    if (!updatedShowOptions[sectionIndex]) {
      updatedShowOptions[sectionIndex] = {};
    }
    updatedShowOptions[sectionIndex][pertanyaanIndex] =
      !updatedShowOptions[sectionIndex][pertanyaanIndex];
    setShowOptions(updatedShowOptions);
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-slate-400">
      {/* left side */}
      <div className="col-span-3 h-screen p-4 overflow-y-auto border border-slate-400 bg-white">
        {/* nama kuis */}
        <h1 className="mb-5 text-3xl font-bold text-center">{quiz.title}</h1>
        {/* tipe quiz */}
        <h1 className="mb-2 text-lg">Tipe Quiz : {quiz.quiz_type}</h1>
        {/* jumlah section */}
        <h1 className="mb-5 text-lg">Jumlah Section: {quiz.sections.length}</h1>
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
        {/* section loop */}
        {quiz.sections.map((section, sectionIndex) => (
          <div className="mb-5 p-5 border border-slate-500" key={sectionIndex}>
            {/* section title */}
            <div
              className="flex justify-between mb-1 cursor-pointer"
              onClick={() => toggleSection(sectionIndex)}>
              <span className="text-lg font-bold uppercase">
                section {sectionIndex + 1} ({section.sectionTitle})
              </span>
              <Icon
                icon={showSection[sectionIndex] ? faChevronUp : faChevronDown}
                className="text-blue-500"
              />
            </div>
            {showSection[sectionIndex] && (
              <>
                {/* section time limit */}
                <h2 className="text-lg mb-3">
                  section time limit : {section.sectionTimeLimit}
                </h2>
                {/* pertanyaan */}
                {section.questionSet.map((pertanyaan, pertanyaanIndex) => (
                  <div
                    className="mb-2 py-4 px-6 border shadow-lg cursor-pointer"
                    key={pertanyaanIndex}
                    onClick={() =>
                      toggleOptions(sectionIndex, pertanyaanIndex)
                    }>
                    {/* question text */}
                    <div className="flex justify-between mb-1">
                      <span>
                        {pertanyaanIndex + 1}. {pertanyaan.questionText}
                      </span>
                      <Icon
                        icon={
                          showOptions[pertanyaanIndex]
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="text-blue-500"
                      />
                    </div>
                    {/* option */}
                    {showOptions[sectionIndex] &&
                      showOptions[sectionIndex][pertanyaanIndex] &&
                      pertanyaan.answer.map((answer, answerIndex) => (
                        <div
                          className={`p-3 border border-slate-400 shadow-sm ${
                            pertanyaan.correctAnswer.toString() ===
                              answerIndex.toString() && "bg-green-300"
                          }`}
                          key={answerIndex}>
                          {answer}
                        </div>
                      ))}
                  </div>
                ))}
              </>
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
      return;
    }

    const response = await axios.post(
      `/quiz/asign/${id}`,
      { deadline },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.status === 200) {
      console.log("gagal post bro");
    }

    if (response.status === 200) {
      navigate("/dashboard/report");
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
          <div className="flex items-center justify-between p-6 border-t border-slate-500">
            <button
              onClick={handleAssign}
              className="px-6 py-2 text-blue-500 font-bold uppercase text-sm">
              Assign
            </button>
            <button
              className="px-6 py-2 text-red-500 font-bold uppercase text-sm"
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

export default DetailSectionedQuiz;
