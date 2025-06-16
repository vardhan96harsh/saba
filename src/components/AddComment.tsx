import { SyntheticEvent, useState } from "react";
import { useApiContext } from "./contexts/ApiContext";
import Rating from '@mui/material/Rating';
import Notei from "/images/Note.svg";

export const AddComment = ({ handleSubmit, handleRating, ratingValue }) => {
  const [comment, setComment] = useState('');
  const { userName } = useApiContext();

  const handleChange = (event) => {
    setComment(event.target.value);
  }

  const handleSubmitData = (e) => {
    e.preventDefault();
    const commentId = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    handleSubmit({ id: commentId, name: userName, time: Date.now(), comment });
    setComment(''); // Clear the comment box after submission
  }

  return (
    <form onSubmit={handleSubmitData} className="w-full rounded-lg  ">
      <div className=" mx-auto ">
      
        {/* <SlNote className="md:mt-[-45px]  mr-2 md:size-6" /> */}
<div className="flex" > <img src={Notei} className="size-6  md:size-8 mr-2" alt="" />
<h2 className="   text-gray-800 text-lg md:text-xl  tracking-wider ">Comments</h2></div>
       
        <div className="mt-3 w-auto">
          <textarea
            onChange={handleChange}
            className="bg-gray-100  text-[12px] md:text-[18px] rounded  border border-gray-400 leading-normal w-[320px] md:w-[320px] lg:w-[349px] xl:w-[355px] 2xl:w-[455px]  md:h-16 lg:h-20 py-1 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white tracking-wider"
            name="comment" value={comment} placeholder='Type Your Comment' required></textarea>
        </div>
        <div className="flex  w-full  ">
          <div className="flex  text-gray-700 ">

          </div>
          <div>

          </div>
          <div className="">
            <input type='submit'
              className="    ml-[215px] md:ml-[219px] lg:ml-[252px] xl:ml-[249px] 2xl:ml-[350px] text-xs bg-gray-800 text-gray-100 font-medium  px-3 border border-gray-400  tracking-wider  hover:bg-gray-100 hover:text-gray-800"
              value='Post Comment' />
          </div>
        </div>
      </div>
    </form>
  )
}

