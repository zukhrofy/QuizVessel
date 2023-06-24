const Participant = require("../models/ParticipantModels");
const Report = require("../models/ReportModels");

const getPlayQuizDetail = async (req, res) => {
  console.log("masuk review quiz");

  const tokenQuiz = req.params.quizToken;
  const report = await Report.findOne({ token: tokenQuiz });

  res.status(200).json(report);
};

const playQuizStart = async (req, res) => {
  const tokenQuiz = req.params.quizToken;
  const user_id = req.user._id;

  const report = await Report.findOne({ token: tokenQuiz });

  // check apakah sudah pernah mengikuti ujian
  const checkParticipants = await Report.findOne({ token: tokenQuiz }).populate(
    {
      path: "participant",
      match: { user_id: user_id },
    }
  );

  if (checkParticipants.participant.length > 0) {
    return res.status(200).json({ response: "telahMengikutiUjian" });
  }

  // check quiz sudah di mark selesai / melewati deadline
  if (report.finished) {
    return res.status(200).json({ response: "ujianSelesai" });
  }

  // lanjut saat user belum masuk quiz
  // create participant
  const createParticipant = await Participant.create({
    user_id,
    report: checkParticipants._id,
  });

  // push participant pada report
  const pushParticipant = await Report.findOneAndUpdate(
    { token: tokenQuiz },
    {
      $push: {
        participant: createParticipant._id,
      },
    }
  );

  // get report with participant
  const reportWithParticipant = await Report.findOne({
    participant: createParticipant._id,
  }).populate({
    path: "participant",
    match: { user_id },
  });

  return res.status(200).json(reportWithParticipant);
};

const getQuizResult = async (req, res) => {
  const tokenQuiz = req.params.quizToken;
  const user_id = req.user._id;

  const participantResult = await Report.findOne({ token: tokenQuiz }).populate(
    {
      path: "participant",
      match: { user_id: user_id },
    }
  );
  return res.status(200).json(participantResult);
};

const processSubmit = async (req, res) => {
  console.log("process submit kuis");
  // process submit
  const tokenQuiz = req.params.quizToken;
  const user_id = req.user._id;
  // jawaban peserta
  const quizResponse = req.body;

  // get the assigned quiz
  const report = await Report.findOne({
    token: tokenQuiz,
  });

  const quizQuestion = report.questions || report.sections;

  // compare the answer
  const results = {};
  let nilaiAkhir;

  // if regular quiz
  if (report.quiz_type === "regular") {
    let score = 0;
    quizQuestion.forEach((question) => {
      const { questionId, correctAnswer } = question;
      const userAnswer = quizResponse[questionId] || null;
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        score++;
      }
      results[questionId] = {
        selectedAnswer: userAnswer,
        isCorrect,
      };
    });
    nilaiAkhir = (score / report.questions.length) * 100;
    // update participant status and result
    const participant = await Participant.findOneAndUpdate(
      { report: report._id, user_id },
      { finished: true, result: { ...results }, nilaiAkhir }
    );

    // if sectioned quiz
  } else if (report.quiz_type == "sectioned") {
    console.log(quizQuestion);
    quizQuestion.forEach((section) => {
      const { sectionId, questionSet } = section;
      const sectionAnswers = quizResponse[sectionId] || null;

      results[sectionId] = {};

      questionSet.forEach((question) => {
        const { questionId, correctAnswer } = question;
        const userAnswer = sectionAnswers[questionId]
          ? sectionAnswers[questionId]
          : null;
        const isCorrect = userAnswer === correctAnswer;

        results[sectionId][questionId] = {
          selectedAnswer: userAnswer,
          isCorrect,
        };
      });
    });
    // update participant status and result
    const participant = await Participant.findOneAndUpdate(
      { report: report._id, user_id },
      { finished: true, result: { ...results } }
    );
  }

  // send back to frontend
  return res.status(200).json({ response: "baruSiapUjian" });
};

module.exports = {
  getPlayQuizDetail,
  playQuizStart,
  processSubmit,
  getQuizResult,
};
