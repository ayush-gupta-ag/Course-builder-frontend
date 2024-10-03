import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaEdit, FaTrashAlt, FaDownload, FaSave } from 'react-icons/fa';

const Resource = ({ resource, moduleId, index, setModules, moveResource }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(resource.name);
  const [newLink, setNewLink] = useState(resource.link || ''); // Assuming link is stored in resource.link
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'RESOURCE',
    item: { type: 'RESOURCE', resource, moduleId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'RESOURCE',
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const dragModuleId = draggedItem.moduleId;

      if (dragIndex === hoverIndex && dragModuleId === moduleId) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveResource(draggedItem, moduleId, hoverIndex);
      draggedItem.index = hoverIndex;
      draggedItem.moduleId = moduleId;
    },
  });

  drag(drop(ref));

  const handleRename = () => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              resources: mod.resources.map((res) =>
                res.id === resource.id
                  ? { ...res, name: newName, link: newLink }
                  : res
              ),
            }
          : mod
      )
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === moduleId
          ? { ...mod, resources: mod.resources.filter((res) => res.id !== resource.id) }
          : mod
      )
    );
  };

  return (
    <div
      ref={ref}
      style={{
        border: '1px solid #ddd',
        padding: '8px',
        margin: '4px 0',
        backgroundColor: '#f9f9f9',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: '8px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px', width: '100%' }}
          />
          {resource.type === 'link' && (
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              style={{ padding: '8px', marginRight: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
            />
          )}
          <button onClick={handleRename} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}>
            <FaSave /> Save
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {resource.type === 'link' ? (
            <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>{resource.name}</a>
          ) : (
            <span>{resource.name}</span>
          )}
          <div>
            <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
              <FaEdit />
            </button>
            <button onClick={handleDelete} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
              <FaTrashAlt />
            </button>
            {resource.type !== 'link' && (
              <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                <FaDownload />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resource;
