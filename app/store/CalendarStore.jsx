// import { listEvents } from "@/utils/calendar";
// import { atom, useAtom, useAtomValue } from "jotai";
// import { useSession } from "next-auth/react";

// function SessionFunction() {
//   const { data: session } = useSession();
//   return session;
// }
// export const userSession = atom(SessionFunction());
// console.log("User Session: ", userSession);

// export const eventsAtom = atom(async () => {
//   try {
//     const response = await listEvents(useAtomValue(userSession));
//     if (response) {
//       return response;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     return [];
//   }
// });
