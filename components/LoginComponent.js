"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const LoginComponent = () => {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/calendar" }); // Use the correct provider ID (e.g., "google")
  };

  return (
    <div className='w-full max-h-screen h-screen flex justify-center items-center flex-col '>
      <p className='text-2xl font-semibold text-blue-600'>
        <img
          src='https://cdn.dribbble.com/userupload/4828045/file/original-e59378ac6c09cea4594b9105373eaf6a.gif'
          className='w-full h-[400px] '
          alt='Loading GIF'
        />
      </p>
      <div>
        <button
          onClick={handleSignIn}
          className='w-auto px-5 py-3 border rounded-xl flex gap-4 border-[#041CFF] text-[#041CFF] 
                  items-center font-medium justify-center hover:transform hover:scale-110 transition-all'
        >
          <div className="bg-[url('../public/google.png')] bg-cover h-6 w-6"></div>
          Sign In With Google
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
