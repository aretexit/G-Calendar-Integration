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
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [selectedType, setSelectedType] = useState("default");
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bySort, setBySort] = useState(["AU", "PH", "DEFAULT"]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (session) {
        const accessToken = session.token.access_token;
        console.log(session);
        try {
          const eventList = await listEvents(accessToken);
          setEvents(eventList);
          setFilteredEvents(eventList);
        } catch (error) {
          console.log("error: ", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);
  const handleSignOut = () => {
    signOut();
  };
  const handleEvents = (newEvent) => {
    setEvents(newEvent);
    setFilteredEvents(newEvent);
  };

  const deleteEvents = async (id, isRecurring, recurringId) => {
    setDeleteLoading(true);
    if (session) {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this event?"
        );
        if (confirmDelete) {
          const accessToken = session.token.access_token;
          console.log(recurringId);
          console.log(isRecurring);
          const updatedEvents = await deleteEvent(
            accessToken,
            id,
            isRecurring,
            recurringId
          );
          if (filteredEvents.find((event) => event.id === id)) {
            if (isRecurring === true) {
              setFilteredEvents(
                filteredEvents.filter(
                  (event) => event.data.recurringEventId !== recurringId
                )
              );
            } else {
              setFilteredEvents(
                filteredEvents.filter((event) => event.id !== id)
              );
            }
          }
        } else {
          // User canceled the deletion
          console.log("Event deletion canceled.");
        }
        setSelectedEvent(null);
      } catch (error) {
        console.log("Error deleting: ", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const dates = new Date();
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log(event);
  };
  const closeModal = () => {
    setSelectedEvent(null);
  };
  const handleSort = (data) => {
    const auHolidays = events.filter(
      (event) => event.type === "Holidays in Australia"
    );
    const phHolidays = events.filter(
      (event) => event.type === "Holidays in Philippines"
    );
    const defaultEvent = events.filter((event) => event.type === undefined);
    let newEvents = filteredEvents;
    if (bySort.includes(data)) {
      setBySort(bySort.filter((item) => item !== data));
      if (data === "AU") {
        newEvents = newEvents.filter(
          (event) => event.type !== "Holidays in Australia"
        );
      }
      if (data === "PH") {
        newEvents = newEvents.filter(
          (event) => event.type !== "Holidays in Philippines"
        );
      }
      if (data === "DEFAULT") {
        newEvents = newEvents.filter((event) => event.type !== undefined);
      }
      setFilteredEvents(newEvents);
    } else {
      setBySort([...bySort, data]);
      if (data === "AU") {
        newEvents = [...newEvents, ...auHolidays];
      }
      if (data === "PH") {
        newEvents = [...newEvents, ...phHolidays];
      }
      if (data === "DEFAULT") {
        newEvents = [...newEvents, ...defaultEvent];
      }
      setFilteredEvents(newEvents);
    }
  };

  const [defaultDate, setDefaultDate] = useState(new Date());
  let max = addHours(endOfDay(new Date(2015, 17, 1), "day"), -1);
  // let max = addMonths(new Date(), 12);
  let views = Object.keys(Views).map((k) => Views[k]);

  // const handleCalendarNavigate = (date) => {
  //   console.log("Month ----->>>", moment(date).format("MMMM YYYY"));
  // };
  const [view, setView] = useState(Views.MONTH);

  const [createEventOpen, setCreateEventOpen] = useState(false);
  const handleOpenCreateEvent = (isOpen) => {
    setCreateEventOpen(!isOpen);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [eventToday, setEventToday] = useState([]);
  // Filter events today
  useEffect(() => {
    if (filteredEvents) {
      const eventsToday = filteredEvents.filter((event) => {
        const eventStart = new Date(event.start);
        eventStart.setHours(0, 0, 0, 0);
        const eventEnd = new Date(event.end);
        eventEnd.setHours(0, 0, 0, 0);
        // Check if date included
        return (
          eventStart.getTime() <= today.getTime() &&
          eventEnd.getTime() >= today.getTime()
        );
      });
      console.log("Event Today: ", eventsToday);
      setEventToday(eventsToday);
    }
  }, [filteredEvents]);

  return loading ? (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-white-200 bg-opacity-50'>
      <div className='text-xl  rounded-md p-2 text-gray-700  w-32 h-10 flex justify-end items-center'>
        Loading
        <span className='loading loading-dots loading-lg'></span>
      </div>
      <img
        src='https://cdn.dribbble.com/userupload/4828045/file/original-e59378ac6c09cea4594b9105373eaf6a.gif'
        className='w-[50%] h-[400px] '
        alt='Loading GIF'
      />
    </div>
  ) : (
    <div className='w-full flex max-h-screen justify-center items-center flex-row'>
      <div className='w-[30%] h-screen bg-gray-100 bg-opacity-50 flex flex-col justify-start items-center py-5 gap-y-4'>
        <div>
          <p className='font-semibold text-lg'>
            {session?.session?.user?.name}
          </p>
        </div>
        <div className='w-full flex flex-col gap-y-3'>
          <div className='w-full flex flex-row pl-5 gap-x-2'>
            <input
              type='checkbox'
              checked={bySort.includes("AU")}
              value='AU'
              onChange={(e) => handleSort(e.target.value)}
              className='checkbox checkbox-md [--chkbg:#f28f33] [--chkfg:white]'
            />
            <p className='text-gray-600'>AU Holiday</p>
          </div>

          <div className='w-full flex flex-row pl-5 gap-x-2'>
            <input
              type='checkbox'
              checked={bySort.includes("PH")}
              value='PH'
              onChange={(e) => handleSort(e.target.value)}
              className='checkbox checkbox-md [--chkbg:#32449c] [--chkfg:white]'
            />
            <p className='text-gray-600'>PH Holiday</p>
          </div>
          <div className='w-full flex flex-row pl-5 gap-x-2'>
            <input
              type='checkbox'
              checked={bySort.includes("DEFAULT")}
              value='DEFAULT'
              onChange={(e) => handleSort(e.target.value)}
              className='checkbox checkbox-md [--chkbg:#928e8e] [--chkfg:white]'
            />
            <p className='text-gray-600'>{session?.session?.user?.name}</p>
          </div>
        </div>
        <p className='text-lg font-semibold'>Event today:</p>
        {eventToday.length > 0 ? (
          <div className='flex w-full flex-col'>
            {eventToday.map((event) => (
              <div
                key={event.id}
                onClick={() => handleSelectEvent(event)}
                className='hover:cursor-pointer w-full max-h-full overflow-y-auto p-2 flex flex-col '
              >
                <div
                  className={`w-full flex flex-col rounded-md p-2 ${
                    event.type === "Holidays in Philippines"
                      ? "bg-[#32449c]"
                      : event.type === "Holidays in Australia"
                      ? "bg-[#f28f33]"
                      : "bg-[#928e8e]"
                  }`}
                >
                  <p className='text-gray-700'>{event.title}</p>
                  <p className='text-[12px] text-gray-600'>
                    Start: {format(event.start, "hh:mm a")}
                  </p>
                  <p className='text-[12px] text-gray-600'>
                    End: {format(event.end, "hh:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full p-2 text-gray-700'>No event for today.</div>
        )}
      </div>
      <div className='w-full p-5 flex max-h-screen justify-center items-center flex-col'>
        <div className='h-full'>
          <div className='w-full py-3 flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Calendars</h1>

            <button
              className='border rounded-xl p-3 my-2  hover:bg-blue-600  hover:text-white transition-all'
              onClick={() => handleOpenCreateEvent(createEventOpen)}
            >
              Create Event
            </button>
            <button
              className='border rounded-xl p-3 my-2 hover:bg-gray-300 transition-all'
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
          <div className='w-full max-h-screen h-[500px]'>
            <Calendar
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
              events={filteredEvents}
              localizer={localizer}
              eventPropGetter={(event, start, end, isSelected) => {
                let bgColor =
                  event.type === "Holidays in Philippines"
                    ? "#32449c"
                    : event.type === "Holidays in Australia"
                    ? "#f28f33"
                    : "#928e8e";
                return {
                  style: {
                    backgroundColor: bgColor,
                    fontSize: "12px",
                    borderRadius: "10px",
                    color: "#272626",
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
        {createEventOpen && (
          <div className='absolute z-50 bg-opacity-50 bg-gray-600 top-0 left-0 flex-col w-full h-screen flex justify-center gap-x-4 items-center'>
            <AddEvent
              session={session}
              events={filteredEvents}
              setEvents={handleEvents}
              createEventOpen={createEventOpen}
              setCreateEventOpen={handleOpenCreateEvent}
            />
          </div>
        )}
        {selectedEvent && (
          <ViewEvent
            deleteEvents={deleteEvents}
            event={selectedEvent}
            onClose={closeModal}
          />
        )}
        {deleteLoading && (
          <div className='absolute z-[1000] top-0 left-0 w-full bg-white bg-opacity-50 h-screen flex justify-center items-center'>
            <div className='border border-gray-500 rounded-md p-2 text-gray-700 bg-gray-400 w-32 h-10 flex justify-end'>
              Deleting
              <span className='loading loading-dots loading-lg'></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
