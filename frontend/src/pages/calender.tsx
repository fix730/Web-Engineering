import React, { useState } from "react";
import { render } from "react-dom";
import events from "./components/Calender/events";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header/Header";
import { useEffect } from "react";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.values(Views);

type EventType = { title: string;[key: string]: any };

const Cal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<EventType[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  useEffect(() => {
    document.title = "Kalender - FindDHBW";
  }, []);

  return (
    <>
      <Header />
      <div className="" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          step={60}
          views={allViews}
          defaultDate={new Date(2015, 3, 1)}
          popup={false}
          onShowMore={(events: EventType[], date: Date) => {
            setModalEvents(events);
            setModalDate(date);
            setShowModal(true);
          }}
        />

        {showModal && (
          <div style={{ backgroundColor: "lightgray", padding: 20 }}>
            <h3>Mehr Termine am {modalDate?.toLocaleDateString()}:</h3>
            <ul>
              {modalEvents.map((event: EventType, idx: number) => (
                <li key={idx}>{event.title}</li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Schließen</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cal;
