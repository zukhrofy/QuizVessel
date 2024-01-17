import { useState } from "react";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faBookAtlas,
  faFileAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

const QuickAction = () => {
  const [modalCreateQuiz, setModalCreateQuiz] = useState(false);

  return (
    <>
      <h1 className="mb-6 text-center text-xl sm:text-left sm:text-3xl">
        Quick Action
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* create quiz */}
        <div
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white p-4 text-gray-800 shadow-lg"
          onClick={() => setModalCreateQuiz(true)}
        >
          <Icon icon={faPlus} size="2xl" />
          <h2 className="text-lg font-medium">Create Quiz</h2>
          <p className="text-center text-sm">Mari buat kuis sekarang</p>
        </div>
        {/* library quiz */}
        <Link
          to="/quiz"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white p-4 text-gray-800 shadow-lg"
        >
          <Icon icon={faFileAlt} size="2xl" />
          <h2 className="text-lg font-medium">Library</h2>
          <p className="text-center text-sm">Pengelolaan kuis</p>
        </Link>
        {/* report quiz */}
        <Link
          to="/report"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white p-4 text-gray-800 shadow-lg"
        >
          <Icon icon={faBookAtlas} size="2xl" />
          <h2 className="text-lg font-medium">View Reports</h2>
          <p className="text-center text-sm">
            lihat report kuis yang sudah kamu bagikan
          </p>
        </Link>
      </div>
      <ModalCreateQuiz modal={modalCreateQuiz} setModal={setModalCreateQuiz} />
    </>
  );
};

export const ModalCreateQuiz = ({ modal, setModal }) => {
  const closeModal = () => setModal(false);

  return (
    <Transition show={modal}>
      <Dialog onClose={closeModal}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="div">
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/quiz/create/regular-quiz"
                      className="rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                    >
                      Regular Quiz
                    </Link>
                    <Link
                      to="/quiz/create/sectioned-quiz"
                      className="rounded border border-rose-600 bg-rose-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
                    >
                      Section Quiz
                    </Link>
                  </div>
                </Dialog.Title>
                <button
                  type="button"
                  className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
// <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//   <div className="rounded-lg bg-white shadow-lg">
//     {/* Body */}
//     <div className="p-8">
//       <div className="flex flex-col gap-3">
//         <Link
//           to="/quiz/create/regular-quiz"
//           className="rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
//         >
//           Regular Quiz
//         </Link>
//         <Link
//           to="/quiz/create/sectioned-quiz"
//           className="rounded border border-rose-600 bg-rose-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
//         >
//           Section Quiz
//         </Link>
//       </div>
//     </div>
//     {/* Footer */}
//     <div className="flex items-center justify-end border-t border-gray-500 p-2">
//       <button
//         className="px-6 py-2 font-bold text-red-500"
//         type="button"
//         onClick={() => setModal(false)}
//       >
//         CLOSE
//       </button>
//     </div>
//   </div>
// </div>

export default QuickAction;
