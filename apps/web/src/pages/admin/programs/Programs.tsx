import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../../../services/index.js';

interface Program {
  id: number;
  name: string;
  description: string | null;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramDescription, setNewProgramDescription] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/programs`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch(`${apiBaseUrl}/api/admin/programs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProgramName,
          description: newProgramDescription,
        }),
      });
      setNewProgramName('');
      setNewProgramDescription('');
      fetchPrograms();
    } catch (error) {
      console.error('Failed to create program:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Programs</h1>
      <div className="mb-4">
        <form onSubmit={handleCreateProgram}>
          <input
            type="text"
            placeholder="Program Name"
            value={newProgramName}
            onChange={(event) => setNewProgramName(event.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Program Description"
            value={newProgramDescription}
            onChange={(event) => setNewProgramDescription(event.target.value)}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-black text-white p-2">
            Add Program
          </button>
        </form>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="border px-4 py-2">
                  <Link to={`/admin/programs/${program.id}`}>
                    {program.name}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  {program.description || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Programs;
