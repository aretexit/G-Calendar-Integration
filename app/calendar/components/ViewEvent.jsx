import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { PiSubtitlesThin } from "react-icons/pi";
import { SiGooglemeet } from "react-icons/si";
import { RiUserShared2Line } from "react-icons/ri";
import { TbFileDescription } from "react-icons/tb";
import { addHours, format } from "date-fns";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";

const ViewEvent = ({ event, onClose, deleteEvents }) => {
  const [eventState, setEventState] = useState(false);
  const checkMembers = () => {
    let members = [];
    if (event?.data?.attendees) {
      event.data.attendees.forEach((attendee) => {
        if (event?.data?.organizer?.email !== attendee.email)
          members.push(attendee.email);
      });
    }
    return (
      members.length > 0 && (
        <div className='flex flex-col w-full'>
          <span className='text-sm '>Members:</span>
          {members.map((member) => (
            <div className='flex flex-col w-full' key={member}>
              <span className='text-gray-700 text-sm flex items-center'>
                <div className='w-2 h-2 bg-blue-600 rounded-full mr-3'></div>
                {member}
              </span>
            </div>
          ))}
        </div>
      )
    );
  };
  const getMeet = (txt) => {
    let aretexMeet = "https://meet.vps-aretex.space/";
    const regex = /https:\/\/meet\.vps-aretex\.space\/([a-zA-Z0-9-]+)/;
    const txtMeet = txt.match(regex);
    if (txtMeet) {
      const uuid = txtMeet[1];
      return aretexMeet + uuid;
    } else {
      return undefined;
    }
  };
  const getDesc = (txt) => {
    const regex = /[\s\S]*?(?=This includes Aretex)/;
    const txtMeet = txt.match(regex);
    console.log(txtMeet);
    if (txtMeet) {
      return txtMeet[0];
    } else {
      return txt;
    }
  };
  const copyToClipboard = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("Link was copied to clipboard.");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='fixed inset-0 z-10 overflow-y-auto bg-opacity-50 bg-gray-200 flex items-center justify-center'>
      <div className='relative mx-auto max-w-lg p-6 bg-white border shadow-lg  rounded-lg'>
        <div className='w-full flex justify-end mb-2'>
          {event.type === undefined &&
            (event?.data?.recurringEventId ? (
              <button
                onClick={() => setEventState(true)}
                className='p-1  rounded  hover:bg-gray-400 hover:text-gray-800  text-gray-600'
              >
                <MdOutlineDelete size={20} />
              </button>
            ) : (
              <button
                onClick={
                  () =>
                    deleteEvents(
                      event?.id,
                      false,
                      event?.data?.recurringEventId
                    )
                  // setEventState(true)
                }
                className='p-1  rounded  hover:bg-gray-400 hover:text-gray-800  text-gray-600'
              >
                <MdOutlineDelete size={20} />
              </button>
            ))}

          <span
            className='items-center hover:bg-gray-400 hover:text-gray-800 flex text-right close text-gray-600 rounded p-1 hover:cursor-pointer'
            onClick={onClose}
          >
            <IoClose size={22} />
          </span>
        </div>
        <div className='w-full flex flex-col gap-y-1'>
          <div className='flex justify-start items-center gap-x-2'>
            <span className='items-center  flex  close text-gray-600 rounded p-1 '>
              <PiSubtitlesThin size={18} />
            </span>
            <h2 className='text-gray-800 text-lg'>{event?.title}</h2>
          </div>
          {event?.desc && (
            <div className='flex justify-start items-start gap-x-2 mb-1'>
              <span className='items-center  flex  close text-gray-600 rounded p-1 '>
                <TbFileDescription size={18} />
              </span>
              <p className='text-gray-600 '>{getDesc(event.desc)}</p>
            </div>
          )}
          {event?.desc && getMeet(event?.desc) !== undefined && (
            <div className='flex justify-start items-center gap-x-2 mb-1'>
              <span className='items-center  flex  close text-gray-600 rounded p-1 '>
                <Image
                  src={"/bridge-logo.png"}
                  width={18}
                  height={18}
                  alt='Meet Logo'
                />
              </span>
              <div className='w-full flex flex-col'>
                <a
                  className='bg-blue-600 text-white rounded-md p-1'
                  target='_blank'
                  href={getMeet(event?.desc)}
                >
                  Join with link.
                </a>
                {/* <span className='text-gray-700 text-sm'>
                  {getMeet(event?.desc)}
                </span> */}
              </div>

              <div
                className='hover:cursor-pointer tooltip'
                data-tip='Copy link'
                onClick={() => copyToClipboard(getMeet(event?.desc))}
              >
                <FaCopy />
              </div>
            </div>
          )}
          {event?.data?.hangoutLink && (
            <div className='flex justify-start items-center gap-x-2 mb-1'>
              <span className='items-center  flex  close text-gray-600 rounded p-1 '>
                <SiGooglemeet size={18} />
              </span>
              <div className='w-full flex flex-col'>
                <a
                  className='bg-blue-600 text-white rounded-md p-1'
                  target='_blank'
                  href={event?.data?.hangoutLink}
                >
                  Join with link.
                </a>
              </div>
              <div
                className='hover:cursor-pointer tooltip'
                data-tip='Copy link'
                onClick={() => copyToClipboard(event?.data?.hangoutLink)}
              >
                <FaCopy />
              </div>
            </div>
          )}
          {event?.data?.organizer?.email && (
            <div className='flex justify-start items-start gap-x-2 mb-1'>
              <span className='items-center  flex  close text-gray-600 rounded p-1 '>
                <RiUserShared2Line size={18} />
              </span>
              <div className='w-full flex flex-col'>
                <span className='text-gray-700 text-md'>
                  {event?.data?.organizer?.email}
                </span>
                <span className='text-gray-700 text-sm'>Organizer</span>
                {checkMembers()}
              </div>
            </div>
          )}
          <p>
            <span className='text-blue-600 font-semibold p-1'>Starts: </span>
            <span className='text-gray-700 text-sm'>
              {format(new Date(event?.start), "PPpp")}
            </span>
          </p>
          <p>
            <span className='text-gray-800 font-semibold p-1'>Ends: </span>
            <span className='text-gray-700 text-sm'>
              {" "}
              {format(new Date(event?.end), "PPpp")}
            </span>
          </p>
        </div>
      </div>
      {eventState && (
        <div className='absolute top-0 left-0 w-full h-screen bg-gray-200 bg-opacity-50 flex justify-center items-center'>
          <div className='flex flex-col items-center justify-center border p-3 rounded-md bg-white '>
            <button
              onClick={() =>
                deleteEvents(event?.id, true, event?.data?.recurringEventId)
              }
              className='border rounded-xl p-2 my-2 hover:bg-gray-300 transition-all'
            >
              Delete all recurrence
            </button>
            <button
              onClick={() =>
                deleteEvents(event?.id, false, event?.data?.recurringEventId)
              }
              className='border rounded-xl p-2 my-2 hover:bg-gray-300 transition-all'
            >
              Delete this one
            </button>
            <button
              className='border rounded-xl p-2 my-2 hover:bg-gray-300 transition-all'
              onClick={() => setEventState(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvent;
