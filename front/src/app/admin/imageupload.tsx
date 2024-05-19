'use client'

import { useState } from "react";
import { type ChangeEvent } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0] ?? null)
    }
  };

  const onUpload = () => {
    if (!file) {
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      console.log(base64);
      // Send base64 to server
      setLoading(true);
      const res = await fetch('/TODO', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) {
        console.error('Failed to upload image');
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} className="" />
      <div>{file && `${file.name} - ${file.type}`}</div>
      <button onClick={onUpload} >Upload</button>
    </div>
  );
}
