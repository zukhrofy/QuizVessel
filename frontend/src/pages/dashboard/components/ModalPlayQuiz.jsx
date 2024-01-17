import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

const ModalPlayQuiz = ({ maximizeSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState("");

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const navigate = useNavigate();

  const onPlayQuiz = () => {
    if (token.trim() === "") {
      alert("Token kuis tidak boleh kosong");
    } else {
      navigate(`/play/${token}/preview/`);
    }
  };

  return (
    <>
      {/* modal button */}
      <div className="mb-7 mt-2">
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold hover:bg-gray-100"
        >
          <Icon icon={faCirclePlay} />
          {maximizeSidebar && "Play Quiz"}
        </button>
      </div>

      {/* modal */}
      <Transition show={isOpen}>
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
                    <label
                      class="mb-2 block text-sm font-bold text-gray-700"
                      for="token"
                    >
                      token
                    </label>
                    <input
                      class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="token"
                      type="text"
                      placeholder="Quiz Token"
                      onChange={(e) => setToken(e.target.value)}
                    />
                  </Dialog.Title>
                  <p className=" mt-2 text-sm text-gray-500">
                    "Masukkan token untuk mengakses kuis. Pastikan token sesuai
                    dengan informasi yang diberikan."
                  </p>

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onPlayQuiz}
                    >
                      lets play
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalPlayQuiz;
