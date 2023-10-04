import { Paper, CssBaseline } from "@mui/material";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import ListTitle from "./ListTitle";
import BeebusyCard from "./BeebusyCard";
import AddNewElement from "./AddNewElement";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const BeebusyList = () => {
  const { projectId } = useParams();
  const getInitialItems = () => {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      return JSON.parse(savedItems);
    }
    return [
      { id: "item1", content: "Tarea 1" },
      { id: "item2", content: "Tarea 2" },
      { id: "item3", content: "Tarea 3" },
    ];
  };

  const [items, setItems] = useState(getInitialItems);

  const [lists, setLists] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchListTitles = async () => {
      const token = localStorage.getItem('token');
      if(!token){
        console.error('Token no encontrado');
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/project/${projectId}`, { // Modificar esta línea para obtener las listas del proyecto específico
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if(response.ok) {
          const data = await response.json();
          console.log(data);
          setLists(data.lists);
        } else {
          console.error('Error al obtener las listas de tareas: ', await response.text());
        }
      } catch (error) {
        console.error('Error al obtener las listas de tareas: ', error);
      }
    };
    fetchListTitles();
  }, [BASE_URL, projectId]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedItems = [...items];
    const [removed] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, removed);
    setItems(updatedItems);

    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  console.log('Listas', lists);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
      {lists.map((list, index) => (
        <StyledPaper key={index}>
            <CssBaseline />
            {/* Llamamos al componente ListTitle y le pasamos el name de la lista */}
            <ListTitle name={list.name} />
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <BeebusyCard content={item.content} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <AddNewElement type="card" />
          </StyledPaper>
          )
        )}
      </DragDropContext>
    </>
  );
};

const StyledPaper = styled(Paper)`
  && {
    width: 300px;
    height: fit-content;
    background-color: var(--yellowjs);
    margin-bottom: 2rem;
    padding: 0.5rem;
  }
`;

export default BeebusyList;
