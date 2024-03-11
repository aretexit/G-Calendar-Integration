"use client";
import { createEvent } from "@/utils/calendar";
import React, { useState } from "react";
const AddEvent = ({ session, setEvents, events }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guestEmail, setGuestEmail] = useState("");
  const [guests, setGuests] = useState([]);

  const handleUpdateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleCreateEvent = async () => {
    if (session) {
      try {
        const accessToken = session.token.access_token;
        const newEvent = await createEvent(
          accessToken,
          title,
          description,
          startDate,
          endDate,
          guests
        );
        handleUpdateEvent(newEvent);
        setTitle("");
        setDescription("");
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };
  const handleAddGuest = (data) => {
    setGuests([...guests, { email: data }]);
    console.log(guests);
    setGuestEmail("");
  };
  return (
    <div className='border p-3 mt-3 rounded-xl'>
      <h2 className='text-xl font-semibold text-center'>Create Event</h2>
      <form className='flex flex-col'>
        <div className='w-full flex flex-col'>
          <label className='w-full'>Title:</label>
          <input
            className='w-full border p-2 rounded-xl'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='w-full flex flex-col'>
          <label>Description:</label>
          <textarea
            className='w-full border p-2 rounded-xl'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='w-full flex flex-row'>
          <label>Start Date:</label>
          <input
            type='datetime-local'
            value={startDate.toISOString().slice(0, 16)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <label>
          End Date:
          <input
            type='datetime-local'
            value={endDate.toISOString().slice(0, 16)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </label>
        <div className='w-full '>
          <label>Guests:</label>
          {guests.map((guest, index) => (
            <div key={index} className='flex flex-wrap gap-x-2'>
              <p className='p-1 border border-orange-500 rounded-xl'>
                {guest?.email}
              </p>
            </div>
          ))}
          <input
            className='w-full border p-2 rounded-xl'
            type='text'
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            list='guestsList'
          />
          <button
            type='button'
            className='p-2 border border-blue-500 rounded-xl'
            onClick={() => handleAddGuest(guestEmail)}
          >
            Add guests
          </button>
        </div>
        <button
          className='border p-3 rounded-xl'
          type='button'
          onClick={handleCreateEvent}
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
