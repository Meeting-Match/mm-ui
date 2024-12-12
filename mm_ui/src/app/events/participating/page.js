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
    // Debugging: Log authentication status and user information
    console.log("Authentication Status:", isAuthenticated);
    console.log("Loading:", loading);
    console.log("User Object:", user);

    if (loading) return; // Still loading, do nothing
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (!user || !user.username) {
      setError("User information is missing.");
      console.error("User or user.username is undefined:", user);
      return;
    } else {
      // Clear any existing errors when user data is available
      if (error) {
        setError("");
      }
    }

    const fetchParticipatingEvents = async () => {
      try {
        const response = await api(`/events/`);
        console.log("API Response:", response);

        // Validate response structure
        if (!response || !response.results) {
          throw new Error("Invalid response structure");
        }

        // Log each event's participant_ids
        response.results.forEach(event => {
          console.log(`Event ID: ${event.id}, Participant IDs:`, event.participant_ids);
        });

        // Use user.username for filtering
        const userUsername = String(user.username);
        console.log("User Username (string):", userUsername);

        // Filter events where participant_ids include the user's username
        const participating = response.results.filter(event => 
          event.participant_ids.includes(userUsername)
        );
        console.log("Participating Events:", participating);

        setEvents(participating);
      } catch (err) {
        console.error("Error fetching participating events:", err);
        setError("Error fetching participating events");
      }
    };

    fetchParticipatingEvents();
  }, [isAuthenticated, loading, router, user, error]); // Added 'error' to dependencies

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Optionally, you can show a message or a redirect
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10">
          You are not participating in any events.
        </div>
      </div>
    );
  }

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
