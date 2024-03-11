import axios from "axios";
import { v4 as uuid } from "uuid";

export async function listEvents(accessToken) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: new Date("2000-01-01").toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
}
export async function createEvent(
  accessToken,
  title,
  description,
  startDate,
  endData,
  guests
) {
  try {
    const conferenceID = uuid(); // Generate a unique ID for each conference request
    console.log("UUID: ", conferenceID);
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
            conferenceSolution: {
              type: "hangoutsMeet",
            },
            requestId: conferenceID,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
      {
        params: {
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
