"use client";
import React, { useState } from "react";
import { addMonths } from "date-fns";

const CustomRecurrence = () => {
  const dateToday = new Date();
  const [customRepeat, setCustomRepeat] = useState(false);
  const [customRepeatNo, setCustomRepeatNo] = useState(1);
  const [customRepeatType, setCustomRepeatType] = useState("day");
  const [customEnds, setCustomEnds] = useState(false);
  const [customEndDate, setCustomEndDate] = useState(addMonths(dateToday, 12));
  const [customRecurrenceNo, setCustomRecurrenceNo] = useState(1);

  const getCustomRecurrenceRule = () => {
    if (customRepeat) {
      const interval = customRepeatNo;
      const type = customRepeatType.toUpperCase();
      const ends = customEnds ? `;UNTIL=${customEndDate.toISOString()}` : '';
      const count = customEnds ? '' : `;COUNT=${customRecurrenceNo}`;

      return `RRULE:FREQ=${type}${count}${ends}`;
    }
    return null;
  };
  return (
    <div className='p-2 flex flex-col'>
      <p className='text-gray-500 text-md'>Custom Recurrence</p>
      <div className='w-full flex flex-row gap-x-1'>
        <span>
          Repeat Every <input type='number' placeholder='number' /> :{" "}
          <select>option</select>
        </span>
      </div>
      <div>
        <p className='text-gray-500 text-md'>Ends</p>
        <div>
          <input name='Conference status' type='radio' />
          <span>On </span>
          <input
            type='datetime-local'
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />{" "}
        </div>
        <div>
          <input name='Conference status' type='radio' />
          <span>After </span>
          <input type='number' value={customRecurrenceNo} />
          <span> recurrence</span>
        </div>
      </div>
    </div>
  );
};

export default CustomRecurrence;
