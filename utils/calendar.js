import axios from "axios";
import { v4 as uuid } from "uuid";

export async function listEvents(accessToken) {
  try {
    const phurl = `https://www.googleapis.com/calendar/v3/calendars/en.philippines%23holiday@group.v.calendar.google.com/events?key=AIzaSyBDIHnygApTyJtUHzNBWXbhmKA5odJEwPc`;
    const auurl = `https://www.googleapis.com/calendar/v3/calendars/en.australian%23holiday@group.v.calendar.google.com/events?key=AIzaSyBDIHnygApTyJtUHzNBWXbhmKA5odJEwPc`;
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: new Date("2000-01-01").toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );
    const PHHoliday = await axios.get(phurl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const AUHoliday = await axios.get(auurl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const returnedItems = [
      ...response.data.items,
      ...PHHoliday.data.items,
      ...AUHoliday.data.items,
    ];
    return returnedItems || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
}
export async function createEvent(
  accessToken,
  title,
  description,
  startDate,
  endData,
  guests,
  withConference
) {
  try {
    let conferenceID = "";
    console.log("UUID: ", conferenceID);
    if (withConference) {
      conferenceID = uuid();
    } else {
      conferenceID = "";
    }

    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        summary: title,
        description: description,
        start: {
          dateTime: startDate,
          timeZone: "Australia/Sydney",
        },
        end: {
          dateTime: endData,
          timeZone: "Australia/Sydney",
        },
        attendees: guests.map((guest) => ({ email: guest.email })),
        conferenceData: {
          createRequest: {
            requestId: conferenceID,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: {
          useDefault: true,
        },
        recurrence: ["RRULE:FREQ=MONTHLY;COUNT=3;"],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          calendarId: "primary",
          sendUpdates: "all",
          conferenceDataVersion: 1,
        },
      }
    );

    console.log("Event Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}

export async function deleteEvent(accessToken, id) {
  try {
    const response = await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Event created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting Google Calendar event: ", error);
  }
}
