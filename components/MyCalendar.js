"use client";

import { listEvents } from "@/utils/calendar";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const MyCalendar = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        console.log(session.token.access_token);
        const accessToken = session.token.access_token;
        const eventList = await listEvents(accessToken);
        console.log(eventList);
        setEvents(eventList);
      }
    };

    fetchData();
  }, [session]);
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className='w-full flex justify-center items-center flex-col'>
      <h1>Calendars</h1>
      My Calendar
      <Calendar events={events} />
      <button
        className='border rounded-xl p-3 my-2'
        onClick={() => handleSignOut()}
      >
        {events.length > 0 ? (
          events.map((event, index) => <div key={index}>{event.summary}</div>)
        ) : (
          <div>No event Available</div>
        )}
        Sign out
      </button>
    </div>
  );
};

export default MyCalendar;
