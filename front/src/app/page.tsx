'use client'

import { useAuthInfo } from "@propelauth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

function AnonymousSplash() {
  const [images, setImages] = useState<string[]>([]);
  const authInfo = useAuthInfo();

  useEffect(() => {
    
    console.log(images)

    const callAPI = async () => {
      const res = await fetch('http://localhost:8000/dataset', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${authInfo.accessToken}`,
          'Access-Control-Allow-Origin': '*',
        }
      });

      if (!res.ok) {
        console.log(res.status);
        return;
      }
      const body = await res.json();
      
      setImages(body.image_links);
    };

    if (images.length == 0) callAPI();

  }, [authInfo]);


  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Welcome to DataSrc
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <>
        {
          images.map((value, index) => {
            return (
              <img src={value} key={index}></img>
            )
          })
        }
        </>
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
