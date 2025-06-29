import React, { useEffect, useState } from 'react';


// @ts-ignore
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../api/axiosInstance';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

moment.locale('de');
const localizer = momentLocalizer(moment);

type PostType = {
  idpost: number;
  title: string;
  start_time: string;
  end_time: string;
};

type LikeCheck = {
  isLiked: boolean;
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const ownResp = await axiosInstance.get<PostType[]>('/api/post/user');
        // Backend liefert direkt ein Array
        const ownPosts = ownResp.data;

        const checks = await Promise.all(
          ownPosts.map(async (p: PostType) => {
            const byUser = await axiosInstance.get<LikeCheck>(
              `/api/post/like/byUser?postId=${p.idpost}`
            );
            return { post: p, likedByUser: byUser.data.isLiked };
          })
        );

        const allEvents: CalendarEvent[] = [];

        checks.forEach(({ post, likedByUser }) => {
          allEvents.push({
            title: post.title,
            start: new Date(post.start_time),
            end: new Date(post.end_time),
            allDay: false,
            resource: { type: 'own' }
          });

          if (likedByUser) {
            allEvents.push({
              title: post.title + ' (Du geliket)',
              start: new Date(post.start_time),
              end: new Date(post.end_time),
              allDay: false,
              resource: { type: 'likedByUser' }
            });
          }
        });

        setEvents(allEvents);
      } catch (error) {
        console.error('Fehler beim Laden des Kalenders:', error);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = event.resource.type === 'likedByUser' ? '#EF4444' : '#3B82F6';
    return { style: { backgroundColor, color: 'white' } };
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-4">Kalender</h1>
        <Calendar    
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      <Footer />
    </>
  );
};

export default CalendarPage;
