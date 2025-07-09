import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar"; // Hauptkomponenten von react-big-calendar
import moment from "moment"; // Moment.js für Datums- und Zeitmanipulation
import "moment/locale/de"; // Deutsche Lokalisierung für Moment.js
import "react-big-calendar/lib/css/react-big-calendar.css"; // Standard-CSS für react-big-calendar
import Header from "./components/Header/Header"; // Header-Komponente der Anwendung
import axiosInstance from "../api/axiosInstance"; // Vorkonfigurierte Axios-Instanz für API-Anfragen
import { PostType } from "./components/Post/Post"; // Typdefinition für einen Post
import PostClicked from "./components/Post/PostClicked"; // Komponente zur Anzeige eines angeklickten Posts (Modal)
import { useNavigate } from "react-router-dom"; // Hook für die Navigation innerhalb der Anwendung
import Footer from "./components/Footer/Footer"; // Fußzeilen-Komponente der Anwendung

// Lokalisierung von Moment.js auf Deutsch setzen, um Datumsformate und Wochentage anzupassen.
moment.locale("de");
// Erstellt einen Moment.js-Localizer für react-big-calendar.
const localizer = momentLocalizer(moment);

// Interface für die Ereignisdaten, wie sie von react-big-calendar erwartet werden.
// Erweitert um einen 'type', um eigene, gelikte oder andere Posts zu unterscheiden.
export interface EventType {
  id: number; // Eindeutige ID des Ereignisses (entspricht der Post-ID)
  title: string; // Titel des Ereignisses
  allDay: boolean; // Flag, ob das Ereignis einen ganzen Tag dauert
  start: Date; // Startzeitpunkt des Ereignisses
  end: Date; // Endzeitpunkt des Ereignisses
  type: 'own' | 'liked' | 'other'; // Typ des Posts: eigener, gelikter oder anderer Post
}

// Interface für die API-Antwort, wenn mehrere Posts abgerufen werden.
export interface PostsResponse {
  posts: PostType[]; // Array von Post-Objekten
}

// Cal-Komponente: Stellt den Hauptkalender dar und verwaltet dessen Funktionalitäten.
const Cal = () => {
  // Zustandsvariable zur Steuerung der Sichtbarkeit des PostClicked-Modals.
  const [showModal, setShowModal] = useState(false);
  // Zustandsvariable für den Post, der im Modal angezeigt werden soll.
  const [currentPost, setCurrentPost] = useState<PostType | undefined>(undefined);

  // Speichert alle aus der API geladenen Ereignisse, bevor Filter angewendet werden.
  const [allLoadedEvents, setAllLoadedEvents] = useState<EventType[]>([]);

  // Zustandsvariable für die Filteroptionen (eigene, gelikte, andere Posts).
  const [filters, setFilters] = useState({
    own: true,   // Filter für eigene Posts aktiv
    liked: true, // Filter für gelikte Posts aktiv
    other: true, // Filter für andere Posts aktiv
  });

  // Hook zur Navigation zwischen verschiedenen Routen der Anwendung.
  const navigate = useNavigate();

  // useEffect Hook: Wird einmal beim Mounten der Komponente ausgeführt.
  // Dient dazu, die Moment.js-Lokalisierung zu überprüfen und alle Kalenderereignisse zu laden.
  useEffect(() => {
    console.log("Moment Spracheinstellung:", moment.locale());
    console.log("Beispiel Datum (Moment):", moment().format("dddd, D. MMMMYY, HH:mm"));
    fetchAllCalendarEvents(); // Startet den Ladevorgang der Ereignisse.
  }, []); // Leeres Abhängigkeits-Array bedeutet, dass der Effekt nur einmal nach dem ersten Rendern läuft.

  // Asynchrone Funktion zum Abrufen aller "sichtbaren" Posts von der API.
  // Dies sind typischerweise öffentliche Posts oder solche, die dem Benutzer angezeigt werden dürfen.
  const fetchAllVisiblePosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");
      return response.data.posts || []; // Gibt das Array der Posts zurück oder ein leeres Array bei Fehlen.
    } catch (error) {
      console.error("Fehler beim Laden aller sichtbaren Ereignisse:", error);
      return [];
    }
  };

  // Asynchrone Funktion zum Abrufen der eigenen Posts des angemeldeten Benutzers.
  const fetchUserOwnPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user");
      return response.data.posts || [];
    } catch (error) {
      console.error("Fehler beim Laden der eigenen Ereignisse:", error);
      return [];
    }
  };

  // Asynchrone Funktion zum Abrufen der Posts, die der Benutzer "geliked" hat.
  const fetchLikedPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user/liked");
      // console.log("Geladene gelikte Posts:", response.data.posts); // Debug-Ausgabe
      return response.data.posts || [];
    } catch (error) {
      console.error("Fehler beim Laden der gelikten Ereignisse:", error);
      return [];
    }
  };

  // useCallback Hook: Lädt alle Kategorien von Posts und konvertiert sie in Kalenderereignisse.
  // Sorgt dafür, dass diese Funktion nur neu erstellt wird, wenn sich ihre Abhängigkeiten ändern (hier keine).
  const fetchAllCalendarEvents = useCallback(async () => {
    // Führt alle drei API-Anfragen parallel aus, um die Ladezeit zu optimieren.
    const [allVisiblePosts, userOwnPosts, likedPosts] = await Promise.all([
      fetchAllVisiblePosts(),
      fetchUserOwnPosts(),
      fetchLikedPosts(),
    ]);

    // Debug-Ausgaben (können für die Produktion entfernt werden)
    // console.log("Rohe eigene Posts:", userOwnPosts);
    // console.log("Rohe gelikte Posts:", likedPosts);
    // console.log("Rohe alle sichtbaren Posts:", allVisiblePosts);

    // Eine Map wird verwendet, um Duplikate zu vermeiden, falls ein Post in mehreren Kategorien erscheint.
    // Die Priorität ist: eigene > gelikte > andere.
    const finalEventsMap = new Map<number, EventType>();

    // Fügt eigene Posts zur Map hinzu (höchste Priorität).
    userOwnPosts.forEach(post => {
      finalEventsMap.set(post.idpost, {
        id: post.idpost,
        title: post.title,
        allDay: false, // Annahme: Posts sind keine Ganztagesereignisse
        start: new Date(post.start_time), // Konvertiert String zu Date-Objekt
        end: new Date(post.end_time),     // Konvertiert String zu Date-Objekt
        type: 'own', // Markiert als eigener Post
      });
    });

    // Fügt gelikte Posts hinzu, wenn sie nicht bereits als "eigene" Posts vorhanden sind.
    likedPosts.forEach(post => {
      if (!finalEventsMap.has(post.idpost)) {
        finalEventsMap.set(post.idpost, {
          id: post.idpost,
          title: post.title,
          allDay: false,
          start: new Date(post.start_time),
          end: new Date(post.end_time),
          type: 'liked', // Markiert als gelikter Post
        });
      }
    });

    // Fügt alle anderen sichtbaren Posts hinzu, wenn sie nicht bereits als "eigene" oder "gelikte" Posts vorhanden sind.
    allVisiblePosts.forEach(post => {
      if (!finalEventsMap.has(post.idpost)) {
        finalEventsMap.set(post.idpost, {
          id: post.idpost,
          title: post.title,
          allDay: false,
          start: new Date(post.start_time),
          end: new Date(post.end_time),
          type: 'other', // Markiert als sonstiger Post
        });
      }
    });

    // Konvertiert die Map-Werte zurück in ein Array und aktualisiert den Zustand.
    setAllLoadedEvents(Array.from(finalEventsMap.values()));
    console.log("Loaded all categorized Events (before filter):", Array.from(finalEventsMap.values())); // Debug-Ausgabe
  }, []);

  // useCallback Hook: Aktualisiert die Filteroptionen basierend auf dem Typ (own, liked, other).
  // Sorgt dafür, dass diese Funktion nur bei Bedarf neu erstellt wird.
  const handleFilterChange = useCallback((type: 'own' | 'liked' | 'other') => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: !prevFilters[type], // Schaltet den Filter für den gegebenen Typ um
    }));
  }, []);

  // useMemo Hook: Filtert die geladenen Ereignisse basierend auf den aktuellen Filter-Einstellungen.
  // Stellt sicher, dass die Filterung nur dann neu berechnet wird, wenn sich 'allLoadedEvents' oder 'filters' ändern.
  const filteredEvents = useMemo(() => {
    return allLoadedEvents.filter(event => filters[event.type]); // Filtert Events basierend auf dem aktiven Typ
  }, [allLoadedEvents, filters]); // Abhängigkeiten: wird neu berechnet, wenn diese Werte sich ändern.


  // Asynchrone Funktion: Wird aufgerufen, wenn ein Ereignis im Kalender angeklickt wird.
  // Ruft die vollständigen Details des Posts von der API ab und öffnet das PostClicked-Modal.
  async function handleOnSelectEvent(event: EventType) {
    try {
      const response = await axiosInstance.get("/api/post/one", {
        params: { postId: event.id }, // Sendet die Ereignis-ID als Parameter an die API
      });
      setCurrentPost(response.data.post); // Speichert den abgerufenen Post im Zustand
      setShowModal(true); // Öffnet das Modal
      console.log("Selected event data:", response.data.post); // Debug-Ausgabe
    } catch (error) {
      console.error("Fehler beim Abrufen der Post-Details:", error);
    }
  }

  // useCallback Hook: Wird aufgerufen, wenn ein Zeitfenster im Kalender ausgewählt (angeklickt oder gezogen) wird.
  // Navigiert zur "Neuer Post erstellen"-Seite und übergibt die Start- und Endzeit des ausgewählten Slots.
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; }) => {
    navigate("/posts/new", {
      state: {
        startTimeParameter: slotInfo.start.toISOString(), // Übergibt die Startzeit im ISO-Format
        endTimeParameter: slotInfo.end.toISOString(),     // Übergibt die Endzeit im ISO-Format
      },
    });
  }, [navigate]); // Abhängigkeit: navigate-Funktion

  // useCallback Hook: Bestimmt die CSS-Klasse für jedes Kalenderereignis basierend auf seinem Typ.
  // Dies ermöglicht unterschiedliche Farben oder Stile für eigene, gelikte und andere Posts.
  const eventPropGetter = useCallback((event: EventType) => {
    let className = '';
    if (event.type === 'own') {
      className = 'rbc-event-own';    // Klasse für eigene Posts
    } else if (event.type === 'liked') {
      className = 'rbc-event-liked';  // Klasse für gelikte Posts
    } else if (event.type === 'other') {
      className = 'rbc-event-other';  // Klasse für andere Posts
    }
    return {
      className: className, // Die zugewiesene CSS-Klasse
      style: {},            // Optional: Inline-Styles, hier leer gelassen, da Styling über CSS-Klassen erfolgt
    };
  }, []);

  // useEffect Hook: Setzt den Dokumententitel (Browser-Tab-Titel) beim Mounten der Komponente.
  useEffect(() => {
    document.title = "Kalender - FindDHBW";
  }, []); // Leeres Abhängigkeits-Array bedeutet, dass der Effekt nur einmal nach dem ersten Rendern läuft.

  // JSX-Struktur der Cal-Komponente: Rendert den Kalender und seine zugehörigen UI-Elemente.
  return (
    <div className="flex flex-col min-h-screen"> {/* Flex-Container für die gesamte Seitenhöhe */}
      <Header /> {/* Anzeige der Kopfzeile der Anwendung */}
      <main className="flex-grow"> {/* Hauptinhaltsbereich, nimmt den verbleibenden Platz ein */}
        <div style={{ padding: '20px' }}> {/* Innenabstand für den Kalenderbereich */}
          {/* Filter-UI über dem Kalender: Ermöglicht das Ein- und Ausblenden von Post-Typen */}
          <div className="flex justify-center mb-4 space-x-4">
            {/* Checkbox und Label für "Eigene Posts" */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={filters.own} // Status der Checkbox gebunden an den Filter-Zustand
                onChange={() => handleFilterChange('own')} // Handler beim Ändern des Checkbox-Status
              />
              <span className="ml-2 text-gray-700 font-medium">Eigene Posts</span>
              <span className="w-4 h-4 ml-2 rounded-full bg-own-color"></span> {/* Farblegende für eigene Posts (via Tailwind CSS-Klasse) */}
            </label>
            {/* Checkbox und Label für "Geliked Posts" */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={filters.liked}
                onChange={() => handleFilterChange('liked')}
              />
              <span className="ml-2 text-gray-700 font-medium">Geliked Posts</span>
              <span className="w-4 h-4 ml-2 rounded-full bg-liked-color"></span> {/* Farblegende für gelikte Posts */}
            </label>
            {/* Checkbox und Label für "Andere Posts" */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={filters.other}
                onChange={() => handleFilterChange('other')}
              />
              <span className="ml-2 text-gray-700 font-medium">Andere Posts</span>
              <span className="w-4 h-4 ml-2 rounded-full bg-other-color"></span> {/* Farblegende für andere Posts */}
            </label>
          </div>

          {/* Kalender-Container: Legt die feste Höhe des Kalenders fest */}
          <div style={{ height: 700 }}>
            <Calendar
              localizer={localizer}      // Der Localizer für Moment.js
              events={filteredEvents}    // Hier werden die GEFILTERTEN Events übergeben 
              step={60}                  // Schrittgröße für die Zeitanzeige (hier 60 Minuten)
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} // Verfügbare Ansichten des Kalenders
              defaultView={Views.MONTH}  // Standardansicht beim Laden der Komponente
              defaultDate={new Date()}   // Standarddatum beim Laden (heutiges Datum)
              popup={false}              // Deaktiviert das Standard-Popup von react-big-calendar bei Klick auf Ereignisse
              selectable                 // Ermöglicht das Auswählen von Zeitfenstern (z.B. per Klick oder Ziehen)
              onSelecting={(range) => false} // Verhindert das Standard-Prompt beim Ziehen eines Auswahlbereichs (important for preventing native browser prompts)
              onSelectSlot={handleSelectSlot} // Handler, wenn ein Zeitfenster ausgewählt wird
              onSelectEvent={handleOnSelectEvent} // Handler, wenn ein Ereignis angeklickt wird
              eventPropGetter={eventPropGetter} // Funktion zum Anwenden von benutzerdefinierten Stilen auf Ereignisse
              messages={{ // Lokalisierung der Standardnachrichten des Kalenders
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
                showMore: (total) => `+${total} mehr`, // Angepasste Nachricht für "mehr" Ereignisse
              }}
            />
          </div>

          {/* Bedingte Anzeige des PostClicked-Modals, wenn ein Post ausgewählt und das Modal geöffnet werden soll */}
          {currentPost && showModal && (
            <PostClicked
              post={currentPost} // Übergibt den ausgewählten Post an das Modal
              onClose={() => {
                setShowModal(false);     // Schließt das Modal
                setCurrentPost(undefined); // Setzt den ausgewählten Post zurück
              }}
            />
          )}
        </div>
      </main>
      <Footer /> {/* Anzeige der Fußzeile der Anwendung */}
    </div>
  );
};

export default Cal;