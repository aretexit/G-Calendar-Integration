"use client";

import { deleteEvent, listEvents } from "@/utils/calendar";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import AddEvent from "./AddEvent";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useRouter } from "next/navigation";
// import { atom, useAtom, useSetAtom } from "jotai";
// import { eventsAtom, userSession } from "@/app/store/CalendarStore";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const router = useRouter();
  // const [eventAtoms, setEventAtoms] = useAtom(eventsAtom);
  // const setSession = useSetAtom(userSession);
  // if (session) {
  //   const initialsessionAtom = atom(session.token.access_token);
  //   setSession(initialsessionAtom);
  // }

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
    router.push("/");
  };
  const handleEvents = (newEvent) => {
    setEvents(newEvent);
  };
  const deleteEvents = async (id) => {
    if (session) {
      try {
        const accessToken = session.token.access_token;
        const updatedEvents = await deleteEvent(accessToken, id);
        console.log(updatedEvents);
      } catch (error) {
        console.log("Error deleting: ", error);
      }
    }
  };

  return (
    <div className='w-full flex justify-center items-center flex-col'>
      <div>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Calendars</h1>
          <button
            className='border rounded-xl p-3 my-2'
            onClick={() => handleSignOut()}
          >
            Sign out
          </button>
        </div>
        <Calendar
          events={events}
          localizer={localizer}
          style={{ style: "50px" }}
          startAccessor='start'
          endAccessor='end'
        />
      </div>
      <div className='flex flex-col w-full justify-center gap-x-4 items-center'>
        <AddEvent session={session} events={events} setEvents={handleEvents} />
        <div>
          {" "}
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                className='border p-2 rounded-xl flex flex-col justify-start items-center'
                key={index}
              >
                <p className='w-full border-b text-xl font-medium text-center'>
                  {event?.summary}
                </p>
                <p>{event?.description}</p>
                <button
                  onClick={() => deleteEvents(event?.id)}
                  className='p-2 border rounded border-red-500 text-red-500'
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No event Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
