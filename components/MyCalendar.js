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
        setEvents(eventList);
      }
    };

    fetchData();
  }, [session]);
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      <h1>Calendars</h1>
      My Calendar
      <Calendar events={events} />
      <button onClick={() => handleSignOut()}>Sign out</button>
    </div>
  );
};

export default MyCalendar;
