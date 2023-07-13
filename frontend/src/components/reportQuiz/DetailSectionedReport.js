// import local libary
import { useState } from "react";
// import third library
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useSortBy, useTable } from "react-table";
import ReactQuill from "react-quill";

const SectionedQuizReport = ({ report }) => {
  const participants = report.participant;

  return (
    <>
      <div className="min-h-screen px-32 py-10 bg-slate-200">
        {/* nama quiz */}
        <h1 className="my-4 text-3xl font-bold">
          Quiz {report.quiz_type} ({report.title})
        </h1>
        {/* overall quiz statisctic */}
        <OverallQuizStatistic participants={participants} />
        {/* tabs */}
        <Tabs>
          <TabList className="mb-2">
            <Tab>Detail Peserta</Tab>
            <Tab>Detail Section</Tab>
            <Tab>Analisa Section</Tab>
          </TabList>
          {/* tab detail peserta */}
          <TabPanel>
            <ParticipantDetailTab
              participants={participants}
              sectionsDetail={report.sections}
            />
          </TabPanel>
          {/* tab detail section */}
          <TabPanel>
            <DetailedSectionsTab
              participants={participants}
              sectionDetail={report.sections}
            />
          </TabPanel>
          {/* tab analisa */}
          <TabPanel>
            <SectionAnalysisTab
              participants={participants}
              sectionsDetail={report.sections}
            />
          </TabPanel>
        </Tabs>
      </div>
    </>
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
  const averageScore = parseFloat(
    (totalScores / participants.length).toFixed(2)
  );

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

const ParticipantDetailTab = ({ participants, sectionsDetail }) => {
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
    ...sectionsDetail.map((section, sectionIndex) => ({
      Header: `Score section (${section.sectionTitle})`,
      accessor: `result[${sectionIndex}].sectionScore`,
    })),
    {
      Header: "",
      accessor: "action",
      Cell: ({ row }) => (
        <button
          className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded"
          onClick={() => setSelectedParticipant(row.original)}>
          view
        </button>
      ),
    },
  ];

  const data = participants.map((participant) => ({
    ...participant,
    username: participant.user_id.username,
  }));

  return (
    <div className="p-10 bg-white border border-slate-500 rounded-md shadow-md">
      {/* title */}
      <h1 className="mb-2 text-xl font-bold">Detail Peserta</h1>
      {/* tabel */}
      <TableComponent columns={columns} data={data} />
      {/* selected participant modal */}
      {selectedParticipant && (
        <ResultModal
          sectionsDetail={sectionsDetail}
          selectedParticipant={selectedParticipant}
          setSelectedParticipant={setSelectedParticipant}
        />
      )}
    </div>
  );
};

const DetailedSectionsTab = ({ participants, sectionDetail }) => {
  const sectionStatistic = sectionDetail.map((section, sectionIndex) => {
    const sectionTitle = section.sectionTitle;
    const sectionScoresArray = participants.map(
      (participant) => participant.result[sectionIndex].sectionScore
    );
    // get section total score
    const totalScores = sectionScoresArray.reduce(
      (previousScore, currentScore) => previousScore + currentScore,
      0
    );
    const averageSectionScore = parseFloat(
      (totalScores / participants.length).toFixed(2)
    );
    const highestSectionScore = Math.max(...sectionScoresArray);
    const lowestSectionScore = Math.min(...sectionScoresArray);

    return {
      sectionTitle,
      averageSectionScore,
      highestSectionScore,
      lowestSectionScore,
    };
  });

  const columns = [
    {
      Header: "Section",
      accessor: "sectionTitle",
    },
    {
      Header: "score rata-rata section",
      accessor: "averageSectionScore",
    },
    {
      Header: "score tertinggi",
      accessor: "highestSectionScore",
    },
    {
      Header: "score terendah",
      accessor: "lowestSectionScore",
    },
  ];

  const data = sectionStatistic;

  return (
    <div className="p-10 bg-white border border-slate-500 rounded-md shadow-md">
      <h2 className="mb-2 text-xl font-bold">Detail Section</h2>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

const SectionAnalysisTab = ({ participants, sectionsDetail }) => {
  const sectionSummaries = {};

  // Iterate over participants
  participants.forEach((participant) => {
    const { result } = participant;

    // get total score of each section
    Object.keys(result).forEach((sectionId) => {
      // Check if exists
      if (!sectionSummaries[sectionId]) {
        sectionSummaries[sectionId] = { totalScore: 0 };
      }

      const section = result[sectionId];
      sectionSummaries[sectionId].totalScore += section.sectionScore;
    });
  });

  // Calculate the average score for each section and add summaries
  Object.keys(sectionSummaries).forEach((sectionId) => {
    const summary = sectionSummaries[sectionId];
    // menambahkan nilai rata rata tiap section
    summary.averageScore = parseFloat(
      (summary.totalScore / participants.length).toFixed(2)
    );
    // menambahkan kesimpulan
    if (summary.averageScore >= 0 && summary.averageScore <= 30) {
      summary.summary = `peserta mengalami kesulitan mengenai section ini karena nilai rata rata hanya ${summary.averageScore}`;
    } else if (summary.averageScore > 30 && summary.averageScore <= 60) {
      summary.summary = `Banyak peserta yang merasa bingung dengan bagian ini karena nilai rata rata hanya ${summary.averageScore}`;
    } else if (summary.averageScore > 60 && summary.averageScore <= 99) {
      summary.summary = `peserta mampu menjawab bagian ini karena nilai rata rata sekitar ${summary.averageScore}`;
    }
  });

  // cari section tersulit dengan memfilter section dengan rata rata tertinggi
  const findEasiestSection = (sectionSummaries) => {
    let easiestSections = [];
    let highestAverageScore = -1;

    Object.keys(sectionSummaries).forEach((sectionId) => {
      const sectionAverageScore = sectionSummaries[sectionId].averageScore;

      if (sectionAverageScore > highestAverageScore) {
        easiestSections = [sectionId];
        highestAverageScore = sectionAverageScore;
      } else if (sectionAverageScore === highestAverageScore) {
        easiestSections.push(sectionId);
      }
    });

    return easiestSections;
  };

  // cari section tersulit dengan memfilter section dengan rata rata terendah
  const findHardestSection = (sectionSummaries) => {
    let hardestSections = [];
    let lowestAverageScore = Infinity;

    Object.keys(sectionSummaries).forEach((sectionId) => {
      const sectionAverageScore = sectionSummaries[sectionId].averageScore;

      if (sectionAverageScore < lowestAverageScore) {
        hardestSections = [sectionId];
        lowestAverageScore = sectionAverageScore;
      } else if (sectionAverageScore === lowestAverageScore) {
        hardestSections.push(sectionId);
      }
    });

    return hardestSections;
  };

  const easiestSection = findEasiestSection(sectionSummaries);
  const hardestSection = findHardestSection(sectionSummaries);

  return (
    <div className="p-10 bg-white border border-slate-500 rounded-md shadow-md">
      {/* title */}
      <h2 className="mb-4 text-xl font-bold">Kesimpulan Section</h2>
      {/* summary tiap sections */}
      <h3 className="text-md font-bold">Section Summaries:</h3>
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2 border border-gray-500">Section</th>
            <th className="px-4 py-2 border border-gray-500">Average Score</th>
            <th className="px-4 py-2 border border-gray-500">Summary</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sectionSummaries).map((sectionId) => {
            const summary = sectionSummaries[sectionId];
            const sectionTitle = sectionsDetail[sectionId].sectionTitle;

            let rowColor = "";
            if (summary.averageScore >= 0 && summary.averageScore <= 30) {
              rowColor = "bg-red-200";
            } else if (
              summary.averageScore > 30 &&
              summary.averageScore <= 60
            ) {
              rowColor = "bg-yellow-200";
            } else if (
              summary.averageScore > 60 &&
              summary.averageScore <= 100
            ) {
              rowColor = "bg-green-200";
            }

            return (
              <tr key={sectionId} className={`text-sm ${rowColor}`}>
                <td className="px-4 py-2 border border-slate-500">
                  {sectionTitle}
                </td>
                <td className="px-4 py-2 border border-slate-500">
                  {summary.averageScore}
                </td>
                <td className="px-4 py-2 border border-slate-500">
                  {summary.summary}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* section termudah */}
      <h3 className="text-md font-bold">Section Termudah</h3>
      <div className="mb-4 p-2 bg-green-100 border border-green-500 rounded-md">
        {easiestSection.map((sectionId) => (
          <p key={sectionId} className="text-green-800">
            Bagian {sectionsDetail[sectionId].sectionTitle} :{" "}
            {sectionSummaries[sectionId].summary}
          </p>
        ))}
      </div>
      {/* section tersulit */}
      <h3 className="text-md font-bold">Hardest Section</h3>
      <div className="mb-4 p-2 bg-red-100 border border-red-500 rounded-md">
        {hardestSection.map((sectionId) => (
          <p key={sectionId} className="text-red-800">
            Bagian {sectionsDetail[sectionId].sectionTitle}:{" "}
            {sectionSummaries[sectionId].summary}
          </p>
        ))}
      </div>
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
  sectionsDetail,
  selectedParticipant,
  setSelectedParticipant,
}) => {
  return (
    <div className="fixed flex justify-center items-center inset-0 z-10 bg-gray-900 bg-opacity-50">
      {/* container */}
      <div className="flex flex-col w-1/2 h-1/2 bg-white rounded-lg shadow-lg">
        {/* upper */}
        <div className="grow p-6 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">
            Jawaban Peserta : {selectedParticipant.user_id.username}
          </h2>
          {sectionsDetail.map((section, sectionIndex) => {
            const participantSectionAnswer =
              selectedParticipant.result[sectionIndex];

            return (
              <div key={sectionIndex} className="mb-4">
                <div className="flex justify-between font-medium">
                  <p>Section {section.sectionTitle}</p>
                  <p>score: {participantSectionAnswer.sectionScore}</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border bg-gray-300">
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
                    {Object.keys(participantSectionAnswer).map((questionId) => {
                      if (questionId === "sectionScore") {
                        return null;
                      }
                      return (
                        <tr key={questionId} className="text-sm">
                          <td className="px-4 py-2 border border-slate-500">
                            <ReactQuill
                              value={
                                section.questionSet[questionId].questionText
                              }
                              theme="bubble"
                              readOnly
                            />
                          </td>
                          <td className="px-4 py-2 border border-slate-500">
                            {participantSectionAnswer[questionId]
                              .selectedAnswer ? (
                              <ReactQuill
                                value={
                                  section.questionSet[questionId].answer[
                                    participantSectionAnswer[questionId]
                                      .selectedAnswer
                                  ]
                                }
                                theme="bubble"
                                readOnly
                              />
                            ) : (
                              "tidak dijawab"
                            )}
                          </td>
                          <td
                            className={`px-4 py-2 border border-slate-500 ${
                              participantSectionAnswer[questionId].isCorrect
                                ? "bg-green-300"
                                : "bg-red-300"
                            }`}>
                            {participantSectionAnswer[questionId].isCorrect
                              ? "Benar"
                              : "Salah"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
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
  );
};
export default SectionedQuizReport;
