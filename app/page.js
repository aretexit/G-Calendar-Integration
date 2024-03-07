import Image from "next/image";
import Login from "./login/page";
export default function Home() {
  return (
    <div>
      {" "}
      <div>
        <h1>Next.js Google Calendar API Integration</h1>
        <Login />
      </div>
    </div>
  );
}
