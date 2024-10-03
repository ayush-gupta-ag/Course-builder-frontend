import React from 'react';
import Module from './Module';
import { useDrop } from 'react-dnd';

const ModuleList = ({ modules, setModules }) => {
  const moveModule = (dragIndex, hoverIndex) => {
    setModules((prevModules) => {
      const newModules = [...prevModules];
      const [movedModule] = newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, movedModule);
      return newModules;
    });
  };

  const [, drop] = useDrop({
    accept: 'MODULE',
    hover: (draggedItem, monitor) => {
      // Prevent dropping any module onto the "Uncategorized" module
      if (draggedItem.id !== 'no_module' && modules[0].id === 'no_module') {
        return;
      }
    },
  });

  return (
    <div ref={drop}>
      {modules.map((module, index) => (
        <Module
          key={module.id}
          index={index}
          module={module}
          setModules={setModules}
          moveModule={moveModule}
        />
      ))}
    </div>
  );
};

export default ModuleList;
