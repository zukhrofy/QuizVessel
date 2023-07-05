// import third library
import { useParams } from "react-router-dom";
import axios from "axios";
import { RingLoader } from "react-spinners";
// import useContext hooks
import useAuthContext from "../../hooks/useAuthContext";
// import local library
import { useEffect, useState } from "react";
// import component
import EditRegularQuiz from "./EditRegularQuiz";
import EditSectionedQuiz from "./EditSectionedQuiz";

const EditQuiz = () => {
  const [quiz, setQuiz] = useState({});
  const [quizType, setQuizType] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuthContext();

  useEffect(() => {
    // get quiz detail
    const fetchQuiz = async () => {
      try {
        const response = await axios(`/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.data;
        if (response.status === 200) {
          setQuiz(data);
          setQuizType(data.quiz_type);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchQuiz();
    }
  }, [id, user]);

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex justify-center items-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {!loading && (
        <>
          {quizType === "regular" && <EditRegularQuiz quiz={quiz} />}
          {quizType === "sectioned" && <EditSectionedQuiz quiz={quiz} />}
        </>
      )}
    </>
  );
};

export default EditQuiz;
