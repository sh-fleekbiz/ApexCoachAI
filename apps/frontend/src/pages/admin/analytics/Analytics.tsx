import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../../api/index.js';

interface AnalyticsSnapshot {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  messagesInPeriod: number;
  resourcesIngestedInPeriod: number;
}

const Analytics: React.FC = () => {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '365d'>('7d');

  useEffect(() => {
    const fetchSnapshot = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/admin/analytics?range=${range}`,
          { credentials: 'include' }
        );
        if (response.ok) {
          const data = await response.json();
          setSnapshot(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics snapshot:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshot();
  }, [range]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="mb-4">
        <select
          value={range}
          onChange={(event) => setRange(event.target.value as any)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="365d">Last Year</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : snapshot ? (
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white p-4 shadow">
            <h2 className="text-lg font-bold">Total Users</h2>
            <p className="text-2xl">{snapshot.totalUsers}</p>
          </div>
          <div className="bg-white p-4 shadow">
            <h2 className="text-lg font-bold">Active Users</h2>
            <p className="text-2xl">{snapshot.activeUsers}</p>
          </div>
          <div className="bg-white p-4 shadow">
            <h2 className="text-lg font-bold">Total Chats</h2>
            <p className="text-2xl">{snapshot.totalChats}</p>
          </div>
          <div className="bg-white p-4 shadow">
            <h2 className="text-lg font-bold">Messages</h2>
            <p className="text-2xl">{snapshot.messagesInPeriod}</p>
          </div>
          <div className="bg-white p-4 shadow">
            <h2 className="text-lg font-bold">Resources Ingested</h2>
            <p className="text-2xl">{snapshot.resourcesIngestedInPeriod}</p>
          </div>
        </div>
      ) : (
        <p>Failed to load analytics snapshot.</p>
      )}
    </div>
  );
};

export default Analytics;
