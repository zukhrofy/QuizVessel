// local library
import { useEffect, useState } from "react";
// use context hook
import { useAuthContext } from "../../contexts/authContext";
// third library
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
// import component
import PlayRegulerQuiz from "./PlayRegulerQuiz";
import PlaySectionedQuiz from "./PlaySectionedQuiz";

const PlayQuizStart = () => {
  const { quizToken } = useParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState({});

  const navigate = useNavigate();

  // use effect ketika awal start quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      // get response from server
      try {
        const response = await axios(`/play/${quizToken}/start/`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          // take response data
          const data = await response.data;
          // if the user have enter the quiz before
          if (data.response === "telahMengikutiUjian") {
            // navigate to result page
            return navigate(`/play/${quizToken}/finish`);
          }
          // jika quiz marked as finished
          if (data.response === "ujianSelesai") {
            // navigate to preview page
            return navigate(`/play/${quizToken}/preview`);
          }
          // if not above condition
          setQuiz(data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err.response.data.error);
      }
    };

    if (user) {
      fetchQuiz();
    }
  }, [user, quizToken]);

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex justify-center items-center">
          <RingLoader color="#007BFF" loading={loading} size={150} />
        </div>
      )}
      {!loading && quiz.quiz_type === "regular" && (
        <PlayRegulerQuiz quiz={quiz} quizToken={quizToken} />
      )}
      {!loading && quiz.quiz_type === "sectioned" && (
        <PlaySectionedQuiz quiz={quiz} quizToken={quizToken} />
      )}
    </>
  );
};

export default PlayQuizStart;
