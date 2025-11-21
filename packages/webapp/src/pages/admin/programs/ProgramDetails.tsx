import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Program {
  id: number;
  name: string;
  description: string | null;
}

interface ProgramAssignment {
  id: number;
  user_id: number;
  role: 'coach' | 'participant';
}

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | undefined>(undefined);
  const [assignments, setAssignments] = useState<ProgramAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/admin/programs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProgram(data);
      }
    } catch (error) {
      console.error('Failed to fetch program:', error);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/programs/${id}/assignments`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{program?.name}</h1>
      <p className="mb-4">{program?.description}</p>
      <h2 className="text-xl font-bold mb-4">Assignments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              User {assignment.user_id} - {assignment.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramDetails;
