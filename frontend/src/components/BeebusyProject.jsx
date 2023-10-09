import { useParams } from 'react-router-dom';
import BeebusyList from './BeebusyList';
import AddNewElement from './AddNewElement';
import styled from "styled-components";
import { useState } from 'react';

const BeebusyProject = () => {
  const { projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleAddList = async (newList) => {
    const token = localStorage.getItem('token');
    if(!token){
      console.error('Token no encontrado');
      return;
    }

    console.log('Nueva lista creada con nombre:', newList.name);
    const listId = newList._id;  // Obtenemos el ID de la nueva lista
  
    if (!listId) {
      console.error('ID de la lista no encontrado');
      return;
    }
  
    // Ahora, añadimos la nueva lista al proyecto
    const response = await fetch(`${BASE_URL}/api/project/${projectId}/addList`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, listId }), 
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('Data:', data);
      if (data.project) {
        // setLists(prevLists => [...prevLists, { _id: listId, name: newListName }]);  // Aquí añadimos el objeto de la lista con el ID y el nombre
        setLists(prevLists => [...prevLists, { _id: newList._id, name: newList.name }]);
      } else {
        console.error('Error al añadir la lista al proyecto');
      }
    } else {
      console.error('Error al añadir la lista al proyecto');
    }
  };
  
  


  const handleAddTask = async (newTaskName, listId) => {
    // Asegúrate de que este endpoint exista y esté configurado correctamente en tu servidor
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTaskName, listId, projectId }), // Asegúrate de que tu API pueda manejar estos datos
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prevTasks => [...prevTasks, newTask]);
      } else {
        console.error('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error al crear la tarea', error);
    }
  };

  return (
    <MainStyled>
      <BeebusyList projectId={projectId} onAddTask={handleAddTask}/>
      <AddNewElement type="list" onAdd={handleAddList} projectId={projectId}/>
    </MainStyled>
  );
}

const MainStyled = styled.main`
  flex-grow: 1;
  padding-inline: 1rem;
  padding-block: 5rem;
  overflow-y: auto;
  overflow-x: auto;
  white-space: nowrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 20px;
  grid-auto-flow: column;
`;

export default BeebusyProject;
