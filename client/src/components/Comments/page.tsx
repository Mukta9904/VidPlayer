import React, { useState, useEffect } from "react";
// import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@nextui-org/react";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  owner: string;
  video: string;
  ownerDetails: {
    fullName?: string;
    email?: string;
    username?: string;
    avatar?: string;
  };
}

const Comments = () => {
  const token = localStorage.getItem("token");
  dayjs.extend(relativeTime);
  const user = useSelector((state: RootState) => state.user.user);
  const video = useSelector((state: RootState) => state.video.video);
  const dispatch = useDispatch<AppDispatch>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);

  const videoId = localStorage.getItem("playedVideoId") || video?._id;
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/comment/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data) {
          console.log(response.data.data);
          setComments(response.data.data);
          setCommentCount(response.data.data.length);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/comment/${videoId}`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.data) {
        const comment = res.data.data
        const newComment = {
          _id: comment._id,
          content: comment.content,
          createdAt: comment.createdAt,
          owner: comment.owner,
          video: comment.video,
          ownerDetails: {
            fullName: user?.fullName,
            email: user?.email,
            username: user?.username,
            avatar: user?.avatar,
          }
        };
        setComments([newComment, ...comments]);
        setNewComment("");
        setCommentCount(commentCount + 1);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full h-full border-t border-gray-700 pt-5 space-y-6 text-gray-100">
      {/* Comment Input Section */}
      <div className="flex gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.username}</AvatarFallback>
        </Avatar>

        <form
          onSubmit={handleSubmit}
          className="flex-1 items-center flex gap-2"
        >
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-800 border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comment
          </Button>
        </form>
      </div>

      {/* Comments Count */}
      <div className="text-gray-400 ml-5">
        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
      </div>
      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="pb-4 ml-5 border-b border-gray-700">
            <div className="flex gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.username}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {user?.fullName}
                  </span>
                  
                  <span className="text-sm text-gray-400">
                    {dayjs(comment.createdAt).fromNow()}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                    @{user?.username}
                  </span>
                <p className="mt-1 text-gray-300">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
