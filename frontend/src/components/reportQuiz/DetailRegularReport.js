// local library
import { useState } from "react";
// third library
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaEye } from "react-icons/fa";

const DetailRegularReport = ({ report }) => {
  const participants = report.participant;
  const totalParticipants = participants.length;

  // overall quiz statistik

  // nilai tertinggi
  const highestScore = Math.max(
    ...participants.map((participant) => participant.nilaiAkhir)
  );
  // nilai rata-rata
  const totalScores = participants.reduce(
    (sum, participant) => sum + participant.nilaiAkhir,
    0
  );
  const averageScore = totalScores / participants.length;
  // nilai terendah
  const lowestScore = Math.min(
    ...participants.map((participant) => participant.nilaiAkhir)
  );

  // question analysis correct answer percentage
  const correctCount = {};

  participants.forEach((participant) => {
    Object.keys(participant.result).forEach((questionIndex) => {
      const answer = participant.result[questionIndex];
      const { isCorrect } = answer;
      if (isCorrect) {
        if (!correctCount[questionIndex]) {
          correctCount[questionIndex] = 1;
        } else {
          correctCount[questionIndex]++;
        }
      }
    });
  });

  // state untuk modal detail participant
  const [selectedUserReport, setSelectedUserReport] = useState(null);

  return (
    <>
      <div className="px-32 py-10 bg-gray-50">
        {/* nama quiz */}
        <h1 className="my-4 text-3xl font-bold">
          Quiz {report.quiz_type} ({report.title})
        </h1>

        {/* overall quiz statistic */}
        <div className="mb-8 p-8 bg-white border border-slate-400 rounded-md shadow-md">
          <h2 className="mb-4 text-xl font-bold">Statistik Keseluruhan</h2>
          <div className="grid grid-cols-2 p-4 gap-4 border border-slate-300">
            <div>
              {/* total participant */}
              <div>
                <span className="font-bold">Jumlah Peserta : </span>
                {totalParticipants}
              </div>
              {/* average score */}
              <div>
                <span className="font-bold">Nilai Rata Rata : </span>
                {averageScore}
              </div>
            </div>
            <div>
              {/* highest score */}
              <div>
                <span className="font-bold">Nilai Tertingi: </span>
                {highestScore}
              </div>
              {/* lowest score */}
              <div>
                <span className="font-bold">Nilai Terendah : </span>
                {lowestScore}
              </div>
            </div>
          </div>
        </div>

        <Tabs>
          <TabList className="mb-2">
            <Tab>Detail Peserta</Tab>
            <Tab>Analisa Pertanyaan</Tab>
          </TabList>

          <TabPanel>
            <div className="bg-white p-10 border border-slate-400 rounded-md shadow-md">
              <h2 className="mb-2 text-xl font-bold">Detail Peserta</h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300">
                      Peserta
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Nilai</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Jumlah Betul
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Jumlah Salah
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Jumlah Tidak Dijawab
                    </th>
                    <th className="px-4 py-2 border border-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* map participant and get correct, false, or skipped question */}
                  {participants.map((participant) => {
                    // change object to array
                    const questionIds = Object.keys(participant.result);
                    const correctAnswers = questionIds.filter(
                      (questionId) => participant.result[questionId].isCorrect
                    );
                    const incorrectAnswers = questionIds.filter(
                      (questionId) => !participant.result[questionId].isCorrect
                    );
                    const skippedQuestions = questionIds.filter(
                      (questionId) =>
                        participant.result[questionId].selectedAnswer === null
                    );
                    return (
                      <tr key={participant._id} className="text-sm">
                        <td className="border px-4 py-2">
                          {participant.user_id}
                        </td>
                        <td className="border px-4 py-2">
                          {participant.nilaiAkhir}
                        </td>
                        <td className="border px-4 py-2">
                          {correctAnswers.length}
                        </td>
                        <td className="border px-4 py-2">
                          {incorrectAnswers.length}
                        </td>
                        <td className="border px-4 py-2">
                          {skippedQuestions.length}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() =>
                              setSelectedUserReport(participant.result)
                            }
                            className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded">
                            view <FaEye />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="p-10 bg-white border border-slate-400 rounded-md shadow-md">
              <h2 className="mb-2 text-xl font-bold">Question Analysis</h2>
              <table className="mx-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300">
                      question
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      correct answer percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.questions.map((question, index) => (
                    <tr key={index} className="text-sm">
                      <td className="border px-4 py-2">
                        {question.questionText}
                      </td>
                      <td className="border px-4 py-2">
                        {correctCount[index]
                          ? (
                              (correctCount[index] / participants.length) *
                              100
                            ).toFixed(2)
                          : "0"}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      {selectedUserReport && (
        <ResultModal
          question={report.questions}
          result={selectedUserReport}
          onClose={setSelectedUserReport}
        />
      )}
    </>
  );
};

const ResultModal = ({ question, result, onClose }) => {
  return (
    <>
      <div className="fixed flex justify-center items-center inset-0 z-50">
        {/* container */}
        <div className="flex flex-col w-1/2 h-1/2 bg-white rounded-lg shadow-lg">
          {/* upper */}
          <div className="p-6 grow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-3 font-medium text-gray-900">Question</th>
                  <th className="p-3 font-medium text-gray-900">User Answer</th>
                  <th className="p-3 font-medium text-gray-900">
                    Correct/Incorrect
                  </th>
                </tr>
              </thead>
              <tbody>
                {question.map((question) => {
                  return (
                    <tr key={question.questionId}>
                      <td className="p-3 border border-slate-500">
                        {question.questionText}
                      </td>
                      <td className="p-3 border border-slate-500">
                        {result[question.questionId].selectedAnswer
                          ? question.answer[
                              result[question.questionId].selectedAnswer
                            ]
                          : "Not answered"}
                      </td>
                      <td
                        className={`p-3 border border-slate-500 ${
                          result[question.questionId]?.isCorrect
                            ? "bg-green-300"
                            : "bg-red-300"
                        }`}>
                        {result[question.questionId].isCorrect
                          ? "Correct"
                          : "Incorrect"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* footer */}
          <div className="flex items-center justify-end p-3 border-t border-slate-400">
            <button
              className="px-6 py-2 text-red-500 font-bold uppercase text-sm"
              type="button"
              onClick={() => onClose(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default DetailRegularReport;
