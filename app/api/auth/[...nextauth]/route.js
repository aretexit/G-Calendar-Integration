import NextAuth from "next-auth";
import Providers from "next-auth/providers/google";
import { atom, useAtom, useSetAtom } from "jotai";
import { userSession } from "@/app/store/CalendarStore";

const handler = NextAuth({
  providers: [
    Providers({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      access_type: "offline",
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar  https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token = { ...user, ...account, ...profile };
      }
      return token;
    },
    async session(session, token) {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },
});
export { handler as GET, handler as POST };
