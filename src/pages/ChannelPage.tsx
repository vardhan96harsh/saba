import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Menu, Transition, Tab } from '@headlessui/react';
import { MdPlayCircle } from 'react-icons/md';
import Slider from 'react-slick';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ named import instead of side-effect
import 'jspdf-autotable';
import { Button } from '../components/dataEntry';
import { CommentBox } from '../components/CommentBox';
import { AddComment } from '../components/AddComment';
import { useApiContext } from '../components/contexts/ApiContext';
import HostPopUp from '../components/HostPopUp';
import { MdCalendarMonth } from 'react-icons/md';
import { MdOutlineDesktopWindows } from 'react-icons/md';
import { PiDotsThreeBold } from 'react-icons/pi';
import useImportCommentData from '@/components/hooks/useImportCommentData';
import useImportSubData from '@/components/hooks/useImportSubData';
import Rating from '@mui/material/Rating';
import { fetchVideoDataFromUrl } from './helpers';
import useImportRatingData from '@/components/hooks/useImportRatingData';
import HomeHeader from '@/components/HomeHeader';
import { Bookmark, BookmarkBorder, Favorite } from '@mui/icons-material';
import useImportCommonData from '@/components/hooks/useImportCommonData';
import Addboxx from '@/components/Addboxx';
import { ImDownload3 } from 'react-icons/im';
import arwl from '../assets/images/Arrlw.svg';
import arwr from '../assets/images/ArrWr.svg';
import PlaylistC from '../assets/images/PlaylistC.svg';
import RateStar from '../assets/images/RateStar.svg';
import oBM from '../assets/images/Favorites.svg';
import fBM from '../assets/images/FillFavldpi.svg';
import backi from '../assets/images/backb.svg';
import { useParams } from 'react-router-dom';

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
  const totalRatings = Object.values(ratings).reduce(
    (acc, rating) => acc + rating,
    0
  );
  const numberOfRatings = Object.keys(ratings).length;
  return numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const truncateTitle = (title = '', wordLimit) => {
  const words = title.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return title;
};

const CarouselItem = ({
  bgImg,
  video,
  onClick,
  isSelected,
  hideEpisodeText,
}) => (
  <div
    className={`relative ml-2 mt-4   cursor-pointer pb-12 2xl:mt-2 ${
      isSelected ? 'border-2 border-[#40defa]' : ' border-1'
    }`}
    onClick={onClick}
  >
    <img
      src={video.thumbnail || bgImg}
      alt={video.title}
      className=' h-[150px] w-full md:h-[150px] xl:h-[180px] 2xl:h-[210px]  '
    />
    <div
      className={`absolute bottom-0 left-0 mt-2 flex min-h-[3rem] w-full items-center justify-center text-center text-black ${
        isSelected ? 'bg-[#40defa] text-black' : ' border-1'
      }`}
    >
      {!hideEpisodeText && (
        <span
          className={`font-goodHeadlineRegular text-lg ${
            isSelected ? 'text-black' : 'text-white'
          }`}
        >
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
  const { id, selectedVideoi, channel, selectedSubcategoryi } =
    location.state || {};

  const {
    data,
    hostData,
    subData,
    userId,
    commentData,
    setCommentData,
    setSubData,
    ratingData,
    setRatingData,
    isOwner,
    isPartner,
    setCommonData,
    commonData,
  } = useApiContext();
  const channel_data = location.state;
  const selectedPodcast = channel_data?.selectedPodcast;
  const { mutateAsync } = useImportCommentData();
  const { mutateAsync: mutateSubsAsync } = useImportSubData();
  const { mutateAsync: mutateRatingsAsync } = useImportRatingData();
  const { mutateAsync: saveCommonData } = useImportCommonData();
  const bookmarkData = commonData?.bookmarkData?.[userId] ?? [];
  const playlistVideos = channel_data?.playlistVideos || [];
  const [hoverText, setHoverText] = useState('');
  const { channelId } = useParams(); // State to hold the text for hover
  // const [hoveredIcon, setHoveredIcon] = useState(null); // State to track which icon is hovered
  // Get the first video of the subcategory

  let arrangedPodcast = {};
  let podcasts = data.podcasts?.reduce((n, podcast) => {
    if (podcast.channel_id === channel_data.id) {
      n.push(podcast);
    }
    return n;
  }, []);

  let defaultImg = channel_data?.name?.toLowerCase().includes('computing')
    ? './images/i5.webp'
    : './images/i6.webp';

  const [getSubsUnsubs, setSubsUnsubs] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  // const [selectedVideo, setSelectedVideo] = useState(selectedVideoi|| podcasts[0]);
  const [selectedVideo, setSelectedVideo] = useState(
    selectedVideoi || podcasts[0]
  );

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

  const videoHost = (hostData || []).filter((host) =>
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
      ...commonData, // Spread the existing commonData
      bookmarkData: {
        // Update only bookmarkData for the current user
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
    setRatingData({
      ...ratingData,
      [selectedVideo.id]: { [userId]: videoRating },
    });
    mutateAsync();
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );

      setCommentData({ ...commentData, [selectedVideo.id]: updatedComments });

      await mutateAsync({
        videoId: selectedVideo.id,
        comments: updatedComments,
      });

      alert('Comment deleted successfully.');
    } catch (error) {
      console.error('Error deleting comment:', error);
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
    const rows = commentsData.map((comment) => {
      const isOwnerComment = comment.user_id === userId; // Check if it's the owner
      return [
        // comment.user_id ? comment.user_id : 'N/A', // Use 'N/A' if user_id is not available
        comment.name ? comment.name : 'N/A', // Use 'N/A' if name is not available
        comment.comment || 'N/A', // Comment text
      ];
    });

    // Add the Table to PDF
    autoTable(doc, {
      startY: 40, // Start after the title
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
    const confirmRating = window.confirm(
      `You have rated ${value} stars. Do you want to submit this rating?`
    );

    if (!confirmRating) {
      // If the user cancels, do nothing
      return;
    }
    setShowRating(false);
    // Update the rating for the selected video
    ratings = { ...ratingData[selectedVideo?.id], [userId]: value };
    setRatingData({ ...ratingData, [selectedVideo.id]: ratings });

    // Save the rating to the server
    await mutateRatingsAsync({
      videoId: selectedVideo.id,
      userId,
      rating: value,
    });
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
  const isManuallySelected = useRef(false);

  const handleSelectedVideo = (video) => {
    isManuallySelected.current = true; // This prevents auto-overriding
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
        alert(
          'Pop-up blocker is enabled. Please allow pop-ups for this website.'
        );
      }
    } else {
      alert('Video URL not available');
    }
  };

  const subscribedChannels = data.channels.filter(
    (channel) => subData[channel.id]?.includes(userId)
  );

  const tabs = [
    ...subscribedChannels.map((channel) => channel.name), // Subscribed channels
    'playlists', // Playlist tab
    'favorites', // Favorites tab
  ];

  const [selectedTab, setSelectedTab] = useState(0);
  const isInitialTabSet = useRef(false);
  const allSubscribedPodcasts = data.podcasts?.filter(
    (podcast) => subData[podcast.channel_id]?.includes(userId)
  );

  const resetFilteredPodcasts = () => {
    if (selectedTab < data.channels.length) {
      const selectedChannel = data.channels[selectedTab];
      setFilteredPodcasts(
        data.podcasts.filter(
          (podcast) => podcast.channel_id === selectedChannel.id
        )
      );
    }
  };

  const fetchVideosForTab = () => {
    if (selectedTab < subscribedChannels.length) {
      const selectedChannel = subscribedChannels[selectedTab];
      const channelVideos = data.podcasts.filter(
        (podcast) => podcast.channel_id === selectedChannel.id
      );
      setFilteredPodcasts(channelVideos);
      if (channelVideos.length > 0) {
        setSelectedVideo(channelVideos[0]);
      } else {
        setSelectedVideo(null);
      }
    }
  };

  useEffect(() => {
  // Check if the selectedTab corresponds to the playlist tab
  if (selectedTab === subscribedChannels.length) {
    // Make sure playlistVideos are available
    if (playlistVideos.length > 0) {
      // Select the first video in the playlist
      setSelectedVideo(playlistVideos[0]);
    }
  }
}, [selectedTab, playlistVideos]); // Trigger when selectedTab or playlistVideos change


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = selectedVideo.wise_link;
    }
  }, [selectedVideo]);

  useEffect(() => {
    resetFilteredPodcasts();
  }, [selectedTab]);

  useEffect(() => {
    fetchVideosForTab();
  }, [selectedTab, data, location.state?.selectedPodcast]);

  const isInitialVideoSet = useRef(false); // Track whether the initial video has been set

  useEffect(() => {
    console.log('Location State:', location.state);
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
    if (isManuallySelected.current) return; // ✅ Don't override if user clicked manually

    const state = location.state || {};
    const { selectedVideo, selectedVideoi, selectedPodcast, firstVideo } =
      state;

    let video = null;
    if (selectedVideo) video = selectedVideo;
    else if (selectedVideoi) video = selectedVideoi;
    else if (selectedPodcast) video = selectedPodcast;
    else if (firstVideo) video = firstVideo;
    else if (podcasts?.length) video = podcasts[0];

    if (video) setSelectedVideo(video);
  }, [location.state,data, podcasts]);


  

  const getShortenedText = (text = '', wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const renderTags = () => {
    const tags = selectedVideo?.tags?.map((tag) => `#${tag}`).join(' ');
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
      className={`absolute top-1/2 -translate-y-1/2 transform ${
        direction === 'next'
          ? 'right-[-2rem] md:right-[-30px] xl:right-[-57px] 2xl:right-[-70px]'
          : 'left-[-2rem] md:left-[-25px] xl:left-[-3rem] 2xl:left-[-4rem]'
      }
        } ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:scale-110'
        }`}
    >
      {direction === 'next' ? (
        <img
          src={arwr}
          className='h-[35px]  w-[35px] md:h-[50px] md:w-[20px] xl:h-[50px] xl:w-[60px] 2xl:h-[60px] 2xl:w-[60px]'
          alt=''
        />
      ) : (
        <img
          src={arwl}
          className='h-[35px]  w-[35px] md:h-[50px] md:w-[20px] xl:h-[50px] xl:w-[60px] 2xl:h-[60px] 2xl:w-[60px]'
          alt=''
        />
      )}
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <Arrow direction='next' />,
    prevArrow: <Arrow direction='prev' />,
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
    subData[channel_id] = (subData[channel_id] ?? []).filter(
      (a) => a !== userId
    );
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
      <div className='w-full px-10 md:px-10 xl:mt-2 xl:px-[60px] 2xl:mt-4 2xl:px-[75px]'>
        <Slider {...settings}>
          {sortedVideos.map((video, index) => (
            <div
              key={index}
              className=''
            >
              <CarouselItem
                bgImg={video.thumbnail || defaultImg}
                video={video}
                onClick={() => handleSelectedVideo(video)}
                isSelected={selectedVideo?.id === video.id}
              />
            </div>
          ))}
        </Slider>
      </div>
    ) : (
      <div className='text-center text-gray-500'>No videos found.</div>
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
            image: subcategory.image || 'path/to/default/image.jpg', // Fallback image
          };
        }
        subcategories[subcategory.name].videos = data.podcasts
          ?.filter(
            (podcast) =>
              podcast.subcategories?.some(
                (sub) => sub.name === subcategory.name
              )
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
        <div className='ml-[20%] py-24 text-center tracking-widest text-gray-500 md:ml-[45%]'>
          No Playlist Available
        </div>
      );
    }

    const handleSubcategoryClick = (subcategory) => {
      setSelectedSubcategory(subcategory);
    };

    const handleBackToSubcategories = () => {
      setSelectedSubcategory(null);
       setCarouselPositions({}); // Reset to show all subcategories
    };

    const currentSubcategory = selectedSubcategory || subcategoryList[0];

    return (
      <div className='flex h-[225px] py-2 md:h-[240px] xl:h-[288px] 2xl:h-[306px]'>
        {selectedSubcategory && (
          <div
            className='ml-2 mt-0 hidden h-[190px] w-[320px] flex-col md:absolute md:ml-8 md:block md:w-[240px] xl:mt-5 xl:w-[300px] 2xl:ml-10 2xl:mt-4 2xl:h-[220px] 2xl:w-[350px]'
            onClick={() => handleSubcategoryClick(currentSubcategory)}
          >
            <div className='h-full w-full md:mt-10 xl:mt-5 2xl:mt-8'>
              <img
                src={subcategories[currentSubcategory].image}
                alt={currentSubcategory}
                className='h-[140px] w-full md:h-[145px] xl:h-[180px] 2xl:h-[210px]'
              />
            <div className="text-center text-lg text-white md:mt-3">
  {currentSubcategory} ({subcategories[currentSubcategory].videos.length}{" "}
  {subcategories[currentSubcategory].videos.length === 1 ? "Episode" : "Episodes"})
</div>

            </div>
            
            {/* <div className='text-center text-lg text-white md:mt-3'>
              {currentSubcategory}
            </div> */}
          </div>
        )}

        <div
          className={`mt-0 px-10 md:absolute md:ml-[-15px] md:mt-0 md:px-[55px] xl:ml-0 xl:mt-0 xl:px-[60px] 2xl:mt-3 2xl:px-[80px] ${
            selectedSubcategory
              ? 'md:w-[1150px] xl:w-[1380px] 2xl:w-[1750px]'
              : 'w-[340px] md:w-[1150px] xl:w-[1380px] 2xl:w-[1750px]'
          }`}
          
        >
          {selectedSubcategory ? (
            // Show all videos under the selected subcategory
            <div className='ml-[0px] md:ml-[300px] xl:ml-[350px] 2xl:ml-[450px]'>
              <div className='absolute mb-[16px] mt-2 hidden h-[215px] w-[2px] bg-[#40defa] md:left-[290px] md:block xl:left-[350px] xl:h-[240px] 2xl:left-[425px] 2xl:mt-3 2xl:h-[250px]'></div>
              <button
                className='ml-[-45px] text-black 2xl:ml-[-65px] 2xl:mt-[-12px]'
                onClick={handleBackToSubcategories}
              >
                <img
                  src={backi}
                  alt=''
                  className='mb-[-15px] w-[35px] xl:mb-[-20px] xl:w-[40px] 2xl:mb-[-15px] 2xl:w-[50px]'
                />
              </button>
              
              <Slider
                className='mt-[-25px] w-[260px] md:mt-0 md:w-full xl:w-[950px] 2xl:w-[1180px]'
                {...{
                  ...settings, // Inherit default settings
                  slidesToShow: 3, // Override to show 3 thumbnails
                }}
              >
                {subcategories[selectedSubcategory].videos.map(
                  (video, index) => (
                    <CarouselItem
                      key={index}
                      bgImg={
                        video.thumbnail ||
                        subcategories[selectedSubcategory].image
                      }
                      video={video}
                      onClick={() => {
                        handleSelectedVideo(video);
                      }}
                      isSelected={selectedVideo?.id === video.id}
                    />
                  )
                )}
              </Slider>
            </div>
          ) : (
            // Show each subcategory with its image and name
            <Slider {...settings}>
              {filteredSubcategories.map(
                ([subcategory, subcategoryData], index) => (
                  <div
                    key={index}
                    className=''
                  >
                    <CarouselItem
                      bgImg={subcategoryData.image}
                      video={{ title: subcategory }}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      isSelected={subcategory === selectedSubcategory}
                      hideEpisodeText={true}
                    />
                <div className="mt-[-40px] text-center text-white">
  {subcategory} ({subcategoryData.videos.length}{" "}
  {subcategoryData.videos.length === 1 ? "Episode" : "Episodes"})
</div>

                  </div>
                )
              )}
            </Slider>
          )}
        </div>
      </div>
    );
  }

  function Favoritevideos() {
    const bookmarkData = commonData?.bookmarkData?.[userId] ?? [];
    const bookmarkedVideos =
      data?.podcasts?.filter((video) => bookmarkData.includes(video.id)) ?? [];

    // Find the most recently added bookmarked video
    const mostRecentBookmarkedVideo =
      bookmarkedVideos.length > 0
        ? bookmarkedVideos.reduce((latest, video) => {
            const latestDate = new Date(latest.publish_date);
            const videoDate = new Date(video.publish_date);
            return videoDate > latestDate ? video : latest;
          })
        : null;

    if (bookmarkedVideos.length === 0) {
      return (
        <div className='ml-[20%] py-20 text-center  text-gray-500 md:ml-[45%] 2xl:py-28'>
          No favorite episodes found.
        </div>
      );
    }

    return (
      <div className='flex h-[225px]  md:h-[230px] xl:mt-2 xl:h-[265px] 2xl:mt-4 2xl:h-[290px]'>
        <div className='absolute w-[340px] px-10 md:w-full md:px-[40px] xl:px-[50px]    2xl:px-[80px]  '>
          <Slider {...settings}>
            {bookmarkedVideos.map((video, index) => (
              <CarouselItem
                key={index}
                bgImg={defaultImg}
                video={video}
                onClick={() => handleSelectedVideo(video)}
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
    return str.split(' ').filter(function (n) {
      return n !== '';
    }).length;
  };

  return (
    <div className='h-screen   overflow-hidden overflow-y-auto bg-gray-100 font-sans antialiased'>
      <div className='mx-auto  '>
        <HomeHeader />

        {selectedVideo ? (
          <>
            <section className='relative bg-[#231f20] py-4'>
              <div className='relative isolate flex flex-1 flex-col items-center  justify-center overflow-hidden'>
                <iframe
                  src={selectedVideo?.link}
                  allowFullScreen
                  width='100%'
                  height='500px'
                  className='aspect-video h-[200px] w-full md:h-[600px] xl:h-[650px] 2xl:h-[800px]'
                  title='Video Player'
                  frameBorder='0'
                />

                <MdPlayCircle
                  className={`absolute bottom-auto left-auto right-auto top-auto z-10 m-auto h-8  w-8 cursor-pointer fill-white md:h-16 md:w-16 ${
                    isVideoPlaying === true ? 'hidden' : 'flex'
                  }`}
                  onClick={handleVideo}
                />
              </div>

              <div className='flex w-full justify-between'>
                <div className='md:w-1/2'>
                  <div className='ml-1 mt-3 block  md:hidden'>
                    <p className='absolute ml-4 block  text-left text-4xl text-white md:hidden '>
                      {selectedVideo.episode}
                      <Rating
                        name='read-only '
                        value={averageRating}
                        readOnly
                        aria-readonly
                        className='ml-2 mt-2  '
                      />
                    </p>
                  </div>
                </div>
                <div className='ml-44 mt-2 flex w-full items-center justify-center gap-4 md:ml-[525px] md:w-1/2 md:gap-20 xl:ml-[395px] 2xl:ml-[930px] 2xl:justify-start'>
                  <div className='flex'>
                    <div
                      className='relative flex'
                      onMouseEnter={() => setHoverText('Rate this Episode')}
                      onMouseLeave={() => setHoverText(null)}
                    >
                      <img
                        src={RateStar}
                        alt='Star Icon'
                        className='h-8 w-8 cursor-pointer md:h-9 md:w-9'
                        onClick={handleStarClick}
                      />
                      {hoverText === 'Rate this Episode' && (
                        <div className='absolute right-6 top-10 hidden w-[120px] rounded bg-white px-2 py-1 text-xs text-black shadow md:block md:text-sm'>
                          Rate this episode
                        </div>
                      )}
                    </div>

                    {showRating && (
                      <Rating
                        name='user-rating'
                        value={videoRating}
                        onChange={(event, newValue) => handleRating(newValue)}
                        className='absolute bottom-[40px] z-50 mb-[-10px] mr-[-122px] rounded-lg bg-white p-[2px] md:bottom-10 md:mr-[-137px] md:p-2'
                      />
                    )}
                  </div>

                  <div
                    className='relative'
                    onMouseEnter={() =>
                      setHoverText('Find this Episode in following Playlist')
                    }
                    onMouseLeave={() => setHoverText(null)}
                  >
                    <img
                      src={PlaylistC}
                      alt='Edit Icon'
                      className='h-6 w-6 cursor-pointer md:h-7 md:w-7'
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering other parent event listeners
                        setIsPopupVisible((prev) => !prev); // Toggle visibility
                      }}
                    />
                    {hoverText ===
                      'Find this Episode in following Playlist' && (
                      <div className='absolute bottom-[150%] hidden w-[150px] rounded-lg bg-white px-2 py-1 text-xs text-black shadow md:block md:text-sm'>
                        Find this episode in the following playlists
                      </div>
                    )}
                  </div>

                  {isPopupVisible && selectedVideo.subcategories && (
                    <div className='absolute z-10 ml-[-30px] mt-32 rounded-md bg-white p-1 shadow-lg md:mr-[-200px] md:mt-[140px] md:p-2 2xl:mr-[100px] 2xl:mt-[170px]'>
                      <h3 className='mb-1 text-sm font-semibold tracking-widest md:text-xl'>
                        Playlist
                      </h3>
                      <ul className='max-h-[60px] overflow-y-auto text-[14px] tracking-wider md:text-lg'>
                        {Array.isArray(selectedVideo.subcategories) ? (
                          selectedVideo.subcategories.map(
                            (subcategory, index) => (
                              <li
                                key={index}
                                className='text-gray-800'
                              >
                                {subcategory.name}
                              </li>
                            )
                          )
                        ) : (
                          <li className='text-gray-800'>
                            {selectedVideo.subcategories}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  <div
                    className='relative'
                    onMouseEnter={() => setHoverText('Add to my Favorites')}
                    onMouseLeave={() => setHoverText(null)}
                  >
                    <span
                      onClick={() =>
                        toggleBookmark(
                          selectedVideo.id,
                          bookmarkData.includes(selectedVideo.id)
                        )
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          bookmarkData.includes(selectedVideo.id) ? fBM : oBM
                        }
                        alt='Bookmark Icon'
                        className='h-6 w-6 md:h-7 md:w-7'
                      />
                    </span>
                    {hoverText === 'Add to my Favorites' && (
                      <div className='absolute bottom-[120%] hidden w-[130px] rounded bg-white px-2 py-1 text-xs text-black shadow md:block md:text-sm'>
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
            <div className='min-w-100 flex items-start justify-start gap-4 overflow-hidden bg-[#40DEFB] px-4 py-2 md:px-[40px]  xl:px-[138px] 2xl:px-[80px]'>
              <div className='hidden md:block'>
                <p className='text-right text-3xl text-black md:text-7xl'>
                  {selectedVideo.episode}
                </p>
                <Rating
                  name='read-only'
                  value={averageRating}
                  readOnly
                  aria-readonly
                  className='mt-[-15px] font-bold'
                />
              </div>
              <div>
                {/* <p className="md:mt-2 text-gray-900 md:text-4xl tracking-wider">
                  {truncateTitle(selectedVideo.title, 12)}
                </p> */}
                <p
                  className={`${
                    countWords(selectedVideo.title) <= 15
                      ? 'md:mt-[33px] '
                      : 'mt-1'
                  } text-[20px] leading-6 tracking-wide text-gray-900 md:text-[20px]  md:leading-7  lg:text-[30px] `}
                >
                  {truncateTitle(selectedVideo.title, 25)}
                </p>

                <p className='text-16px ml-[0px]  mt-1 tracking-widest text-gray-900 md:ml-0 md:text-lg lg:text-xl'>
                  With{' '}
                  <span className='mt-1 text-[16px]  tracking-widest text-gray-900'>
                    {videoHost.map((host, index) => {
                      const isLast = index === videoHost.length - 1;
                      const isSecondLast = index === videoHost.length - 2;
                      const needsComma =
                        !isLast && videoHost.length > 2 && !isSecondLast;
                      const needsAnd = isSecondLast && videoHost.length > 1;

                      return (
                        <span key={index}>
                          <button
                            onClick={() => openHostPopUp(host)}
                            className='ml-1 text-blue-500'
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

            <section className=' md:flex '>
              <div className='bg-[#D4FCFF] md:w-[75%]'>
                <div className='mb-3 w-full bg-[#549ef7] px-3 py-2 text-[14px] md:flex md:h-10  md:justify-between md:px-[43px] md:pr-1 md:text-[18px] lg:pr-10 xl:px-[141px] 2xl:px-[90px]'>
                  <h1 className='flex gap-2 tracking-widest text-black md:text-sm md:leading-normal lg:text-lg'>
                    <MdOutlineDesktopWindows className='size-6 md:size-6' />
                    Channel Name: {selectedVideo.channel}
                  </h1>
                  <h1>
                    <span className='flex gap-2 tracking-widest text-gray-900 md:text-sm lg:text-lg'>
                      <MdCalendarMonth className='size-6' /> Publish Date:{' '}
                      {selectedVideo?.publish_date
                        ? new Date(
                            selectedVideo.publish_date
                          ).toLocaleDateString()
                        : ''}
                    </span>
                  </h1>
                </div>
                <div className='px-4 leading-4 md:px-[44px]  md:leading-5 lg:leading-6 xl:pl-[142px] 2xl:pl-[88px]'>
                  <div className='text-[12px] tracking-widest text-gray-900 md:text-[1p4x] lg:text-[18px]'>
                    <span className='font-semibold'>Description:</span>
                    <div
                      className='channel-description tracking-widest text-gray-900'
                      style={{ color: 'inherit' }}
                      dangerouslySetInnerHTML={{
                        __html: renderDescription().replace(
                          /<a /g,
                          '<a style="color:#2a78d4; text-decoration:underline;" '
                        ),
                      }}
                    />
                    {selectedVideo?.title.split('').length > 50 && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className=' tracking-wider text-blue-500'
                      >
                        {showFullDescription ? 'See Less' : 'See More'}
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

              <div className='relative bg-[#E6E6E6]  px-2 py-10 md:w-[40%] md:py-1 lg:w-[40%] '>
                <div className='ml-[280px]  flex md:ml-[300px] lg:ml-[328px] xl:ml-[330px] 2xl:ml-[430px] '>
                  {isOwner && (
                    <button
                      onClick={handleDownloadCommentsAsPDF}
                      className='cursor-pointer font-medium tracking-wider text-red-500'
                    >
                      <ImDownload3 className='mb-[-20px] hidden  size-6 text-black md:block' />
                    </button>
                  )}
                </div>

                <AddComment handleSubmit={handleComment} />

                <h2 className='text-[14px] tracking-wider text-gray-900 md:text-[18px]'>
                  {' '}
                  {comments.length === 1 ? 'Comment' : 'Comments'}{' '}
                  {comments.length}
                </h2>
                <hr className='mb-2 mt-0 w-[360px] border-black md:w-[320px] lg:w-[348px] xl:w-[352px] 2xl:w-[450px] ' />

                {/* Comments List - Make this section scrollable if more than 3 comments */}
                <div
                  className={`overflow-y-auto overflow-x-hidden tracking-wider  ${
                    comments.length > 3 ? 'max-h-40' : ''
                  }`} // Scrollable if more than 3 comments
                  style={{ maxHeight: comments.length > 3 ? '200px' : 'auto' }}
                >
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className='comment relative  p-2 tracking-wider'
                    >
                      {/* Comment Text or Edit Mode */}
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          {editingCommentId === comment.id ? (
                            // Edit Mode: Show input for editing
                            <textarea
                              value={editedComment}
                              onChange={(e) => setEditedComment(e.target.value)}
                              className='h-20 w-full rounded border border-gray-400 bg-white p-2 font-medium leading-normal placeholder-gray-700 focus:bg-white focus:outline-none'
                            />
                          ) : (
                            // View Mode: Show comment text
                            <CommentBox comment={comment} />
                          )}
                        </div>

                        {/* Check if the current user is the owner or admin */}
                        {(isOwner || comment.user_id === userId) && (
                          <Menu
                            as='div'
                            className='relative inline-block text-left'
                          >
                            <div>
                              <Menu.Button className='inline-flex w-full justify-center  px-4 text-sm font-medium text-gray-700'>
                                <PiDotsThreeBold className='mr-[-30px] h-5 w-5 text-gray-500 md:ml-[-300px]' />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter='transition ease-out duration-100'
                              enterFrom='transform opacity-0 scale-95'
                              enterTo='transform opacity-100 scale-100'
                              leave='transition ease-in duration-75'
                              leaveFrom='transform opacity-100 scale-100'
                              leaveTo='transform opacity-0 scale-95'
                            >
                              <Menu.Items className='right-0 ml-0 mt-[-10px] w-[60px] divide-y divide-gray-100 border border-gray-200 shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none md:ml-[-80px] md:mt-[-40px]'>
                                <div className='px-1'>
                                  {/* Show Edit button only for the comment owner */}
                                  {comment.user_id === userId && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditedComment(comment.comment); // Load current comment for editing
                                          }}
                                          className={`${
                                            active
                                              ? 'bg-blue-500 text-white'
                                              : 'text-gray-900'
                                          } group flex  w-full items-center px-2 py-2 md:text-sm`}
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
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                        className={`${
                                          active
                                            ? 'bg-red-500 text-white'
                                            : 'text-gray-900'
                                        } group flex  w-full items-center px-1  py-1 text-xs md:px-2 md:py-2 md:text-sm`}
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
                        <div className='mt-2 flex gap-4'>
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className='rounded bg-green-500 px-4 py-2 text-white'
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className='rounded bg-red-500 px-4 py-2 text-white'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className=''>
              <div className=''>
                <img
                  src='./images/Divider 1.png'
                  className='w-full md:h-12'
                  alt='Header Image'
                />
              </div>
            </section>

            <section className='relative bg-[#231F20] shadow-lg '>
              <Tab.Group
                selectedIndex={selectedTab}
                onChange={setSelectedTab}
              >
                <Tab.List className='flex items-center justify-center bg-white'>
                  {tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      className={({ selected }) =>
                        classNames(
                          'px-4 py-1 text-center  text-[14px] tracking-wider focus:outline-none focus:ring-0 md:px-6 md:text-2xl',
                          selected
                            ? 'bg-[#231F20] text-[#40defa]'
                            : 'border-none text-gray-800'
                        )
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels
                  as='div'
                  className='   px-1 tracking-wider md:px-0'
                >
                  {tabs.map((tab, index) => (
                    <Tab.Panel
                      key={index}
                      className={classNames(
                        ' flex',
                        'focus:outline-none focus:ring-0'
                      )}
                    >
                      {index < subscribedChannels.length ? (
                        filteredPodcasts.length > 0 ? (
                          <>
                            {/* {/ Show the channel icon only for the Channels tab /} */}

                            {/* {/ Render the video thumbnails /} */}
                            <VideoSlider videos={filteredPodcasts} />
                          </>
                        ) : (
                          <div className='text-center text-gray-500'>
                            Channel is not subscribed.
                          </div>
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
        ) : (
          'No Videos'
        )}
      </div>
      {isHostPopUpOpen && (
        <HostPopUp
          isOpen={isHostPopUpOpen}
          onClose={closeHostPopUp}
          host={selectedHost}
          numOfPodcasts={hostVideoCounts[selectedHost?.host_id] || 0}
        />
      )}
      <section className='relative rounded-sm'>
        <div className=''>
          <img
            src='./images/Divider 1.png'
            className='h-6 w-full'
            alt='Header Image'
          />
        </div>
      </section>
    </div>
  );
}
export default ChannelPage;
