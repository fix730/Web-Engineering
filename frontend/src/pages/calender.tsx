import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import events from "./components/Calender/events";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import PostClicked from "./components/Post/PostClicked";
import axios from "axios";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.values(Views);

export interface EventType {
  id: number;
  title: string;
  allDay: true;
  start: Date;
  end: Date;
}

export interface PostsResponse {
  posts: PostType[];
}


const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [postClicked, setPostClicked] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>();
  const [x, setX] = useState<boolean>(false);
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    console.log("Events loaded:");
    fetchEvents();
  }, []);

  async function handleOnSelectEvent(event: EventType) {
    setShowModal(true);
    const response = await axiosInstance.get("/api/post/one", {
      params: { postId: event.id },
    });

    // setModalEvents(events.filter((e: EventType) => e.title === event.title));
    console.log("Selected event:", response.data.post);
    setCurrentPost(response.data.post);
    setPostClicked(true);
  }


  const fetchEvents = async () => {
    console.log("Attempting to fetch events from /api/posts/all..."); // Simpler start log

    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");


      // Only log success if it actually works
      console.log("✅ Events fetched successfully!");
      console.log("Response status:", response.status);
      console.log("Number of posts received:", response.data.posts?.length || 0); // Check for posts array and its length

      setEvents(response.data.posts.map((post) => ({
        id: post.idpost,
        title: post.title,
        allDay: true,
        start: new Date(post.start_time),
        end: new Date(post.end_time),
      })));

    } catch (error) {
      console.error("❌ Error fetching events:"); // Clear error indicator

      if (axios.isAxiosError(error)) {
        // Log critical Axios error details
        console.error("  Message:", error.message);
        console.error("  Code:", error.code); // e.g., ERR_NETWORK, ERR_BAD_REQUEST

        if (error.response) {
          // Server responded with an error status (e.g., 404, 500)
          console.error("  Status:", error.response.status);
          console.error("  Data:", error.response.data); // What the server sent back
        } else if (error.request) {
          // Request was sent, but no response (e.g., server down, network issue)
          console.error("  No response received. Check server status or network.");
        }
      } else {
        // General JavaScript error
        console.error("  Non-Axios error:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events as EventType[]}
          step={60}
          views={allViews}
          defaultDate={new Date(2025, 7, 10)}
          popup={false}
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true);
          }}
          onSelectEvent={(event) => handleOnSelectEvent(event)}
        />

        {currentPost && showModal && (
          <PostClicked
            post={currentPost}
            onClose={() => {
              setShowModal(false);
              setCurrentPost(undefined);
            }}

          />
        )}
      </div>
    </>
  );
};

export default Cal;
