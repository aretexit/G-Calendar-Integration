"use client";

import { deleteEvent, listEvents } from "@/utils/calendar";
import { useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import AddEvent from "./AddEvent";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  endOfDay,
  addHours,
} from "date-fns";
import ViewEvent from "@/app/calendar/components/ViewEvent";
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const eventlist = {};
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
        try {
          const eventList = await listEvents(accessToken);
          console.log(eventList);
          setEvents(eventList);
        } catch (error) {
          console.log("error: ", error.message);
        }
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
  const deleteEvents = async (id, isRecurring) => {
    if (session) {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this event?"
        );
        if (confirmDelete) {
          const accessToken = session.token.access_token;
          const updatedEvents = await deleteEvent(accessToken, id, isRecurring);
          console.log(updatedEvents);
          if (events.find((event) => event.id === id)) {
            setEvents(events.filter((event) => event.id !== id));
          }
        } else {
          // User canceled the deletion
          console.log("Event deletion canceled.");
        }
        setSelectedEvent(null);
      } catch (error) {
        console.log("Error deleting: ", error);
      }
    }
  };

  const dates = new Date();
  // const handleSelectEvent = useCallback(
  //   (event) => window.alert(event.title),
  //   []
  // );
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const closeModal = () => {
    setSelectedEvent(null);
  };

  const [defaultDate, setDefaultDate] = useState(new Date());
  let max = addHours(endOfDay(new Date(2015, 17, 1), "day"), -1);
  // let max = addMonths(new Date(), 12);
  let views = Object.keys(Views).map((k) => Views[k]);

  const handleCalendarNavigate = (date) => {
    console.log("Month ----->>>", moment(date).format("MMMM YYYY"));
  };
  const [view, setView] = useState(Views.MONTH);

  return (
    <div className='w-full flex  justify-center items-center flex-col'>
      <div className='h-full'>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Calendars</h1>
          <button
            className='border rounded-xl p-3 my-2'
            onClick={() => handleSignOut()}
          >
            Sign out
          </button>
        </div>
        <div className='w-full h-[600px]'>
          <Calendar
            // defaultDate={moment().toDate()}
            // defaultDate={defaultDate}
            max={1}
            timeslots={10}
            // views={views}
            // style={{ width: "100%", height: "100%" }}
            view={view}
            views={views}
            onNavigate={(defaultDate) => {
              setDefaultDate(new Date(defaultDate));
            }}
            onView={(view) => setView(view)}
            events={events}
            localizer={localizer}
            eventPropGetter={(event, start, end, isSelected) => {
              let bgColor =
                event.type === "Holidays in Philippines"
                  ? "#32449c"
                  : event.type === "Holidays in Australia"
                  ? "#f28f33"
                  : "#f2f2f2";
              return {
                style: {
                  backgroundColor: bgColor,
                  borderRadius: "0px",
                  opacity: 0.8,
                  color: "black",
                  border: "0px",
                  display: "block",
                },
              };
            }}
            // startAccessor='start'
            // endAccessor='end'
            selectable
            onSelectEvent={handleSelectEvent}
            dayLayoutAlgorithm='no-overlap'
            showMultiDayTimes
            step={10}
            date={defaultDate}
          />
        </div>
      </div>
      <div className='flex flex-col w-full justify-center gap-x-4 items-center'>
        <AddEvent session={session} events={events} setEvents={handleEvents} />
        {/* <div className='w-full flex flex-wrap gap-x-2'>
          {" "}
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                className='border p-2 rounded-xl flex flex-col justify-start items-center '
                key={index}
              >
                <p
                  className={`w-full border-b text-xl font-medium text-center ${
                    event?.organizer?.displayName ===
                      "Holidays in Philippines" && "bg-gray-300 bg-opacity-15"
                  }`}
                >
                  {event?.summary}
                </p>
                <p>{event?.description}</p>
                <p>{event?.start?.date}</p>

                <button
                  onClick={() => deleteEvents(event?.id, false)}
                  className='p-2 border rounded border-red-500 text-red-500'
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No event Available</div>
          )}
        </div> */}
      </div>
      {selectedEvent && (
        <ViewEvent
          deleteEvents={deleteEvents}
          event={selectedEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MyCalendar;
