import { ScrollRestoration } from "react-router";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout() {
  return (
    <div className="bg-[#F8F9FC] h-full w-full p-5 flex flex-col gap-4">
      <ScrollRestoration />
      <Header />

      <main className="h-[calc(100vh-248px)] w-full flex gap-4">
        <Sidebar />

        <div className="flex-1">

        </div>
      </main>
    </div>
  );
}
