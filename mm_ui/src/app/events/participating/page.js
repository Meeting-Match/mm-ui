"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import Link from "next/link";
import { api } from '../../utils/api';

export default function ParticipatingEvents() {
  const { isAuthenticated, loading, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Early return if loading or not authenticated
    if (loading) return;
    if (!isAuthenticated) return router.push("/signin");

    if (!user || !user.username) {
      setError("User information is missing.");
      return;
    }

    // Clear any existing error when user info is available
    if (error) setError("");

    // Fetch events the user is participating in
    const fetchParticipatingEvents = async () => {
      try {
        const response = await api(`/events/participant/`);
        if (!response?.results) {
          throw new Error("Invalid response structure");
        }

        const userId = String(user.id); // Assuming user.id is numeric or string type
        const participatingEvents = response.results.filter((event) =>
          event.participant_ids.includes(userId)
        );

        setEvents(participatingEvents);
      } catch (err) {
        console.error("Error fetching participating events:", err);
        setError("Error fetching participating events");
      }
    };

    fetchParticipatingEvents();
  }, [isAuthenticated, loading, user, error, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10 text-red-600">{error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10">You are not participating in any events.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Events I&apos;m Participating In</h1>
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-4 border rounded hover:bg-gray-50">
              <Link href={`/events/${event.id}`} className="text-blue-600 underline">
                {event.title}
              </Link>
              <p className="text-sm text-gray-600">{new Date(event.datetime).toLocaleString()}</p>
              <p className="text-sm text-gray-600"><strong>Location:</strong> {event.location}</p>
              <p className="text-sm text-gray-600"><strong>Description:</strong> {event.description}</p>
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
