
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Bell } from 'lucide-react';
import Navbar from './Navbar';

export default function TaskReminder() {
  const [reminders, setReminders] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    id: null,
    name: '',
    date: '',
    time: '',
  });

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('taskReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskReminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReminder.name || !newReminder.date || !newReminder.time) {
      alert('Please fill in all fields');
      return;
    }
    
    const reminderToAdd = {
      ...newReminder,
      id: Date.now(),
    };
    
    setReminders(prev => [...prev, reminderToAdd]);
    
    // Reset form
    setNewReminder({
      id: null,
      name: '',
      date: '',
      time: '',
    });
    
    setFormVisible(false);
  };

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const formatDateTime = (date, time) => {
    const reminderDate = new Date(`${date}T${time}`);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(reminderDate);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Bell className="mr-2 text-blue-600" />
          Task Reminders
        </h2>
        <button 
          onClick={() => setFormVisible(!formVisible)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          {formVisible ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Add New Reminder</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              name="name"
              value={newReminder.name}
              onChange={handleInputChange}
              placeholder="Enter task name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-1 text-blue-600" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={newReminder.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock size={16} className="mr-1 text-blue-600" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={newReminder.time}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus size={18} className="mr-1" />
            Add Reminder
          </button>
        </form>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No reminders yet. Add your first reminder!</p>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
              <div>
                <h3 className="font-medium text-gray-800">{reminder.name}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1 text-blue-600" />
                  {formatDateTime(reminder.date, reminder.time)}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(reminder.id)}
                className="p-1 text-red-500 hover:bg-red-100 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}