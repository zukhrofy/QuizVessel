// import local libary
import { useState } from "react";
// import third library
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const SectionedQuizReport = ({ report }) => {
  // get participant
  const participants = report.participant;
  const totalParticipants = participants.length;

  // Calculate the number of correct and incorrect answers per section
  const sectionResults = participants.reduce((sectionResults, participant) => {
    Object.keys(participant.result).forEach((sectionId) => {
      const section = participant.result[sectionId];
      console.log(section);
      const incorrectCount = Object.values(section).reduce(
        (count, answer) => (answer.isCorrect ? count : count + 1),
        0
      );
      const correctCount = Object.values(section).reduce(
        (count, answer) => (answer.isCorrect ? count + 1 : count),
        0
      );
      if (!sectionResults[sectionId]) {
        sectionResults[sectionId] = {
          incorrectCount,
          correctCount,
        };
      } else {
        sectionResults[sectionId].incorrectCount += incorrectCount;
        sectionResults[sectionId].correctCount += correctCount;
      }
    });
    return sectionResults;
  }, {});

  console.log(sectionResults);

  // Find the section with the most incorrect answers
  const mostIncorrectSection = Object.keys(sectionResults).reduce(
    (mostIncorrectSection, sectionId) => {
      if (
        !mostIncorrectSection ||
        sectionResults[sectionId].incorrectCount >
          sectionResults[mostIncorrectSection].incorrectCount
      ) {
        return sectionId;
      }
      return mostIncorrectSection;
    },
    null
  );

  // Find the section with the most correct answers
  const mostCorrectSection = Object.keys(sectionResults).reduce(
    (mostCorrectSection, sectionId) => {
      console.log(mostCorrectSection);
      if (
        !mostCorrectSection ||
        sectionResults[sectionId].correctCount >
          sectionResults[mostCorrectSection].correctCount
      ) {
        return sectionId;
      }
      return mostCorrectSection;
    },
    null
  );

  // State for modal detail participant
  const [selectedUserReport, setSelectedUserReport] = useState(null);

  return (
    <>
      <div className="px-32 py-10 bg-gray-50">
        <h1 className="my-4 text-3xl font-bold">
          Quiz {report.quiz_type} ({report.title})
        </h1>

        <Tabs>
          <TabList className="mb-2">
            <Tab>Detail Peserta</Tab>
            {(mostIncorrectSection || mostCorrectSection) && (
              <Tab>Analisa Pertanyaan</Tab>
            )}
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
                    <th className="px-4 py-2 border border-gray-300">
                      Detail Jawaban
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant._id} className="text-sm">
                      <td className="border px-4 py-2">
                        {participant.user_id}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() =>
                            setSelectedUserReport(participant.result)
                          }
                          className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded">
                          view
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {(mostIncorrectSection || mostCorrectSection) && (
            <TabPanel>
              <div className="bg-white border border-slate-400 rounded-md shadow-md">
                <h2 className="mb-2 text-xl font-bold">Analisa Pertanyaan</h2>
                {mostIncorrectSection && (
                  <div className="mb-4">
                    <h3 className="mb-2 font-bold">Section Paling Sulit</h3>
                    <p>
                      Bagian dengan tingkat kesalahan tertinggi adalah Bagian{" "}
                      {report.sections[mostIncorrectSection].sectionTitle}
                    </p>
                  </div>
                )}
                {mostCorrectSection && (
                  <div className="mb-4">
                    <h3 className="mb-2 font-bold">Bagian Paling Mudah</h3>
                    <p>
                      Bagian dengan tingkat kebenaran tertinggi adalah Bagian{" "}
                      {report.sections[mostCorrectSection].sectionTitle}
                    </p>
                  </div>
                )}
              </div>
            </TabPanel>
          )}
        </Tabs>
      </div>

      {/* Participant Detail Modal */}
      {selectedUserReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white border border-gray-300 rounded-md">
            <h2 className="mb-4 text-xl font-bold">
              Detail Jawaban Peserta ({selectedUserReport.user_id})
            </h2>
            {Object.keys(selectedUserReport).map((sectionId) => {
              const section = selectedUserReport[sectionId];
              return (
                <div key={sectionId} className="mb-4">
                  <h3 className="mb-2 font-bold">
                    Bagian {report.sections[sectionId].sectionTitle}
                  </h3>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 border border-gray-300">
                          Pertanyaan
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Jawaban
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(section).map((questionId) => {
                        const question = section[questionId];
                        return (
                          <tr key={questionId} className="text-sm">
                            <td className="border px-4 py-2">
                              {question.questionId}
                            </td>
                            <td className="border px-4 py-2">
                              {question.selectedAnswer}
                            </td>
                            <td className="border px-4 py-2">
                              {question.isCorrect ? "Benar" : "Salah"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <button
              onClick={() => setSelectedUserReport(null)}
              className="flex items-center gap-1 px-4 py-2 mt-4 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionedQuizReport;
