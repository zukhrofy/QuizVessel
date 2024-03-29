// import third library
import { useParams } from "react-router-dom";
import axios from "axios";
import { RingLoader } from "react-spinners";
// local library
import { useEffect, useState } from "react";
// import use context hooks
import useAuthContext from "../../../hooks/auth/useAuthContext";
// import component
import DetailRegularQuiz from "./DetailRegularQuiz";
import DetailSectionedQuiz from "./DetailSectionedQuiz";

const DetailQuiz = () => {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({});
  const [quizType, setQuizType] = useState("");
  const { user } = useAuthContext();
  const { id } = useParams();

  useEffect(() => {
    // get detailed quiz
    const fetchQuiz = async () => {
      try {
        const response = await axios(`/api/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = response.data;

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
        <div className="flex h-screen w-full items-center justify-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {!loading && (
        <>
          {quizType === "regular" && <DetailRegularQuiz quiz={quiz} />}
          {quizType === "sectioned" && <DetailSectionedQuiz quiz={quiz} />}
        </>
      )}
    </>
  );
};

export default DetailQuiz;
