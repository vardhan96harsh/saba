import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '../components/contexts/ApiContext';
import HostPopUp from "../components/HostPopUp";  // Import the HostPopUp component
import HomeHeader from '@/components/HomeHeader';
import team from "../assets/images/Team.svg";

const HostDetails: React.FC = () => {
  const { data, hostData } = useApiContext();

  const hosts = hostData && hostData.length > 0
    ? hostData
    : data?.hosts || [];
   // Get hosts from data or fallback to empty array
  const podcasts = data?.podcasts || []; 
  const navigate = useNavigate(); // Initialize useNavigate

  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [selectedHost, setSelectedHost] = useState(null); // State to store the selected host
  const [hostVideoCounts, setHostVideoCounts] = useState({}); // State to store video counts for hosts

  // Handle back to home navigation
  const handleBackClick = () => {
    navigate('/'); // Navigate to the home page
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle clicking on a host to open the popup
  const handleHostClick = (host: any) => {
    setSelectedHost(host); // Set the selected host
    setIsPopupOpen(true); // Open the popup
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };


    // Calculate the number of podcasts for each host
    const getHostVideoCounts = (podcasts) => {
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
  
    // Update host video counts whenever podcasts change
    useEffect(() => {
      setHostVideoCounts(getHostVideoCounts(podcasts));
    }, [podcasts]);

  
  const filteredHosts = hosts.filter((host) =>
    host.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const getCategoryColor = (category?: string) => {
    if (!category) {
      return 'bg-gray-200';
    }
    switch (category.toLowerCase()) {
      case 'core team':
        return 'bg-white';
      case 'computing':
        return 'bg-[#D4FCFF]';
      case 'printing':
        return 'bg-[#E5F1FE]'; 
      case 'all':
        return 'bg-[#E6E6E6]';
      default:
        return 'bg-[#F1F1F1]'; 
    }
  };

  return (
    <div className="py- tracking-wider">
      <HomeHeader />
      <div className="flex justify-between items-center mb-2">
        <div className='flex items-center bg-[#E6E6E6] px-1 md:px-5 w-full h-8 md:h-20'>
          <span>
            <img src={team} alt="team" className="w-5 md:w-10 h-5 md:h-10" />
          </span>
          <h1 className="mt-1 pl-2 md:pl-5 text-black md:text-[38px] tracking-wide">the team</h1>
        </div>
      </div>
      {filteredHosts.length === 0 ? (
        <p className="text-center text-gray-700 text-xl">No guest available</p>
      ) : (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pb-5 pr-20 pl-20 overflow-auto" style={{ overflow: 'scroll' , maxHeight: '80vh' }} >
          {filteredHosts.map((host) => (
            <div
              key={host.host_id}
              onClick={() => handleHostClick(host)}
              className={`border rounded-lg shadow-lg p-6 transition transform hover:scale-105 cursor-pointer tracking-widest ${getCategoryColor(host.category)} `}
            >
              <img
                src={host.photo || 'https://via.placeholder.com/150'}
                alt={host.name}
                className="mx-auto mb-4 rounded-full w-36 h-36 object-cover"
              />
              <h2 className="font-thin text-[25px] text-black text-center tracking-normal">{host.name}</h2>
              <p className="font-semibold text-center text-gray-600">{host.designation}</p>
              <p className="font-medium text-blue-600 text-center">{host.email_id}</p>
              {/* <p className="mt-2 font-semibold text-center text-gray-600">Host ID: {host.host_id}</p> */}
          

            </div>
          ))}
        </div>
      )}
      {selectedHost && (
        <HostPopUp
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          host={selectedHost}
          numOfPodcasts={hostVideoCounts[selectedHost.host_id] || 0}  // Replace with actual number if available
        />
      )}
    </div>
  );
};

export default HostDetails;
