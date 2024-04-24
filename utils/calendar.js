import axios from "axios";
import { v4 as uuid } from "uuid";
import { addHours, format } from "date-fns";

export async function listEvents(accessToken) {
  try {
    const phurl = `https://www.googleapis.com/calendar/v3/calendars/en.philippines%23holiday@group.v.calendar.google.com/events?key=AIzaSyCyhwBYtlzS0uQ3B-ZqvQ7pLACCdrT8QSE`;
    const auurl = `https://www.googleapis.com/calendar/v3/calendars/en.australian%23holiday@group.v.calendar.google.com/events?maxResults=2500&key=AIzaSyCyhwBYtlzS0uQ3B-ZqvQ7pLACCdrT8QSE`;
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
    const defaultResponse = response.data.items.map((res) => ({
      id: res.id,
      title: res.summary,
      start: new Date(format(res.start.dateTime, "yyyy/MM/dd HH:mm:ss")),
      end: new Date(format(res.end.dateTime, "yyyy/MM/dd HH:mm:ss")),
      allDay: false,
      desc: res.description,
      data: res,
      type: res.organizer.displayName,
    }));
    const PHHolidayResponse = PHHoliday.data.items.map((res) => ({
      id: res.id,
      title: res.summary,
      start: new Date(format(res.start.date, "yyyy/MM/dd HH:mm:ss")),
      end: new Date(format(res.end.date, "yyyy/MM/dd HH:mm:ss")),
      allDay: false,
      desc: res.description,
      data: res,
      type: res.organizer.displayName,
    }));
    const AUHolidayResponse = AUHoliday.data.items.map((res) => ({
      id: res.id,
      title: res.summary,
      start: new Date(format(res.start.date, "yyyy/MM/dd HH:mm:ss")),
      end: new Date(format(res.end.date, "yyyy/MM/dd HH:mm:ss")),
      allDay: false,
      desc: res.description,
      data: res,
      type: res.organizer.displayName,
    }));
    console.log("phHoliday: ", PHHolidayResponse);
    console.log("AUHoliday: ", AUHoliday);
    const returnedItems = [
      ...defaultResponse,
      ...PHHolidayResponse,
      ...AUHolidayResponse,
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
  withConference,
  Rrule
) {
  try {
    let newDescription = description;
    let conferenceID = "";
    let aretexMeet =
      "This includes Aretex Meet: https://meet.vps-aretex.space/" + uuid();
    // console.log("UUID: ", conferenceID);
    if (withConference) {
      conferenceID = uuid();
      newDescription = `${newDescription} \n${aretexMeet}`;
    } else {
      conferenceID = "";
    }

    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        summary: title,
        description: newDescription,
        start: {
          dateTime: startDate,
          timeZone: "Australia/Sydney",
        },
        end: {
          dateTime: endData,
          timeZone: "Australia/Sydney",
        },
        attendees: guests.map((guest) => ({ email: guest.email })),
        // conferenceData: {
        //   createRequest: {
        //     requestId: conferenceID,
        //     conferenceSolutionKey: { type: "hangoutsMeet" },
        //   },
        // },
        reminders: {
          useDefault: true,
        },
        recurrence: [Rrule],
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
    const defaultResponse = {
      id: response.data.id,
      title: response.data.summary,
      start: new Date(
        format(response.data.start.dateTime, "yyyy/MM/dd HH:mm:ss")
      ),
      end: new Date(format(response.data.end.dateTime, "yyyy/MM/dd HH:mm:ss")),
      allDay: false,
      desc: response.data.description,
      data: response.data,
      type: response.data.organizer.displayName,
    };
    return defaultResponse;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}

export async function deleteEvent(accessToken, id, recurring, recurringId) {
  try {
    let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`;
    const eventParams = {
      sendUpdates: "all",
      recurrence: recurring ? "all" : "none",
    };
    if (recurring === true && recurringId) {
      url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${recurringId}`;
    }
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: eventParams,
    });
    console.log("Event(s) Deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting Google Calendar event: ", error);
  }
}
