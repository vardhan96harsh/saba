import { Podcast } from "@/types/types";
import { useEffect, useState } from "react";
import { MdPlayCircle } from "react-icons/md";
import { Loader } from "./Loader";

interface CaruselProps {
  bgImg: string;
  subtitle: string;
  video: Podcast;
  onClick: Function;
}

export const Carausel = ({ bgImg, video, subtitle, onClick }: CaruselProps) => {

  let [videoData, setVideoData] = useState({})
  let [loading, setLoading] = useState(false)

  const handleClick = () => {
    onClick(video);
  }

  // useEffect(() => {
  //   if (video && video.link) {

  //     let refId = video.link?.split('ref:') ?? '';

  //     fetch(`https://edge.api.brightcove.com/playback/v1/accounts/1160438706001/videos/ref:${refId[1]}`, {
  //       "headers": {
  //         "accept": "application/json;pk=BCpkADawqM3-ept_s9M526PvJGFk1OmqJbDQKjW7gNRVeNleUjKV8WRHpkBSfWx_ymoXslGDWJ9UiYs0PMvU7aG4OBOJgXIWXBnOj4chTgyOzbncPKjeFsm0uCBwtn8MSnELzkpJF7NnBeqB",
  //       },
  //       "method": "GET",
  //     }).then(async (response) => {
  //       let data = await response.json();

  //       setVideoData({
  //         thumbnail: data?.poster,
  //         src: data?.sources[data.sources?.length - 1]?.src,
  //       });
  //       setLoading(false)
  //     });
  //   }
  //   else {
  //     setLoading(false)

  //   }

  // }, []);
  return (
    <div onClick={handleClick} className="block transition ease-in-out  hover:scale-105 duration-30 cursor-pointer isolate relative aspect-[977/1058] w-full h-auto rounded-sm overflow-hidden z-0">
      <img
        src={video?.thumbnail ? video?.thumbnail : bgImg}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="background"
      />
      <span className="layer absolute inset-0 w-full h-full -z-[9]" />
      <MdPlayCircle className={`absolute top-0 bottom-0 left-0 right-0 m-auto h-12 w-12 fill-white z-10`} />

      {loading ? <Loader></Loader> :
        <div className="flex flex-col justify-between p-4 w-full h-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-sm text-white leading-none truncate mt-2">
              {video.title}
            </h1>
            <h3 className="font-semibold text-[10px] text-white leading-none mt-1">
              {subtitle}
            </h3>
          </div>
        </div>}

    </div>
  );
};
