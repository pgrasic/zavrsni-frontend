import React from 'react';
import RemindersList from '../components/Medication/RemindersList';

const Reminders: React.FC = () => {
  return (
    <main>
      <h1>Your Reminders</h1>
      <RemindersList />
    </main>
  );
};

export default Reminders;
