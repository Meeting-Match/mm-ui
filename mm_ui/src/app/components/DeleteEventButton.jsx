"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api"; // Adjust path if necessary

export default function DeleteEventButton({ eventId }) {
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api(`/events/${eventId}/`, { method: "DELETE" });
      setStatus("Event deleted successfully!");
      // After successful deletion, redirect to the created events page or dashboard
      router.push("/events/created");
    } catch (error) {
      setStatus(error.message || "Failed to delete the event.");
    }
  };

  return (
    <div className="mt-4">
      {status && <p className="text-sm text-green-600 mb-2">{status}</p>}
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Event
      </button>
    </div>
  );
}