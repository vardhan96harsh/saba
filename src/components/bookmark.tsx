import React, { useRef } from 'react';
import fav from "../assets/images/Favorites.svg";

import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useApiContext } from '../components/contexts/ApiContext';
import arwl from "../assets/images/Arrlw.svg";
import arwr from "../assets/images/ArrWr.svg";


const Bookmark: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { commonData, userId, data } = useApiContext();
  const navigate = useNavigate(); // Initialize useNavigate

  // Get bookmarked video IDs for the current user
  const bookmarkData = commonData?.bookmarkData?.[userId] ?? [];

  // Filter the actual videos that are bookmarked by the user
  const bookmarkedVideos = data?.podcasts?.filter((video) =>
    bookmarkData.includes(video.id)
  ) ?? [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -340, // Adjust the value to scroll more or less
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 340, // Adjust the value to scroll more or less
        behavior: 'smooth',
        
      });
    }
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (video) => {
    // Navigate to the video player page and pass the selected video data
    navigate('/channel', {
      state: {
        id: video.channel_id,
        name: video.channel,
        selectedPodcast: video, // Pass the clicked video details
       openTab: "favorites",
      },
    });
  };

  
  return (
    <div className="relative bg-[#231f20] pt-2 playlist-container">
      <div className="flex items-center mb-4 ml-[9px] md:ml-[24px]">
        <img src={fav} className="w-6 md:w-[30px] h-6 md:h-[40px] mt-[-5px]" alt="" />
        <h2 className="ml-2 md:ml-7 text-[20px] text-white md:text-[38px] tracking-wide">favorites</h2>
      </div>
      {bookmarkedVideos.length > 0 ?(
      <div className="relative flex items-center">
        <button
          className="left-0 md:left-0 z-10 absolute bg-[#231f20] mt-[-60px] md:pl-4 w-[42px] md:w-[80px] h-[185px] text-black"
          style={{ top: '25%' }}
          onClick={scrollLeft}
        >
         <img src={arwl} className="w-[35px] h-[35px]" alt="" />
        </button>

        <div
          className="flex gap-10 md:gap-5 space-x-5 2xl:pr-20 md:space-x-4 xl:space-x-0 2xl:space-x-[7px] mb-10 pr-14 md:pr-20 pl-6 sm:pl-1 md:pl-[70px] xl:pl-[78px]  overflow-x-scroll no-scrollbar"
          ref={scrollContainerRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            } 
          `}</style>

         
          {bookmarkedVideos.map((video) => (
            <div
              key={video.id}
              className="relative flex-shrink-0 shadow-md w-[280px] sm:w-[240px] md:w-[305px] xl:w-[310px] h-[160px] sm:h-[140px] md:h-[170px] cursor-pointer" 
              style={{
                backgroundImage: `url(${video.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
              onClick={() => handleThumbnailClick(video)} 
            >
             
              {/* <div className="bottom-0 left-0 absolute p-2 w-full text-center text-white">
                {video.title}
              </div> */}
            </div>
          ))}

    
          {bookmarkedVideos.length === 0 && (
            <div className="text-white">No bookmarked videos available.</div>
          )}
        </div>

        <button
          className="right-[-20px] md:right-0 absolute bg-[#231f20] mt-[-60px] p-1 md:p-2 w-[60px] h-[185px] text-black focus:outline-none"
          style={{ top: '25%' }}
          onClick={scrollRight}
        >
         <img src={arwr} className="w-[35px] h-[35px]" alt="" />
        </button>
      </div>):(<div className="text-white text-center font-widest">No bookmarked Podcast available.</div>)}
    </div>
  );
};

export default Bookmark;
