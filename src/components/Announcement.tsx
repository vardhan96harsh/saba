import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import { useApiContext } from '../components/contexts/ApiContext';
import useImportCommonData from '@/components/hooks/useImportCommonData';

const Announcement: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Help Us Improve the daily inc');
  const [description, setDescription] = useState('We want to know what you love, loathe, and need more of ');
  const [ctaText, setCtaText] = useState('Join the focus group now to have your say');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [newBackgroundImage, setNewBackgroundImage] = useState<File | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isOwner, setAnnouncementData, commonData, setCommonData } = useApiContext();
  const { mutateAsync: importCommonData } = useImportCommonData();
  const [isLoading, setIsLoading] = useState(false);


  const DEFAULT_BACKGROUND_IMAGE = '/images/AN2.png';

  useEffect(() => {
    if (isSaved || isError) {
      const timer = setTimeout(() => {
        setIsSaved(false);
        setIsError(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isSaved, isError]);


  useEffect(() => {
    console.log("Loading announcement data from commonData:", commonData); 
    if (commonData?.announcementData) {
      const data = commonData.announcementData;
      setTitle(data.title || 'Help Us Improve the daily inc');
      setDescription(data.description || 'We want to know what you love, loathe, and need more of.');
      setCtaText(data.ctaText || 'Join the focus group now to have your say');
      setBackgroundImage(data.backgroundImage || DEFAULT_BACKGROUND_IMAGE);
    }
  }, [commonData]);

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  
 

  
  const handleSave = async () => {
    setIsLoading(true);
    setIsSaved(false);
    setIsError(false);
  
    try {
      // Use the current backgroundImage (which now already holds the Base64 string)
      const announcementData = {
        title,
        description,
        ctaText,
        backgroundImage: backgroundImage || DEFAULT_BACKGROUND_IMAGE,
      };
  
      // Create the updated common data object
      const updatedCommonData = { ...commonData, announcementData };
  
      // Update your local state and context with the new announcement data
      setCommonData(updatedCommonData);
      setAnnouncementData(announcementData);
  
      // Save the data to the server in a single call
      await importCommonData(updatedCommonData);
  
      setIsSaved(true);
      setIsEditing(false);
      console.log("Announcement data saved successfully.");
    } catch (error) {
      console.error("Error saving announcement data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBackgroundImage(base64);    // Update the preview immediately with Base64
        setNewBackgroundImage(null);     // Clear the new image state as it's already converted
      };
      reader.readAsDataURL(file);
    }
  };
  
  
  

  return (
    <>
      <div
        className="relative justify-between   w-full h-[110px] lg:h-[135px] xl:h-[130px] 2xl:h-[250px] "
        style={{
          backgroundImage: `url(${backgroundImage || DEFAULT_BACKGROUND_IMAGE})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <div className="inset-0 flex md:flex-row justify-between items-start bg-opacity-50 p-2 tracking-wider">
          <div className="flex flex-col px-2 w-1/2 text-left">
            <h1 className=" pt-3 md:pt-3 pl-0 md:pl-16 w-full md:w-full  text-black text-lg md:text-2xl lg:text-3xl leading-none ">
              {title}
            </h1>
            <p className="pt-1 md:pt-1 lg:pt-0 xl:pt-4  pr-0 pl-0 md:pl-16 w-full md:w-full text-black text-left text-xs md:text-lg lg:text-lg leading-none md:leading-4">
              {description}
            </p>
           
          </div>
          
        

         
        </div>
       
        {isOwner && !isEditing && (
          <div className="md:block top-1 right-3 absolute hidden">
            <button
              className="px-4 py-1 rounded text-black"
              onClick={() => setIsEditing(true)}
            >
              <AiOutlineEdit size={20} />
            </button>
          </div>
          
        )}
          <p className="  w-full  text-center mt-10 sm:mt-6 md:mt-6 xl:mt-12 lg:mt-12 text-white md:text-3xl tracking-wide">
            {ctaText}
          </p>
      </div>
      

      {isEditing && (
        <div className="z-50 fixed inset-0 flex justify-center bg-black bg-opacity-50 tracking-widest">
          <div className="bottom-10 fixed flex-none justify-center items-center bg-white shadow-md p-6 rounded-md w-1/3">
            <button
              className="top-2 right-2 absolute text-gray-600 hover:text-gray-900"
              onClick={handleCancel}
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="mb-4 font-bold text-xl">Edit Announcement</h2>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 text-sm">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 mt-1 p-2 border rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 mt-1 p-2 border rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 text-sm">Call to Action Text</label>
              <textarea
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="border-gray-300 mt-1 p-2 border rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 text-sm">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end">
            <button
  className={`py-2 px-4 rounded mr-2 ${
    isLoading ? 'bg-gray-400' : isError ? 'bg-green-500 text-white' 
    : isSaved ? 'bg-green-500 text-white' 
    : 'bg-blue-500 text-white'
  } flex items-center justify-center`}
  onClick={handleSave}
  disabled={isLoading} // Disable the button while loading
>
  {isLoading ? (
    <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
  ) : isError ? 'Saved' : isSaved ? 'Saved' : 'Save'}
</button>



              <button
                className="bg-red-500 px-4 py-2 rounded text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Announcement;
