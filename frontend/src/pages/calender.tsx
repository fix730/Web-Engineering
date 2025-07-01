import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de"; // Stellt sicher, dass die deutsche Lokalisierung geladen ist
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import { useNavigate } from "react-router-dom"; // Importieren von useNavigate

// Lokalisierung auf Deutsch setzen
moment.locale("de");
const localizer = momentLocalizer(moment);

export interface EventType {
  id: number;
  title: string;
  allDay: boolean; // allDay kann auch false sein, wenn es um spezifische Uhrzeiten geht
  start: Date;
  end: Date;
}

export interface PostsResponse {
  posts: PostType[];
}

const Cal = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const navigate = useNavigate(); // Initialisieren des navigate Hooks

  useEffect(() => {
    // Diese Konsolenlogs sind hilfreich zur Debugging der Moment.js Lokalisierung
    console.log("Moment Spracheinstellung:", moment.locale());
    console.log("Beispiel Datum (Moment):", moment().format("dddd, D. MMMM YYYY, HH:mm"));
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");

      setEvents(
        response.data.posts.map((post) => ({
          id: post.idpost,
          title: post.title,
          allDay: false, // Setzen Sie dies auf false, da Sie spezifische Start- und Endzeiten haben
          start: new Date(post.start_time),
          end: new Date(post.end_time),
        }))
      );
    } catch (error) {
      console.error("❌ Fehler beim Laden der Ereignisse:", error);
      // Optional: Eine Benachrichtigung für den Benutzer anzeigen
    }
  };

  return (
    <>
      <Header />
      <div style={{ height: 700, padding: '20px' }}> {/* Etwas Padding hinzufügen für bessere Optik */}
        <Calendar
          localizer={localizer}
          events={events as EventType[]}
          step={60} // Standard-Schrittweite in Minuten für die Tages- und Wochenansicht
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} // Agenda-Ansicht hinzugefügt
          defaultView={Views.MONTH}
          defaultDate={new Date()} // Setzt das Standarddatum auf das aktuelle Datum
          popup={false} // Verhindert das Standard-Popup von react-big-calendar
          selectable // Aktiviert die Auswahl von Zeitfenstern
          onSelectSlot={(slotInfo) => {
            // Beim Auswählen eines Zeitfensters zur Post-Erstellungsseite navigieren
            navigate("/posts/new", {
              state: {
                // Übergeben der Start- und Endzeiten als ISO-Strings
                startTime: slotInfo.start.toISOString(),
                endTime: slotInfo.end.toISOString(),
              },
            });
          }}
          // Optional: onSelectEvent, wenn Sie beim Klicken auf ein bestehendes Ereignis etwas tun wollen
          onSelectEvent={(event) => {
            console.log("Ereignis angeklickt:", event);
            // Beispiel: Zu einer Detailseite des Posts navigieren
            // navigate(`/posts/${event.id}`);
          }}
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
      </div>
    </>
  );
};

export default Cal;