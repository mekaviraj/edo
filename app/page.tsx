'use client';

import { useState, useEffect } from 'react';

interface Student {
  roll: string;
  name: string;
  cluster: number;
}

interface Team {
  _id: string;
  mentor?: string;
  members: Student[];
  createdAt: string;
}

export default function Home() {
  const [studentsByCluster, setStudentsByCluster] = useState<{ [key: string]: Student[] }>({
    '1': [],
    '2': [],
    '3': [],
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');
  const [selected3, setSelected3] = useState('');
  const [mentor, setMentor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Log state at rendering time to inspect what keys and arrays React sees
  console.log("Rendering Home component. studentsByCluster state is currently:", studentsByCluster);

  // Fetch unassigned students and existing teams, disabling cache explicitly
  const fetchData = async () => {
    try {
      console.log("Fetching students...");
      const resSt = await fetch('/api/students', { cache: 'no-store' });
      console.log("Fetch response status:", resSt.status);

      const resClone = resSt.clone();
      const rawText = await resClone.text();
      console.log("Raw response text:", rawText);

      if (resSt.ok) {
        const dataSt = JSON.parse(rawText);
        console.log("Parsed JSON:", dataSt);
        console.log("Lengths of cluster 1:", dataSt['1']?.length);
        console.log("Lengths of cluster 2:", dataSt['2']?.length);
        console.log("Lengths of cluster 3:", dataSt['3']?.length);
        setStudentsByCluster(dataSt);
      }

      const resTm = await fetch('/api/teams', { cache: 'no-store' });
      if (resTm.ok) {
        const dataTm = await resTm.json();
        setTeams(dataTm);
      }
    } catch (err) {
      setError('Could not fetch data from the server.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("State after setStudentsByCluster (useEffect):", studentsByCluster);
  }, [studentsByCluster]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selected1 || !selected2 || !selected3) {
      setError('Please select one student from each cluster.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cluster1: selected1,
          cluster2: selected2,
          cluster3: selected3,
          mentor,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Team created successfully!');
        setSelected1('');
        setSelected2('');
        setSelected3('');
        setMentor('');
        fetchData();
      } else {
        setError(data.error || 'Failed to create team.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) {
      return;
    }
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/teams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Team deleted successfully!');
        fetchData();
      } else {
        setError(data.error || 'Failed to delete team.');
      }
    } catch (err) {
      setError('An error occurred while deleting the team.');
    }
  };

  // Safe helper arrays for dropdown mappings
  const c1List = studentsByCluster['1'] || [];
  const c2List = studentsByCluster['2'] || [];
  const c3List = studentsByCluster['3'] || [];

  return (
    <main className="min-h-screen bg-emerald-50/20 text-emerald-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-900">
            Jrp

          </h1>
          <p className="mt-2 text-sm text-emerald-700">
            IT3 major project Teams
          </p>
          <div className="flex flex-col items-center justify-center">
            <img
              src="/modiii.jpeg"
              alt="modiii"
              className="w-32 h-auto rounded-lg shadow-sm border border-emerald-100"
            />
            <span className="text-xs text-emerald-700/70 mt-1.5 font-medium">Pradhan mantri stmg yojana</span>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
            {success}
          </div>
        )}

        {/* Creator Form */}
        <form onSubmit={handleCreateTeam} className="bg-white border border-emerald-100 shadow-sm rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cluster 1 Dropdown */}
            <div>
              <label htmlFor="cluster1" className="block text-sm font-semibold text-emerald-900 mb-2">
                Cluster 1 Student
              </label>
              <select
                id="cluster1"
                value={selected1}
                onChange={(e) => setSelected1(e.target.value)}
                className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              >
                <option value="">Select Student...</option>
                {c1List.map((st) => (
                  <option key={st.roll} value={st.roll}>
                    {st.name} ({st.roll})
                  </option>
                ))}
              </select>
            </div>

            {/* Cluster 2 Dropdown */}
            <div>
              <label htmlFor="cluster2" className="block text-sm font-semibold text-emerald-900 mb-2">
                Cluster 2 Student
              </label>
              <select
                id="cluster2"
                value={selected2}
                onChange={(e) => setSelected2(e.target.value)}
                className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              >
                <option value="">Select Student...</option>
                {c2List.map((st) => (
                  <option key={st.roll} value={st.roll}>
                    {st.name} ({st.roll})
                  </option>
                ))}
              </select>
            </div>

            {/* Cluster 3 Dropdown */}
            <div>
              <label htmlFor="cluster3" className="block text-sm font-semibold text-emerald-900 mb-2">
                Cluster 3 Student
              </label>
              <select
                id="cluster3"
                value={selected3}
                onChange={(e) => setSelected3(e.target.value)}
                className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              >
                <option value="">Select Student...</option>
                {c3List.map((st) => (
                  <option key={st.roll} value={st.roll}>
                    {st.name} ({st.roll})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Mentor Name Input */}
            <div className="md:col-span-2">
              <label htmlFor="mentor" className="block text-sm font-semibold text-emerald-900 mb-2">
                Mentor Name (Optional)
              </label>
              <input
                id="mentor"
                type="text"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                placeholder="Enter mentor name"
                className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-emerald-900 disabled:bg-emerald-300 border border-emerald-950 transition cursor-pointer"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Teams Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-emerald-900">Existing Teams</h2>
          {teams.length === 0 ? (
            <p className="text-emerald-700/60 text-sm">No teams created yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-emerald-100 shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-emerald-100 text-sm text-left">
                <thead className="bg-emerald-50 text-emerald-950 font-semibold">
                  <tr>
                    <th scope="col" className="px-6 py-3">Team Number</th>
                    <th scope="col" className="px-6 py-3">Cluster 1 Student</th>
                    <th scope="col" className="px-6 py-3">Cluster 2 Student</th>
                    <th scope="col" className="px-6 py-3">Cluster 3 Student</th>
                    <th scope="col" className="px-6 py-3">Mentor</th>
                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {teams.map((team, index) => {
                    // Safe search for members by cluster number (converting type to cover both strings and numbers)
                    const c1Member = team.members.find(m => Number(m.cluster) === 1);
                    const c2Member = team.members.find(m => Number(m.cluster) === 2);
                    const c3Member = team.members.find(m => Number(m.cluster) === 3);

                    return (
                      <tr key={team._id} className="hover:bg-emerald-50/10">
                        <td className="px-6 py-4 font-bold text-emerald-900">Team {index + 1}</td>
                        <td className="px-6 py-4 text-emerald-950">{c1Member ? c1Member.name : 'N/A'}</td>
                        <td className="px-6 py-4 text-emerald-950">{c2Member ? c2Member.name : 'N/A'}</td>
                        <td className="px-6 py-4 text-emerald-950">{c3Member ? c3Member.name : 'N/A'}</td>
                        <td className="px-6 py-4 text-emerald-950">{team.mentor || 'None'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteTeam(team._id)}
                            className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
