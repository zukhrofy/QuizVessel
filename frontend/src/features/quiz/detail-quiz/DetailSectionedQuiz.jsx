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
    <div className="grid h-screen grid-cols-12 gap-4 bg-slate-400">
      {/* left side */}
      <div className="col-span-3 h-full bg-white p-4">
        {/* nama kuis */}
        <h1 className="mb-5 text-center text-3xl font-bold">{quiz.title}</h1>
        <div className="mb-5 border border-slate-400 p-2">
          {/* tipe quiz */}
          <h1 className="mb-1 text-lg font-medium">
            Tipe Quiz : {quiz.quiz_type}
          </h1>
          {/* jumlah section */}
          <h1 className="mb-2 text-lg font-medium">
            Jumlah Section: {quiz.sections.length}
          </h1>
          {/* jumlah soal pada tiap section */}
          <div className="border border-slate-600 p-2">
            {quiz.sections.map((section, index) => (
              <div
                key={`sectionDetail-${index}`}
                className="flex gap-3 text-lg"
              >
                <div>{section.sectionTitle} : </div>
                <div>{section.questionSet.length} soal</div>
              </div>
            ))}
          </div>
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
        {quiz.sections.map((section, sectionIndex) => (
          <div className="mb-4 border border-slate-500 p-4" key={sectionIndex}>
            {/* section title and time limit */}
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => toggleSection(sectionIndex)}
            >
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
                    className="mt-3 cursor-pointer border border-slate-400 bg-slate-100 px-6 py-4"
                    key={pertanyaanIndex}
                    onClick={() => toggleOptions(sectionIndex, pertanyaanIndex)}
                  >
                    {/* nomor soal dan toggle */}
                    <div className="mb-2 flex items-center justify-between">
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
                      className="mb-2 border border-slate-500 bg-white p-2"
                    />
                    {/* option */}
                    {showOptions[sectionIndex] &&
                      showOptions[sectionIndex][pertanyaanIndex] &&
                      pertanyaan.answer.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="flex items-center gap-2"
                        >
                          {/* letter */}
                          <span>{answerLetter(answerIndex)}</span>
                          {/* answer text */}
                          <div
                            className={`flex grow items-center justify-between border border-slate-400 p-3 ${
                              pertanyaan.correctAnswer.toString() ===
                              answerIndex.toString()
                                ? "bg-green-300"
                                : "bg-white"
                            }`}
                          >
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

export default DetailSectionedQuiz;
