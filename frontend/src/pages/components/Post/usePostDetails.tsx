// src/hooks/usePostDetails.ts or src/utils/usePostDetails.ts
import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { fetchProfileImage } from "../../../utils/image";
import { PostType } from "../Post/Post"

interface UsePostDetailsResult {
  liked: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  postImage: string | undefined;
  countLikes: number;
  toggleLike: () => Promise<void>;
  aktualisierenLikeStatus: () => Promise<void>;
  checkLikeStatus: () => Promise<void>;
}

export const usePostDetails = (post: PostType): UsePostDetailsResult => {
  const [liked, setLiked] = useState(false);
  const [postImage, setPostImage] = useState<string | undefined>(undefined);
  const [countLikes, setCountLikes] = useState<number>(0);


  // Fetches post image
  useEffect(() => {
    fetchProfileImage({ onSetImageUrl: setPostImage, imageId: post.image_idimage, profilePlaceholder: undefined });
  }, [post.image_idimage]);

  // Fetches current like status for the user and total like count
  const checkLikeStatus = async () => {
    try {
      const [likeStatusResponse, likeCountResponse] = await Promise.all([
        axiosInstance.get(`/api/post/like/byUser`, { params: { postId: post.idpost } }),
        axiosInstance.get(`/api/post/like/count`, { params: { postId: post.idpost } })
      ]);
      setLiked(Boolean(likeStatusResponse.data.isLiked));
      setCountLikes(Number(likeCountResponse.data.likes));
    } catch (error) {
      console.error("Fehler beim Überprüfen des Like-Status:", error);
    }
  };

  // Updates only the like count (useful after a like/unlike action)
  const aktualisierenLikeStatus = async () => {
    try {
      const getCountLikes = await axiosInstance.get(`/api/post/like/count`, {
        params: {
          postId: post.idpost
        }
      });
      setCountLikes(Number(getCountLikes.data.likes));
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Like-Status:", error);
    }
  };

  // Handles toggling the like status
  const toggleLike = async () => {
    try {
      if (!liked) {
        await axiosInstance.post("/api/post/like", {
          postId: post.idpost
        });
        setCountLikes(prev => prev + 1); // Optimistic update
      } else {
        await axiosInstance.delete(`/api/post/like`, {
          params: {
            postId: post.idpost
          }
        });
        setCountLikes(prev => Math.max(0, prev - 1)); // Optimistic update
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Fehler beim Umschalten des Like-Status:", error);
      // Revert optimistic update if API call fails
      setCountLikes(prev => (liked ? prev + 1 : prev - 1));
      setLiked(liked);
    }
  };

  // Initial fetch of like status and count when the component mounts
  useEffect(() => {
    checkLikeStatus();
  }, [post.idpost]); // Re-run if post.idpost changes

  return {
    liked,
    setLiked,
    postImage,
    countLikes,
    toggleLike,
    aktualisierenLikeStatus,
    checkLikeStatus,
  };
};