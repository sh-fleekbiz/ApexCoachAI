import React, { useState } from 'react';
import PeopleList from './PeopleList.tsx';
import Invitations from './Invitations.tsx';

const People: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">People</h1>
      <div className="flex mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'members' ? 'border-b-2 border-black' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'invitations' ? 'border-b-2 border-black' : ''}`}
          onClick={() => setActiveTab('invitations')}
        >
          Invitations
        </button>
      </div>
      {activeTab === 'members' ? <PeopleList /> : <Invitations />}
    </div>
  );
};

export default People;
