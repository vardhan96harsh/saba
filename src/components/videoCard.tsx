import { Channel } from "@/types/types";
import { useEffect } from "react";
import a1 from "../assets/images/a1.webp";
import a2 from "../assets/images/a2.jpg";
import a3 from "../assets/images/a3.jpg";
import { Description } from "@headlessui/react";
import cross from "../assets/images/cross.svg";
import check from "../assets/images/check.svg";


interface VideoCardProps {
  channelId: string;
  bgImg: string;
  title: string;
  videos: number;
  recordings: string;
  members: number;
  isSubsUnsubs: Boolean;
  onClick: Function;
  handleSubscribe: Function;
  description: string;
  isDisabled?: Boolean;
  icon: string; 
}

export const VideoCard = ({
  channelId,
  bgImg,
  title,
  description,
  videos,
  recordings,
  members,
  isSubsUnsubs,
  onClick,
  handleSubscribe,
  isDisabled,
  icon ,
}: VideoCardProps) => {

  useEffect(() => {
    document.title = "Welcome to Podcast";
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Toggle the state
    handleSubscribe(isSubsUnsubs, channelId);
  };

  const handleOnClick = () => {
    onClick();
  };


  const displayText = title.toLowerCase().includes('computing')
    ? "Subscribe to our Computing channel for podcasts about desktops, gaming laptops, poly products, omen, hyper X products, and many more."
    : title.toLowerCase().includes('printing')
    ? "Subscribe to our Printing channel for podcasts about our HP laser Jet Series, tips, tricks and much more."
    : "Testing channel";

  return (
    <div onClick={handleOnClick} className={`isolate transition ease-in-out ml-0   duration-300 relative md:w-[270px] lg:w-[225px] xl:w-[285px] 2xl:w-[328px]  md:h-[260px] 2xl:h-[280px]  rounded-sm overflow-hidden ${isSubsUnsubs === true ? "cursor-pointer" : "cursor-default"}`}>
      <img
        src={icon}
        className="-z-10 absolute mt-4 md:mt-1 ml-7 md:ml-6 w-auto h-[60px] md:h-24 2xl:h-[105px] object-fill"
        alt="background"
      />
      
      <span className="-z-[9] w-full h-full" />
      
      <div className="flex flex-col justify-between p-6 w-full h-full">
        <div className="flex flex-col">
         
          <div className="flex items-center mt-20 2xl:mt-24">
            <span className="font-djr-forma  text-[20px] text-black md:text-[32px] 2xl:text-[35px] leading-none ">
              {title}
            </span>
          </div>
          <div className="flex items-center mt-1 2xl:mt-3">
            <span className={` text-[12px] text-gray-700 2xl:text-[14px] leading-none tracking-wide ${window.innerWidth < 768 ? "line-clamp-5" : ""
                                            } `}>
              {description} 
            </span>
          </div>
        </div>
        <button
          type="button"
          disabled={isDisabled}
          className={`mx-auto flex items-center justify-center gap-2  md:text-base  mt-2 ml-[1px]  text-xs md:px-6 px-3 tracking-wide ${isSubsUnsubs
              ? "border-2 bg-white border-white text-black"
              : "bg-[#040404] border-2 border-[#000000] text-white"
            }`}
          onClick={handleButtonClick}
        >
          {isSubsUnsubs ? (
            <>
              Subscribed
              <img src={check} alt="Unsubscribe" className="w-4 md:w-6 h-4 md:h-6" />
            </>
          ) : (
            <>
              Unsubscribed
              <img
                src={cross}
                alt="Subscribe"
                className="w-4 md:w-6 h-4 md:h-6"
                style={{
                  filter: "invert(100%) brightness(200%) contrast(100%)",
                }}
              />
            </>
          )}
        </button>


      </div>
    </div>
  );
};











 
          {/* <h3 className="font-semibold text-[10px] text-black leading-none">
            {videos} Podcast{videos > 1 ? 's' : ''}
          </h3> */}
          {/* <div className="flex items-center gap-2 mt-3"> */}
           
          {/* </div> */}








 {/* <div className="flex -space-x-2">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                src={a1}
                alt="avatar"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                src={a2}
                alt="avatar"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                src={a3}
                alt="avatar"
              />
            </div> */}
            {/* <span className="font-semibold text-[10px] text-black leading-none">
              {members} Member{members > 1 ? 's' : ''}
            </span> */}