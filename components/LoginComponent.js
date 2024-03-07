"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const LoginComponent = () => {

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/calendar" }); // Use the correct provider ID (e.g., "google")
  };

  const handleSignOut = () => {
    signOut();
  };
  return (
    <div>
      <div>
        <div>
          <h1>Next.js Google Calendar API Integration</h1>

          <button onClick={handleSignIn}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
