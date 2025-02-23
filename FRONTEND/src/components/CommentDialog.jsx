
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeEventHandeler=(e)=>{
    const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
  }

  const sendMessageHandeler= async()=>{
    alert(text)
  }
  return (
    <Dialog open={open} className="bg-[#ffff]">
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col bg-[#ffff]"
      >
        <div className="flex flex-1 bg-[#ffff]">
          <div className="w-1/2">
            <img
              src="https://plus.unsplash.com/premium_photo-1730745779969-e7768f4506c5?q=80&w=1938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex item-centre justify-between p-4">
              <div className="flex gap-3 item-centre ">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="post_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-s">username</Link>
                  {/* <span className="text-gray-600  item-centre">Bio Here...</span> */}
                </div>
              </div>

              <Dialog> 
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className="bg-[#ffff] flex flex-col items-center text-sm text-center">
                <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr/>
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                commentsssss aayengeeeeeeee
            </div>
            <div className="p-4">
              <div className="flex item-center gap-2">
                <input type="text" placeholder="add a comment" value={text} onChange={changeEventHandeler} className="w-full outline-none border border-gray-300 p-2 rounded " />
                <Button disabled={!text.trim()} onClick={sendMessageHandeler} variant="outline" className="bg-sky-600 focus-visible:ring-transparent text-white hover:bg-blue-900">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
