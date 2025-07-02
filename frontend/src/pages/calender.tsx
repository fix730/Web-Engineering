import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import axiosInstance from "../api/axiosInstance";
import { PostType } from "./components/Post/Post";
import PostClicked from "./components/Post/PostClicked";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer/Footer"; // 

// Lokalisierung auf Deutsch setzen
moment.locale("de");
const localizer = momentLocalizer(moment);

export interface EventType {
  id: number;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  type: 'own' | 'liked' | 'other';
}

export interface PostsResponse {
  posts: PostType[];
}

const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | undefined>(undefined);

  const [allLoadedEvents, setAllLoadedEvents] = useState<EventType[]>([]);

  const [filters, setFilters] = useState({
    own: true,
    liked: true,
    other: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Moment Spracheinstellung:", moment.locale());
    console.log("Beispiel Datum (Moment):", moment().format("dddd, D. MMMMYY, HH:mm"));
    fetchAllCalendarEvents();
  }, []);

  const fetchAllVisiblePosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/all");
      return response.data.posts || [];
    } catch (error) {
      console.error("Fehler beim Laden aller sichtbaren Ereignisse:", error);
      return [];
    }
  };

  const fetchUserOwnPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user");
      return response.data.posts || [];
    } catch (error) {
      console.error("Fehler beim Laden der eigenen Ereignisse:", error);
      return [];
    }
  };

  const fetchLikedPosts = async (): Promise<PostType[]> => {
    try {
      const response = await axiosInstance.get<PostsResponse>("/api/post/user/liked");
      return response.data.posts || [];
    } catch (error) {
      console.error("Fehler beim Laden der gelikten Ereignisse:", error);
      return [];
    }
  };

  const fetchAllCalendarEvents = useCallback(async () => {
    const [allVisiblePosts, userOwnPosts, likedPosts] = await Promise.all([
      fetchAllVisiblePosts(),
      fetchUserOwnPosts(),
      fetchLikedPosts(),
    ]);

    const finalEventsMap = new Map<number, EventType>();

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

    likedPosts.forEach(post => {
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

    allVisiblePosts.forEach(post => {
      if (!finalEventsMap.has(post.idpost)) {
        finalEventsMap.set(post.idpost, {
          id: post.idpost,
          title: post.title,
          allDay: false,
          start: new Date(post.start_time),
          end: new Date(post.end_time),
          type: 'other',
        });
      }
    });

    setAllLoadedEvents(Array.from(finalEventsMap.values()));
    console.log("Loaded all categorized Events (before filter):", Array.from(finalEventsMap.values()));
  }, []);

  const handleFilterChange = useCallback((type: 'own' | 'liked' | 'other') => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: !prevFilters[type],
    }));
  }, []);

  const filteredEvents = useMemo(() => {
    return allLoadedEvents.filter(event => filters[event.type]);
  }, [allLoadedEvents, filters]);


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

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; }) => {
    navigate("/posts/new", {
      state: {
        startTime: slotInfo.start.toISOString(),
        endTime: slotInfo.end.toISOString(),
      },
    });
  }, [navigate]);

  const eventPropGetter = useCallback((event: EventType) => {
    let className = '';
    if (event.type === 'own') {
      className = 'rbc-event-own';
    } else if (event.type === 'liked') {
      className = 'rbc-event-liked';
    } else if (event.type === 'other') {
      className = 'rbc-event-other';
    }
    return {
      className: className,
      style: {},
    };
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        {/* Filter-UI über dem Kalender */}
        <div className="flex justify-center mb-4 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={filters.own}
              onChange={() => handleFilterChange('own')}
            />
            <span className="ml-2 text-gray-700 font-medium">Eigene Posts</span>
            <span className="w-4 h-4 ml-2 rounded-full bg-own-color"></span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={filters.liked}
              onChange={() => handleFilterChange('liked')}
            />
            <span className="ml-2 text-gray-700 font-medium">Geliked Posts</span>
            <span className="w-4 h-4 ml-2 rounded-full bg-liked-color"></span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={filters.other}
              onChange={() => handleFilterChange('other')}
            />
            <span className="ml-2 text-gray-700 font-medium">Andere Posts</span>
            <span className="w-4 h-4 ml-2 rounded-full bg-other-color"></span>
          </label>
        </div>

        {/* Kalender-Container */}
        <div style={{ height: 700 }}>
          <Calendar
            localizer={localizer}
            events={filteredEvents} //HIER werden die GEFILTERTEN Events übergeben
            step={60}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            defaultDate={new Date()}
            popup={false}
            selectable
            onSelecting={(range) => false} // Verhindert das Standard-Prompt beim Ziehen eines Auswahlbereichs
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleOnSelectEvent}
            // onShowMore={(events: EventType[], date: Date) => {
            //   setModalEvents(events);
            //   setModalDate(date);
            //   setShowModal(true);
            // }}
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
        </div>

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
      <Footer /> 
    </>
  );
};

export default Cal;