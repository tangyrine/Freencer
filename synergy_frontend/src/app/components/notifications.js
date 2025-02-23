import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">Recent Updates</h2>
      {notifications.length > 0 ? (
        <ul className="mt-2">
          {notifications.map((notif, index) => (
            <li key={index} className="border-b py-2">{notif.message}</li>
          ))}
        </ul>
      ) : (
        <p>No Updates Yet</p>
      )}
    </div>
  );
}
