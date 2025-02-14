import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "./Navbar";
import interactionPlugin from "@fullcalendar/interaction"; 

const TaskCalendar = () => {
    const [events, setEvents] = useState([]);

  // Handle new task addition
  const handleDateClick = (info) => {
    const title = prompt("Enter task name:");
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  return (
    <>
    <Navbar />

    <div className="w-full h-3/4 bg-green-600 text-white">

    <div className="w-full h-1/4 bg-white text-gray-800 flex justify-center items-center mb-4">
    <h1 className="text-5xl font-bold">Welcome to Project Calendar</h1>
    </div>

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick} // Click to add tasks
      editable={true} // Enable drag and drop
    />
    </div>
    </>
  );
};

export default TaskCalendar;
