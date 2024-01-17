const Participant = require("../models/ParticipantModels");
const Report = require("../models/ReportModels");

// quiz preview
const getPlayQuizPreview = async (req, res) => {
  const quizToken = req.params.quizToken;
  const assignedQuiz = await Report.findOne({ token: quizToken });

  // cek apakah token tersedia
  if (!assignedQuiz) return res.status(404).json({ error: "quiz not found" });

  // check ketersediaan quiz
  const isFinished = assignedQuiz.finished;
  if (isFinished) {
    return res.status(403).json({
      error: {
        message: "Maaf Quiz Telah Melewati Deadline",
        description:
          "Batas waktu untuk quiz ini telah berakhir. Anda tidak dapat bergabung lagi.",
      },
    });
  }

  // jika quiz masih bisa diakses
  return res.status(200).json(assignedQuiz);
};

// quiz start
const playQuizStart = async (req, res) => {
  const quizToken = req.params.quizToken;
  const user_id = req.user._id;

  // get assigned quiz
  const assignedQuiz = await Report.findOne({ token: quizToken });

  // check quiz sudah di mark selesai / melewati deadline
  if (assignedQuiz.finished) {
    return res.status(200).json({ response: "ujianSelesai" });
  }

  // check apakah participant sudah pernah mengikuti quiz
  const participant = await Report.findOne({ token: quizToken }).populate({
    path: "participant",
    match: { user_id: user_id },
  });

  if (participant.participant.length > 0) {
    return res.status(200).json({ response: "telahMengikutiUjian" });
  }

  // proses saat user belum mengikuti quiz
  // create participant
  const createParticipant = await Participant.create({
    user_id,
    report: assignedQuiz._id,
  });

  // push participant pada quiz yang telah di assign
  const pushParticipant = await Report.findOneAndUpdate(
    { token: quizToken },
    {
      $push: {
        participant: createParticipant._id,
      },
    }
  );

  // send quiz to user
  return res.status(200).json(assignedQuiz);
};

// process submit
const processSubmit = async (req, res) => {
  const quizToken = req.params.quizToken;
  const user_id = req.user._id;
  // jawaban peserta
  const quizResponse = req.body;

  // get the assigned quiz
  const report = await Report.findOne({
    token: quizToken,
  });

  // comparation of regular quiz
  if (report.quiz_type === "regular") {
    const quizQuestion = report.questions;
    const results = {};
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

    const nilaiAkhir = parseFloat(
      ((score / report.questions.length) * 100).toFixed(2)
    );

    // update participant status and result
    const participant = await Participant.findOneAndUpdate(
      { report: report._id, user_id },
      { finished: true, result: { ...results }, nilaiAkhir }
    );
  }

  // comparation if sectioned quiz
  if (report.quiz_type == "sectioned") {
    const quizSection = report.sections;
    const results = {};
    let totalScore = 0;

    quizSection.forEach((section) => {
      const { sectionId, questionSet } = section;
      const sectionAnswers = quizResponse[sectionId] || null;

      results[sectionId] = {};
      let sectionScore = 0;

      questionSet.forEach((question) => {
        const { questionId, correctAnswer } = question;
        const userAnswer = sectionAnswers?.[questionId] ?? null;
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) {
          sectionScore++;
        }

        results[sectionId][questionId] = {
          selectedAnswer: userAnswer,
          isCorrect,
        };
      });

      const sectionTotalScore = parseFloat(
        ((sectionScore / questionSet.length) * 100).toFixed(2)
      );
      results[sectionId].sectionScore = sectionTotalScore;
      totalScore = totalScore + sectionTotalScore;
    });

    console.log(totalScore);
    const nilaiAkhir = parseFloat((totalScore / quizSection.length).toFixed(2));
    console.log(nilaiAkhir);

    // update participant status and result
    const participant = await Participant.findOneAndUpdate(
      { report: report._id, user_id },
      { finished: true, result: { ...results }, nilaiAkhir }
    );
  }

  // send back to frontend
  return res.status(200).json({ response: "baruSiapUjian" });
};

// get result
const getQuizResult = async (req, res) => {
  const quizToken = req.params.quizToken;
  const user_id = req.user._id;

  const assignedQuiz = await Report.findOne({ token: quizToken });
  const participant = await Participant.findOne({
    user_id,
    report: assignedQuiz._id,
  });
  return res.status(200).json({ assignedQuiz, participant });
};

module.exports = {
  getPlayQuizPreview,
  playQuizStart,
  processSubmit,
  getQuizResult,
};
