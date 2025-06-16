"use client";

import { addUserEmailToProduct } from "@/lib/actions";
import {
  Dialog,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState, FormEvent } from "react";

interface Props {
  productId: string
}

// const Modal = ( productId ): Props => {
const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addUserEmailToProduct(productId, email);



    } catch (err) {
      console.error("Failed to submit email", err);
    } finally {
      setIsSubmitting(false);
      setEmail('');
      closeModal();
    }
  };

  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          {/* Modal Panel */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="p-3 border border-gray-200 rounded-md">
                        <Image
                          src="/assets/icons/logo.svg"
                          alt="logo"
                          width={28}
                          height={28}
                        />
                      </div>
                      <Image
                        src="/assets/icons/x-close.svg"
                        alt="close"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                        onClick={closeModal}
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800">
                      Stay updated with product pricing alerts!
                    </h4>

                    <p className="text-sm text-gray-600">
                      Never miss a bargain again with our timely alerts.
                    </p>
                  </div>

                  <form className="flex flex-col mt-5 space-y-4" onSubmit={handleSubmit}>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email address
                    </label>

                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                      <Image
                        src="/assets/icons/mail.svg"
                        alt="mail"
                        width={18}
                        height={18}
                      />
                      <input
                        required
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 ml-2 border-none outline-none text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      {isSubmitting ? 'Submitting...' : 'Track'}
                    </button>
                  </form>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
