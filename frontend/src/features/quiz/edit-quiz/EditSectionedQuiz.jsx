// import third library
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextareaAutosize from "react-textarea-autosize";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import useContext hooks
import useAuthContext from "@/hooks/auth/useAuthContext";
// import yup schema and default value
import { sectionedSchema } from "@/schema/quizSchema";
// import local library
import { useEffect, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const EditSectionedQuiz = ({ quiz }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // react hook form config
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(sectionedSchema),
    defaultValues: quiz,
  });

  useEffect(() => {
    reset(quiz);
  }, [quiz, reset]);

  useEffect(() => {
    window.katex = katex;
  }, []);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();

  // array of section config
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  // event handle submit form
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    if (!user) {
      return;
    }

    try {
      const response = await axios.patch(`/api/quiz/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        // jika sukses redirect ke library
        navigate("/quiz");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // event ketika error submit form
  const onError = (err) => console.log(err);

  return (
    <div className="flex h-screen w-full">
      {/* sidebar */}
      <Sidebar sectionFields={sectionFields} />
      {/* main */}
      <div className="relative grow overflow-y-auto">
        {/* top nav */}
        <TopNav user={user} />
        {/* main form */}
        <main className="p-10">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input type="hidden" {...register(`quiz_type`)} />
            {/* title / nama kuis */}
            <div>
              <input
                type="text"
                placeholder="Nama kuis"
                {...register("title")}
                className={`w-1/2 rounded border border-gray-300 px-4 py-2 ${
                  errors?.title && "border-red-400"
                }`}
              />
              {/* title error */}
              <div className="text-sm text-red-400">
                {errors?.title?.message}
              </div>
            </div>

            {/* sections items */}
            {sectionFields.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="my-5 border border-slate-400 bg-gray-100 p-10"
                id={`sections-${sectionIndex}`}
              >
                {/* section id */}
                <input
                  type="hidden"
                  value={sectionIndex}
                  {...register(`sections[${sectionIndex}].sectionId`)}
                />
                {/* section number and delete section */}
                <div className="mb-6 flex items-center justify-between">
                  {/* section number */}
                  <h1 className="text-3xl font-semibold">
                    Section {sectionIndex + 1}
                  </h1>
                  {/* delete section */}
                  {sectionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-3xl"
                    >
                      x
                    </button>
                  )}
                </div>
                {/* section title and section time limit */}
                <div className="mb-4 flex justify-between">
                  {/* section title */}
                  <div className="flex flex-col">
                    <label>Section Title</label>
                    <TextareaAutosize
                      {...register(`sections[${sectionIndex}].sectionTitle`)}
                      className={`rounded px-4 py-2 ${
                        errors.sections?.[sectionIndex]?.sectionTitle
                          ? "border border-red-400"
                          : "border-0"
                      }`}
                      minRows={1}
                      maxRows={2}
                      placeholder="section title"
                    />
                    {/* error ketika title section kosong */}
                    <span className="text-red-500">
                      {errors?.sections?.[sectionIndex]?.sectionTitle?.message}
                    </span>
                  </div>
                  {/* section time limit */}
                  <div className="flex flex-col">
                    <label>Section Time</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className={`w-1/2 rounded border border-gray-300 p-2 ${
                          errors.sections?.[sectionIndex]?.sectionTimeLimit
                            ? "border border-red-400"
                            : "border-0"
                        }`}
                        {...register(
                          `sections[${sectionIndex}].sectionTimeLimit`,
                        )}
                      />
                      <span>Menit</span>
                    </div>
                    {/* error ketika time limit section kosong */}
                    <span className="text-red-500">
                      {
                        errors?.sections?.[sectionIndex]?.sectionTimeLimit
                          ?.message
                      }
                    </span>
                  </div>
                </div>
                {/* question sets */}
                <NestedSoal
                  sectionIndex={sectionIndex}
                  {...{ control, register, errors }}
                />
              </div>
            ))}
            {/* error ketika section hanya satu */}
            <div className="text-red-500">{errors?.sections?.message}</div>
            {/* add section button */}
            <button
              type="button"
              onClick={() =>
                appendSection({
                  sectionTitle: "",
                  sectionTimeLimit: 0,
                  questionSet: [
                    {
                      questionText: "",
                      answer: ["option 1", "option 2"],
                    },
                  ],
                })
              }
              className="mb-4 w-full rounded border bg-blue-500 py-3 text-white"
            >
              Add Section
            </button>

            {/* submit button */}
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

const Sidebar = ({ sectionFields }) => {
  return (
    <aside className="bg-blue-300 p-6">
      <h2 className="mb-3 text-xl font-semibold">Section Pointer</h2>
      <div className="grid grid-cols-3 gap-3">
        {sectionFields.map((section, index) => (
          <div
            key={section.id}
            onClick={() =>
              document.getElementById(`sections-${index}`).scrollIntoView()
            }
            className="cursor-pointer rounded-lg bg-white px-3 py-2 font-semibold"
          >
            S {index + 1}
          </div>
        ))}
      </div>
    </aside>
  );
};

const TopNav = ({ user }) => {
  return (
    <header className="sticky top-0 flex w-full items-center justify-between bg-white px-6 py-2 shadow-md">
      <h3 className="text-lg font-semibold">Create Sectioned Quiz</h3>
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

const NestedSoal = ({ sectionIndex, control, register, errors }) => {
  // array of question config
  const {
    fields: questionSetFields,
    append: appendQuestionSet,
    remove: removeQuestionSet,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questionSet`,
  });

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
    <div>
      {questionSetFields.map((question, questionIndex) => (
        <div
          key={question.id}
          className="mb-2 border border-slate-400 bg-white p-10"
        >
          {/* question id */}
          <input
            type="hidden"
            value={questionIndex}
            {...register(
              `sections.${sectionIndex}.questionSet[${questionIndex}].questionId`,
            )}
          />
          <div className="mb-1 flex items-center justify-between">
            {/* question number */}
            <h1 className="text-xl font-semibold">
              Question {questionIndex + 1}
            </h1>
            {/* delete question */}
            {questionSetFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestionSet(questionIndex)}
                className="text-2xl"
              >
                x
              </button>
            )}
          </div>
          {/* question text */}
          <Controller
            control={control}
            name={`sections[${sectionIndex}].questionSet[${questionIndex}].questionText`}
            render={({ field }) => (
              <ReactQuill
                className={`bg-white ${
                  errors?.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                    ?.questionText && "border border-red-400"
                }`}
                placeholder="Type your question.."
                value={field.value}
                onChange={field.onChange}
                modules={quillQuestionModules}
              />
            )}
          />
          <span className="text-sm text-red-500">
            {
              errors?.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                ?.questionText?.message
            }
          </span>
          {/* Add answer options and correct answer fields */}
          <NestedAnswer
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
            {...{ control, register, errors }}
          />
        </div>
      ))}
      {/* error ketika question kurang dari dua */}
      <div className="text-red-500">
        {errors?.sections?.[sectionIndex]?.questionSet?.message}
      </div>
      {/* button untuk tambah question */}
      <button
        type="button"
        onClick={() =>
          appendQuestionSet({
            questionText: "",
            answer: ["option 1", "option 2"],
            correctAnswer: "",
          })
        }
        className="w-full rounded border bg-indigo-500 py-3 text-white"
      >
        Add Question
      </button>
    </div>
  );
};

const NestedAnswer = ({
  sectionIndex,
  questionIndex,
  control,
  register,
  errors,
}) => {
  // array of question config
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questionSet.${questionIndex}.answer`,
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
      {answerFields.map((answer, answerIndex) => (
        <div key={answer.id}>
          <div className="flex items-center">
            {/* letter */}
            <span className="mr-4">{answerLetter(answerIndex)}</span>
            {/* option text */}
            <Controller
              control={control}
              name={`sections[${sectionIndex}].questionSet[${questionIndex}].answer[${answerIndex}]`}
              render={({ field }) => (
                <ReactQuill
                  className={`w-1/2 bg-white ${
                    errors?.sections?.[sectionIndex]?.questionSet?.[
                      questionIndex
                    ]?.answer?.[answerIndex] && "border border-red-400"
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
                id={`${sectionIndex}-${questionIndex}-correct-${answerIndex}`}
                value={answerIndex}
                {...register(
                  `sections[${sectionIndex}].questionSet[${questionIndex}].correctAnswer`,
                )}
                className="peer hidden"
              />
              <label
                for={`${sectionIndex}-${questionIndex}-correct-${answerIndex}`}
                className="flex cursor-pointer bg-green-100 p-4 text-sm font-medium shadow-sm peer-checked:bg-green-500"
              >
                &#10004;
              </label>
            </div>
            {/* button mengurangi answer */}
            {answerFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeAnswer(answerIndex)}
                className="bg-slate-200 p-4 text-sm font-medium"
              >
                -
              </button>
            )}
            {/* error ketika tidak memmilih correct answer */}
            {answerIndex === 0 && (
              <div className="ml-4 text-sm text-red-400">
                {
                  errors.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                    ?.correctAnswer?.message
                }
              </div>
            )}
          </div>
          {/* error ketika option text kosong */}
          <div className="ml-8 text-sm text-red-400">
            {
              errors?.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                ?.answer?.[answerIndex]?.message
            }
          </div>
          {/* error ketika option kurang dari dua */}
          <div className="mb-3 ml-8 text-sm text-red-400">
            {
              errors?.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                ?.answer?.message
            }
          </div>
        </div>
      ))}

      {/* tombol untuk tambah answer */}
      <button
        type="button"
        onClick={() => appendAnswer("option")}
        className="block py-2 text-xl font-semibold text-indigo-700"
      >
        + option
      </button>
    </div>
  );
};

export default EditSectionedQuiz;
