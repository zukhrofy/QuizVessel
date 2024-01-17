// import third library
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// use context hooks
import useAuthContext from "@/hooks/auth/useAuthContext";
// import yup schema and default value
import { regularSchema } from "@/schema/quizSchema";
// import local library
import { useEffect, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

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
      const response = await axios.patch(`/api/quiz/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        navigate("/quiz");
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

  useEffect(() => {
    window.katex = katex;
  }, []);

  // module for react-quill
  const quillQuestionModules = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["formula"],
    ],
  };

  return (
    // container
    <div className="flex h-screen w-full">
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
                  className={`w-full rounded border border-gray-300 px-4 py-2 ${
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
                    className={`w-24 rounded border border-gray-500 px-4 py-2 ${
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
                className="my-5 border border-slate-400 bg-gray-100 px-20 py-10"
                id={`question-${index}`}
              >
                {/* question id */}
                <input
                  type="hidden"
                  value={index}
                  {...register(`questions[${index}].questionId`)}
                />
                {/* question number and delete question */}
                <div className="mb-6 flex items-center justify-between">
                  {/* question number */}
                  <h1 className="text-3xl font-semibold">
                    Question {index + 1}
                  </h1>
                  {/* delete question */}
                  {questionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-3xl"
                    >
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
              className="mb-4 w-full rounded border bg-indigo-500 py-3 text-white"
            >
              Add Question
            </button>
            {/* error ketika pertanyaan kurang dari 2 */}
            <span className="mb-4 text-red-400">
              {errors.questions?.message}
            </span>
            <div className="flex justify-center">
              <button
                className="flex w-1/2 items-center justify-center rounded bg-green-600 px-4 py-2 text-white"
                type="submit"
              >
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
    <aside className="bg-blue-300 p-6">
      <h2 className="mb-3 text-xl font-semibold">Question Pointer</h2>
      <div className="grid grid-cols-3 gap-3">
        {questionFields.map((question, index) => (
          <div
            key={question.id}
            onClick={() =>
              document.getElementById(`question-${index}`).scrollIntoView()
            }
            className="cursor-pointer rounded-lg bg-white px-3 py-2 font-semibold"
          >
            Q {index + 1}
          </div>
        ))}
      </div>
    </aside>
  );
};

const TopNav = ({ user }) => {
  return (
    <header className="sticky top-0 flex w-full items-center justify-between bg-white px-6 py-2 shadow-md">
      <h3 className="text-lg font-semibold">Create Regular Quiz</h3>
      {user && (
        <div className="flex items-center gap-2">
          <span>{user.username}</span>
          <Link
            to="/quiz"
            className="rounded border bg-indigo-500 px-6 py-2 text-white"
          >
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
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["formula"],
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
                className="flex cursor-pointer bg-green-100 p-4 text-sm font-medium shadow-sm peer-checked:bg-green-500"
              >
                &#10004;
              </label>
            </div>
            {/* button untuk mengurangi option */}
            {answerField.length > 1 && (
              <button
                type="button"
                onClick={() => removeAnswer(answerIndex)}
                className="bg-white p-4 text-sm font-medium"
              >
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
          <div className="mb-3 ml-8 text-sm text-red-400">
            {errors.questions?.[questionIndex]?.answer?.message}
          </div>
        </div>
      ))}

      {/* tombol untuk tambah answer */}
      <button
        type="button"
        onClick={() => appendAnswer("option")}
        className="py-2 text-xl font-semibold text-indigo-700"
      >
        + option
      </button>
    </div>
  );
};

export default EditRegularQuiz;
