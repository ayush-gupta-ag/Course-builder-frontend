import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const AddResourceForm = ({ moduleId, setModules }) => {
  const [resourceName, setResourceName] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('link');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resourceType === 'link' && resourceName.trim() && resourceUrl.trim()) {
      const newResource = {
        id: Date.now(),
        name: resourceName,
        type: 'link',
        url: resourceUrl,
      };
      addResource(newResource);
    } else if (resourceType === 'file' && resourceName.trim() && file) {
      const newResource = {
        id: Date.now(),
        name: resourceName,
        type: 'file',
        file,
      };
      addResource(newResource);
    }
    setResourceName('');
    setResourceUrl('');
    setFile(null);
  };

  const addResource = (newResource) => {
    setModules((prevModules) => {
      const uncategorizedModule = prevModules.find(mod => mod.id === 'no_module');
      if (moduleId) {
        return prevModules.map((mod) =>
          mod.id === moduleId
            ? { ...mod, resources: [...mod.resources, newResource] }
            : mod
        );
      } else {
        if (uncategorizedModule) {
          return prevModules.map((mod) =>
            mod.id === 'no_module'
              ? { ...mod, resources: [...mod.resources, newResource] }
              : mod
          );
        } else {
          return [
            {
              id: 'no_module',
              name: 'Uncategorized',
              resources: [newResource],
            },
            ...prevModules,
          ];
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={resourceName}
        onChange={(e) => setResourceName(e.target.value)}
        placeholder="Resource Name"
      />
      {resourceType === 'link' && (
        <input
          type="text"
          value={resourceUrl}
          onChange={(e) => setResourceUrl(e.target.value)}
          placeholder="Resource URL"
        />
      )}
      <select
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
      >
        <option value="link">Link</option>
        <option value="file">File</option>
      </select>
      {resourceType === 'file' && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}
      <button type="submit">
        <FaPlus /> Add Resource
      </button>
    </form>
  );
};

export default AddResourceForm;
