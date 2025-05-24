import React from 'react';

const RoleSelection = ({ onRoleSelect }) => {
  const roles = [
    // {
    //   id: 'user',
    //   name: 'User',
    //   description: 'Regular user access',
    //   icon: '👤',
    // },
    {
      id: 'client',
      name: 'Client',
      description: 'Client business account',
      icon: '🏢',
    },
  ];

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onRoleSelect(role.id)}
          className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
        >
          <div className="text-3xl mr-4">{role.icon}</div>
          <div className="text-left">
            <h3 className="font-medium">{role.name}</h3>
            <p className="text-sm text-gray-500">{role.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RoleSelection; 