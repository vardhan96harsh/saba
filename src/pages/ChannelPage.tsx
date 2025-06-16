import React, { Fragment, useEffect, useState, useRef } from "react";
import { Menu, Transition, Tab } from "@headlessui/react";
import { MdPlayCircle } from "react-icons/md";
import Slider from "react-slick";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ named import instead of side-effect
import 'jspdf-autotable';
import { Button } from "../components/dataEntry";
import { CommentBox } from '../components/CommentBox';
import { AddComment } from "../components/AddComment";
import { useApiContext } from "../components/contexts/ApiContext";
import HostPopUp from "../components/HostPopUp";
import { MdCalendarMonth } from "react-icons/md";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { PiDotsThreeBold } from "react-icons/pi";
import useImportCommentData from "@/components/hooks/useImportCommentData";
import useImportSubData from "@/components/hooks/useImportSubData";
import Rating from '@mui/material/Rating';
import { fetchVideoDataFromUrl } from "./helpers";
import useImportRatingData from "@/components/hooks/useImportRatingData";
import HomeHeader from "@/components/HomeHeader";
import { Bookmark, BookmarkBorder, Favorite } from "@mui/icons-material";
import useImportCommonData from '@/components/hooks/useImportCommonData';
import Addboxx from "@/components/Addboxx";
import { ImDownload3 } from "react-icons/im";
import arwl from "../assets/images/Arrlw.svg";
import arwr from "../assets/images/ArrWr.svg";
import PlaylistC from "../assets/images/PlaylistC.svg";
import RateStar from "../assets/images/RateStar.svg";
import oBM from "../assets/images/Favorites.svg";
import fBM from "../assets/images/FillFavldpi.svg";
import backi from "../assets/images/backb.svg";
import { useParams } from "react-router-dom"; 


const calculateHostVideoCounts = (podcasts) => {
  const hostCounts = {};
  podcasts.forEach((podcast) => {
    if (podcast.hosts && Array.isArray(podcast.hosts)) {
      podcast.hosts.forEach((hostId) => {
        hostCounts[hostId] = (hostCounts[hostId] || 0) + 1;
      });
    }
  });
  return hostCounts;
};

const calculateAverageRating = (ratings) => {
  const totalRatings = Object.values(ratings).reduce((acc, rating) => acc + rating, 0);
  const numberOfRatings = Object.keys(ratings).length;
  return numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const truncateTitle = (title="", wordLimit) => {
  const words = title.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return title;
};

const CarouselItem = ({ bgImg, video, onClick, isSelected, hideEpisodeText }) => (
  <div
    className={`relative cursor-pointer ml-2   mt-4 2xl:mt-2 pb-12 ${isSelected ? "border-[#40defa] border-2" : " border-1"}`}
    onClick={onClick}
  >
    <img src={video.thumbnail || bgImg} alt={video.title} className=" w-full h-[150px] md:h-[150px] xl:h-[180px] 2xl:h-[210px]  " />
    <div className={`absolute bottom-0 left-0 w-full mt-2 text-black min-h-[3rem] flex items-center justify-center text-center ${isSelected ? "bg-[#40defa] text-black" : " border-1"}`}>
      {!hideEpisodeText && (
        <span className={`font-goodHeadlineRegular text-lg ${isSelected ? "text-black" : "text-white"}`}>
          Ep.{video.episode} - {truncateTitle(video.title, 2)}
        </span>
      )}
    </div>
  </div>
);

function ChannelPage() {
  const [carouselPositions, setCarouselPositions] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { id, selectedVideoi, channel, selectedSubcategoryi } = location.state || {};

  const { data,hostData, subData, userId, commentData, setCommentData, setSubData, ratingData, setRatingData, isOwner, isPartner, setCommonData, commonData } = useApiContext();
  const channel_data = location.state;
  const selectedPodcast = channel_data?.selectedPodcast;
  const { mutateAsync } = useImportCommentData();
  const { mutateAsync: mutateSubsAsync } = useImportSubData();
  const { mutateAsync: mutateRatingsAsync } = useImportRatingData();
  const { mutateAsync: saveCommonData } = useImportCommonData();
  const bookmarkData = commonData?.bookmarkData?.[userId] ?? [];
  const playlistVideos = channel_data?.playlistVideos || [];
  const [hoverText, setHoverText] = useState("");
  const { channelId } = useParams();  // State to hold the text for hover
  // const [hoveredIcon, setHoveredIcon] = useState(null); // State to track which icon is hovered
  // Get the first video of the subcategory


  let arrangedPodcast = {};
  let podcasts = data.podcasts?.reduce((n, podcast) => {
    if (podcast.channel_id === channel_data.id) {
      n.push(podcast);
    }
    return n;
  }, []);

  let defaultImg = channel_data?.name?.toLowerCase().includes('computing') ? "./images/i5.webp" : "./images/i6.webp";

  const [getSubsUnsubs, setSubsUnsubs] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  // const [selectedVideo, setSelectedVideo] = useState(selectedVideoi|| podcasts[0]);
  const [selectedVideo, setSelectedVideo] = useState(selectedVideoi || podcasts[0]);
  useEffect(() => {
    if (data && data.videos) {
      if (selectedVideoi) {
        const video = data.videos.find((video) => video.id === selectedVideoi);
        if (video) handleSelectedVideo(video);
      } else {
        if (selectedPodcast) {
          handleSelectedVideo(selectedPodcast);
        } else if (podcasts.length > 0) {
          handleSelectedVideo(podcasts[0]);
        }
      }
    }
  }, [data, selectedVideoi, selectedPodcast, podcasts]);



  const [showFullTags, setShowFullTags] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPodcasts, setFilteredPodcasts] = useState(podcasts);


  let comments = commentData[selectedVideo?.id] ?? [];
  let ratings = ratingData[selectedVideo?.id] ?? {};
  let videoRating = ratings[userId] ?? '';

  const [isHostPopUpOpen, setIsHostPopUpOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const videoRef = useRef(null);
  let subscribed = subData[channel_data.id + '']?.includes(userId);

  const videoHost = (hostData || []).filter(host =>
    (selectedVideo?.hosts || []).includes(host.host_id)
  );
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');



  const toggleBookmark = async (videoId, isBookMarked) => {
    let updatedBookmarks;

    // Toggle the bookmark by adding or removing the video ID
    if (isBookMarked) {
      updatedBookmarks = bookmarkData.filter((id) => id !== videoId);
    } else {
      updatedBookmarks = [...bookmarkData, videoId];
    }


    const updatedCommonData = {
      ...commonData,  // Spread the existing commonData
      bookmarkData: { // Update only bookmarkData for the current user
        ...commonData.bookmarkData,
        [userId]: updatedBookmarks,
      },
    };


    setCommonData(updatedCommonData);


    await saveCommonData(updatedCommonData);
  };


  const handleComment = (comment) => {

    comments = commentData[selectedVideo?.id] ?? [];
    comments.unshift(comment);
    commentData[selectedVideo.id] = comments;
    setCommentData({ ...commentData });
    setShowAllComments(false);
    setRatingData({ ...ratingData, [selectedVideo.id]: { [userId]: videoRating } });
    mutateAsync();
  };

  const handleDeleteComment = async (commentId) => {
    try {

      const updatedComments = comments.filter((comment) => comment.id !== commentId);

      setCommentData({ ...commentData, [selectedVideo.id]: updatedComments });


      await mutateAsync({
        videoId: selectedVideo.id,
        comments: updatedComments,
      });

      alert("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);

    }
  };


  const handleEditComment = async (commentId) => {
    try {

      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, comment: editedComment };
        }
        return comment;
      });


      setCommentData({
        ...commentData,
        [selectedVideo.id]: updatedComments,
      });


      await mutateAsync({
        videoId: selectedVideo.id,
        comments: updatedComments,
      });


      setEditingCommentId(null);
      setEditedComment('');

      alert('Comment updated successfully.');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update the comment. Please try again.');
    }
  };

  const handleDownloadCommentsAsPDF = () => {
    const videoTitle = selectedVideo?.title || 'No Title';
    const commentsData = commentData[selectedVideo?.id] || [];

    if (!commentsData || commentsData.length === 0) {
      alert('No comments available for download.');
      return;
    }

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(` ${videoTitle}`, 14, 22);

    // Define columns and rows for the table
    const columns = ['Username', 'Comment'];
    const rows = commentsData.map(comment => {
      const isOwnerComment = comment.user_id === userId; // Check if it's the owner
      return [
        // comment.user_id ? comment.user_id : 'N/A', // Use 'N/A' if user_id is not available
        comment.name ? comment.name : 'N/A', // Use 'N/A' if name is not available
        comment.comment || 'N/A' // Comment text
      ];
    });

    // Add the Table to PDF
    autoTable(doc,{
      startY: 40,  // Start after the title
      head: [columns],
      body: rows,
      theme: 'striped',
      margin: { top: 10 },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save(`comments_${selectedVideo?.id}.pdf`);
  };

  const [showRating, setShowRating] = useState(false); // State to control visibility of Rating


  // Handle showing/hiding the rating component
  const handleStarClick = () => {
    setShowRating(!showRating); // Toggle visibility on star click
  };


  const handleRating = async (value) => {
    // Check if the user has already rated
    if (ratings[userId]) {
      alert('You have already rated this video.');
      return;
    }
    // Show the rating confirmation alert
    const confirmRating = window.confirm(`You have rated ${value} stars. Do you want to submit this rating?`);

    if (!confirmRating) {

      // If the user cancels, do nothing
      return;
    }
    setShowRating(false);
    // Update the rating for the selected video
    ratings = { ...ratingData[selectedVideo?.id], [userId]: value };
    setRatingData({ ...ratingData, [selectedVideo.id]: ratings });

    // Save the rating to the server
    await mutateRatingsAsync({ videoId: selectedVideo.id, userId, rating: value });

  };

  const handleVideoClick = (action) => {
    setIsVideoPlaying(action);
  };

  // const handleSelectedVideo = async (video) => {
  //   let linkData = await fetchVideoDataFromUrl(video.link);
  //   if (linkData) {
  //     let len = linkData.sources?.length - 1;
  //     video = { ...video, wise_link: linkData?.sources[len]?.src }; // Ensure video has wise_link
  //   }
  //   setSelectedVideo(video);
  // };

  const handleSelectedVideo = (video) => {
    setSelectedVideo(video);
  };
  


  const handleVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
        handleVideoClick(false);
      } else {
        video.play();
        handleVideoClick(true);
      }
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleButtonClick = () => {
    setSubsUnsubs((prevSubsUnsubs) => !prevSubsUnsubs);
  };

  const handleDownload = (videoUrl) => {
    if (videoUrl) {
      const newTab = window.open(videoUrl, '_blank');
      if (newTab) {
        setTimeout(() => {
          newTab.document.body.innerHTML = `<a id="downloadLink" href="${videoUrl}" download="video_${selectedVideo?.episode}.mp4"></a>`;
          const downloadLink = newTab.document.getElementById('downloadLink');
          downloadLink.click();
        }, 500);
      } else {
        alert('Pop-up blocker is enabled. Please allow pop-ups for this website.');
      }
    } else {
      alert('Video URL not available');
    }
  };

  const subscribedChannels = data.channels.filter(channel =>
    subData[channel.id]?.includes(userId)
  );

  const tabs = [
    ...subscribedChannels.map(channel => channel.name), // Subscribed channels
    "playlists", // Playlist tab
    "favorites", // Favorites tab
  ];

 





  const [selectedTab, setSelectedTab] = useState(0);
  const isInitialTabSet = useRef(false);
  const allSubscribedPodcasts = data.podcasts?.filter(podcast => subData[podcast.channel_id]?.includes(userId));



  const resetFilteredPodcasts = () => {
    if (selectedTab < data.channels.length) {
      const selectedChannel = data.channels[selectedTab];
      setFilteredPodcasts(data.podcasts.filter(podcast => podcast.channel_id === selectedChannel.id));
    }
  };



  useEffect(() => {
    // const fetchVideosForTab = () => {
    //   if (selectedTab < subscribedChannels.length) {
    //     // For subscribed channels
    //     const selectedChannel = subscribedChannels[selectedTab];
    //     const channelVideos = data.podcasts.filter(
    //       podcast => podcast.channel_id === selectedChannel.id
    //     );
    //     setFilteredPodcasts(channelVideos);
    //   } else if (selectedTab === subscribedChannels.length) {
    //     // For Playlist tab
    //     const playlistVideos = data.podcasts.filter(podcast => podcast.is_playlist);
    //     setFilteredPodcasts(playlistVideos);
    //   } else if (selectedTab === subscribedChannels.length + 1) {
    //     // For Favorites tab
    //     const favoriteVideos = data.podcasts.filter(podcast =>
    //       bookmarkData.includes(podcast.id)
    //     );
    //     setFilteredPodcasts(favoriteVideos);

    //     // Pre-select the video passed via state (if any)
    //     if (location.state?.selectedPodcast) {
    //       setSelectedVideo(location.state.selectedPodcast);
    //     } else if (favoriteVideos.length > 0) {
    //       setSelectedVideo(favoriteVideos[0]); // Default to the first favorite video
    //     }
    //   }
    // };

    // fetchVideosForTab();
  const fetchVideosForTab = () => {
  if (selectedTab < subscribedChannels.length) {
    const selectedChannel = subscribedChannels[selectedTab];
    const channelVideos = data.podcasts.filter(
      podcast => podcast.channel_id === selectedChannel.id
    );
    setFilteredPodcasts(channelVideos);
    if(channelVideos.length > 0) {
      setSelectedVideo(channelVideos[0]);
    } else {
      setSelectedVideo(null);
    }
  } else if (selectedTab === subscribedChannels.length) {
    const playlistVideos = data.podcasts.filter(podcast => podcast.is_playlist);
    setFilteredPodcasts(playlistVideos);
    if(playlistVideos.length > 0) {
      setSelectedVideo(playlistVideos[0]);
    } else {
      setSelectedVideo(null);
    }
  } else if (selectedTab === subscribedChannels.length + 1) {
    const favoriteVideos = data.podcasts.filter(podcast =>
      bookmarkData.includes(podcast.id)
    );
    setFilteredPodcasts(favoriteVideos);

    if (location.state?.selectedPodcast) {
      setSelectedVideo(location.state.selectedPodcast);
    } else if (favoriteVideos.length > 0) {
      setSelectedVideo(favoriteVideos[0]);
    } else {
      setSelectedVideo(null);
    }
  }
};

  
  }, [selectedTab, data, bookmarkData, location.state?.selectedPodcast]);

 
  


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = selectedVideo.wise_link;
    }
  }, [selectedVideo]);

  useEffect(() => {
    resetFilteredPodcasts();
  }, [selectedTab]);


  const isInitialVideoSet = useRef(false); // Track whether the initial video has been set

  useEffect(() => {
    // Set the selected video only on the initial load or navigation
    if (!isInitialVideoSet.current) {
      if (location.state?.firstVideo) {
        handleSelectedVideo(location.state.firstVideo);
      } else if (!selectedVideo && podcasts.length > 0) {
        handleSelectedVideo(podcasts[0]);
      }
      isInitialVideoSet.current = true; // Mark the initial setup as complete
    }
  }, [location.state, podcasts, selectedVideo]);

 


  useEffect(() => {
    if (!isInitialTabSet.current) {
      if (location.state?.openTab === 'favorites') {
        // Set the Favorites tab (last index)
        setSelectedTab(subscribedChannels.length + 1);
        isInitialTabSet.current = true;
      } else if (location.state?.openTab === 'playlist') {
        // Set the Playlist tab (second last index)
        setSelectedTab(subscribedChannels.length);
        isInitialTabSet.current = true;

        // Set selected playlist if passed
        if (location.state?.selectedPlaylist) {
          setSelectedSubcategory(location.state.selectedPlaylist); // Highlight the selected playlist
        }
      } else if (channel_data?.id) {
        // Find the index of the channel in subscribedChannels
        const selectedChannelIndex = subscribedChannels.findIndex(
          (channel) => channel.id === channel_data.id
        );

        if (selectedChannelIndex >= 0) {
          setSelectedTab(selectedChannelIndex); // Set the initial tab
          isInitialTabSet.current = true;
        }
      }
    }
  }, [location.state, channel_data, subscribedChannels]);


  useEffect(() => {
    if (selectedVideoi) {
      setSelectedVideo(selectedVideoi); // Set the video directly if selected
    } else if (selectedSubcategoryi) {
      // Filter videos based on the selected subcategory
      const filteredVideos = data.podcasts.filter((podcast) =>
        podcast.subcategories?.some((sub) => sub.name === selectedSubcategoryi)
      );
      setFilteredPodcasts(filteredVideos);
    } else if (id) {
      // Fallback to channel videos
      const channelVideos = data.podcasts.filter((podcast) => podcast.channel_id === id);
      setFilteredPodcasts(channelVideos);
    }
  }, [selectedVideoi, selectedSubcategoryi, id, data]);
  useEffect(() => {
    if (!selectedVideoi && !selectedSubcategoryi && id) {
      const defaultVideos = data.podcasts.filter((podcast) => podcast.channel_id === id);
      if (defaultVideos.length) {
        setSelectedVideo(defaultVideos[0]);
      }
    }
  }, [selectedVideoi, selectedSubcategoryi, id, data]);



  const getShortenedText = (text="", wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const renderTags = () => {
    const tags = selectedVideo?.tags?.map(tag => `#${tag}`).join(' ');
    return showFullTags ? tags : getShortenedText(tags ?? '', 4);
  };

  const renderDescription = () => {
    const description = selectedVideo?.description || '';
    const wordLimit = 50;
    const words = description.split(' ');

    if (words.length > wordLimit) {
      return showFullDescription
        ? description
        : words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };


  const Arrow = ({ direction, onClick, disabled }) => (
    <div
      onClick={!disabled ? onClick : null}
      className={`absolute top-1/2 transform -translate-y-1/2 ${direction === "next" ? "right-[-2rem] md:right-[-30px] xl:right-[-57px] 2xl:right-[-70px]" : "left-[-2rem] md:left-[-25px] xl:left-[-3rem] 2xl:left-[-4rem]"}
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
    >
      {direction === "next" ? (

        <img src={arwr} className="w-[35px]  h-[35px] md:w-[20px] md:h-[50px] xl:w-[60px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px]" alt="" />
      ) : (
        <img src={arwl} className="w-[35px]  h-[35px] md:w-[20px] md:h-[50px] xl:w-[60px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px]" alt="" />
      )}
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    beforeChange: (current, next) => {
      setCarouselPositions((prev) => ({
        ...prev,
        [selectedTab]: next, // Track position for the selected tab
      }));
    },
    initialSlide: carouselPositions[selectedTab] || 0, // Use saved position for the selected tab
  };

  const hostVideoCounts = calculateHostVideoCounts(data.podcasts || []);
  const openHostPopUp = (host) => {
    const hostDetails = host;
    if (hostDetails) {
      setSelectedHost(hostDetails);
      setIsHostPopUpOpen(true);
    } else {
      console.error(`Host not found.`);
    }
  };

  const closeHostPopUp = () => {
    setIsHostPopUpOpen(false);
    setSelectedHost(null);
  };

  const addSub = (channel_id) => {
    subData[channel_id] = [...(subData[channel_id] ?? []), userId];
    setSubData({ ...subData });
    mutateSubsAsync();
  };

  const removeSub = (channel_id) => {
    subData[channel_id] = (subData[channel_id] ?? []).filter(a => a !== userId);
    setSubData({ ...subData });
    mutateSubsAsync();
  };

  const handleSubscribe = (subscribe, channel_id) => {
    if (subscribe) {
      return removeSub(channel_id);
    }
    addSub(channel_id);
  };
  function VideoSlider({ videos }) {
    // Sort videos in descending order
    const sortedVideos = [...videos].sort((a, b) => b.episode - a.episode);

    return sortedVideos.length > 0 ? (
      <div className="w-full px-10 md:px-10 xl:px-[60px] xl:mt-2 2xl:mt-4 2xl:px-[75px]">
        <Slider {...settings}>
          {sortedVideos.map((video, index) => (
            <div key={index} className="">
              <CarouselItem
                bgImg={video.thumbnail || defaultImg}
                video={video}
                onClick={() => setSelectedVideo(video)}
                isSelected={selectedVideo?.id === video.id}
              />
            </div>
          ))}
        </Slider>
      </div>
    ) : (
      <div className="text-center text-gray-500">No videos found.</div>
    );
  }

  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Track selected subcategory

  function PlaylistSlider() {
    const { data } = useApiContext(); // Fetch data from context

    // Group videos by subcategory
    const subcategories = {};
    data?.channels?.forEach((channel) => {
      channel.subcategories.forEach((subcategory) => {
        if (!subcategories[subcategory.name]) {
          subcategories[subcategory.name] = {
            videos: [],
            image: subcategory.image || "path/to/default/image.jpg", // Fallback image
          };
        }
        subcategories[subcategory.name].videos = data.podcasts
          ?.filter((podcast) =>
            podcast.subcategories?.some((sub) => sub.name === subcategory.name)
          )
          .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date)); // Sort by latest first


          
      });
    });
    

    // Filter subcategories to include only those with videos
    const filteredSubcategories = Object.entries(subcategories).filter(
      ([, { videos }]) => videos.length > 0
    );

    const subcategoryList = filteredSubcategories.map(([name]) => name);

    if (subcategoryList.length === 0) {
      return (
        <div className="py-24 md:ml-[45%] ml-[20%] text-center text-gray-500 tracking-widest">
          No Playlist Available
        </div>
      );
    }

    const handleSubcategoryClick = (subcategory) => {
      setSelectedSubcategory(subcategory);
    };

    const handleBackToSubcategories = () => {
      setSelectedSubcategory(null); // Reset to show all subcategories
    };

    const currentSubcategory = selectedSubcategory || subcategoryList[0];

    return (
      <div className="flex h-[225px] md:h-[240px] xl:h-[273px] 2xl:h-[306px] py-0">
        {selectedSubcategory && (
          <div
            className="w-[320px] md:w-[240px] xl:w-[300px] 2xl:w-[350px] h-[190px] 2xl:h-[220px] md:absolute hidden md:block flex-col ml-2 md:ml-8 mt-0 xl:mt-5 2xl:mt-4 2xl:ml-10"
            onClick={() => handleSubcategoryClick(currentSubcategory)}
          >
            <div className="w-full h-full md:mt-10 xl:mt-5 2xl:mt-8">
              <img
                src={subcategories[currentSubcategory].image}
                alt={currentSubcategory}
                className="w-full h-[140px] md:h-[145px] xl:h-[180px] 2xl:h-[210px]"
              />
            </div>
            <div className="text-center text-white text-lg md:mt-3">
              {currentSubcategory}
            </div>
          </div>
        )}

        <div
          className={`px-10 md:px-[55px] md:ml-[-15px] xl:ml-0 xl:px-[60px] 2xl:px-[80px] md:absolute 2xl:mt-3 mt-0 md:mt-0 xl:mt-0 ${selectedSubcategory
            ? "md:w-[1150px] xl:w-[1380px] 2xl:w-[1750px]"
            : "w-[340px] md:w-[1150px] xl:w-[1380px] 2xl:w-[1750px]"
            }`}
        >
          {selectedSubcategory ? (
            // Show all videos under the selected subcategory
            <div className="ml-[0px] md:ml-[300px] xl:ml-[350px] 2xl:ml-[450px]">
              <div className="md:block md:left-[290px] xl:left-[350px] 2xl:left-[425px] absolute hidden bg-[#40defa] mt-2 2xl:mt-3 mb-[16px] w-[2px] h-[215px] xl:h-[240px] 2xl:h-[250px]"></div>
              <button
                className="text-black ml-[-45px] 2xl:ml-[-65px] 2xl:mt-[-12px]"
                onClick={handleBackToSubcategories}
              >
                <img
                  src={backi}
                  alt=""
                  className="w-[35px] xl:w-[40px] 2xl:w-[50px] mb-[-15px] xl:mb-[-20px] 2xl:mb-[-15px]"
                />
              </button>
              <Slider
                className="w-[260px] md:w-full xl:w-[950px] 2xl:w-[1180px] mt-[-25px] md:mt-0"
                {...{
                  ...settings, // Inherit default settings
                  slidesToShow: 3, // Override to show 3 thumbnails
                }}
              >
                {subcategories[selectedSubcategory].videos.map((video, index) => (
                  <CarouselItem
                    key={index}
                    bgImg={
                      video.thumbnail || subcategories[selectedSubcategory].image
                    }
                    video={video}
                    onClick={() => {
                      handleSelectedVideo(video);
                    }}
                    isSelected={selectedVideo?.id === video.id}
                  />
                ))}
              </Slider>
            </div>
          ) : (
            // Show each subcategory with its image and name
            <Slider {...settings}>
              {filteredSubcategories.map(([subcategory, subcategoryData], index) => (
                <div key={index} className="">
                  <CarouselItem
                    bgImg={subcategoryData.image}
                    video={{ title: subcategory }}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    isSelected={subcategory === selectedSubcategory}
                    hideEpisodeText={true}
                  />
                  <div className="text-center text-white mt-[-40px]">
                    {subcategory}
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    );
  }

  function Favoritevideos() {
    const bookmarkData = commonData?.bookmarkData?.[userId] ?? [];
    const bookmarkedVideos = data?.podcasts?.filter(video =>
      bookmarkData.includes(video.id)
    ) ?? [];



    // Find the most recently added bookmarked video
    const mostRecentBookmarkedVideo = bookmarkedVideos.length > 0
      ? bookmarkedVideos.reduce((latest, video) => {
        const latestDate = new Date(latest.publish_date);
        const videoDate = new Date(video.publish_date);
        return videoDate > latestDate ? video : latest;
      })
      : null;

    if (bookmarkedVideos.length === 0) {
      return (
        <div className="md:ml-[45%] ml-[20%] py-20  2xl:py-28 text-center text-gray-500">
          No favorite episodes found.
        </div>
      );
    }

    return (
      <div className="flex h-[225px]  md:h-[230px] xl:h-[265px] 2xl:h-[290px] xl:mt-2 2xl:mt-4">



        <div className="absolute px-10 md:px-[40px] xl:px-[50px] 2xl:px-[80px] md:w-full    w-[340px]  ">
          <Slider {...settings}>
            {bookmarkedVideos.map((video, index) => (
              <CarouselItem
                key={index}
                bgImg={defaultImg}
                video={video}
                onClick={() => setSelectedVideo(video)}
                isSelected={selectedVideo?.id === video.id}
              />
            ))}
          </Slider>
        </div>
      </div>
    );
  }

  const numOfPodcasts = podcasts.length;
  const averageRating = calculateAverageRating(ratings);

  const countWords = (str) => {
    return str.split(" ").filter(function (n) { return n !== '' }).length;
  };


  return (
    <div className="bg-gray-100   h-screen font-sans antialiased overflow-hidden overflow-y-auto">
      <div className="mx-auto  ">

        <HomeHeader />

        {selectedVideo ? (
          <>
            <section className="relative bg-[#231f20] py-4">
              <div className="relative flex flex-col flex-1 justify-center items-center  overflow-hidden isolate">
                {/* <video
                  ref={videoRef}
                  key={selectedVideo.id}
                  autoPlay={false}
                  className="w-fill h-[200px] md:h-[600px] xl:h-[650px] 2xl:h-[800px] aspect-video"
                  playsInline
                  controls
                  poster={selectedVideo?.thumbnail ? selectedVideo?.thumbnail : defaultImg}
                  onPlay={() => handleVideoClick(true)}
                  onPause={() => handleVideoClick(false)}
                >
                  <Fragment key={selectedVideo.id}>
                    <source key={selectedVideo.id} src={selectedVideo?.link} type="video/mp4" />
                  </Fragment>
                  Your browser does not support the video tag.
                </video> */}
                <iframe
  src={selectedVideo?.link}
  allowFullScreen
  width="100%"
  height="500px"
  className="w-full h-[200px] md:h-[600px] xl:h-[650px] 2xl:h-[800px] aspect-video"
  title="Video Player"
  frameBorder="0"
/>


                <MdPlayCircle
                  className={`absolute top-auto bottom-auto left-auto right-auto m-auto h-8 w-8  md:h-16 md:w-16 fill-white z-10 cursor-pointer ${isVideoPlaying === true ? "hidden" : "flex"}`}
                  onClick={handleVideo}
                />
              </div>

              <div className="flex justify-between w-full"><div className="md:w-1/2">
                <div className="block md:hidden mt-3  ml-1">
                  <p className="block absolute md:hidden  ml-4 text-4xl text-left text-white " >{selectedVideo.episode}
                    <Rating name="read-only " value={averageRating} readOnly aria-readonly className="ml-2 mt-2  " /></p>

                </div>
              </div>
                <div className="flex justify-center 2xl:justify-start items-center gap-4 md:gap-20 mt-2 ml-44 md:ml-[525px] xl:ml-[395px] 2xl:ml-[930px] w-full md:w-1/2">
                  <div className="flex">
                    <div
                      className="relative flex"
                      onMouseEnter={() => setHoverText("Rate this Episode")}
                      onMouseLeave={() => setHoverText(null)}
                    >
                      <img
                        src={RateStar}
                        alt="Star Icon"
                        className="w-8 md:w-9 h-8 md:h-9 cursor-pointer"
                        onClick={handleStarClick}
                      />
                      {hoverText === "Rate this Episode" && (
                        <div className="hidden md:block top-10 right-6 absolute bg-white shadow px-2 py-1 rounded w-[120px] text-black text-xs md:text-sm">
                          Rate this episode
                        </div>
                      )}
                    </div>

                    {showRating && (
                      <Rating
                        name="user-rating"
                        value={videoRating}
                        onChange={(event, newValue) => handleRating(newValue)}
                        className="bottom-[40px] md:bottom-10 z-50 absolute bg-white mr-[-122px] md:mr-[-137px] mb-[-10px] p-[2px] md:p-2 rounded-lg"
                      />
                    )}
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => setHoverText("Find this Episode in following Playlist")}
                    onMouseLeave={() => setHoverText(null)}
                  >
                    <img
                      src={PlaylistC}
                      alt="Edit Icon"
                      className="w-6 md:w-7 h-6 md:h-7 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering other parent event listeners
                        setIsPopupVisible((prev) => !prev); // Toggle visibility
                      }}
                    />
                    {hoverText === "Find this Episode in following Playlist" && (
                      <div className="bottom-[150%] hidden md:block absolute bg-white shadow px-2 py-1 rounded-lg w-[150px] text-black text-xs md:text-sm">
                        Find this episode in the following playlists
                      </div>
                    )}
                  </div>

                  {isPopupVisible && selectedVideo.subcategories && (
                    <div
                      className="z-10 absolute bg-white shadow-lg mt-32 md:mt-[140px] 2xl:mt-[170px] 2xl:mr-[100px] md:mr-[-200px] ml-[-30px] p-1 md:p-2 rounded-md"
                    >
                      <h3 className="mb-1 font-semibold text-sm md:text-xl tracking-widest">Playlist</h3>
                      <ul className="max-h-[60px] text-[14px] md:text-lg tracking-wider overflow-y-auto">
                        {Array.isArray(selectedVideo.subcategories) ? (
                          selectedVideo.subcategories.map((subcategory, index) => (
                            <li key={index} className="text-gray-800">{subcategory.name}</li>
                          ))
                        ) : (
                          <li className="text-gray-800">{selectedVideo.subcategories}</li>
                        )}
                      </ul>
                    </div>
                  )}
                  <div
                    className="relative"
                    onMouseEnter={() => setHoverText("Add to my Favorites")}
                    onMouseLeave={() => setHoverText(null)}
                  >
                    <span
                      onClick={() =>
                        toggleBookmark(selectedVideo.id, bookmarkData.includes(selectedVideo.id))
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={bookmarkData.includes(selectedVideo.id) ? fBM : oBM}
                        alt="Bookmark Icon"
                        className="w-6 md:w-7 h-6 md:h-7"
                      />
                    </span>
                    {hoverText === "Add to my Favorites" && (
                      <div className="bottom-[120%] hidden md:block absolute bg-white shadow px-2 py-1 rounded w-[130px] text-black text-xs md:text-sm">
                        Add to my favorites
                      </div>
                    )}
                  </div>

                  {/* <div
                    className="relative"
                    onMouseEnter={() => setHoverText("Share this Link")}
                    onMouseLeave={() => setHoverText(null)}
                  >
                    <Addboxx video={selectedVideo} />
                    {hoverText === "Share this Link" && (
                      <div className="bottom-[120%] hidden md:block absolute bg-white shadow px-2 py-1 rounded w-[100px] text-black text-xs md:text-sm">
                        Share this link
                      </div>
                    )}
                  </div> */}
                </div>
              </div>


            </section>
            <div className="flex justify-start items-start gap-4 bg-[#40DEFB] px-4 md:px-[40px] xl:px-[138px] 2xl:px-[80px] py-2  min-w-100 overflow-hidden">
              <div className="hidden md:block">
                <p className="text-right text-3xl text-black md:text-7xl" >{selectedVideo.episode}</p>
                <Rating name="read-only" value={averageRating} readOnly aria-readonly className="mt-[-15px] font-bold" />
              </div>
              <div>
                {/* <p className="md:mt-2 text-gray-900 md:text-4xl tracking-wider">
                  {truncateTitle(selectedVideo.title, 12)}
                </p> */}
                <p className={`${countWords(selectedVideo.title) <= 15 ? 'md:mt-[33px] ' : 'mt-1'} text-gray-900 leading-6 text-[20px] md:text-[20px] lg:text-[30px]  md:leading-7  tracking-wide `}

                >
                  {truncateTitle(selectedVideo.title, 25)}
                </p>


                <p className="mt-1 md:ml-0  ml-[0px] text-16px text-gray-900 md:text-lg lg:text-xl tracking-widest">
                  With <span className="mt-1 text-[16px]  text-gray-900 tracking-widest">
                    {videoHost.map((host, index) => {
                      const isLast = index === videoHost.length - 1;
                      const isSecondLast = index === videoHost.length - 2;
                      const needsComma = !isLast && videoHost.length > 2 && !isSecondLast;
                      const needsAnd = isSecondLast && videoHost.length > 1;

                      return (
                        <span key={index}>
                          <button
                            onClick={() => openHostPopUp(host)}
                            className="ml-1 text-blue-500"
                          >
                            {host.name}
                          </button>
                          {needsComma && ', '}
                          {needsAnd && ' and '}
                        </span>
                      );
                    })}
                  </span>
                </p>

              </div>
            </div>

            <section className=" md:flex ">
              <div className="bg-[#D4FCFF] md:w-[75%]">
                <div className="md:flex md:justify-between bg-[#549ef7] mb-3 px-3 md:px-[43px] xl:px-[141px] 2xl:px-[90px]  py-2 md:pr-1 lg:pr-10 w-full md:h-10 text-[14px] md:text-[18px]">
                  <h1 className="flex gap-2 text-black md:text-sm lg:text-lg md:leading-normal tracking-widest">
                    <MdOutlineDesktopWindows className="md:size-6 size-6" />
                    Channel Name: {selectedVideo.channel}
                  </h1>
                  <h1>
                    <span className="flex gap-2 text-gray-900 md:text-sm lg:text-lg tracking-widest">
                      <MdCalendarMonth className="size-6" /> Publish Date: {selectedVideo?.publish_date ? new Date(selectedVideo.publish_date).toLocaleDateString() : ''}
                    </span>
                  </h1>
                </div>
                <div className="px-4 md:px-[44px] xl:pl-[142px]  2xl:pl-[88px] leading-4 md:leading-5 lg:leading-6">
                  <div className="text-[12px] text-gray-900 md:text-[1p4x] lg:text-[18px] tracking-widest">
                    <span className="font-semibold">Description:</span>
                    <div
                      className="text-gray-900 tracking-widest channel-description"
                      style={{ color: "inherit" }}
                      dangerouslySetInnerHTML={{
                        __html: renderDescription().replace(/<a /g, '<a style="color:#2a78d4; text-decoration:underline;" '),
                      }}
                    />
                    {selectedVideo?.title.split('').length > 50 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className=" text-blue-500 tracking-wider"
                      >
                        {showFullDescription ?'See Less' : 'See More'}
                      </button>
                    )}
                  </div>
                  {/* <div className="mt-1 text-[12px] text-blue-500 md:text-[18px] tracking-widest">
                    <button
                      className="mb-2"
                      onClick={() => {
                        if (!selectedVideo?.wise_link) {
                          alert('Video is still loading. Please wait.');
                        } else {
                          handleDownload(selectedVideo?.wise_link);
                        }
                      }}
                    >
                      Download Link
                    </button>

                  </div> */}
                </div>
              </div>

              <div className="relative bg-[#E6E6E6]  px-2 py-10 md:py-1 md:w-[40%] lg:w-[40%] ">
                <div className="flex  ml-[280px] md:ml-[300px] lg:ml-[328px] xl:ml-[330px] 2xl:ml-[430px] ">
                  {isOwner && (
                    <button
                      onClick={handleDownloadCommentsAsPDF}
                      className="font-medium text-red-500 tracking-wider cursor-pointer"
                    >
                      <ImDownload3 className="md:block hidden  mb-[-20px] text-black size-6" />
                    </button>
                  )}
                </div>

                <AddComment handleSubmit={handleComment} />


                <h2 className="text-[14px] text-gray-900 md:text-[18px] tracking-wider"> {comments.length === 1 ? 'Comment' : 'Comments'}  {comments.length}</h2>
                <hr className="mt-0 mb-2 border-black w-[360px] md:w-[320px] lg:w-[348px] xl:w-[352px] 2xl:w-[450px] " />

                {/* Comments List - Make this section scrollable if more than 3 comments */}
                <div
                  className={`overflow-y-auto overflow-x-hidden tracking-wider  ${comments.length > 3 ? "max-h-40" : ""}`} // Scrollable if more than 3 comments
                  style={{ maxHeight: comments.length > 3 ? "200px" : "auto" }}
                >
                  {comments.map((comment, index) => (
                    <div key={comment.id} className="relative p-2  tracking-wider comment">
                      {/* Comment Text or Edit Mode */}
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          {editingCommentId === comment.id ? (
                            // Edit Mode: Show input for editing
                            <textarea
                              value={editedComment}
                              onChange={(e) => setEditedComment(e.target.value)}
                              className="border-gray-400 bg-white focus:bg-white p-2 border rounded w-full h-20 font-medium leading-normal focus:outline-none placeholder-gray-700"
                            />
                          ) : (
                            // View Mode: Show comment text
                            <CommentBox comment={comment} />
                          )}
                        </div>

                        {/* Check if the current user is the owner or admin */}
                        {(isOwner || comment.user_id === userId) && (
                          <Menu as="div" className="inline-block relative text-left">
                            <div>
                              <Menu.Button className="inline-flex justify-center px-4  w-full font-medium text-gray-700 text-sm">
                                <PiDotsThreeBold className="mr-[-30px] md:ml-[-300px] w-5 h-5 text-gray-500" />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="right-0 border-gray-200 ring-opacity-5 shadow-lg mt-[-10px] md:mt-[-40px] ml-0 md:ml-[-80px] border  divide-y divide-gray-100 ring-1 ring-black w-[60px] focus:outline-none">
                                <div className="px-1">
                                  {/* Show Edit button only for the comment owner */}
                                  {comment.user_id === userId && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditedComment(comment.comment); // Load current comment for editing
                                          }}
                                          className={`${active ? "bg-blue-500 text-white" : "text-gray-900"} group flex  items-center w-full px-2 py-2 md:text-sm`}
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}

                                  {/* Show Delete button for both admin and comment owner */}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className={`${active ? "bg-red-500 text-white" : "text-gray-900"} group flex  items-center w-full px-1  md:px-2 py-1 md:py-2 text-xs md:text-sm`}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        )}
                      </div>

                      {/* Save and Delete buttons during edit mode */}
                      {editingCommentId === comment.id && (
                        <div className="flex gap-4 mt-2">
                          <button onClick={() => handleEditComment(comment.id)} className="bg-green-500 px-4 py-2 rounded text-white">
                            Save
                          </button>
                          <button onClick={() => handleDeleteComment(comment.id)} className="bg-red-500 px-4 py-2 rounded text-white">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                  ))}

                </div>
              </div>

            </section>
           

            <section className="">
              <div className="">
                <img src="./images/Divider 1.png" className="w-full md:h-12" alt="Header Image" />
              </div>
            </section>

            <section className="relative bg-[#231F20] shadow-lg ">


              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex justify-center items-center bg-white">
                  {tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      className={({ selected }) =>
                        classNames(
                          "text-[14px] text-center md:text-2xl  focus:outline-none focus:ring-0 px-4 md:px-6 py-1 tracking-wider",
                          selected ? "text-[#40defa] bg-[#231F20]" : "text-gray-800 border-none"
                        )
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels as="div" className="   tracking-wider px-1 md:px-0">
                  {tabs.map((tab, index) => (
                    <Tab.Panel
                      key={index}
                      className={classNames(" flex", "focus:outline-none focus:ring-0")}
                    >
                      {index < subscribedChannels.length ? (
                        filteredPodcasts.length > 0 ? (
                          <>
                            {/* {/ Show the channel icon only for the Channels tab /} */}

                            {/* {/ Render the video thumbnails /} */}
                            <VideoSlider videos={filteredPodcasts} />
                          </>
                        ) : (
                          <div className="text-center text-gray-500">Channel is not subscribed.</div>
                        )
                      ) : index === subscribedChannels.length ? (
                        <PlaylistSlider playlists={filteredPodcasts} />
                      ) : (
                        <Favoritevideos favorites={filteredPodcasts} />
                      )}
                      {/* <div className="md:block md:left-[300px] 2xl:left-[425px] absolute hidden bg-[#40defa] mt-2 2xl:mt-3 mb-[16px] w-[2px] h-[215px] 2xl:h-[300px]"></div> */}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>

              </Tab.Group>
            </section>
          </>
        ) : 'No Videos'}
      </div>
      {isHostPopUpOpen && (
        <HostPopUp
          isOpen={isHostPopUpOpen}
          onClose={closeHostPopUp}
          host={selectedHost}
          numOfPodcasts={hostVideoCounts[selectedHost?.host_id] || 0}
        />
      )}
      <section className="relative rounded-sm">
        <div className="">
          <img src="./images/Divider 1.png" className="w-full h-6" alt="Header Image" />
        </div>
      </section>
    </div>

  );
}
export default ChannelPage;
