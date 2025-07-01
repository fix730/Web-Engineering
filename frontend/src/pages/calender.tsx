import React, { useEffect, useState, useCallback } from "react";
// render und events importiert, aber nicht verwendet, können bei Bedarf entfernt werden
// import { render } from "react-dom";
// import events from "./components/Calender/events";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de"; // Wichtig: Für deutsche Lokalisierung
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import PostClicked from "./components/Post/PostClicked"; // Import für das Post-Detail-Modal
import axios from "axios"; // Für axios.isAxiosError
import { useNavigate } from "react-router-dom"; // Import für die Navigation

// Lokalisierung auf Deutsch setzen
moment.locale("de"); // HIER wurde es auf Deutsch gesetzt
const localizer = momentLocalizer(moment);
const allViews = Object.values(Views); // allViews wird nicht direkt verwendet, kann entfernt werden

// Erweitertes EventType-Interface
export interface EventType {
  id: number;
  title: string;
  allDay: boolean; // Kann true oder false sein
  start: Date;
  end: Date;
  type: 'own' | 'liked'; // 'own' für eigene Posts, 'liked' für gelikte Posts
}

export interface PostsResponse {
  posts: PostType[];
}

const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]); // Für 'Show More' Modal
  const [modalDate, setModalDate] = useState<Date | null>(null); // Für 'Show More' Modal
  const [postClicked, setPostClicked] = useState(false); // Kann möglicherweise mit showModal zusammengefasst werden
  const [currentPost, setCurrentPost] = useState<PostType | undefined>(undefined); // currentPost initial auf undefined setzen
  // const [x, setX] = useState<boolean>(false); // Wird nicht verwendet, kann entfernt werden

  const [events, setEvents] = useState<EventType[]>([]); // Alle Kalender-Events
  const navigate = useNavigate(); // Hook für die Navigation

  useEffect(() => {
    console.log("Moment Spracheinstellung:", moment.locale());
    console.log("Beispiel Datum (Moment):", moment().format("dddd, D. MMMM YYYY, HH:mm"));
    fetchAllCalendarEvents(); // Funktion zum Laden beider Event-Typen
  }, []);

  // Funktion zum Abrufen eigener Posts
  const fetchOwnPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");
      return response.data.posts || [];
    } catch (error) {
      console.error("❌ Fehler beim Laden der eigenen Ereignisse:", error);
      return [];
    }
  };

  // Funktion zum Abrufen gelikter Posts
  const fetchLikedPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user/liked");
      return response.data.posts || [];
    } catch (error) {
      console.error("❌ Fehler beim Laden der gelikten Ereignisse:", error);
      return [];
    }
  };

  // Funktion zum Laden aller relevanten Events (eigene und gelikte)
  const fetchAllCalendarEvents = useCallback(async () => {
    const [ownPosts, likedPosts] = await Promise.all([
      fetchOwnPosts(),
      fetchLikedPosts(),
    ]);

    const ownEvents: EventType[] = ownPosts.map((post) => ({
      id: post.idpost,
      title: post.title,
      allDay: false, // Normalerweise false für Events mit genauer Uhrzeit
      start: new Date(post.start_time),
      end: new Date(post.end_time),
      type: 'own', // Markierung als eigener Post
    }));

    const likedEvents: EventType[] = likedPosts.map((post) => ({
      id: post.idpost,
      title: post.title,
      allDay: false, // Normalerweise false für Events mit genauer Uhrzeit
      start: new Date(post.start_time),
      end: new Date(post.end_time),
      type: 'liked', // Markierung als gelikter Post
    }));

    setEvents([...ownEvents, ...likedEvents]);
    console.log("Loaded Events:", [...ownEvents, ...likedEvents]);
  }, []); // useCallback, da es eine Abhängigkeit in useEffect hat und keine externen Abhängigkeiten

  // Handler für Klick auf ein bestehendes Event (öffnet PostClicked Modal)
  async function handleOnSelectEvent(event: EventType) {
    try {
      const response = await axiosInstance.get("/api/post/one", {
        params: { postId: event.id },
      });
      setCurrentPost(response.data.post);
      setShowModal(true); // Modal anzeigen
      setPostClicked(true); // Optional, kann mit showModal zusammengefasst werden
      console.log("Selected event data:", response.data.post);
    } catch (error) {
      console.error("Fehler beim Abrufen der Post-Details:", error);
      // Optional: Fehlermeldung anzeigen
    }
  }

  // Handler für Klick auf einen leeren Slot (navigiert zu Post erstellen)
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; }) => {
    navigate("/posts/new", {
      state: {
        startTime: slotInfo.start.toISOString(),
        endTime: slotInfo.end.toISOString(),
      },
    });
  }, [navigate]);

  // Funktion zur dynamischen Zuweisung von CSS-Klassen für das Event-Styling
  const eventPropGetter = useCallback((event: EventType) => {
    let className = '';
    if (event.type === 'own') {
      className = 'rbc-event-own'; // Klasse für eigene Events
    } else if (event.type === 'liked') {
      className = 'rbc-event-liked'; // Klasse für gelikte Events
    }
    return {
      className: className,
      style: {}, // Stile werden über CSS-Klassen gesetzt
    };
  }, []);

  return (
    <>
      <Header />
      <div className="" style={{ height: 700, padding: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events} // Events sind jetzt von EventType[]
          step={60}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} // Agenda-Ansicht hinzugefügt
          defaultView={Views.MONTH}
          defaultDate={new Date()} // Setzt das Standarddatum auf das aktuelle Datum
          popup={false} // Verhindert das Standard-Popup von react-big-calendar
          selectable // Ermöglicht das Klicken/Ziehen auf leere Slots
          onSelectSlot={handleSelectSlot} // Handler für das Erstellen neuer Posts
          onSelectEvent={handleOnSelectEvent} // Handler für das Klicken auf bestehende Events
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true); // Dies steuert das 'Show More' Modal
          }}
          eventPropGetter={eventPropGetter} // Wichtig für das farbliche Unterscheiden
          messages={{
            today: "Heute",
            previous: "Zurück",
            next: "Weiter",
            month: "Monat",
            week: "Woche",
            day: "Tag",
            agenda: "Agenda",
            date: "Datum",
            time: "Uhrzeit",
            event: "Ereignis",
            noEventsInRange: "Keine Ereignisse im gewählten Zeitraum.",
            showMore: (total) => `+${total} mehr`,
          }}
        />

        {/* PostClicked Modal (für einzelne Post-Details) */}
        {currentPost && showModal && ( // showModal ist jetzt der primäre Trigger
          <PostClicked
            post={currentPost}
            onClose={() => {
              setShowModal(false);
              setCurrentPost(undefined);
              setPostClicked(false); // Zurücksetzen
            }}
          />
        )}

        {/* Optional: Ein separates Modal für 'Show More' (wenn gewünscht, sonst kann PostClicked dafür angepasst werden) */}
        {/*
        {modalEvents.length > 0 && modalDate && showModal && ( // Beispiel für 'Show More' Modal
          <div className="modal">
            <div className="modal-content">
              <h2>Events for {moment(modalDate).format("L")}</h2>
              <ul>
                {modalEvents.map((event) => (
                  <li key={event.id}>{event.title} - {event.type}</li>
                ))}
              </ul>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
        */}
      </div>
    </>
  );
};

export default Cal;