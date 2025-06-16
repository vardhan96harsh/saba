import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import HostBg from '../assets/images/HostBGM.jpg';


interface HostPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  host: any; // Replace with your host type
  numOfPodcasts: number;
}

const HostPopUp: React.FC<HostPopUpProps> = ({ isOpen, onClose, host, numOfPodcasts }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-center items-center overflow-y-auto">
          <div className="flex justify-center items-center p-4 min-h-full text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="relative align-top bg-cover bg-center shadow-xl md:p-6 w-[400px] md:w-[900px] h-[225px] md:h-[506px] text-left transform transition-all overflow-hidden"
                style={{ backgroundImage: `url(${HostBg})` }}
              >

                <button
                  type="button"
                  className="top-4 right-4 absolute focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>

                <div
                  className="z-10 md:absolute p-6 rounded-tl-[25px] rounded-tr-[25px]"
                  style={{ width: '310px', height: '260px', bottom: '205px', left: '100px' }}
                >

                  <div className="md:mr-[-300px] ml-28 md:ml-[215px] text-2xl text-black md:text-5xl">

                    <p>{host.name}</p>
                  </div>



                  <div className='mr-[-600px] ml-[105px] md:ml-[205px]'>
                    <hr className="text-right md:mt-[4px] border-t-[2px] md:border-t-[3px] border-black w-full md:h-4" />
                  </div>

                  <div className="mt-2 md:mt-6 md:mr-[-300px] ml-[115px] md:ml-[215px] text-sm text-white md:text-3xl tracking-wide">

                    <p>{host.designation}</p>
                  </div>

                </div>
               

                <div className="top-[100px] md:top-[210px] left-[138px] md:left-[340px] absolute w-[250px] md:w-[450px] text-left md:text-xl tracking-wider"
                >
                  <p className='mt-[-10px] md:mt-2 font-bold text-blue-600 text-xs md:text-xl' >{host.email_id}</p>
               <p
  className="mt-0 md:mt-10 font-medium text-xs md:text-xl"
  style={{ maxHeight: '190px', overflowY: 'auto' }}
>
  {host.profile || 'I am from Houston, TX! I’ve spent 27 amazing years at HP, helping our Global teams be their best. Now, I’m super excited to share my journey and passion with you through this podcast. Join me as we dive into fun stories, cool tech, and awesome insights. Let’s explore the future together!'}
</p>

                </div>
                <div
                  className="top-[25px] md:top-[70px] left-[20px] md:left-[65px] z-20 absolute border-2 border-white bg-white rounded-full w-[90px] md:w-[210px] h-[90px] md:h-[210px] overflow-hidden"
                >
                  <img
                    src={host.photo || 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}
                    alt="Host"
                    className={`w-full h-full object-cover ${!host.photo ? 'opacity-50' : ''}`}
                  />
                </div>



                <div className="top-[115px] md:top-72 left-[35px] md:left-[120px] absolute flex md:gap-4 text-center text-white">

                  <p className="font-bold text-2xl text-center md:text-5xl">{numOfPodcasts} </p>
                  <p className="mt-[5px] md:mt-[7px] ml-[5px] md:ml-[-10px] text-xs md:text-lg leading-3 md:leading-4 tracking-wide">available <br /> episodes</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HostPopUp;
