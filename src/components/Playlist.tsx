import React, { useRef } from "react";
import arl from "../assets/images/ArrowLeft.svg";
import arr from "../assets/images/ArrowRight.svg";
import { useNavigate } from "react-router-dom";
import playi from "../assets/images/Playlists.svg";
import { useApiContext } from "../components/contexts/ApiContext";

const Playlist = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { data } = useApiContext();


  const getScrollSpeed = () => {
    const width = window.innerWidth;
    if (width >= 1536) return 420; // 2xl
    if (width >= 1280) return 320; // xl
    if (width >= 1024) return 345; // lg
    if (width >= 768) return 260; // md
    return 340; // sm
  };

  const scrollLeft = () => {
    const speed = getScrollSpeed();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -speed,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const speed = getScrollSpeed();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: speed,
        behavior: "smooth",
      });
    }
  };
  const handleThumbnailClick = (subcategory) => {
    const channel = data?.channels?.find((channel) =>
      channel.subcategories?.some((sub) => sub.name === subcategory.name)
    );

    if (channel) {
      const subcategoryVideos = subcategoryData[subcategory.name]?.podcasts || [];
      const firstVideo = subcategoryVideos[0]; // Get the first video of the subcategory

      navigate("/channel", {
        state: {
          id: channel.id,
          name: channel.name,
          openTab: "playlist", // Open the Playlist tab
          selectedPlaylist: subcategory.name, // Pass selected playlist name
          firstVideo: firstVideo || null, // Pass the first video, if available
          playlistVideos: subcategoryVideos, // Pass all videos of the selected subcategory
        },
      });
    } else {
      alert(`No channel found for subcategory: ${subcategory.name}`);
    }
  };



  const subcategoryData = {};

  // Iterate over channels to access subcategories directly
  data?.channels?.forEach((channel) => {
   ;(channel.subcategories || []).forEach((subcategory) => {

      const subcategoryName = subcategory.name;

      // Initialize subcategoryData only if it doesn't exist
      if (!subcategoryData[subcategoryName]) {
        subcategoryData[subcategoryName] = {
          podcasts: [],
          thumbnail: subcategory.image, // Directly use the subcategory image
        };
      }

      // Add podcasts matching the channel and subcategory
           data.podcasts?.forEach((podcast) => {
        if (
          podcast.subcategories?.some((sub) => sub.name === subcategoryName)
        ) {
          subcategoryData[subcategoryName].podcasts.push(podcast);
        }
      });
    });
  });
  // Filter out subcategories without any podcasts
  const filteredSubcategoryData = Object.entries(subcategoryData).filter(
    ([, { podcasts }]) => podcasts.length > 0
  );

  // Then, update the rendering logic to use this data


  return (
    <div className="relative bg-[#F1F1F1] pt-2">
      <div className="flex items-center mb-4 px-4">
        <img
          src={playi}
          alt="Playlist Icon"
          className="z-20 mr-4 ml-[-8px] md:ml-0 border-black w-7 md:w-12 h-7 md:h-[45px] mt-[-4px]"
        />

        <h2 className="ml-[-10px] md:ml-[1px]  font-djr-forma text-[20px] text-black md:text-[38px] tracking-tight md:tracking-wide 2xl:tracking-wide">
          playlists
        </h2>
      </div>

      {filteredSubcategoryData.length > 0 ? (
        <div className="relative flex items-center">
          <button
            className="left-0 md:left-4 z-10 absolute bg-[#F1F1F1] mt-[-50px] w-[40px] md:w-[65px] h-[220px] 2xl:h-[270px] text-black"
            onClick={scrollLeft}
          >
            <img src={arl} className="w-[35px] h-[35px]" alt="" />
          </button>
          <div
            className="flex gap-0 md:gap-2 xl:gap-0 2xl:gap-4 space-x-5 md:space-x-6 mb-10 md:ml-8 pr-14 md:pr-20 2xl:pr-20 pl-5 overflow-x-scroll no-scrollbar"
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            {filteredSubcategoryData.map(([subcategoryName, { thumbnail }], index) => (
              <div
                key={`${subcategoryName}-${index}`}
                className="relative flex-shrink-0 bg-white shadow-md w-[280px] md:w-[315px]   xl:w-[310px] 2xl:w-[380px] h-[180px] md:h-[210px] 2xl:h-[250px] cursor-pointer object-cover"
                style={{
                  backgroundImage: `url(${thumbnail || ""})`,
                  backgroundSize: "contain",
                  backgroundPosition: "bottom",
                }}
                onClick={() => handleThumbnailClick({ name: subcategoryName })} // Navigate to channel on thumbnail click
              >
                <div className="top-0 left-0 absolute bg-[#25baed] w-full text-black tracking-wide">
                  <p className="pl-2 text-[18px] md:text-2xl">{subcategoryName}</p>
                  <div className="w-full h-[2px]"></div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="right-[-10px] md:right-0 absolute bg-[#F1F1F1] mt-[-50px] md:mr-0 p-1 md:p-2 md:w-[60px] h-[220px] 2xl:h-[270px] text-black focus:outline-none"
            onClick={scrollRight}
          >
            <img src={arr} className="w-[35px] h-[35px]" alt="" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">No playlists available.</p>
      )}

    </div>
  );
};

export default Playlist;
