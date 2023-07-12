// import third library
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextareaAutosize from "react-textarea-autosize";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// use context hooks
import useAuthContext from "../../hooks/useAuthContext";
// yup schema and default value
import { sectionedQuizValue, sectionedSchema } from "../../schemas/quizSchema";
// import local library
import { useState } from "react";

const CreateSectionedQuiz = () => {
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
    defaultValues: sectionedQuizValue,
  });

  const navigate = useNavigate();
  const { user } = useAuthContext();

  // array of section config
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = async (data) => {
    if (!user) {
      navigate("auth/login");
    }

    try {
      setIsSubmitting(true);
      // send request
      const response = await axios.post("/quiz", data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 200) {
        reset();
        setIsSubmitting(false);
        navigate("/dashboard/library");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <div className="flex w-full h-screen">
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
                className={`w-1/2 px-4 py-2 border border-gray-300 rounded ${
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
                className="my-5 p-10 bg-gray-100 border border-slate-400"
                id={`sections-${sectionIndex}`}>
                {/* section id */}
                <input
                  type="hidden"
                  value={sectionIndex}
                  {...register(`sections[${sectionIndex}].sectionId`)}
                />
                {/* section number and delete section */}
                <div className="flex justify-between items-center mb-6">
                  {/* section number */}
                  <h1 className="text-3xl font-semibold">
                    Section {sectionIndex + 1}
                  </h1>
                  {/* delete section */}
                  {sectionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-3xl">
                      x
                    </button>
                  )}
                </div>
                {/* section title and section time limit */}
                <div className="flex justify-between mb-4">
                  {/* section title */}
                  <div className="flex flex-col">
                    <label>Section Title</label>
                    <TextareaAutosize
                      {...register(`sections[${sectionIndex}].sectionTitle`)}
                      className={`px-4 py-2 rounded ${
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
                        className={`w-1/2 p-2 border border-gray-300 rounded ${
                          errors.sections?.[sectionIndex]?.sectionTimeLimit
                            ? "border border-red-400"
                            : "border-0"
                        }`}
                        {...register(
                          `sections[${sectionIndex}].sectionTimeLimit`
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
              className="w-full mb-4 py-3 text-white bg-blue-500 border rounded">
              Add Section
            </button>

            {/* submit button */}
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

const Sidebar = ({ sectionFields }) => {
  return (
    <aside className="p-6 bg-blue-300">
      <h2 className="mb-3 text-xl font-semibold">Section Pointer</h2>
      <div className="grid grid-cols-3 gap-3">
        {sectionFields.map((section, index) => (
          <div
            key={section.id}
            onClick={() =>
              document.getElementById(`sections-${index}`).scrollIntoView()
            }
            className="px-3 py-2 font-semibold bg-white rounded-lg cursor-pointer">
            S {index + 1}
          </div>
        ))}
      </div>
    </aside>
  );
};

const TopNav = ({ user }) => {
  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-6 py-2 bg-white shadow-md">
      <h3 className="text-lg font-semibold">Create Sectioned Quiz</h3>
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
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
    ],
  };

  return (
    <div>
      {questionSetFields.map((question, questionIndex) => (
        <div
          key={question.id}
          className="mb-2 p-10 bg-white border border-slate-400">
          {/* question id */}
          <input
            type="hidden"
            value={questionIndex}
            {...register(
              `sections.${sectionIndex}.questionSet[${questionIndex}].questionId`
            )}
          />
          <div className="flex justify-between items-center mb-1">
            {/* question number */}
            <h1 className="text-xl font-semibold">
              Question {questionIndex + 1}
            </h1>
            {/* delete question */}
            {questionSetFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestionSet(questionIndex)}
                className="text-2xl">
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
        className="w-full py-3 text-white bg-indigo-500 border rounded">
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
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
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
                  `sections[${sectionIndex}].questionSet[${questionIndex}].correctAnswer`
                )}
                class="peer hidden"
              />
              <label
                for={`${sectionIndex}-${questionIndex}-correct-${answerIndex}`}
                class="flex p-4 text-sm font-medium bg-green-100 shadow-sm cursor-pointer peer-checked:bg-green-500">
                &#10004;
              </label>
            </div>
            {/* button mengurangi answer */}
            {answerFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeAnswer(answerIndex)}
                className="p-4 text-sm font-medium bg-slate-200">
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
          <div className="ml-8 mb-3 text-sm text-red-400">
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
        className="block py-2 text-xl font-semibold text-indigo-700">
        + option
      </button>
    </div>
  );
};

export default CreateSectionedQuiz;
