import axios from "axios";
import { useNavigate } from "react-router-dom";

export const createQuiz = async (data, user) => {
  const navigate = useNavigate();
  try {
    const response = await axios.post("/quiz", data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.status === 200) {
      console.log("new quiz added: ", data);
      reset(); // Reset the form after submission
      navigate("/dashboard/library");
    }
  } catch (error) {
    console.log("gagal post bro");
  }
};
