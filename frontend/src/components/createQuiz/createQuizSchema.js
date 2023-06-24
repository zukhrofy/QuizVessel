import * as yup from "yup";
import "../../utils/yupLocale";

export const regularSchema = yup
  .object({
    title: yup.string().required("nama kuis tidak boleh kosong"),
    time_limit: yup
      .number()
      .typeError("tidak boleh kosong")
      .min(30, "minimal 30 menit")
      .nullable(),
    questions: yup
      .array(
        yup.object({
          questionId: yup.string(),
          questionText: yup.string().required("pertanyaan tidak boleh kosong"),
          answer: yup
            .array()
            .of(yup.string().required("option tidak boleh kosong"))
            .required()
            .min(2, "minimal dua option jawaban!"),
          correctAnswer: yup
            .string()
            .required("pilih salah satu jawaban yang benar")
            .nullable(),
        })
      )
      .required()
      .min(2, "minimal dua soal disediakan"),
  })
  .required();

export const regularQuizValue = {
  quiz_type: "regular",
  title: "",
  time_limit: 0,
  questions: [
    {
      questionText: "",
      answer: ["option 1", "option 2"],
    },
    {
      questionText: "",
      answer: ["option 1", "option 2"],
    },
  ],
};

export const sectionedSchema = yup
  .object({
    title: yup.string().required("nama kuis tidak boleh kosong"),
    sections: yup
      .array(
        yup.object({
          sectionId: yup.string(),
          sectionTitle: yup
            .string()
            .required("judul section tidak boleh kosong"),
          sectionTimeLimit: yup
            .number("time limit section tidak boleh kosong")
            .required()
            .min(5, "section time minimal 5 menit"),
          questionSet: yup
            .array(
              yup.object({
                questionId: yup.string(),
                questionText: yup
                  .string()
                  .required("pertanyaan tidak boleh kosong"),
                answer: yup
                  .array()
                  .of(yup.string().required("option tidak boleh kosong"))
                  .required()
                  .min(2, "minimal dua option jawaban!"),
                correctAnswer: yup
                  .string()
                  .required("pilih salah satu jawaban yang benar")
                  .nullable(),
              })
            )
            .required()
            .min(2, "minimal dua soal"),
        })
      )
      .required()
      .min(2, "minimal dua section"),
  })
  .required();

export const sectionedQuizValue = {
  title: "",
  quiz_type: "sectioned",
  sections: [
    {
      sectionTitle: "",
      sectionTimeLimit: 0,
      questionSet: [
        {
          questionText: "",
          answer: ["option 1", "option 2"],
        },
      ],
    },
  ],
};
