import React, { useState, useRef } from 'react';
import ResourceList from './ResourceList';
import AddResourceForm from './AddResourceForm';
import { useDrag, useDrop } from 'react-dnd';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';

const Module = ({ module, index, setModules, moveModule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(module.name);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { type: 'MODULE', id: module.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => module.id !== 'no_module', // Prevent dragging the "Uncategorized" module
  });

  const [, drop] = useDrop({
    accept: 'MODULE',
    hover: (draggedItem, monitor) => {
      if (!ref.current || module.id === 'no_module') { // Prevent dropping on the "Uncategorized" module
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
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

      moveModule(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleRename = () => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === module.id ? { ...mod, name: newName } : mod
      )
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    setModules((prevModules) =>
      prevModules.filter((mod) => mod.id !== module.id)
    );
  };

  return (
    <div
      ref={ref}
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#f9f9f9',
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`module ${isDragging ? 'dragging' : ''}`}
    >
      {isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              padding: '8px',
              marginRight: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              flex: '1',
            }}
            placeholder="Enter module name"
          />
          <button
            onClick={handleRename}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <FaSave /> Save
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: '0', fontSize: '1.5rem', color: '#333' }}>{module.name}</h2>
          <div>
            {module.id !== 'no_module' && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <FaTrashAlt />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <AddResourceForm moduleId={module.id} setModules={setModules} />
      <ResourceList module={module} setModules={setModules} />
    </div>
  );
};

export default Module;
