"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";
import Link from "next/link";
import { api } from "../../../../utils/api";

export default function ParticipatingEvents() {
  const { isAuthenticated, loading, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    const fetchParticipatingEvents = async () => {
      try {
        const allEvents = await api(`/events/`);
        const participating = allEvents.filter(event => event.participant_ids.includes(user.id));
        setEvents(participating);
      } catch (err) {
        setError("Error fetching participating events");
      }
    };

    fetchParticipatingEvents();
  }, [isAuthenticated, loading, router, user]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return null;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (events.length === 0) return <div className="text-center mt-10">You are not participating in any events.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Events I'm Participating In</h1>
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-4 border rounded hover:bg-gray-50">
              <Link href={`/events/${event.id}`} className="text-blue-600 underline">
                {event.title}
              </Link>
              <p className="text-sm text-gray-600">{new Date(event.datetime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <Link href="/dashboard" className="mt-4 inline-block text-blue-600 underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}