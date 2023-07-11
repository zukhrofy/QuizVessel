// local library
import { useState } from "react";
// third library
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useTable, useSortBy } from "react-table";
import ReactQuill from "react-quill";

const DetailRegularReport = ({ report }) => {
  const participants = report.participant;

  return (
    <div className="min-h-screen px-32 py-10 bg-slate-200">
      {/* nama quiz */}
      <h1 className="my-4 text-3xl font-bold">
        Quiz {report.quiz_type} ({report.title})
      </h1>
      {/* overall quiz statistic */}
      <OverallQuizStatistic participants={participants} />
      {/* tabs */}
      <Tabs>
        <TabList className="mb-2">
          <Tab>Detail Peserta</Tab>
          <Tab>Analisa Pertanyaan</Tab>
        </TabList>
        {/* tab detail peserta */}
        <TabPanel>
          <ParticipantDetailTab
            participants={participants}
            questionsDetail={report.questions}
          />
        </TabPanel>
        {/* tab analisis pertanyaan */}
        <TabPanel>
          <QuestionAnalysisTab
            participants={participants}
            questionsDetail={report.questions}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

const OverallQuizStatistic = ({ participants }) => {
  // total participant
  const totalParticipants = participants.length;
  // array of totalScore
  const nilaiAkhirArray = participants.map(
    (participant) => participant.nilaiAkhir
  );

  // nilai tertinggi
  const highestScore = Math.max(...nilaiAkhirArray);
  // nilai terendah
  const lowestScore = Math.min(...nilaiAkhirArray);
  const totalScores = nilaiAkhirArray.reduce((sum, score) => sum + score, 0);
  // nilai rata-rata
  const averageScore = totalScores / participants.length;

  return (
    <div className="mb-8 p-8 bg-white border border-slate-500 shadow-md">
      <h2 className="mb-1 text-xl font-bold">Statistik Keseluruhan</h2>
      <div className="grid grid-cols-2 p-4 gap-4 border border-slate-500">
        {/* total participant */}
        <div>
          <span className="font-bold">Jumlah Peserta : </span>
          {totalParticipants} Peserta
        </div>
        {/* average score */}
        <div>
          <span className="font-bold">Nilai Rata Rata : </span>
          {averageScore}
        </div>
        {/* nilai tertinggi */}
        <div>
          <span className="font-bold">Nilai Tertingi : </span>
          {highestScore}
        </div>
        {/* nilai terendah */}
        <div>
          <span className="font-bold">Nilai Terendah : </span>
          {lowestScore}
        </div>
      </div>
    </div>
  );
};

const ParticipantDetailTab = ({ participants, questionsDetail }) => {
  // modal for show partcipant detail selected answer
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // columns and data for table
  const columns = [
    {
      Header: "Peserta",
      accessor: "username",
    },
    {
      Header: "Nilai Akhir",
      accessor: "nilaiAkhir",
    },
    {
      Header: "Jumlah Benar",
      accessor: "correctAnswers",
    },
    {
      Header: "Jumlah Salah",
      accessor: "incorrectAnswers",
    },
    {
      Header: "Jumlah Tidak Dijawab",
      accessor: "skippedQuestions",
    },
    {
      Header: "",
      accessor: "participant",
      Cell: ({ row }) => (
        <button
          className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded"
          onClick={() => setSelectedParticipant(row.original.participant)}>
          view
        </button>
      ),
    },
  ];

  const data = participants.map((participant) => {
    const questionIds = Object.keys(participant.result);
    const correctAnswers = questionIds.filter(
      (questionId) => participant.result[questionId].isCorrect
    );
    const incorrectAnswers = questionIds.filter(
      (questionId) => !participant.result[questionId].isCorrect
    );
    const skippedQuestions = questionIds.filter(
      (questionId) => participant.result[questionId].selectedAnswer === null
    );

    return {
      username: participant.user_id.username,
      nilaiAkhir: participant.nilaiAkhir,
      correctAnswers: correctAnswers.length,
      incorrectAnswers: incorrectAnswers.length,
      skippedQuestions: skippedQuestions.length,
      participant: participant,
    };
  });

  return (
    <div className="p-10 bg-white border border-slate-500 rounded-md shadow-md">
      {/* title */}
      <h2 className="mb-2 text-xl font-bold">Detail Peserta</h2>
      {/* tabel */}
      <TableComponent columns={columns} data={data} />
      {/* selected participant modal */}
      {selectedParticipant && (
        <ResultModal
          questionsDetail={questionsDetail}
          selectedParticipant={selectedParticipant}
          setSelectedParticipant={setSelectedParticipant}
        />
      )}
    </div>
  );
};

const QuestionAnalysisTab = ({ participants, questionsDetail }) => {
  // menghitung total jumlah benar dari seluruh peserta
  const correctCount = {};
  participants.forEach((participant) => {
    Object.keys(participant.result).forEach((questionIndex) => {
      // jika key question index sudah dibuat
      if (!correctCount[questionIndex]) {
        correctCount[questionIndex] = 0;
      }

      const answer = participant.result[questionIndex];
      const { isCorrect } = answer;
      if (isCorrect) {
        correctCount[questionIndex]++;
      }
    });
  });

  const columns = [
    {
      Header: "question",
      accessor: "question",
      Cell: ({ row }) => (
        <ReactQuill value={row.original.question} theme="bubble" readOnly />
      ),
    },
    {
      Header: "persentase jawaban benar",
      accessor: "correctPercentage",
    },
    {
      Header: "kesimpulan",
      accessor: "summary",
    },
  ];

  const data = questionsDetail.map((question, index) => {
    const correctPercentage = (correctCount[index] / participants.length) * 100;

    let summary = "";
    if (correctPercentage === 100) {
      summary =
        "soal ini mudah bagi peserta karena semua menjawab dengan benar";
    } else if (correctPercentage >= 75) {
      summary =
        "soal ini tergolong mudah bagi peserta lebih dari sebagian peserta benar";
    } else if (correctPercentage >= 50) {
      summary =
        "pertanyaan ini cukup membingungkan karena hanya setengah peserta menjawab dengan benar";
    } else {
      summary =
        "Pertanyaan ini sulit bagi peserta karena tidak lebih dari setengah peserta yang benar";
    }

    return {
      question: question.questionText,
      correctPercentage: correctPercentage.toFixed(2) + "%",
      summary,
    };
  });

  return (
    <div className="p-10 bg-white border border-slate-400 rounded-md shadow-md">
      <h2 className="mb-2 text-xl font-bold">Analisis Tiap Pertanyaan</h2>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

const TableComponent = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <table {...getTableProps()} className="w-full">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-300">
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="px-4 py-2 border border-gray-500">
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="text-sm">
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  className="px-4 py-2 border border-slate-500">
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ResultModal = ({
  questionsDetail,
  selectedParticipant,
  setSelectedParticipant,
}) => {
  return (
    <>
      <div className="fixed flex justify-center items-center inset-0 z-10 bg-gray-900 bg-opacity-50">
        {/* container */}
        <div className="flex flex-col w-1/2 h-1/2 bg-white rounded-lg shadow-lg">
          {/* upper */}
          <div className="grow p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              Jawaban Peserta : {selectedParticipant.user_id.username}
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border bg-gray-300">
                  <th className="px-4 py-2 border border-gray-500">No</th>
                  <th className="px-4 py-2 border border-gray-500">
                    Pertanyaan
                  </th>
                  <th className="px-4 py-2 border border-gray-500">
                    Jawaban yang dipilih
                  </th>
                  <th className="px-4 py-2 border border-gray-500">
                    benar/salah
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionsDetail.map((question, questionIndex) => {
                  const questionAnswer =
                    selectedParticipant.result[questionIndex];
                  return (
                    <tr key={question.questionId} className="text-sm">
                      <td className="px-4 py-2 border border-slate-500">
                        {questionIndex + 1}
                      </td>
                      <td className="px-4 py-2 border border-slate-500">
                        <ReactQuill
                          value={question.questionText}
                          theme="bubble"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2 border border-slate-500">
                        {questionAnswer.selectedAnswer ? (
                          <ReactQuill
                            value={
                              question.answer[questionAnswer.selectedAnswer]
                            }
                            theme="bubble"
                            readOnly
                          />
                        ) : (
                          "Tidak dijawab"
                        )}
                      </td>
                      <td
                        className={`px-4 py-2 border border-slate-500 ${
                          questionAnswer.isCorrect
                            ? "bg-green-300"
                            : "bg-red-300"
                        }`}>
                        {questionAnswer.isCorrect ? "Correct" : "Incorrect"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* footer */}
          <div className="flex justify-end p-2 border-t border-slate-500">
            <button
              className="px-5 py-2 text-sm font-bold uppercase text-red-500"
              type="button"
              onClick={() => setSelectedParticipant(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailRegularReport;
