// import third library
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// use context hooks
import useAuthContext from "../../hooks/useAuthContext";
// import yup schema and default value
import { regularSchema } from "../../schemas/quizSchema";
// import local library
import { useEffect, useState } from "react";

const EditRegularQuiz = ({ quiz }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // array of question config
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(regularSchema),
    defaultValues: quiz,
  });

  useEffect(() => {
    reset(quiz);
  }, [quiz, reset]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();

  // event handle submit form
  const onSubmit = async (data) => {
    if (!user) {
      navigate("auth/login");
    }

    try {
      setIsSubmitting(true);
      const response = await axios.patch(`/quiz/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        navigate("/dashboard/library");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // event ketika error submit form
  const onError = (err) => console.log(err);

  // array of question config
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  // module for react-quill
  const quillQuestionModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
    ],
  };

  return (
    // container
    <div className="flex w-full h-screen">
      {/* sidebar */}
      <Sidebar questionFields={questionFields} />
      {/* main div */}
      <div className="grow overflow-y-auto">
        {/* top navbar */}
        <TopNav user={user} />
        {/* regular quiz form */}
        <main className="p-10">
          {/* form */}
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input type="hidden" {...register("quiz_type")} />
            {/* title and time limit */}
            <div className="grid grid-cols-2">
              {/* title */}
              <div>
                <input
                  type="text"
                  placeholder="Nama Kuis"
                  {...register("title")}
                  className={`w-full px-4 py-2 border border-gray-300 rounded ${
                    errors?.title && "border-red-400"
                  }`}
                />
                {/* title error */}
                <div className="text-sm text-red-400">
                  {errors?.title?.message}
                </div>
              </div>
              {/* time limit */}
              <div className="ml-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Waktu pengerjaan"
                    {...register("time_limit")}
                    className={`w-24 px-4 py-2 border border-gray-500 rounded ${
                      errors?.time_limit && "border-red-400"
                    }`}
                  />
                  <span>Menit</span>
                </div>
                <span className="text-sm text-red-400">
                  {errors.time_limit?.message}
                </span>
              </div>
            </div>

            {/* question items */}
            {questionFields.map((question, index) => (
              <div
                key={question.id}
                className="my-5 px-20 py-10 bg-gray-100 border border-slate-400"
                id={`question-${index}`}>
                {/* question id */}
                <input
                  type="hidden"
                  value={index}
                  {...register(`questions[${index}].questionId`)}
                />
                {/* question number and delete question */}
                <div className="flex justify-between items-center mb-6">
                  {/* question number */}
                  <h1 className="text-3xl font-semibold">
                    Question {index + 1}
                  </h1>
                  {/* delete question */}
                  {questionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-3xl">
                      x
                    </button>
                  )}
                </div>
                {/* question text */}
                <Controller
                  control={control}
                  name={`questions.${index}.questionText`}
                  render={({ field }) => (
                    <ReactQuill
                      className={`bg-white ${
                        errors.questions?.[index]?.questionText
                          ? "border border-red-400"
                          : "border-0"
                      }`}
                      placeholder="Type your question.."
                      value={field.value}
                      onChange={field.onChange}
                      modules={quillQuestionModules}
                    />
                  )}
                />
                {/* question text error */}
                <span className="text-sm text-red-400">
                  {errors.questions?.[index]?.questionText?.message}
                </span>
                {/* answer items */}
                <NestedAnswer
                  questionIndex={index}
                  {...{ control, register, errors }}
                />
                {/* remove question */}
              </div>
            ))}
            {/* tambah pertanyaan */}
            <button
              type="button"
              onClick={() =>
                appendQuestion({
                  questionText: "",
                  answer: ["Option 1"],
                  correctAnswer: "",
                })
              }
              className="w-full mb-4 py-3 text-white bg-indigo-500 border rounded">
              Add Question
            </button>
            {/* error ketika pertanyaan kurang dari 2 */}
            <span className="mb-4 text-red-400">
              {errors.questions?.message}
            </span>
            <div className="flex justify-center">
              <button
                className="flex justify-center items-center w-1/2 px-4 py-2 text-white bg-green-600 rounded"
                type="submit">
                <span>Submit</span>
                {isSubmitting && (
                  <ClipLoader color="#ffffff" loading={isSubmitting} />
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ questionFields }) => {
  return (
    <aside className="p-6 bg-blue-300">
      <h2 className="mb-3 text-xl font-semibold">Question Pointer</h2>
      <div className="grid grid-cols-3 gap-3">
        {questionFields.map((question, index) => (
          <div
            key={question.id}
            onClick={() =>
              document.getElementById(`question-${index}`).scrollIntoView()
            }
            className="px-3 py-2 font-semibold bg-white rounded-lg cursor-pointer">
            Q {index + 1}
          </div>
        ))}
      </div>
    </aside>
  );
};

const TopNav = ({ user }) => {
  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-6 py-2 bg-white shadow-md">
      <h3 className="text-lg font-semibold">Create Regular Quiz</h3>
      {user && (
        <div className="flex items-center gap-2">
          <span>{user.username}</span>
          <Link
            to="/dashboard/library"
            className="px-6 py-2 text-white bg-indigo-500 border rounded">
            <span className="text-sm font-medium">back</span>
          </Link>
        </div>
      )}
    </header>
  );
};

const NestedAnswer = ({ questionIndex, control, register, errors }) => {
  const {
    fields: answerField,
    remove: removeAnswer,
    append: appendAnswer,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answer`,
  });

  const answerLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index];
  };

  const quillAnswerModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
    ],
  };

  return (
    <div className="py-4">
      {answerField.map((answer, answerIndex) => (
        <div key={answer.id}>
          <div className="flex items-center">
            {/* letter */}
            <span className="mr-4">{answerLetter(answerIndex)}</span>
            {/* answer text */}
            <Controller
              control={control}
              name={`questions.${questionIndex}.answer.${answerIndex}`}
              render={({ field }) => (
                <ReactQuill
                  className={`w-1/2 bg-white ${
                    errors.questions?.[questionIndex]?.answer?.[answerIndex]
                      ? "border border-red-400"
                      : "border-0"
                  }`}
                  placeholder="Type your answer.."
                  value={field.value}
                  onChange={field.onChange}
                  modules={quillAnswerModules}
                />
              )}
            />
            {/* input radio untuk correct answer */}
            <div>
              <input
                type="radio"
                id={`${questionIndex}-correct-${answerIndex}`}
                value={answerIndex}
                {...register(`questions.${questionIndex}.correctAnswer`)}
                className="peer hidden"
              />
              <label
                htmlFor={`${questionIndex}-correct-${answerIndex}`}
                className="flex p-4 text-sm font-medium bg-green-100 shadow-sm cursor-pointer peer-checked:bg-green-500">
                &#10004;
              </label>
            </div>
            {/* button untuk mengurangi option */}
            {answerField.length > 1 && (
              <button
                type="button"
                onClick={() => removeAnswer(answerIndex)}
                className="p-4 text-sm font-medium bg-white">
                X
              </button>
            )}
            {/* error ketika tidak ada jawaban benar yang dipilih */}
            {answerIndex === 0 && (
              <div className="ml-4 text-sm text-red-400">
                {errors.questions?.[questionIndex]?.correctAnswer?.message}
              </div>
            )}
          </div>
          {/* error ketika answer kosong */}
          <div className="ml-8 text-sm text-red-400">
            {errors.questions?.[questionIndex]?.answer?.[answerIndex]?.message}
          </div>
          {/* error ketika pilihan option kurang dari 2 */}
          <div className="ml-8 mb-3 text-sm text-red-400">
            {errors.questions?.[questionIndex]?.answer?.message}
          </div>
        </div>
      ))}

      {/* tombol untuk tambah answer */}
      <button
        type="button"
        onClick={() => appendAnswer("option")}
        className="py-2 text-xl font-semibold text-indigo-700">
        + option
      </button>
    </div>
  );
};

export default EditRegularQuiz;
