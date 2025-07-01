import React, { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de"; // Wichtig: Für deutsche Lokalisierung
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import PostClicked from "./components/Post/PostClicked";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Lokalisierung auf Deutsch setzen
moment.locale("de");
const localizer = momentLocalizer(moment);

// Erweitertes EventType-Interface mit neuem 'type' für Kategorisierung
export interface EventType {
  id: number;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  type: 'own' | 'liked' | 'other'; // 'own', 'liked', oder 'other' (fremde, nicht gelikte)
}

export interface PostsResponse {
  posts: PostType[];
}

const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [currentPost, setCurrentPost] = useState<PostType | undefined>(undefined);
  const [events, setEvents] = useState<EventType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Moment Spracheinstellung:", moment.locale());
    console.log("Beispiel Datum (Moment):", moment().format("dddd, D. MMMMYY, HH:mm"));
    fetchAllCalendarEvents();
  }, []);

  // API-Funktion für alle sichtbaren Posts (fremd und eigene)
  const fetchAllPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");
      return response.data.posts || [];
    } catch (error) {
      console.error("❌ Fehler beim Laden aller sichtbaren Ereignisse:", error);
      return [];
    }
  };

  // API-Funktion für eigene Posts des Benutzers
  const fetchUserOwnPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user"); // URL aus Ihrem Screenshot
      return response.data.posts || [];
    } catch (error) {
      console.error("❌ Fehler beim Laden der eigenen Ereignisse:", error);
      return [];
    }
  };

  // API-Funktion für gelikte Posts des Benutzers
  const fetchLikedPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user/liked");
      return response.data.posts || [];
    } catch (error) {
      console.error("❌ Fehler beim Laden der gelikten Ereignisse:", error);
      return [];
    }
  };

  const fetchAllCalendarEvents = useCallback(async () => {
    // Alle drei API-Anfragen parallel ausführen
    const [allPosts, userOwnPosts, likedPosts] = await Promise.all([
      fetchAllPosts(),
      fetchUserOwnPosts(),
      fetchLikedPosts(),
    ]);

    // Eine Map verwenden, um Duplikate nach Post-ID zu verwalten
    // und Prioritäten zu setzen (Own > Liked > Other)
    const finalEventsMap = new Map<number, EventType>();

    // 1. Eigene Posts hinzufügen (höchste Priorität)
    userOwnPosts.forEach(post => {
      finalEventsMap.set(post.idpost, {
        id: post.idpost,
        title: post.title,
        allDay: false,
        start: new Date(post.start_time),
        end: new Date(post.end_time),
        type: 'own',
      });
    });

    // 2. Gelikte Posts hinzufügen (mittlere Priorität)
    likedPosts.forEach(post => {
      // Nur hinzufügen, wenn der Post nicht bereits als 'own' hinzugefügt wurde
      if (!finalEventsMap.has(post.idpost)) {
        finalEventsMap.set(post.idpost, {
          id: post.idpost,
          title: post.title,
          allDay: false,
          start: new Date(post.start_time),
          end: new Date(post.end_time),
          type: 'liked',
        });
      }
    });

    // 3. Alle anderen Posts hinzufügen (niedrigste Priorität)
    allPosts.forEach(post => {
      // Nur hinzufügen, wenn der Post nicht bereits als 'own' oder 'liked' hinzugefügt wurde
      if (!finalEventsMap.has(post.idpost)) {
        finalEventsMap.set(post.idpost, {
          id: post.idpost,
          title: post.title,
          allDay: false,
          start: new Date(post.start_time),
          end: new Date(post.end_time),
          type: 'other', // Neuer Typ für fremde, nicht gelikte Posts
        });
      }
    });

    // Konvertiere die Map-Werte zurück in ein Array für den Kalender-State
    setEvents(Array.from(finalEventsMap.values()));
    console.log("Loaded all categorized Events:", Array.from(finalEventsMap.values()));
  }, []);

  // Handler für Klick auf ein bestehendes Event (öffnet PostClicked Modal)
  async function handleOnSelectEvent(event: EventType) {
    try {
      const response = await axiosInstance.get("/api/post/one", {
        params: { postId: event.id },
      });
      setCurrentPost(response.data.post);
      setShowModal(true);
      console.log("Selected event data:", response.data.post);
    } catch (error) {
      console.error("Fehler beim Abrufen der Post-Details:", error);
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
    } else if (event.type === 'other') {
      className = 'rbc-event-other'; // Klasse für andere (fremde, nicht gelikte) Events
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
          events={events}
          step={60}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
          defaultDate={new Date()}
          popup={false}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleOnSelectEvent}
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true);
          }}
          eventPropGetter={eventPropGetter}
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