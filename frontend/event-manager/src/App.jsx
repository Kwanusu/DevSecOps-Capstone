import React, { useState, useEffect } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", location: "", description: "" });

  useEffect(() => {
  fetch("/api/events")   // proxy handles redirect to backend
    .then(res => res.json())
    .then(data => setEvents(data));
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
  const newEvent = await res.json();
  setEvents([...events, newEvent]);
  setForm({ title: "", date: "", location: "", description: "" });
};


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Event Management System</h1>
      
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
        <button type="submit">Add Event</button>
      </form>

      <h2>All Events</h2>
      <ul>
        {events.map(ev => (
          <li key={ev.id}>
            <strong>{ev.title}</strong> ({ev.date}) - {ev.location}
            <p>{ev.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
