import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Users, X } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

function TeamsOverview() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, description })
      });

      if (!response.ok) throw new Error('Failed to create team');
      const result = await response.json();

      setTeams(prev => [result.team, ...prev]);
      setShowForm(false);
      setTeamName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teams</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'New Team'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter team description"
                className="w-full p-2 border rounded"
              />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Create Team
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p>No teams created yet</p>
              </div>
            ) : (
              teams.map(team => (
                <Link
                  key={team._id}
                  to={`/teams/${team._id}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-lg">{team.name}</h2>
                  </div>
                  <p className="text-sm text-gray-500">Created at: {new Date(team.createdAt).toLocaleDateString()}</p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default TeamsOverview;
