import { useEffect, useState } from 'react';
import { VideoCard } from "../components/videoCard";
import { Channel } from '@/types/types';
import { useLocation, useNavigate } from 'react-router-dom';
//import HeaderHP from '@/components/HeaderHP';
import HomeHeader from '@/components/HomeHeader';
import { useApiContext } from '../components/contexts/ApiContext';
import useImportSubData from '@/components/hooks/useImportSubData';

import HomeCur from '@/components/HomeCur';
import LatestPod from '@/components/LatestPod';
import Announcement from '@/components/Announcement';
import HostList from '@/components/HostList';
import Playlist from '@/components/Playlist';
import Bookmark from '@/components/Bookmark';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subData, userId, setSubData, data } = useApiContext();


  const [currentIndex, setCurrentIndex] = useState(0); // Track current index for navigation
  const chunkSize = 2; // Number of channels to show at a time



  // Updated to separate subscribed and new channels
  const channels = data?.channels?.map((channel) => {
    return {
      total_video: data.podcasts?.reduce((n, podcast) => podcast.channel_id === channel.id ? n + 1 : n, 0),
      isSubbed: subData[channel.id + '']?.includes(userId),
      backgroundImage: channel.name.toLowerCase().includes('computing') ? "./images/computing.webp" : channel.name.toLowerCase().includes('printing')
        ? "./images/printing.webp" : "./images/DC3.webp",
      ...channel
    };
  });


  // let latestpd = data.podcasts?.slice(-4);
  // let latestpd = data.podcasts?.slice(0, 4); // Get the latest 4 podcasts
  // let latestpd = data.podcasts?.slice(-4).reverse();
  // let latestpd = data.podcasts?.slice(-4).sort((a, b) => b.episode - a.episode);

  let latestpd = data.podcasts
  ?.sort((a, b) => b.episode - a.episode) // Sort all data in descending order
  ?.slice(0, 4); // Take the first 4 after sorting


  const newChannels = channels;

  // Navigation handler when clicking on the thumbnail
  // const handleThumbnailClick = (channel_data: Channel) => {
  //   if (channel_data.isSubbed) {
  //     navigate('/channel', { state: channel_data });
  //   }
  // };

  const handleThumbnailClick = (channel_data) => {
  if (channel_data.isSubbed) {
    navigate('/channel', { state: { ...channel_data, openTab: channel_data.name } });
  }
};



  useEffect(() => {
    document.title = "Welcome to Podcast";
  }, []);


  const handleSubscribe = (subscribe: boolean, channel_id: string) => {
    if (subscribe) {
      removeSub(channel_id);  // Unsubscribe logic
    } else {
      addSub(channel_id);  // Subscribe logic
    }
  };

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };


  const newChannelChunks = chunkArray(newChannels, chunkSize);

  // const newChannelChunks = chunkArray(newChannels, 4);

  const { mutateAsync } = useImportSubData();

  const addSub = (channel_id: string) => {
    subData[channel_id] = [...(subData[channel_id] ?? []), userId];
    setSubData({ ...subData });
    mutateAsync();
  };

  const removeSub = (channel_id: string) => {
    subData[channel_id] = (subData[channel_id] ?? []).filter(a => a !== userId);
    setSubData({ ...subData });
    mutateAsync();
  };


  // Handle sliding to next and previous set of channels
  const handleNext = () => {
    if (currentIndex < newChannelChunks.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };


  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const playlists = (data?.podcasts || []).map((podcast) => ({
    id: podcast.id,
    title: podcast.title,
    description: podcast.description,
    imgSrc: podcast.thumbnail || './images/default-thumbnail.png', // Default thumbnail
    subcategory: podcast.subcategories  // Default subcategory
  }));

  console.log('Playlists Data:', playlists); // Debugging to verify subcategory names

  console.log('Playlists:', playlists);


  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.href);
    return {
      videoId: params.get("videoId"),
      title: params.get("title") ? decodeURIComponent(params.get("title")) : "",
      channelId: params.get("channelId"),
      channelName: params.get("channelName") ? decodeURIComponent(params.get("channelName")) : "",
      videoUrl: params.get("videoUrl") ? decodeURIComponent(decodeURIComponent(params.get("videoUrl"))) : "",
      publishDate: params.get("publishDate"),
    };
  };
  

  // Redirect to ChannelPage if URL has video data
  // useEffect(() => {
  //   console.log("Raw location.search:", window.location.href);
  //   console.log("Raw location.search:", window.location.search);
  //   const queryData = getQueryParams();
  //   console.log("Checking query params:", queryData);
  
  //   if (queryData.videoId && queryData.channelId) {
  //     console.log("Redirecting to ChannelPage with video data...", queryData);
  //     navigate('/channel', {
  //       state: {
  //         id: queryData.channelId,
  //         selectedVideoi: {
  //           id: queryData.videoId,
  //           title: queryData.title,
  //           channel_id: queryData.channelId,
  //           channel: queryData.channelName,
  //           wise_link: queryData.videoUrl,
  //           publish_date: queryData.publishDate,
  //         },
  //         openTab: queryData.channelName,
  //       }
  //     });
  //   } else {
  //     console.log("No valid video data in the URL.");
  //   }
  // }, []);
  




  return (
    <main>
      <div className="w-100 h-screen antialiased font-sans bg-[#E6E6E6] overflow-hidden overflow-y-auto">
        <div className=" w-100 mx-auto">
          {/* <HeaderHP /> */}
          <HomeHeader />
          <HomeCur />

          {latestpd && <LatestPod podcasts={latestpd} />}


          <section className="rounded-sm relative">
            <div className="">
              <img src="./images/Divider 1.png" className="w-full h-8" alt="Header Image" />
            </div>
          </section>

          {/* New Podcast Channels Section */}
          <section className="relative   lg:flex shadow-md rounded-sm ">
            <div className="  w-full lg:w-1/2  flex justify-center items-center  bg-[#40DEFA] ">
              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <HiChevronLeft
                  onClick={handlePrev}
                  className={`w-8 h-8 fill-black  cursor-pointer hover:scale-125 transition-transform duration-300 ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                />)}
              {/* Display Channels */}
              <div className="relative flex gap-0 ">
                {newChannelChunks[currentIndex]
                  ?.slice() // Create a copy to avoid mutating the original array
                  // Sort channels alphabetically by name
                  .map((d, index) => (
                    <div className="flex items-center" key={index}>
                      <VideoCard
                        channelId={d.id + ''}
                        onClick={() => handleThumbnailClick(d)}
                        bgImg={d.backgroundImage}
                        title={d.name}
                        description={d.description}
                        videos={d.total_video + ""}
                        members={(subData[d.id + ''] ?? []).length + ''}
                        isSubsUnsubs={d.isSubbed}
                        isDisabled={false}
                        handleSubscribe={handleSubscribe}
                        icon={d.icon}
                      />
                      {/* Add a vertical line between the channels */}
                      {index < newChannelChunks[currentIndex].length - 1 && (
                        <div className="w-[3px] h-64 bg-black mx-3  2xl:mx-0 "></div>
                      )}
                    </div>
                  ))}
              </div>

              {currentIndex < newChannelChunks.length - 1 && (


                <HiChevronRight
                  onClick={handleNext}
                  className={`w-8 h-8 fill-black   cursor-pointer hover:scale-125 transition-transform duration-300 ${currentIndex >= newChannelChunks.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                />)}
            </div>


            <div className='w-1/2'> <HostList /></div>
          </section>


        </div>
        <Playlist playlists={playlists} />
        <section className="rounded-sm relative">
          <div className="">
            <img src="./images/Divider 1.png" className="w-full h-3" alt="Header Image" />
          </div>
        </section>
        <Bookmark />
        <section className="rounded-sm relative">
          <div className="">
            <img src="./images/Divider 1.png" className="w-full h-3" alt="Header Image" />
          </div>
        </section>
        <Announcement />
        <div className='py-8 bg-[#2bace3]'> </div>
      </div>
    </main>
  );
};

export default Home;








