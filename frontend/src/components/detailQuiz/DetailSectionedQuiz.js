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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

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
          {/* tipe quiz */}
          <h1 className="mb-1 text-lg font-medium">
            Tipe Quiz : {quiz.quiz_type}
          </h1>
          {/* jumlah section */}
          <h1 className="mb-2 text-lg font-medium">
            Jumlah Section: {quiz.sections.length}
          </h1>
          {/* jumlah soal pada tiap section */}
          <div className="p-2 border border-slate-600">
            {quiz.sections.map((section, index) => (
              <div
                key={`sectionDetail-${index}`}
                className="flex gap-3 text-lg">
                <div>{section.sectionTitle} : </div>
                <div>{section.questionSet.length} soal</div>
              </div>
            ))}
          </div>
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
        {quiz.sections.map((section, sectionIndex) => (
          <div className="mb-4 p-4 border border-slate-500" key={sectionIndex}>
            {/* section title and time limit */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(sectionIndex)}>
              {/* section number and title */}
              <span className="text-xl font-semibold">
                Section {sectionIndex + 1} : ({section.sectionTitle})
              </span>
              <div className="flex items-center gap-3">
                {/* section time limit */}
                <div className="text-xl font-semibold">
                  {section.sectionTimeLimit} menit
                </div>
                <Icon
                  icon={showSection[sectionIndex] ? faChevronUp : faChevronDown}
                />
              </div>
            </div>
            {showSection[sectionIndex] && (
              <>
                {/* pertanyaan */}
                {section.questionSet.map((pertanyaan, pertanyaanIndex) => (
                  <div
                    className="mt-3 px-6 py-4 bg-slate-100 border border-slate-400 cursor-pointer"
                    key={pertanyaanIndex}
                    onClick={() =>
                      toggleOptions(sectionIndex, pertanyaanIndex)
                    }>
                    {/* nomor soal dan toggle */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xl font-semibold">
                        Pertanyaan {pertanyaanIndex + 1}
                      </div>
                      <Icon
                        icon={
                          showOptions[sectionIndex]?.[pertanyaanIndex]
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="text-blue-500"
                      />
                    </div>
                    {/* question text */}
                    <ReactQuill
                      value={pertanyaan.questionText}
                      theme="bubble"
                      readOnly
                      className="mb-2 p-2 bg-white border border-slate-500"
                    />
                    {/* option */}
                    {showOptions[sectionIndex] &&
                      showOptions[sectionIndex][pertanyaanIndex] &&
                      pertanyaan.answer.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="flex items-center gap-2">
                          {/* letter */}
                          <span>{answerLetter(answerIndex)}</span>
                          {/* answer text */}
                          <div
                            className={`grow flex justify-between items-center p-3 border border-slate-400 ${
                              pertanyaan.correctAnswer.toString() ===
                              answerIndex.toString()
                                ? "bg-green-300"
                                : "bg-white"
                            }`}>
                            <ReactQuill
                              value={answer}
                              theme="bubble"
                              readOnly
                            />
                            {pertanyaan.correctAnswer.toString() ===
                              answerIndex.toString() && (
                              <span className="text-black">&#10004;</span>
                            )}
                          </div>
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

export default DetailSectionedQuiz;
