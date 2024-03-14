import React from "react";

const ViewEvent = ({ event, onClose, deleteEvents }) => {
  return (
    <div className='fixed inset-0 z-10 overflow-y-auto flex items-center justify-center'>
      <div className='relative mx-auto max-w-lg p-6 bg-[#f2f2f2] rounded-lg'>
        <div className='w-full flex justify-between'>
          <span
            className='items-center border flex text-right close  border-red-500 text-red-500 rounded p-1 hover:cursor-pointer'
            onClick={onClose}
          >
            Close
          </span>

          <button
            onClick={() => deleteEvents(event?.id, false)}
            className='p-2 border rounded border-red-500 text-red-500'
          >
            Delete
          </button>
        </div>
        <div className='w-full flex flex-col'>
          <h2 className='font-semibold'>{event?.title}</h2>
          <p>{event?.desc}</p>
          <p>
            Organizer: <span>{event?.data?.organizer?.email}</span>
          </p>
          <a
            target='_blank'
            href={event?.data?.hangoutLink}
            className='underlined text-blue-500'
          >
            {event?.data?.hangoutLink}
          </a>

          <p>Starts: {event?.start.toLocaleString()}</p>
          <p>Ends: {event?.end.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
