"use client";
import React, { useState } from "react";
import { addMonths, format } from "date-fns";
import DatePicker from "react-datepicker";

const CustomRecurrence = ({ setCustomRrule }) => {
  const dateToday = new Date();
  const [customRepeat, setCustomRepeat] = useState(true);
  const [customRepeatNo, setCustomRepeatNo] = useState(1);
  const [customRepeatType, setCustomRepeatType] = useState("daily");
  const [customEnds, setCustomEnds] = useState("");
  const [customEndDate, setCustomEndDate] = useState(addMonths(new Date(), 12));
  const [customRecurrenceNo, setCustomRecurrenceNo] = useState(1);
  const [byDay, setByDay] = useState(["MO"]);
  const [rrule, setRrule] = useState("");

  const handleWeeklyDay = (day) => {
    if (byDay.includes(day)) {
      setByDay(byDay.filter((item) => item !== day));
    } else {
      setByDay([...byDay, day]);
    }
  };

  const getCustomRecurrenceRule = () => {
    if (customRepeat) {
      // const interval = customRepeatNo;
      const type = customRepeatType.toUpperCase();
      const byDayString = byDay.toString();
      const ends =
        customEnds === "ends"
          ? `;UNTIL=${format(customEndDate, "yyyyMMdd'T'HHmmss'Z'")}`
          : "";
      const count =
        customEnds === "after" ? `;COUNT=${customRecurrenceNo}` : "";
      const byday = type === "WEEKLY" ? `;BYDAY=${byDayString}` : "";

      return `RRULE:FREQ=${type}${count}${ends}${byday}`;
    }
    return null;
  };
  const handleSave = (data) => {
    if (data === "") {
      alert("Please select end option");
      return;
    } else {
      setCustomRrule(getCustomRecurrenceRule());
    }
  };
  return (
    <div className='p-2 flex flex-col'>
      <p className='text-gray-500 text-md'>Custom Recurrence</p>
      <div className='pl-2 w-full flex flex-row items-center gap-x-1'>
        <span className='text-gray-500'>Repeat Every : </span>

        <select
          className='border p-1 rounded-lg text-gray-500'
          value={customRepeatType}
          onChange={(e) => setCustomRepeatType(e.target.value)}
        >
          <option value='day'>day</option>
          <option value='weekly'>week</option>
          <option value='monthly'>month</option>
          <option value='yearly'>year</option>
        </select>
      </div>
      {customRepeatType === "weekly" && (
        <div className='px-4 py-2 flex w-full flex-row gap-x-1 items-center justify-evenly'>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("SU")}
              value='SU'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>SU</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("MO")}
              value='MO'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>MO</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("TU")}
              value='TU'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>TU</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("WE")}
              value='WE'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>WE</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("TH")}
              value='TH'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>TH</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("FR")}
              value='FR'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>FR</label>
          </div>
          <div>
            <input
              type='checkbox'
              checked={byDay.includes("SA")}
              value='SA'
              onChange={(e) => handleWeeklyDay(e.target.value)}
            />
            <label>SA</label>
          </div>
        </div>
      )}
      <div className='pl-2'>
        <p className='text-gray-500 text-md'>Ends</p>
        <div className='w-full flex'>
          <div className=' flex flex-row items-center w-32'>
            <input
              name='On'
              checked={customEnds === "ends"}
              value='ends'
              type='radio'
              onChange={(e) => setCustomEnds(e.target.value)}
            />
            <span>On</span>
          </div>
          {/* <input
            className='border w-full p-1 rounded-lg text-gray-500'
            type='datetime-local'
            value={customEndDate.toISOString().slice(0, 16)}
            onChange={(e) => setCustomEndDate(e.target.value)}
            disabled={customEnds !== "ends"}
          /> */}
          <DatePicker
            selected={customEndDate}
            onChange={(date) => setCustomEndDate(date)}
            showTimeSelect
            timeIntervals={15}
            timeFormat='HH:mm'
            dateFormat='yyyy-MM-dd HH:mm'
            className='border w-full p-1 rounded-lg text-gray-500'
          />
        </div>
        <div className='w-full flex'>
          <div className=' flex flex-row items-center w-32'>
            <input
              name='after'
              checked={customEnds === "after"}
              value='after'
              onChange={(e) => setCustomEnds(e.target.value)}
              type='radio'
            />
            <span>After </span>
          </div>
          <div className='w-full flex flex-row items-center'>
            <input
              className='border w-20 p-1 rounded-lg text-gray-500'
              type='number'
              value={customRecurrenceNo >= 1 ? customRecurrenceNo : 1}
              disabled={customEnds !== "after"}
              onChange={(e) => setCustomRecurrenceNo(e.target.value)}
            />
            <span className='text-sm text-gray-500'> recurrence</span>
          </div>
        </div>
      </div>
      <div className='w-full flex items-center justify-center '>
        <button
          type='button'
          onClick={() => handleSave(customEnds)}
          className='border p-2 rounded-xl'
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomRecurrence;
