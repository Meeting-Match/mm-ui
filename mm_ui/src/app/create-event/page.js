"use client";
import React from "react";
import PostEvent from "../components/PostEvent";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Create a New Event</h1>
        <p className="text-gray-600 mb-4">Fill out the form below to create a new event.</p>
        <PostEvent />
      </div>
    </div>
  );
}
