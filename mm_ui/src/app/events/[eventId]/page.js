"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import AddAvailability from "../../components/AddAvailability";
import { api } from '../../utils/api';

import Link from "next/link";

export default function EventDetails() {
  const { eventId } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await api(`/events/${eventId}/`);
        setEvent(data);
      } catch (err) {
        setError("Error fetching event details");
      }
    };

    fetchEvent();
  }, [isAuthenticated, loading, eventId, router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return null;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!event) return <div className="text-center mt-10">Loading event...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="mb-2"><strong>Date and Time:</strong> {new Date(event.datetime).toLocaleString()}</p>
        <p className="mb-2"><strong>Description:</strong> {event.description}</p>
        <p className="mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="mb-2"><strong>Organizer ID:</strong> {event.organizer_id}</p>
        <p className="mb-4"><strong>Participants:</strong> {event.participant_ids.join(', ')}</p>

        <AddAvailability eventId={eventId} />

        <Link href="/dashboard" className="mt-4 inline-block text-blue-600 underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}