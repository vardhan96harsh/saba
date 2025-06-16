import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineYoutube, AiOutlineUser, AiOutlineDesktop } from "react-icons/ai"; // Icons for Podcast, Channel, and Host
import { LuListVideo } from "react-icons/lu";
import HostPopUp from "../components/HostPopUp"; // Import the HostPopUp component
import { useApiContext } from "../components/contexts/ApiContext"; // Import your context

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

const HomeHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isHostPopUpOpen, setIsHostPopUpOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [hostVideoCounts, setHostVideoCounts] = useState({});
  const { data, subData, userId, setSubData, hostData } = useApiContext();
  const navigate = useNavigate();

  // Handle input change for search
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle logo click to navigate to home page
  const handleLogoClick = () => {
    navigate("/");
  };

  // Handle suggestion click
  const handleSuggestionClick = (item) => {
    if (item.type === "host") {
      setSelectedHost(item.data);
      setIsHostPopUpOpen(true);
    } else {
      const channelId =
        item.type === "podcast" || item.type === "subcategory"
          ? item.data.channel_id
          : item.data.id;
      const isSubscribed = subData[channelId]?.includes(userId);

      if (isSubscribed) {
        navigate("/channel", {
          state:
            item.type === "podcast"
              ? { id: item.data.channel_id, selectedVideoi: item.data }
              : item.type === "channel"
              ? { id: item.data.id, channel: item.data, openTab: 'channel' }
              : { id: item.data.channel_id, selectedSubcategoryi: item.data.name },
        });
        
      } else {
        const confirmSubscribe = window.confirm(
          "You are not subscribed to this channel. Would you like to subscribe?"
        );

        if (confirmSubscribe) {
          const updatedSubData = {
            ...subData,
            [channelId]: [...(subData[channelId] || []), userId],
          };
          setSubData(updatedSubData);

          navigate("/channel", {
            state:
              item.type === "podcast"
                ? { id: item.data.channel_id, selectedVideoi: item.data }
                : item.type === "channel"
                ? { id: item.data.id, channel: item.data }
                : { id: item.data.channel_id, selectedSubcategoryi: item.data.name },
          });
        }
      }
    }
    setSearchTerm("");
    setSuggestions([]);
  };

  const normalizeString = (str) =>
  str?.toLowerCase().replace(/\s+/g, ""); // lowercase and remove spaces


  // Fetch suggestions based on search term
 useEffect(() => {
  if (searchTerm.length > 0) {
    const filteredSuggestions = [];
    const normalizedSearch = normalizeString(searchTerm);

    const podcasts = data?.podcasts?.filter((podcast) => {
      const titleMatch = normalizeString(podcast.title)?.includes(normalizedSearch);
      const episodeMatch = podcast.episode?.toString().includes(searchTerm);
      const tagMatch = podcast.tags?.some(tag =>
        normalizeString(tag).includes(normalizedSearch)
      );
      return titleMatch || episodeMatch || tagMatch;
    });
    if (podcasts) {
      filteredSuggestions.push(...podcasts.map((p) => ({ type: "podcast", data: p })));
    }

    const channels = data?.channels?.filter((channel) =>
      normalizeString(channel.name).includes(normalizedSearch)
    );
    if (channels)
      filteredSuggestions.push(...channels.map((c) => ({ type: "channel", data: c })));

    const hosts = hostData?.filter((host) =>
      normalizeString(host.name).includes(normalizedSearch)
    );
    if (hosts)
      filteredSuggestions.push(...hosts.map((h) => ({ type: "host", data: h })));

    const subcategories = data?.channels
      ?.flatMap((channel) => channel.subcategories || [])
      .filter(
        (subcategory) =>
          typeof subcategory === "string" &&
          normalizeString(subcategory).includes(normalizedSearch)
      );
    if (subcategories) {
      filteredSuggestions.push(
        ...subcategories.map((subcategory) => ({
          type: "subcategory",
          data: { name: subcategory },
        }))
      );
    }

    setSuggestions(filteredSuggestions);
  } else {
    setSuggestions([]);
  }
}, [searchTerm, data]);

  // Calculate host video counts
  useEffect(() => {
    if (data?.podcasts) {
      setHostVideoCounts(calculateHostVideoCounts(data.podcasts));
    }
  }, [data?.podcasts]);
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}...`
      : text;
  };
  

  return (
    <header>
      <section className="relative flex justify-between items-center bg-[#231f20] px-2 md:px-6 py-[3px]">
        <div className="flex justify-center items-center gap-2 md:gap-5">
          <img
            onClick={handleLogoClick}
            src="./images/logo_white.svg"
            className="w-[16px] md:w-8 h-[16px] md:h-8 cursor-pointer"
            alt="HP Logo"
          />
          <div className="flex flex-col justify-center items-start text-white">
            <span
              onClick={handleLogoClick}
              className="md:mt-[5px] md:mb-[-0px] ml-0 md:ml-1 text-[20px] md:text-[34px] lg:text-[45px] cursor-pointer"
            >
              Tech tune-up podcast
            </span>
          </div>
        </div>

        <div className="relative mr-0 md:mr-4 lg:mr-12 w-[32%] md:w-[45%] tracking-wider">
          <input
            type="text"
            placeholder="Looking for something? Try searching by episode, guest or topic..."
            value={searchTerm}
            onChange={handleInputChange}
            className="border-[#2a78d4] border-2 px-6 md:px-8 py-0 md:py-1 rounded-full w-full text-[12px] text-gray-900 md:text-base focus:outline-none"
            style={{ zIndex: isHostPopUpOpen ? "0" : "40" }}
          />
          <HiMagnifyingGlass className="top-[5px] md:top-1 left-1 absolute w-auto h-4 md:h-6 text-gray-400" />

          {suggestions.length > 0 && !isHostPopUpOpen && (
            <div
              className="absolute bg-white shadow-md mt-2 ml-[-100px] md:ml-0 rounded-md w-[230px] md:w-full max-h-40 md:max-h-60 text-[12px] text-black md:text-[18px] overflow-y-auto"
              style={{ zIndex: 40, marginTop: "5px", padding: "5px" }}
            >
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center hover:bg-gray-200 px-4 py-2 cursor-pointer"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.type === "podcast" && <AiOutlineYoutube  className="mr-2" />}
                  {item.type === "channel" && <AiOutlineDesktop className="mr-2" />}
                  {item.type === "host" && <AiOutlineUser className="mr-2" />}
                  {item.type === "subcategory" && <LuListVideo className="mr-2" />}
                  <span>
                  {item.type === "podcast"
        ? `Ep ${item.data.episode}: ${truncateText(item.data.title, 10)}` // Add Episode Number
        : item.type === "subcategory"
        ? item.data.name
        : item.data.name}
</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative rounded-sm">
        <div>
          <img src="./images/D.png" className="w-full h-2 md:h-3" alt="Header Image" />
        </div>
      </section>

      {isHostPopUpOpen && selectedHost && (
        <div style={{ zIndex: 30, position: "relative" }}>
          <HostPopUp
            isOpen={isHostPopUpOpen}
            onClose={() => setIsHostPopUpOpen(false)}
            host={selectedHost}
            numOfPodcasts={hostVideoCounts[selectedHost.host_id] || 0}
          />
        </div>
      )}
    </header>
  );
};

export default HomeHeader;
