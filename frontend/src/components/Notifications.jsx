import React,  { useState } from "react";

const Notifications = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    "New exam scheduled",
    "Assignment graded",
    "New announcement posted",
  ];

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>🔔</button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded">
          {notifications.map((n, i) => (
            <div key={i} className="p-2 border-b text-sm">
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
