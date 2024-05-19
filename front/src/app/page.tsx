'use client'

import Link from "next/link";

function AnonymousSplash() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Welcome to DataSrc
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <span
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">First box</h3>
          <div className="text-lg">
            Annotate images or smth
          </div>
        </span>
        <span
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">Second box</h3>
          <div className="text-lg">
            What else to put here
          </div>
        </span>
      </div>
    </div>
  )
}

function LoggedInSplash() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Welcome to DataSrc
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <span
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">First box</h3>
          <div className="text-lg">
            Annotate images or smth
          </div>
        </span>
        <span
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">Second box</h3>
          <div className="text-lg">
            What else to put here
          </div>
        </span>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <AnonymousSplash/>
    </main>
  );
}
