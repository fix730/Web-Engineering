import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import PostClicked from "./components/Post/PostClicked";
import axios from "axios";

// Moment.js für Lokalisierung
moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.values(Views);

// --- Interface-Definitionen ---

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

// --- Hauptkomponente des Kalenders ---
const Cal = () => {
  // --- Zustandsvariablen ---
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [postClicked, setPostClicked] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>();
  const [x, setX] = useState<boolean>(false); // Unbenutzt
  const [events, setEvents] = useState<EventType[]>([]);

  // --- Initiales Laden der Events beim Mounten der Komponente ---
  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Event-Handler: Wird aufgerufen, wenn ein Event im Kalender ausgewählt wird ---
  async function handleOnSelectEvent(event: EventType) {
    setShowModal(true);
    const response = await axiosInstance.get("/api/post/one", {
      params: { postId: event.id },
    });
    setCurrentPost(response.data.post);
    setPostClicked(true);
  }

  // --- Funktion zum Abrufen der Events von der API ---
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");
      setEvents(response.data.posts.map((post) => ({
        id: post.idpost,
        title: post.title,
        allDay: true,
        start: new Date(post.start_time),
        end: new Date(post.end_time),
      })));
    } catch (error) {
      console.error("Fehler beim Abrufen der Events:", error);
      if (axios.isAxiosError(error)) {
        console.error("Nachricht:", error.message);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Daten:", error.response.data);
        } else if (error.request) {
          console.error("Keine Antwort erhalten. Serverstatus oder Netzwerk prüfen.");
        }
      }
    }
  };

  return (
    <>
      <Header />
      <div style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events as EventType[]}
          step={60}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultDate={new Date(2025, 7, 10)}
          popup={false}
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true);
          }}
          onSelectEvent={(event) => handleOnSelectEvent(event)}
        />

        {/* PostClicked Modal: Wird angezeigt, wenn ein Post ausgewählt wurde */}
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