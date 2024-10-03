import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const AddModuleForm = ({ addModule }) => {
  const [moduleName, setModuleName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (moduleName.trim()) {
      addModule(moduleName);
      setModuleName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
        placeholder="New Module Name"
      />
      <button type="submit">
        <FaPlus /> Add Module
      </button>
    </form>
  );
};

export default AddModuleForm;
