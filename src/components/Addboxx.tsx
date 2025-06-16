import React, { useState } from "react";
import ShareLink from "../assets/images/ShareLink.svg";

interface AddboxxProps {
  video: {
    id: string;
    title: string;
    channel_id: string;
    channel: string;
    wise_link: string;
    publish_date?: string;
    hosts?: { host_id: string; name: string }[];
  } | null;
}

const Addboxx: React.FC<AddboxxProps> = ({ video }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!video) return null; // Don't render if no video data is provided

  const togglePopup = (): void => {
    setIsOpen(!isOpen);
  };

  // Generates a shareable link with video details
  const generateShareableLink = () => {
    const baseUrl = "https://hpi.sabacloud.com/Saba/Web_spf/HPI/app/workspace/detail/pgcnt000000000539913";

    // Encode video details in URL parameters
    const params = new URLSearchParams({
      videoId: video.id,
      title: encodeURIComponent(video.title),
      channelId: video.channel_id,
      channelName: encodeURIComponent(video.channel),
      videoUrl: encodeURIComponent(video.wise_link),
      publishDate: video.publish_date || "",
      // hosts: video.hosts?.map(host => `${host.name} (${host.host_id})`).join(", ") || "N/A"
    }).toString();

    return `${baseUrl}?${params}`;
  };

  const copyToClipboard = (): void => {
    const shareableLink = generateShareableLink();
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <img
        src={ShareLink}
        alt="Addbox Icon"
        className="w-7 md:w-8 h-7 md:h-8 cursor-pointer"
        onClick={togglePopup}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Copy the link</h3>
            <input 
              type="text" 
              value={generateShareableLink()} 
              readOnly 
              className="border rounded w-full px-3 py-2 text-center mb-4"
            />
            <div className="space-x-4">
              <button 
                onClick={copyToClipboard} 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Copy Link
              </button>
              <button 
                onClick={togglePopup} 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addboxx;
