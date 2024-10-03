import React from 'react';
import Resource from './Resource';
import { useDrop } from 'react-dnd';

const ResourceList = ({ module, setModules }) => {
  const moveResource = (draggedItem, targetModuleId, targetIndex) => {
    setModules((prevModules) => {
      const newModules = prevModules.map((mod) => {
        if (mod.id === draggedItem.moduleId) {
          return { ...mod, resources: mod.resources.filter((res, idx) => idx !== draggedItem.index) };
        }
        if (mod.id === targetModuleId) {
          const newResources = [...mod.resources];
          newResources.splice(targetIndex, 0, draggedItem.resource);
          return { ...mod, resources: newResources };
        }
        return mod;
      });
      return newModules;
    });
  };

  const [, drop] = useDrop({
    accept: 'RESOURCE',
    drop: (draggedItem) => {
      if (draggedItem.moduleId !== module.id) {
        moveResource(draggedItem, module.id, module.resources.length);
      }
    },
  });

  return (
    <div ref={drop} style={{ minHeight: '50px', padding: '8px', border: '1px solid #ddd' }}>
      {module.resources.map((resource, index) => (
        <Resource
          key={resource.id}
          index={index}
          resource={resource}
          moduleId={module.id}
          moveResource={moveResource}
          setModules={setModules}
        />
      ))}
    </div>
  );
};

export default ResourceList;
