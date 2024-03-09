import axios from "axios";

export async function listEvents(accessToken) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: new Date().toISOString(),
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
  endData
) {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      {
        summary: title,
        description: description,
        start: {
          dateTime: startDate,
          timeZone: "Australia/Sydney", // Update to your desired time zone
        },
        end: {
          dateTime: endData,
          timeZone: "Australia/Sydney", // Update to your desired time zone
        },
      },
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
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}
