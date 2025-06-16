import { Comment } from "@/types/types"

interface CommentProps{
    comment:Comment
}

export const CommentBox = ({comment}:CommentProps) => {



    return (
        <div className="  rounded-lg ">
            <div className="  md:text-lg">
                <div className="">
                    <p className="font-semibold text-sm md:text-lg mr-2 tracking-wider">
                        {comment.name} :
                    </p>
                    <p className= " text-[12px] md:text-lg w-[90%] md:w-[80%]">
                    {comment.comment}
                </p>
                    {/* <div className="flex gap-3">
                        <a href="#" className=" transition-colors duration-75" target="_blank">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="#" className=" transition-colors duration-75" target="_blank">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                    </div> */}
                </div>

                {/* <p className=" text-sm">
                    CEO
                    <a href="#" className="hover:underline hover:cursor-pointer hover:text-blue-500 transition-colors duration-75">
                        Tech Company Z
                    </a>
                </p> */}
                {/* <p className="text-base">
                    {comment.comment}
                </p> */}
            </div>
        </div>
    )
}