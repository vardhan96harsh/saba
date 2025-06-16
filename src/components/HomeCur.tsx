import React, { useState, useEffect } from "react";
import { useApiContext } from "../components/contexts/ApiContext";
import useImportCommonData from "@/components/hooks/useImportCommonData";
import { FiX } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import arl from "../assets/images/ArrowLeft.svg";
import arr from "../assets/images/ArrowRight.svg";

interface Banner {
  id: number;
  title: string;
  description: string;
  imgUrl: string | null;
  link: string;
}

const DEFAULT_IMAGE = "/images/default.png";
const bannerColors = ["#E6E6E6", "#94f0fd", "#40defa", "#D4Fcff"];
const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Welcome",
    description: "to the tech tune-up podcast site for global training.",
    imgUrl: "images/HC1.png",
    link: "",
  },
  {
    id: 2,
    title: "Training",
    description: "Learn the best practices from experts.",
    imgUrl: "images/HC2.png",
    link: "",
  },
  {
    id: 3,
    title: "Podcasts",
    description: "Tune in to the latest episodes.",
    imgUrl: "images/HC3.png",
    link: "",
  },
  {
    id: 4,
    title: "Global Network",
    description: "Connect with a global community.",
    imgUrl: "images/HC4.png",
    link: "",
  },
];

const HomeCur: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string[]>([]); // Tracks the save status of individual slides
  const [saveAllStatus, setSaveAllStatus] = useState<string>(""); // Tracks the save status for "Save All"
  const { isOwner, setHomeCurData, commonData, setCommonData } = useApiContext();
  const { mutateAsync: importCommonData } = useImportCommonData();
  const [banners, setBanners] = useState<Banner[]>(commonData.sliderData || DEFAULT_BANNERS);

  useEffect(() => {
    // Initialize saveStatus with "default" for each banner
    setSaveStatus(banners.map(() => "default"));
  }, [banners]);

  // Jump to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    // Automatically shift banners every 6 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [banners.length]);

  // Edit mode toggle
  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  // Update text fields (title, description, link)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Banner,
    index: number
  ) => {
    const value = e.target.value;
    let updatedValue = value;

    if (field === "title") {
      // Restrict title to a maximum of 15 characters
      if (value.length > 15) {
        updatedValue = value.substring(0, 15);
      }
    }

    if (field === "description") {
      // Restrict description to a maximum of 170 characters
      if (value.length > 100) {
        updatedValue = value.substring(0, 100);
      }
    }

    const updatedBanners = [...banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      [field]: updatedValue,
    };
    setBanners(updatedBanners);
  };

  // Convert image to Base64 string
  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file upload and store it as a Base64 string
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64Image = (await convertToBase64(file)) as string;
      const updatedBanners = [...banners];
      updatedBanners[index] = {
        ...updatedBanners[index],
        imgUrl: base64Image, // Store image as Base64 string
      };
      setBanners(updatedBanners);
    }
  };


  const saveIndividualBanner = async (index: number) => {
    try {
      setLoadingStatus((prev) => prev.map((status, i) => (i === index ? true : status))); // Set loading to true

      const updatedBanner = {
        ...banners[index],
        link: banners[index].link ,
      };

      console.log("Saving banner:", updatedBanner);

      const response = await importCommonData({
        ...commonData,
        sliderData: [...banners],
      });

      console.log("API Response:", response);

      const updatedBanners = [...banners];
      updatedBanners[index] = updatedBanner;

      const newCommonData = { ...commonData, sliderData: updatedBanners };
      setCommonData(newCommonData);

      await importCommonData(newCommonData);
      console.log(`Banner ${updatedBanner.id} saved successfully.`);

      setSaveStatus((prev) =>
        prev.map((status, i) => (i === index ? "saved" : status))
      );
    } catch (error) {
      console.error(`Error saving banner ${banners[index].id}:`, error);

      setSaveStatus((prev) =>
        prev.map((status, i) => (i === index ? "error" : status))
      );
    } finally {
      setLoadingStatus((prev) => prev.map((status, i) => (i === index ? false : status))); // Reset loading
    }
  };


  const handleRedirectClick = (link: string) => {
    const cleanLink = link?.trim();
  
    if (cleanLink && /^https?:\/\//i.test(cleanLink)) {
      window.open(cleanLink, "_blank", "noopener,noreferrer");
    } else {
      alert("This banner does not have a valid link starting with http or https.");
      console.warn("Invalid link:", cleanLink);
    }
  };
  


  // Save all banners
  const saveAllBanners = async () => {
    setIsEditing(false);
    try {
      const updatedBanners = banners.map((banner) => ({
        ...banner,
        link: banner.link ,
      }));

      const newCommonData = { ...commonData, sliderData: updatedBanners };
      setCommonData(newCommonData);

      await importCommonData(newCommonData);
      console.log("All slider data saved successfully.");
      // Update save all status to "saved"
      setSaveAllStatus("saved");
      // Reset individual save statuses
      setSaveStatus(banners.map(() => "default"));
    } catch (error) {
      console.error("Error saving all slider data:", error);
      setSaveAllStatus("error");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };


  const getButtonStyle = (status: string) => {
    switch (status) {
      case "saved":
        return "bg-green-500 text-white";
      case "error":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const [loadingStatus, setLoadingStatus] = useState<boolean[]>(banners.map(() => false));
  const currentBanner = banners[currentIndex];



  return (
    <div className="relative bg-[#000000] w-full h-[180px] md:h-[320px] overflow-hidden">
    <div
  key={currentBanner.id}
  className="absolute w-full h-full transition-opacity duration-1000 ease-in-out xl:object-cover opacity-100 pointer-events-auto"
  style={{
    backgroundColor: bannerColors[currentIndex],
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundImage:
      window.innerWidth > 768
        ? `url(${currentBanner.imgUrl ? currentBanner.imgUrl : DEFAULT_IMAGE})`
        : "none",
    cursor: isEditing ? "default" : "auto",
  }}
>
  <div className="top-1/2 left-3 z-10 absolute ml-[-15px] md:ml-1 transform -translate-y-1/2">
    <button
      onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
      className="rounded-full text-black"
    >
      <img src={arl} className="w-[30px] md:w-[35px] h-[30px] md:h-[35px]" alt="Left" />
    </button>
  </div>

  <div className="top-1/2 right-0 z-10 absolute mr-[-4px] md:mr-4 transform -translate-y-1/2">
    <button
      onClick={() => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
      className="rounded-full text-black"
    >
      <img src={arr} className="w-[30px] md:w-[35px] h-[30px] md:h-[35px]" alt="Right" />
    </button>
  </div>

  <div className="inset-0 flex flex-col items-start py-4 md:py-12 w-[80%] md:w-1/2">
    {currentBanner.title && (
      <>
        <h1 className="items-center md:px-20 pl-8 text-[38px] text-black md:text-[77px] leading-[38px] md:leading-[66px]">
          {currentBanner.title}
        </h1>
        <div className="mt-4 border-t-[2px] border-black w-full"></div>
      </>
    )}

    {currentBanner.description && (
      <>
        <p className="ml-0 2xl:ml-0 md:px-12 py-1 md:py-3 pl-8 md:pl-20 font-medium text-[15px] md:text-[35px] leading-tight md:leading-8">
          {currentBanner.description}
        </p>
        <div className="border-t-[2px] border-black w-full"></div>
      </>
    )}

    {!isEditing && currentBanner.link?.trim().startsWith("http") && (
      <button
        onClick={() => handleRedirectClick(currentBanner.link)}
        className="bottom-2 md:bottom-4 left-10 md:left-20 absolute border-[#2073BE] bg-[#002F5A] hover:bg-gray-200 px-3 md:px-2 py-1 md:py-1 border text-[8px] text-white md:text-xs tracking-widest"
      >
        Learn more
      </button>
    )}

    {isOwner && !isEditing && (
      <button
        onClick={handleEdit}
        className="md:block top-4 right-4 absolute hidden px-2 py-2 text-black"
      >
        <AiOutlineEdit size={20} />
      </button>
    )}
  </div>

  <div className="bottom-2 absolute flex justify-center items-center space-x-1 md:space-x-2 w-full">
    {banners.map((_, dotIndex) => (
      <button
        key={dotIndex}
        onClick={() => goToSlide(dotIndex)}
        className={`w-[5px] h-[5px] md:w-2 md:h-2 rounded-full ${
          dotIndex === currentIndex ? "bg-black" : "bg-black opacity-50"
        }`}
      ></button>
    ))}
  </div>
</div>


      {isEditing && (
        <>
          <div className="z-40 fixed inset-0 justify-center items-center bg-black opacity-50"></div>

          <div
            className="left-1/2 z-50 fixed bg-white shadow-3xl mt-10 rounded-lg w-[650px] h-[450px] transform -translate-x-1/2"

          >
            <div className="z-50 flex justify-between bg-white shadow-sm pt-3 pl-3 rounded-lg tracking-wider">
              <h2 className="font-bold text-2xl tracking-wider">Edit Banners</h2>
              <FiX className="text-2xl cursor-pointer" onClick={cancelEdit} />
            </div>

            <div className="p-4 h-[400px] tracking-widest overflow-auto">
              {banners.map((banner, index) => (
                <div key={banner.id} className="mb-6">
                  <h3 className="font-bold text-lg tracking-wider">Banner {index + 1}</h3>
                  <label className="block mb-2 font-bold tracking-wider">Title (Max 1 word)</label>
                  <input
                    type="text"
                    className="mb-2 p-2 border w-full text-xl xl:tracking-wid"
                    value={banner.title}
                    onChange={(e) => handleInputChange(e, "title", index)}
                  />

                  <label className="block mb-2 font-bold xl:tracking-widest">Description (Max 15 word)</label>
                  <textarea
                    className="mb-2 p-2 border w-full text-lg"
                    value={banner.description}
                    onChange={(e) => handleInputChange(e, "description", index)}
                  />

                  <label className="block mb-2 font-bold tracking-widest">Image:</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, index)}
                    accept="image/*"
                    className="mb-4"
                  />

                  <label className="block mb-2 font-bold tracking-widest">Link:</label>
                  <input
                    type="text"
                    className="mb-2 p-2 border w-full text-xl"
                    value={banner.link}
                    onChange={(e) => handleInputChange(e, "link", index)}
                  />

                  {/* <button
                    onClick={() => saveIndividualBanner(index)}
                    className={`${getButtonStyle(
                      saveStatus[index]
                    )} rounded px-4 py-2`}
                  >
                    {saveStatus[index] === "saved"
                      ? "Saved!"
                      : saveStatus[index] === "error"
                        ? "Saved!"
                        : `Save Banner ${index + 1}`}
                  </button> */}

                  <button
                    onClick={() => saveIndividualBanner(index)}
                    className={`${getButtonStyle(saveStatus[index])} rounded px-4 py-2 flex items-center justify-center`}
                    disabled={loadingStatus[index]} // Disable button while loading
                  >
                    {loadingStatus[index] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : saveStatus[index] === "saved" ? (
                      "Saved!"
                    ) : saveStatus[index] === "error" ? (
                      "Saved!"
                    ) : (
                      `Save Banner ${index + 1}`
                    )}
                  </button>

                </div>
              ))}

              <div className="flex justify-end space-x-4 mt-[-20px]">
                <button
                  onClick={saveAllBanners}
                  className={`${getButtonStyle(saveAllStatus)} px-4 py-2 rounded`}
                >
                  {saveAllStatus === "saved"
                    ? "All Saved"
                    : saveAllStatus === "error"
                      ? " Saved All!"
                      : "Save All!"}
                </button>
                <button onClick={cancelEdit} className="bg-red-500 px-4 py-2 rounded text-white">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeCur;
