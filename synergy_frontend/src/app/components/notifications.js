export default function Notifications({ reminders }) {
  // CHANGED: Ensure reminders is always an array
  const groupedReminders = (Array.isArray(reminders) ? reminders : []).reduce((acc, reminder) => {
    if (!acc[reminder.type]) {
      acc[reminder.type] = [];
    }
    acc[reminder.type].push(reminder.message);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">Recent Updates</h2>
      {reminders && reminders.length > 0 ? (  // CHANGED: Added check for `reminders.length`
        <div className="mt-2">
          {Object.keys(groupedReminders).map((type) => (
            <div key={type} className="mb-4">
              <h3 className="text-lg font-semibold capitalize">{type} Updates</h3>
              <ul className="mt-1">
                {groupedReminders[type].map((message, index) => (
                  <li key={index} className="border-b py-2">{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No Updates Yet</p>
      )}
    </div>
  );
}
