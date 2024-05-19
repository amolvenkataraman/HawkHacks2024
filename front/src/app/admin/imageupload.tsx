'use client'

import { useAuthInfo } from "@propelauth/react";
import { type MouseEvent } from "react";
import { MouseEventHandler, useEffect, useState, useRef } from "react";
import { type ChangeEvent } from "react";

export default function ImageUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const authInfo = useAuthInfo();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles(files)
    }
  };

  const onUpload = (event: MouseEvent) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Convert image to base64
      const reader = new FileReader();

      reader.onloadend = async (ev) => {
        const base64 = reader.result as string;

        // Send base64 to server
        setLoading(true);
        setImages((prev) => [...prev, base64]);

        setLoading(false);
      };

      reader.readAsDataURL(file);

    });
    
    event.preventDefault();
  };

  useEffect(() => {
    // All files prepared, now upload 
    if (images.length !== files?.length) return;

    fetch('http://localhost:8000/dataset', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authInfo.accessToken}`,
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        {
          images: images,
          username: 'username',
          password: 'password',
          method: 'POST',
          targetUrl: '',
          
        }
      ),
    }).then((res) => {
      if (!res.ok) console.error('Failed to upload image');
    }).catch((err) => console.log(err));

    setImages([]);
    setFiles(null);
  }, [images])

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex justify-center items-center border border-black rounded-lg py-3 backdrop-blur backdrop-brightness-50 gap-2">
        <input type="file" accept=".png,.jpg" onChange={onFileChange} multiple className="max-w-[50%]" />
        <button className="border-2 border-white rounded-md px-2 py-1 " onClick={onUpload} >Upload</button>
        <button className="border-2 border-white rounded-md px-2 py-1 ">Pay</button>
      </div>
      <div className="flex flex-wrap justify-center items-end gap-2">
        <>
          {files !== null && Array.from(files).map((file, index) => {
            return (
              <div className="text-center" key={index}>
                <div>{file && `${file.name} - ${file.type}`}</div>
                <img src={URL.createObjectURL(file)} />
              </div>
            );
          })}
        </>
      </div>
    </div>
  );
}
