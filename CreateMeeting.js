import React, { useState } from 'react';

function CreateMeeting() {
  const [meetingName, setMeetingName] = useState('');
  const [timeWindow, setTimeWindow] = useState({ start: '', end: '' });
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');

  const handleTimeWindowChange = (e) => {
    setTimeWindow({ ...timeWindow, [e.target.name]: e.target.value });
  };

  const addParticipant = () => {
    if (newParticipant) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    }
  };

  return (
    <div>
      <h2>Create Meeting</h2>

      {/* Meeting Name */}
      <label>Meeting Name: </label>
      <input
        type="text"
        value={meetingName}
        onChange={(e) => setMeetingName(e.target.value)}
        placeholder="Enter meeting name"
      /><br /><br />

      {/* Time Window */}
      <label>Start Time: </label>
      <input
        type="time"
        name="start"
        value={timeWindow.start}
        onChange={handleTimeWindowChange}
      /><br />
      <label>End Time: </label>
      <input
        type="time"
        name="end"
        value={timeWindow.end}
        onChange={handleTimeWindowChange}
      /><br /><br />

      {/* Participants */}
      <h3>Add Participants</h3>
      <input
        type="text"
        value={newParticipant}
        onChange={(e) => setNewParticipant(e.target.value)}
        placeholder="Enter participant name"
      />
      <button onClick={addParticipant}>Add Participant</button>

      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </div>
  );
}

export default CreateMeeting;
