'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { refreshToken } from '../utils/refreshToken.js';

export default function PostEvent() {
  const [formData, setFormData] = useState({
    title: '',
    datetime: '',
    description: '',
    location: '',
    participant_ids: '', // Comma-separated IDs
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      let response = await fetch('http://localhost:8000/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtAccess')}`, // Use stored JWT token
        },
        body: JSON.stringify({
          ...formData,
          participant_ids: formData.participant_ids.split(',').map(id => id.trim()), // Convert to an array
        }),
      });
      console.log(response);

      if (response.status === 401) {
        console.log('We need to refresh the token!');

        let newAccess = await refreshToken();
        localStorage.setItem('jwtAccess', newAccess);

        let response = await fetch('http://localhost:8000/events/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtAccess')}`, // Use stored JWT token
          },
          body: JSON.stringify({
            ...formData,
            participant_ids: formData.participant_ids.split(',').map(id => id.trim()), // Convert to an array
          }),
        });

        if (!response.ok) {
          router.push("/signin");
        }
      }
      else if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create the event');
      }

      setFormData({
        title: '',
        datetime: '',
        description: '',
        location: '',
        participant_ids: '',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>
      {success && <p className="text-green-600">Event created successfully!</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Participants (IDs, comma-separated)</label>
          <input
            type="text"
            name="participant_ids"
            value={formData.participant_ids}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
