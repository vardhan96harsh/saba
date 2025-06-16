import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import useImportCommonData from "../components/hooks/useImportCommonData";
import { useApiContext } from '../components/contexts/ApiContext';
import team from "../assets/images/Team.svg";


const HostList: React.FC = () => {
  const navigate = useNavigate();
  const { isOwner, commonData, setCommonData } = useApiContext();
  const { mutateAsync: importCommonData } = useImportCommonData();
  const [hosts, setHosts] = useState(commonData.hostData || [
    { name: 'Anisa', quote: '  "Podcasts are a really cool and fun way to learn. Come and join us for some exciting tech journeys."', photo: 'images/host1.png' },
    { name: 'Emilia', quote: '"Every story has the power to ignite change; let’s share those stories and inspire a new generation."', photo: 'images/host2.png' },
    { name: 'Adelita', quote: ' "In a world filled with noise, let your voice be the beacon that guides others to truth and understanding."', photo: 'images/host3.png' },
    { name: 'Thomas', quote: ' "Sharing knowledge is the first step to building a community; let’s create a space for learning and growth."', photo: 'images/host4.png' }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHostDetails, setCurrentHostDetails] = useState(hosts);
  const [savedIndices, setSavedIndices] = useState<number[]>([]);
  const [isAllSaved, setIsAllSaved] = useState(false);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<boolean[]>(hosts.map(() => false));



  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hosts.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [hosts.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;


    if (name === "quote") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 20) return;
    }

    if(name == "name" && value.length > 20){
      return;
    }

    const updatedHosts = [...currentHostDetails];
    updatedHosts[index] = {
      ...updatedHosts[index],
      [name]: value
    };
    setCurrentHostDetails(updatedHosts);
  };


  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64Image = (await convertToBase64(file)) as string;

      const updatedHosts = [...currentHostDetails];
      updatedHosts[index].photo = base64Image; // Save the image as Base64
      setCurrentHostDetails(updatedHosts);
    }
  };

 
  const handleSaveHost = async (index: number) => {
    try {
      setLoadingStatus((prev) => prev.map((status, i) => (i === index ? true : status))); // Set loading to true
  
      const updatedHosts = [...hosts];
      updatedHosts[index] = currentHostDetails[index];
      setHosts(updatedHosts);
  
      // Update context and save to server
      const newCommonData = { ...commonData, hostData: updatedHosts };
      setCommonData(newCommonData);
      await importCommonData(newCommonData);
  
      setSavedIndices((prev) => [...prev, index]);
      setErrorIndices((prev) => prev.filter((i) => i !== index)); // Remove index from errors
  
      // Reset the button state after 5 seconds
      setTimeout(() => {
        setSavedIndices((prev) => prev.filter((i) => i !== index));
      }, 5000);
  
      console.log("Host data saved successfully.");
    } catch (error) {
      console.error("Error saving host data:", error);
      setErrorIndices((prev) => [...prev, index]); // Add index to errors
  
      // Reset the error state after 5 seconds
      setTimeout(() => {
        setErrorIndices((prev) => prev.filter((i) => i !== index));
      }, 5000);
    } finally {
      setLoadingStatus((prev) => prev.map((status, i) => (i === index ? false : status))); // Reset loading
    }
  };

  const handleSaveAllHosts = async () => {

    try {
      setHosts(currentHostDetails);
      setIsEditing(false);

      // Update context and save all hosts to the server
      const newCommonData = { ...commonData, hostData: currentHostDetails };
      setCommonData(newCommonData);
      await importCommonData(newCommonData);

      setIsAllSaved(true);
      setSavedIndices(currentHostDetails.map((_, idx) => idx));
      setErrorIndices([]); // Clear all errors on success

      // Reset the state after 5 seconds
      setTimeout(() => {
        setIsAllSaved(false);
        setSavedIndices([]);
      }, 5000);

      console.log("All hosts saved successfully.");
    } catch (error) {
      console.error("Error saving all hosts:", error);
      setErrorIndices(currentHostDetails.map((_, idx) => idx)); // Mark all as errors

      // Reset the error state after 5 seconds
      setTimeout(() => {
        setErrorIndices([]);
      }, 5000);
    }

  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const saveHostDataToServer = (hostData: typeof hosts) => {

    importCommonData({ ...commonData, hostData })
      .then(() => {
        console.log("Host data saved successfully.");
      })
      .catch((error) => {
        console.error("Error saving host data:", error);
      });
  };

  return (
    <div className=" mx-0 md:mx-auto px-2 w md:px-20 lg:px-4 py-2 md:py-4 bg-[#E6E6E6] ">
      <span className='flex'>
        <img src={team} alt="Logo" className="w-6 h-6 md:w-[40px] md:h-[40px]" />
        <h1 onClick={() => navigate('/host-details')} className="text-xl ml-[7px] md:ml-4 md:text-[38px] mt-2  font-djr-forma  cursor-pointer tracking-wide">the team</h1>
      </span>
      {isOwner && (
        <button onClick={handleEditClick} className="absolute lg:top-4  right-4 text-black rounded p-2 hidden md:block">
          <AiOutlineEdit className='size-5' />
        </button>
      )}
      <div className='flex '>
        <div >
          <div className="w-[110px] md:w-[150px] lg:w-[150px] border   bg-black mt-7 md:mt-16 mb-[1px] md:mb-[-16px] h-[150px] md:h-[200px] justify-center">
            <img
              src={hosts[currentIndex].photo}
              alt={hosts[currentIndex].name}
              className="w-20 h-20  md:w-28 md:h-28 ml-[14px] md:ml-[19px] object-fill mt-[-24px] md:mt-[-38px] rounded-full"
            />
            <h2 className="text-sm md:text-xl text-white font-djr-forma mt-4 md:mt-4 text-center tracking-widest break-words overflow-hidden px-2">
              {hosts[currentIndex].name}
            </h2>

          </div>
        </div>
        <div className='' >
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-3xl xl:text-3xl  2xl:text-3xl font-medium mb-2 mt-2 md:mt-8 xl:mt-10 pl-4 sm:pl-6 md:pl-10 pr-0  lg:pr-10 2xl:pr-44 mr-[-180px] sm:mr-[-250px] md:mr-[-300px]  lg:mr-0 tracking-wide">
            {hosts[currentIndex].quote}
          </p>
        </div>
      </div>


      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 tracking-wider">
          <div className="bg-white px-6 rounded-lg shadow-lg w-[650px] h-[500px] ">
            {/*  Fixed Header for Title and Close Button */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-2xl font-bold tracking-wider  mt-2">Edit Hosts</h3>
              <button onClick={handleCloseModal} className="bg-transparent">
                <AiOutlineClose className="text-xl text-gray-500 hover:text-gray-800" />
              </button>
            </div>


            <div className="overflow-y-auto h-[calc(100%-4rem)]  ">
              {currentHostDetails.map((host, index) => (
                <div key={index} className="flex flex-col space-y-4 border-b pb-4 mb-4 tracking-wider">
                  <h4 className="text-lg font-bold">Edit Host {index + 1}</h4>
                  <div>
                    <label className="block text-lg font-bold mb-1 tracking-wider">Host Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={host.name}
                      onChange={(e) => handleInputChange(e, index)}
                      className="border text-xl rounded w-full p-2 tracking-wider "
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-1 tracking-wider">Quote (Max 20 words):</label>
                    <textarea
                      value={host.quote}
                      name="quote"
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-2 text-xl border tracking-wider border-gray-300 rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-lg tracking-wider  font-bold mb-1">Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="border text-xl rounded w-full p-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mr-2">
                  <button
  onClick={() => handleSaveHost(index)}
  className={`${savedIndices.includes(index)
    ? 'bg-green-500'
    : errorIndices.includes(index)
      ? 'bg-green-500'
      : 'bg-blue-500'
    } text-white rounded px-2 py-1 flex items-center justify-center`}
  disabled={loadingStatus[index]} // Disable button while loading
>
  {loadingStatus[index] ? (
    <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
  ) : errorIndices.includes(index) ? (
    'Host Saved'
  ) : savedIndices.includes(index) ? (
    'Saved'
  ) : (
    `Save Host ${index + 1}`
  )}
</button>
                  </div>
                </div>
              ))}
              <div className=" mb-5">
                <button
                  onClick={handleSaveAllHosts}
                  className={`${isAllSaved
                    ? 'bg-green-500'
                    : errorIndices.length > 0
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                    } text-white rounded px-2 py-1`}
                >
                  {errorIndices.length > 0
                    ? 'Saved All hosts'
                    : isAllSaved
                      ? 'Save All Saved'
                      : 'Save All Hosts'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostList;
