// import third library
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import ClipLoader from "react-spinners/ClipLoader";
// import useContext hooks
import useAuthContext from "../../hooks/useAuthContext";
// import yup schema and default value
import { sectionedSchema } from "./editQuizSchema";
// import local library
import { useEffect, useState } from "react";

export const EditSectionedQuiz = ({ quiz }) => {
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
      const response = await axios.patch(`/quiz/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        // jika sukses redirect ke library
        navigate("/dashboard/library");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  // event ketika error submit form
  const onError = (err) => console.log(err);

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
                className={`w-1/2 mb-3 px-4 py-2 border border-gray-300 rounded ${
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
                id={`section-${sectionIndex}`}
                className="my-5 p-10 bg-gray-100 border shadow-xl rounded">
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
                    <label className="mb-1">Section Title</label>
                    <TextareaAutosize
                      {...register(`sections[${sectionIndex}].sectionTitle`)}
                      className="px-4 py-2 border border-gray-300 rounded"
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
                    <label className="mb-1">Section Time</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="p-2 border border-gray-300 rounded"
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
            <div className="text-red-500 mt-1">{errors?.sections?.message}</div>
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
              className="text-blue-500">
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
    <aside className="bg-blue-300 p-6">
      <div className=" grid grid-cols-2 gap-3">
        {sectionFields.map((question, index) => (
          <div
            key={question.id}
            onClick={() =>
              document.getElementById(`section-${index}`).scrollIntoView()
            }
            className="px-4 py-2 font-semibold bg-white rounded-lg cursor-pointer">
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
      <h3 className="text-lg font-semibold">Edit Sectioned Quiz</h3>
      {user && (
        <div className="flex items-center gap-2">
          <span>{user.username}</span>
          <Link
            to="/dashboard/library"
            className="px-6 py-2 text-white bg-indigo-300 hover:bg-indigo-500 border rounded">
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

  return (
    <div>
      {questionSetFields.map((question, questionIndex) => (
        <>
          <div
            key={question.id}
            className="bg-white mb-2 p-10 border shadow-md rounded">
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
                  className="text-3xl">
                  x
                </button>
              )}
            </div>
            {/* question id */}
            <input
              type="hidden"
              value={questionIndex}
              {...register(
                `sections.${sectionIndex}.questionSet[${questionIndex}].questionId`
              )}
            />
            {/* question text */}
            <TextareaAutosize
              {...register(
                `sections[${sectionIndex}].questionSet[${questionIndex}].questionText`
              )}
              className="w-full p-3 border border-gray-500 rounded"
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
        </>
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
        className="text-blue-500">
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

  const getAnswerLetter = (index) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index];
  };

  return (
    <div className="py-4">
      {answerFields.map((answer, answerIndex) => (
        <div key={answer.id}>
          <div className="flex items-center">
            {/* letter */}
            <span>{getAnswerLetter(answerIndex)}</span>
            {/* option text */}
            <TextareaAutosize
              {...register(
                `sections[${sectionIndex}].questionSet[${questionIndex}].answer[${answerIndex}]`
              )}
              minRows={1}
              maxRows={4}
              className="w-1/2 ml-4 px-4 py-3 border border-gray-400 rounded"
              placeholder={`option ${answerIndex + 1}`}
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
              <div className="text-sm text-red-400">
                {
                  errors.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                    ?.correctAnswer?.message
                }
              </div>
            )}
          </div>
          {/* error ketika option text kosong */}
          <span className="ml-8 text-red-500">
            {
              errors?.sections?.[sectionIndex]?.questionSet?.[questionIndex]
                ?.answer?.[answerIndex]?.message
            }
          </span>
          {/* error ketika option kurang dari dua */}
          <div className="text-red-500">
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
