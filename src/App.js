import React, { useState } from 'react';
import ModuleList from './ModuleList';
import AddModuleForm from './AddModuleForm';
import AddResourceForm from './AddResourceForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  const [modules, setModules] = useState([]);

  const addModule = (moduleName) => {
    const newModule = {
      id: modules.length + 1,
      name: moduleName,
      resources: [],
    };
    setModules([...modules, newModule]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Course Builder</h1>
        <AddModuleForm addModule={addModule} />
        <AddResourceForm setModules={setModules} />
        <ModuleList modules={modules} setModules={setModules} />
      </div>
    </DndProvider>
  );
};

export default App;
