"use client";
import Image from "next/image";
import React from 'react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchMessage() {
      try {
        // This will eventually change to be wherever our backend is.
        let response = await fetch("http://localhost:8000/events/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwtAccess")}`
          }
        });
        let result = await response.json();
        setData(result);
        console.log(result["message"]);
      }
      catch (error) {
        console.log(error);
      }
    }

    fetchMessage();
  }, []);

  return (
    <>

      <h1>The backend returned:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>

    </>
  );
}
