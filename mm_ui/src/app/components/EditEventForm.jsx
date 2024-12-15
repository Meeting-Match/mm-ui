"use client";
import { useState } from "react";
import { api } from "../utils/api";

export default function EditEventForm({ event, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: event.title,
    datetime: event.datetime,
    description: event.description,
    location: event.location,
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Body:", formData);
      const updatedEvent = await api(`/events/${event.id}/`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });
      onSuccess(updatedEvent);
    } catch (err) {
      setError("Error updating event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Date and Time</label>
        <input
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex justify-between">
        <button type="submit" className="text-white bg-blue-600 px-4 py-2 rounded">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="text-gray-600 underline">
          Cancel
        </button>
      </div>
    </form>
  );
}
