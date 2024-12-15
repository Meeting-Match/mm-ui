"use client";
import { useState } from "react";
import { api } from "../utils/api";

export default function AddAvailability({ eventId }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setHours(startDate.getHours() - 5);
    endDate.setHours(endDate.getHours() - 5);

    const adjustedStart = startDate.toISOString();
    const adjustedEnd = endDate.toISOString();   
    setStatus('');
    try {
      await api('/availabilities/', {
        method: 'POST',
        body: {
          start: adjustedStart,
          end: adjustedEnd,
          event: eventId, // Pass eventId as a plain ID
        },
      });
      setStatus('Availability added successfully!');
      setStart('');
      setEnd('');
    } catch (error) {
      setStatus(error.message || 'Failed to add availability.');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md mt-6">
      <h2 className="text-lg font-semibold mb-2">Add Your Availability</h2>
      {status && <p className="mb-2 text-green-600">{status}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block mb-1 font-medium">Start</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Availability
        </button>
      </form>
    </div>
  );
}
