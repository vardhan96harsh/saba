import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import playic from '../assets/images/Curl.png';
import { useApiContext } from '../components/contexts/ApiContext';
import thumb from '../assets/images/thumbnail.jpg';
import arwl from "../assets/images/Arrlw.svg";
import arwr from "../assets/images/ArrWr.svg";

const LatestPod = ({ podcasts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { subData, userId, setSubData } = useApiContext();

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? podcasts.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % podcasts.length);
    };

    const handleThumbnailOrTitleClick = (podcast) => {
        const channelId = podcast.channel_id;
        const isSubscribed = subData[channelId]?.includes(userId);
        // console.log(podcast.channel.toLowerCase().includes('computing'), "nikhil checking");

        if (isSubscribed) {
            // Navigate to the channel page if subscribed and pass the selected podcast
            navigate('/channel', {
                state: {
                    id: channelId,
                    name: podcast.channel,
                    selectedVideoi: podcast,  // Pass the podcast details
                    selectedPodcast: podcast,
                }
            });
        } else {
            // Ask to subscribe if not subscribed
            const confirmSubscribe = window.confirm(
                `You are not subscribed to ${podcast.channel}. Would you like to subscribe?`
            );
            if (confirmSubscribe) {
                addSub(channelId);
                navigate('/channel', {
                    state: {
                        id: channelId,
                        name: podcast.channel,
                        selectedVideoi: podcast,  // Pass the podcast details'
                        selectedPodcast: podcast,
                    }
                });
            }
        }
    };

    const addSub = (channelId) => {
        subData[channelId] = [...(subData[channelId] ?? []), userId];
        setSubData({ ...subData });
        // Optionally, call an API to persist the subscription
    };

    if (!podcasts || podcasts.length === 0) {
        return <div>No podcasts available</div>;
    }
    const truncateText = (text, wordLimit = 35) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return `${words.slice(0, wordLimit).join(' ')}...`;
        }
        return text;
    };

    return (
        <div className="latest-pod mx-auto bg-[#231f20]">
            {/* Heading Section */}
            <div className="relative mb-0 bg-[#231f20]">
                <div className="absolute inset-0  z-0 h-full"></div>
                <div className="relative flex items-center px-[8px] md:px-6 py-4  text-gray-50">
                    <img
                        src={playic}
                        alt="Podcast icon"
                        className="w-[22px] h-[17px] md:w-[42px] md:h-[32px] md:object-cover mt-[-8px] "
                    />
                    <h2 className="text-[17px] sm:text-[18px] md:text-[38px]  ml-2  md:ml-6 tracking-wide">latest podcasts</h2>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="relative bg-[#231f20] p-0 h-auto pb-6 sm:h-[200px] md:h-[280px]  overflow-hidden">
                {/* Left Arrow Button using React Icon */}
                <button
                    onClick={handlePrevClick}
                    className="absolute left-[-5px] md:left-[14px] top-24 md:top-32 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center"
                >
                    <img src={arwl} className="w-[35px] h-[35px]" alt="" />
                </button>

                {/* Slides */}
                <div className="relative flex">
                    {podcasts.map((podcast, index) => (
                        <div
                            key={index}
                            className={`banner w-full flex flex-col ${index === currentIndex ? 'block' : 'hidden'} sm:flex-row `}
                        >

                            <div className="w-full md:w-1/2 flex gap-4 md:gap-8 text-center  relative">
                                {/* Title as Name of Podcast */}
                                <div className="mt-0 md:mt-4  w-40 md:w-60">
                                    <h3
                                        className="text-4xl sm:text-4xl md:text-7xl pt-0 mt-0 ml-10 text-white  text-right cursor-pointer tracking-widest"
                                        onClick={() => handleThumbnailOrTitleClick(podcast)}
                                    >
                                        {podcast.episode}

                                    </h3>
                                    <p
                                        className={`text-black ${podcast.channel.toLowerCase().includes('computing') ? 'bg-[#d4fcff]' : podcast.channel.toLowerCase().includes('printing') ? 'bg-[#eff1fe]' : 'bg-[#e5f1fe]'} text-[10px] md:text-sm pr-1 cursor-pointer tracking-widest text-right`}
                                        onClick={() => handleThumbnailOrTitleClick(podcast)}
                                    >
                                        {podcast.channel}
                                    </p>

                                </div>
                                <div className="mt-0 md:mt-6 items-start text-left w-[90%] sm:w-full sm:mr-0  md:w-full mr-8 md:mr-2">
                                    <p className="text-white text-[20px] leading-6 md:leading-7 md:text-xl xl:text-2xl tracking-widest">{truncateText(podcast.title, 12)}</p>
                                    <div
                                        className={`mt-3 md:mb-0 mb-4 md:mt-3 text-[18px]  xl:text-[18px] leading-none text-white md:text-sm md:leading-6 tracking-widest ${window.innerWidth < 768 ? "line-clamp-3" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: truncateText(podcast.description, 27) }}
                                    />

                                    {/* <p className="text-white text-[12px] mt-2 md:mt-4 md:text-sm tracking-widest hidden md:block"> If you like the podcasts, please rate, share and subscribe!<br /> Spread the word, there is a new episode coming every week</p> */}
                                </div>
                            </div>

                            <div
                                className="mt-4 md:mt-0 p-0 w-full md:w-1/2 cursor-pointer"
                                onClick={() => handleThumbnailOrTitleClick(podcast)}
                            >
                                <img src={podcast.thumbnail} alt={podcast.title} className="ml-6 sm:ml-8 md:ml-6 w-[310px] sm:w-auto md:w-[380px] xl:w-[444px] h-[170px] sm:h-[140px] md:h-[210px] xl:h-[250px] object-fill" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow Button using React Icon */}
                <button
                    onClick={handleNextClick}
                    className="absolute right-0 md:right-[14px] top-24 md:top-32 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center"
                >
                    <img src={arwr} className="w-[35px] h-[35px]" alt="" />
                </button>
            </div>
        </div>
    );
};

export default LatestPod;
