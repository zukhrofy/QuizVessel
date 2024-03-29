// import local library
import { useEffect, useState } from "react";
// use context hook
import useAuthContext from "../../hooks/auth/useAuthContext";
// third library
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCopy,
  faEdit,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import axios from "axios";

const QuizList = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState([]);
  // state untuk menyimpan id quiz yang akan diassign
  const [selectedQuizId, setSelectedQuizId] = useState(false);
  //   state untuk modal assign quiz
  const [showModalAsign, setShowModalAssign] = useState(false);

  const openAssignModal = (bookId) => {
    setSelectedQuizId(bookId);
    setShowModalAssign(true);
  };

  useEffect(() => {
    // get all quiz
    const fetchAllQuiz = async () => {
      try {
        const response = await axios("/api/quiz", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          const data = await response.data;
          setQuiz(data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchAllQuiz();
    }
  }, [user]);

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Quiz Bank</h1>
      {/* quiz list */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {loading && <BarLoader color="#007BFF" loading={loading} />}

        {!loading &&
          quiz.map((quiz) => (
            <Link
              key={quiz._id}
              to={`/quiz/${quiz._id}/`}
              className="rounded-lg bg-white p-6 shadow-md hover:bg-indigo-100"
            >
              <h2 className="mb-4 text-xl font-semibold">{quiz.title}</h2>
              {/* quiz type */}
              <p className="mb-2 text-gray-600">Tipe Kuis: {quiz.quiz_type}</p>
              {/* last updated */}
              <p className="mb-4 text-gray-600">
                di update{" "}
                {formatDistanceToNow(new Date(quiz.updatedAt), {
                  locale: id,
                  addSuffix: true,
                })}
              </p>
              {/* action button */}
              <div className="flex justify-between ">
                {/* assign button */}
                <button
                  className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    openAssignModal(quiz._id);
                  }}
                >
                  Assign <Icon icon={faPenToSquare} />
                </button>
                {/* edit button */}
                <Link
                  to={`/quiz/${quiz._id}/edit`}
                  className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
                >
                  Edit <Icon icon={faCopy} />
                </Link>
              </div>
            </Link>
          ))}
      </div>

      {showModalAsign && (
        <ModalAssign id={selectedQuizId} setModal={setShowModalAssign} />
      )}
    </>
  );
};

const ModalAssign = ({ setModal, id }) => {
  const { user } = useAuthContext();
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

export default QuizList;
