import NextAuth from "next-auth";
import Providers from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Providers({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/auth?prompt=consent&access_type=offline&response_type=code",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = { ...user, ...account };
      }
      return token;
    },
    async session(session, token) {
      console.log("Token in session callback:", token);

      if (token) {
        session.user = token;
      }

      return session;
    },
  },
});
export { handler as GET, handler as POST };
