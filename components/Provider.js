"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "jotai";

const Providers = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <Provider>{children}</Provider>
    </SessionProvider>
  );
};

export default Providers;
