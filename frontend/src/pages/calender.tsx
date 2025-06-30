import React, { useState } from "react";
import { render } from "react-dom";
import events from "./components/Calender/events";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={events}
        step={60}
        views={allViews}
        defaultDate={new Date(2015, 3, 1)}
        popup={false}
        onShowMore={(events:any, date) => {
          setModalEvents(events);
          setModalDate(date);
          setShowModal(true);
        }}
      />

      {showModal && (
        <div style={{ backgroundColor: "lightgray", padding: 20 }}>
          <h3>Mehr Termine am {modalDate?.toLocaleDateString()}:</h3>
          <ul>
            {modalEvents.map((event, idx) => (
              <li key={idx}>{event.title}</li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>Schließen</button>
        </div>
      )}
    </div>
  );
};

render(<App />, document.getElementById("root"));
