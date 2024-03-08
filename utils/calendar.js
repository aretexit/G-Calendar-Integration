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

