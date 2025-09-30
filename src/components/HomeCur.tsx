import React, { useState, useEffect } from 'react';
import { useApiContext } from '../components/contexts/ApiContext';
import useImportCommonData from '@/components/hooks/useImportCommonData';
import { FiX } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import arl from '../assets/images/ArrowLeft.svg';
import arr from '../assets/images/ArrowRight.svg';

interface Banner {
  id: number;
  title: string;
  description: string;
  imgUrl: string | null;
  link: string;
}

const DEFAULT_IMAGE = '/images/default.png';
const bannerColors = ['#E6E6E6', '#94f0fd', '#40defa', '#D4Fcff'];
const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Welcome',
    description: 'to the tech tune-up podcast site for global training.',
    imgUrl: 'images/HC1.png',
    link: '',
  },
  {
    id: 2,
    title: 'Training',
    description: 'Learn the best practices from experts.',
    imgUrl: 'images/HC2.png',
    link: '',
  },
  {
    id: 3,
    title: 'Podcasts',
    description: 'Tune in to the latest episodes.',
    imgUrl: 'images/HC3.png',
    link: '',
  },
  {
    id: 4,
    title: 'Global Network',
    description: 'Connect with a global community.',
    imgUrl: 'images/HC4.png',
    link: '',
  },
];

const HomeCur: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string[]>([]); // Tracks the save status of individual slides
  const [saveAllStatus, setSaveAllStatus] = useState<string>(''); // Tracks the save status for "Save All"
  const { isOwner, setHomeCurData, commonData, setCommonData } =
    useApiContext();
  const { mutateAsync: importCommonData } = useImportCommonData();
  const [banners, setBanners] = useState<Banner[]>(
    commonData.sliderData || DEFAULT_BANNERS
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Initialize saveStatus with "default" for each banner
    setSaveStatus(banners.map(() => 'default'));
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

    if (field === 'title') {
      // Restrict title to a maximum of 15 characters
      if (value.length > 15) {
        updatedValue = value.substring(0, 15);
      }
    }

    if (field === 'description') {
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
  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file upload and store it as a Base64 string
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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
      setLoadingStatus((prev) =>
        prev.map((status, i) => (i === index ? true : status))
      ); // Set loading to true

      const updatedBanner = {
        ...banners[index],
        link: banners[index].link,
      };

      console.log('Saving banner:', updatedBanner);

      const response = await importCommonData({
        ...commonData,
        sliderData: [...banners],
      });

      console.log('API Response:', response);

      const updatedBanners = [...banners];
      updatedBanners[index] = updatedBanner;

      const newCommonData = { ...commonData, sliderData: updatedBanners };
      setCommonData(newCommonData);

      await importCommonData(newCommonData);
      console.log(`Banner ${updatedBanner.id} saved successfully.`);

      setSaveStatus((prev) =>
        prev.map((status, i) => (i === index ? 'saved' : status))
      );
    } catch (error) {
      console.error(`Error saving banner ${banners[index].id}:`, error);

      setSaveStatus((prev) =>
        prev.map((status, i) => (i === index ? 'error' : status))
      );
    } finally {
      setLoadingStatus((prev) =>
        prev.map((status, i) => (i === index ? false : status))
      ); // Reset loading
    }
  };

  const handleRedirectClick = (link: string) => {
    const cleanLink = link?.trim();

    if (cleanLink && /^https?:\/\//i.test(cleanLink)) {
      window.open(cleanLink, '_blank', 'noopener,noreferrer');
    } else {
      alert(
        'This banner does not have a valid link starting with http or https.'
      );
      console.warn('Invalid link:', cleanLink);
    }
  };

  // Save all banners
  const saveAllBanners = async () => {
    setIsEditing(false);
    try {
      const updatedBanners = banners.map((banner) => ({
        ...banner,
        link: banner.link,
      }));

      const newCommonData = { ...commonData, sliderData: updatedBanners };
      setCommonData(newCommonData);

      await importCommonData(newCommonData);
      console.log('All slider data saved successfully.');
      // Update save all status to "saved"
      setSaveAllStatus('saved');
      // Reset individual save statuses
      setSaveStatus(banners.map(() => 'default'));
    } catch (error) {
      console.error('Error saving all slider data:', error);
      setSaveAllStatus('error');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };

  const getButtonStyle = (status: string) => {
    switch (status) {
      case 'saved':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-green-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const [loadingStatus, setLoadingStatus] = useState<boolean[]>(
    banners.map(() => false)
  );
  const currentBanner = banners[currentIndex];

  return (
    <div className='relative h-[180px] w-full overflow-hidden md:h-[240px] lg:h-[310px] xl:h-[335px]  2xl:h-[425px]'>
      <div
        key={currentBanner.id}
        className='pointer-events-auto absolute h-full w-full opacity-100 transition-opacity  duration-1000 ease-in-out'
        style={{
          // ✅ Mobile: show only bg color
          // ✅ Desktop/Tablet: show only image, no bg color
          backgroundColor: isMobile
            ? bannerColors[currentIndex]
            : 'transparent',
          backgroundImage: !isMobile
            ? `url(${
                currentBanner.imgUrl ? currentBanner.imgUrl : DEFAULT_IMAGE
              })`
            : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          cursor: isEditing ? 'default' : 'auto',
        }}
      >
        <div className='absolute left-3 top-1/2 z-10 ml-[-15px] -translate-y-1/2 transform md:ml-1'>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? banners.length - 1 : prev - 1
              )
            }
            className='rounded-full text-black'
          >
            <img
              src={arl}
              className='h-[30px] w-[30px] md:h-[35px] md:w-[35px]'
              alt='Left'
            />
          </button>
        </div>

        <div className='absolute right-0 top-1/2 z-10 mr-[-4px] -translate-y-1/2 transform md:mr-4'>
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
              )
            }
            className='rounded-full text-black'
          >
            <img
              src={arr}
              className='h-[30px] w-[30px] md:h-[35px] md:w-[35px]'
              alt='Right'
            />
          </button>
        </div>

        <div className='inset-0 flex w-[80%] flex-col items-start py-4 md:w-1/2 md:py-12'>
          {currentBanner.title && (
            <>
              <h1 className='items-center pl-8 text-[38px] leading-[38px] text-black md:px-20 md:text-[77px] md:leading-[66px] 2xl:text-[100px] 2xl:leading-[40px]'>
                {currentBanner.title}
              </h1>
              <div className='mt-4 w-full border-t-[2px] border-black 2xl:mt-16'></div>
            </>
          )}

          {currentBanner.description && (
            <>
              <p className='ml-0 py-1 pl-8 text-[15px] font-medium leading-tight md:px-12 md:py-3 md:pl-20 md:text-[35px] md:leading-8 lg:text-[40px] lg:leading-9 2xl:ml-0 2xl:text-[50px] 2xl:leading-snug'>
                {currentBanner.description}
              </p>
              <div className='w-full border-t-[2px] border-black'></div>
            </>
          )}

          {!isEditing && currentBanner.link?.trim().startsWith('http') && (
            <button
              onClick={() => handleRedirectClick(currentBanner.link)}
              className='absolute bottom-2 left-10 border border-[#2073BE] bg-[#002F5A] px-3 py-1 text-[8px] tracking-widest text-white hover:bg-gray-200 md:bottom-4 md:left-20 md:px-2 md:py-1 md:text-xs'
            >
              Learn more
            </button>
          )}

          {isOwner && !isEditing && (
            <button
              onClick={handleEdit}
              className='absolute right-4 top-4 hidden px-2 py-2 text-black md:block'
            >
              <AiOutlineEdit size={20} />
            </button>
          )}
        </div>

        <div className='absolute bottom-2 flex w-full items-center justify-center space-x-1 md:space-x-2'>
          {banners.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => goToSlide(dotIndex)}
              className={`h-[5px] w-[5px] rounded-full md:h-2 md:w-2 ${
                dotIndex === currentIndex ? 'bg-black' : 'bg-black opacity-50'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {isEditing && (
        <>
          <div className='fixed inset-0 z-40 items-center justify-center bg-black opacity-50'></div>

          <div className='shadow-3xl fixed left-1/2 z-50 mt-10 h-[450px] w-[650px] -translate-x-1/2 transform rounded-lg bg-white'>
            <div className='z-50 flex justify-between rounded-lg bg-white pl-3 pt-3 tracking-wider shadow-sm'>
              <h2 className='text-2xl font-bold tracking-wider'>
                Edit Banners
              </h2>
              <FiX
                className='cursor-pointer text-2xl'
                onClick={cancelEdit}
              />
            </div>

            <div className='h-[400px] overflow-auto p-4 tracking-widest'>
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className='mb-6'
                >
                  <h3 className='text-lg font-bold tracking-wider'>
                    Banner {index + 1}
                  </h3>
                  <label className='mb-2 block font-bold tracking-wider'>
                    Title (Max 1 word)
                  </label>
                  <input
                    type='text'
                    className='xl:tracking-wid mb-2 w-full border p-2 text-xl'
                    value={banner.title}
                    onChange={(e) => handleInputChange(e, 'title', index)}
                  />

                  <label className='mb-2 block font-bold xl:tracking-widest'>
                    Description (Max 15 word)
                  </label>
                  <textarea
                    className='mb-2 w-full border p-2 text-lg'
                    value={banner.description}
                    onChange={(e) => handleInputChange(e, 'description', index)}
                  />

                  <label className='mb-2 block font-bold tracking-widest'>
                    Image:
                  </label>
                  <input
                    type='file'
                    onChange={(e) => handleFileUpload(e, index)}
                    accept='image/*'
                    className='mb-4'
                  />

                  <label className='mb-2 block font-bold tracking-widest'>
                    Link:
                  </label>
                  <input
                    type='text'
                    className='mb-2 w-full border p-2 text-xl'
                    value={banner.link}
                    onChange={(e) => handleInputChange(e, 'link', index)}
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
                    className={`${getButtonStyle(
                      saveStatus[index]
                    )} flex items-center justify-center rounded px-4 py-2`}
                    disabled={loadingStatus[index]} // Disable button while loading
                  >
                    {loadingStatus[index] ? (
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    ) : saveStatus[index] === 'saved' ? (
                      'Saved!'
                    ) : saveStatus[index] === 'error' ? (
                      'Saved!'
                    ) : (
                      `Save Banner ${index + 1}`
                    )}
                  </button>
                </div>
              ))}

              <div className='mt-[-20px] flex justify-end space-x-4'>
                <button
                  onClick={saveAllBanners}
                  className={`${getButtonStyle(
                    saveAllStatus
                  )} rounded px-4 py-2`}
                >
                  {saveAllStatus === 'saved'
                    ? 'All Saved'
                    : saveAllStatus === 'error'
                    ? ' Saved All!'
                    : 'Save All!'}
                </button>
                <button
                  onClick={cancelEdit}
                  className='rounded bg-red-500 px-4 py-2 text-white'
                >
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
