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

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.values(Views);

type EventType = {
  id: number;
  title:
  string;
  [key: string]: any
};



const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [postClicked, setPostClicked] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>();
  const [x, setX] = useState<boolean>(false);

  useEffect(() => {
    console.log("Events loaded:");
  }, [showModal]);

  async function handleOnSelectEvent(event: EventType) {
    setShowModal(true);
    const response = await axiosInstance.get("/api/post/one", {
      params: { postId: 12 },
    });

    // setModalEvents(events.filter((e: EventType) => e.title === event.title));
    console.log("Selected event:", response.data.post);
    setCurrentPost(response.data.post);
    setPostClicked(true);
  }
  return (
    <>
      <Header />
      <div className="" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events as EventType[]}
          step={60}
          views={allViews}
          defaultDate={new Date(2015, 3, 1)}
          popup={false}
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true);
          }}
        onSelectEvent={(event)=>handleOnSelectEvent(event)}
        />

        {currentPost && (
          <PostClicked
            post={currentPost}
            onClose={() => setPostClicked(false)}
            handlePostClick={setPostClicked}
          />
        )}
      </div>
    </>
  );
};

export default Cal;
