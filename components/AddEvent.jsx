"use client";
import { createEvent } from "@/utils/calendar";
import React, { useEffect, useState } from "react";
import { TbFileDescription } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomRecurrence from "@/app/calendar/components/CustomRecurrence";
import { getRecurrenceRule } from "@/app/calendar/components/calendarFunctions";
import { addHours } from "date-fns";

const AddEvent = ({
  session,
  setEvents,
  events,
  createEventOpen,
  setCreateEventOpen,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  // const endD = startDate.setHours(startDate.getHours() + 1);
  const [endDate, setEndDate] = useState(addHours(new Date(), 1));
  const [guestEmail, setGuestEmail] = useState("");
  const [guests, setGuests] = useState([]);
  const [withConference, setWithConference] = useState(false);
  const [recurrence, setRecurrence] = useState("");
  const [customRrule, setCustomRrule] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [repeatNo, setRepeatNo] = useState(1);
  const [repeatWeek, setRepeakWeek] = useState();
  //regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const isValidatedEmail = (email) => {
    const validate = emailRegex.test(email);
    return validate;
  };

  const handleUpdateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    if (session) {
      try {
        if (title !== "") {
          const Rrule = getRecurrenceRule(recurrence, customRrule);
          const accessToken = session.token.access_token;
          const newEvent = await createEvent(
            accessToken,
            title,
            description,
            startDate,
            endDate,
            guests,
            withConference,
            Rrule
          );
          console.log("New Event: ", newEvent);
          handleUpdateEvent(newEvent);
          setTitle("");
          setDescription("");
          setGuestEmail("");
          setGuests([]);
          setCreateEventOpen(createEventOpen);
        } else {
          alert("Title required.");
        }
      } catch (error) {
        console.error("Error creating event:", error);
        alert(error.response.data.error.message);
      } finally {
        setCreateLoading(false);
      }
    }
  };
  const handleGuest = (data) => {
    if (guests.includes(data)) {
      setGuests((previousGuests) =>
        previousGuests.filter((item) => item !== data)
      );
    } else {
      if (!isValidatedEmail(data)) {
        alert("Email not valid");
        setGuestEmail("");
        return;
      }
      setGuests([...guests, { email: data }]);
      setGuestEmail("");
    }
  };
  const handleCustomRrule = (data) => {
    console.log("data", data);
    setCustomRrule(data);
  };
  return createLoading ? (
    <div className='absolute top-0 left-0 w-full bg-white bg-opacity-50 h-screen flex justify-center items-center'>
      <div className='border border-gray-500 rounded-md p-2 text-gray-700 bg-gray-400 w-32 h-10 flex justify-end'>
        Creating
        <span className='loading loading-dots loading-lg'></span>
      </div>
    </div>
  ) : (
    <div className='border max-h-screen overflow-y-auto p-3 mt-3 rounded-xl bg-white w-[500px]'>
      <h2 className='text-xl font-semibold text-center'>Create Event</h2>
      <form className='flex flex-col gap-y-2'>
        <div className='w-full flex flex-col'>
          <input
            className='w-full border-b p-2 rounded-xl'
            placeholder='Add title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className='w-full flex flex-row'>
          <textarea
            className='w-full border p-2 rounded-xl'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='flex flex-col w-full gap-y-1'>
          <p className='font-semibold'>Event Date</p>
          <div className='w-full flex flex-row justify-between items-center pl-2'>
            <label className='w-32'>Start Date:</label>
            {/* <input
          type='datetime-local'
          className='border w-full p-1 rounded-lg text-gray-500'
          value={startDate.toISOString().slice(0, 16)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        /> */}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat='HH:mm'
              dateFormat='yyyy-MM-dd HH:mm'
              className='border w-full p-1 rounded-lg text-gray-500'
            />
          </div>
          <div className='w-full flex flex-row justify-between pl-2'>
            <label className='w-32'>End Date:</label>
            {/* <input
          type='datetime-local'
          className='border w-full p-1 rounded-lg text-gray-500'
          value={endDate.toISOString().slice(0, 16)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        /> */}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='yyyy-MM-dd HH:mm'
              className='border w-full p-1 rounded-lg text-gray-500'
            />
          </div>

          <div className='w-full flex flex-row justify-between items-center pl-2'>
            <label className='w-32'>Recurrence: </label>
            <select
              className='p-1 rounded-lg w-full border text-gray-500'
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              <option value=''>Does not repeat</option>
              <option value='DAILY'>Daily</option>
              <option value='WEEKLY'>Weekly</option>
              <option value='MONTHLY'>Monthly</option>
              <option value='YEARLY'>Yearly</option>
              <option value='custom'>Custom</option>
            </select>
          </div>
          {recurrence === "custom" && (
            <CustomRecurrence setCustomRrule={handleCustomRrule} />
          )}
        </div>
        <div className='w-full '>
          <label className='font-semibold'>Guests:</label>
          {guests.map((guest, index) => (
            <div key={index} className='flex flex-wrap gap-x-2'>
              <div className='relative'>
                <p className='p-1  border border-gray-500 rounded-xl'>
                  {guest?.email}
                </p>
                <button
                  className='absolute -top-2 right-0 bg-orange-600 p-0 text-[10px] w-3 h-3 flex items-center justify-center rounded-md'
                  onClick={() => handleGuest(guest)}
                >
                  x
                </button>
              </div>
            </div>
          ))}
          <div className='w-full flex gap-x-2'>
            <input
              className='w-full border p-2 rounded-xl'
              placeholder='Add guest'
              type='email'
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              list='guestsList'
            />
            <button
              type='button'
              className='p-2 border border-blue-500 rounded-xl text-2xl'
              onClick={() => handleGuest(guestEmail)}
            >
              +
            </button>
          </div>
        </div>
        <div className='w-full flex flex-row gap-x-2'>
          <input
            name='Conference status'
            className='bg-blue-500'
            value={withConference}
            onChange={() => setWithConference(!withConference)}
            type='checkbox'
          />
          <p>Enable Conference</p>
        </div>
        <div className='w-full flex flex-row justify-between'>
          <button
            className='border p-3 rounded-xl hover:bg-blue-600  hover:text-white transition-all'
            type='submit'
            onClick={(e) => handleCreateEvent(e)}
          >
            Create Event
          </button>
          <button
            className='border p-3 rounded-xl hover:bg-gray-300 transition-all'
            type='button'
            onClick={() => setCreateEventOpen(createEventOpen)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
