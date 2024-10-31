import React, { useState } from 'react';

function Availability() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });

  const addTimeSlot = () => {
    if (newSlot.start && newSlot.end && newSlot.start < newSlot.end) {
      setTimeSlots([...timeSlots, newSlot]);
      setNewSlot({ start: '', end: '' });
    } else {
      alert('Please enter a valid time slot');
    }
  };

  const handleSlotChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Insert Availability</h2>

      {/* Time Slot Input */}
      <label>Start Time: </label>
      <input
        type="time"
        name="start"
        value={newSlot.start}
        onChange={handleSlotChange}
      /><br />
      <label>End Time: </label>
      <input
        type="time"
        name="end"
        value={newSlot.end}
        onChange={handleSlotChange}
      /><br />
      <button onClick={addTimeSlot}>Add Time Slot</button>

      {/* Display Time Slots */}
      <h3>Time Slots</h3>
      <ul>
        {timeSlots.map((slot, index) => (
          <li key={index}>{slot.start} - {slot.end}</li>
        ))}
      </ul>
    </div>
  );
}

export default Availability;
