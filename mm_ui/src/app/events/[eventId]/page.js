"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import AddAvailability from "../../components/AddAvailability";
import { api } from "../../utils/api";
import Link from "next/link";
import DeleteEventButton from "../../components/DeleteEventButton"; // Import here
import EditEventForm from "../../components/EditEventForm"; // Import the EditEventForm component

export default function EventDetails() {
  const { eventId } = useParams();
  const { isAuthenticated, loading, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Add editing state
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await api(`/getevent/${eventId}/`, { useCompositeService: true });
        console.log(`Retrieved enriched event data:`, data);
        setEvent(data);

        const availabilityData = await api(`/events/${eventId}/availability`);
        console.log(`Retrieved availability data:`, availabilityData);
        setAvailabilities(availabilityData.results);
      } catch (err) {
        setError("Error fetching event details or availability data");
      }
    };

    fetchEvent();
  }, [isAuthenticated, loading, eventId, router]);

  const getOrganizerId = () => {
    if (!event?.organizer_profile) return null;
    const urlParts = event.organizer_profile.split("/");
    return urlParts[urlParts.length - 2];
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle the edit mode
  };

  const handleEditSuccess = (updatedEvent) => {
    setEvent(updatedEvent); // Update event data after successful edit
    setIsEditing(false); // Exit edit mode
  };

  const handleEditCancel = () => {
    setIsEditing(false); // Exit edit mode
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return null;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!event) return <div className="text-center mt-10">Loading event...</div>;

  const organizerId = Number(getOrganizerId());
  const userId = Number(user?.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="mb-2"><strong>Date and Time:</strong> {new Date(event.datetime).toLocaleString()}</p>
        <p className="mb-2"><strong>Description:</strong> {event.description}</p>
        <p className="mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="mb-2"><strong>Organizer Profile:</strong> <a href={event.organizer_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{event.organizer_profile}</a></p>
        <p className="mb-4"><strong>Participants:</strong> {event.participants?.map(p => `${p.username} (${p.email})`).join(", ")}</p>

        {/* Availability section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Availability:</h2>
          {availabilities.length > 0 ? (
            availabilities.map((availability, index) => (
              <div key={index} className="mb-2">
                <p><strong>Participant ID:</strong> {availability.participant.split("/").pop()}</p>
                <p><strong>Start:</strong> {new Date(availability.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(availability.end).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No availability data available.</p>
          )}
        </div>

        {/* Edit/Delete section, only for the organizer */}
        {organizerId === userId && (
          <div className="mb-4">
            {!isEditing ? (
              <>
                <button onClick={handleEditToggle} className="text-blue-600 underline mr-4">
                  Edit Event
                </button>
                <DeleteEventButton eventId={eventId} />
              </>
            ) : (
              <EditEventForm
                event={event}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            )}
          </div>
        )}

        <AddAvailability eventId={eventId} />

        <Link href="/dashboard" className="mt-4 inline-block text-blue-600 underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
