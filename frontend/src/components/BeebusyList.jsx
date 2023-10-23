import { Paper, CssBaseline } from "@mui/material";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import ListTitle from "./ListTitle";
import BeebusyCard from "./BeebusyCard";
import AddNewElement from "./AddNewElement";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BeebusyList = ({ projectName }) => {
  const { projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Obtenemos las listas
  useEffect(() => {
    const fetchListTitles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/project/${projectId}`, {
          // Modificar esta línea para obtener las listas del proyecto específico
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLists(data.lists);
        } else {
          console.error(
            "Error al obtener las listas de tareas: ",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al obtener las listas de tareas: ", error);
      }
    };
    fetchListTitles();
  }, [BASE_URL, projectId]); // lists
  // Obtenemos las tareas
  useEffect(() => {
    const fetchTasksTitles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/tasks/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const projectTasks = data.filter(
            (task) => task.projects?.[0]?._id === projectId
          );

          const tasksByList = lists.reduce((acc, list) => {
            acc[list._id] = projectTasks.filter(
              (task) => task.lists[0]._id === list._id
            );
            return acc;
          }, {});

          setTasks(tasksByList);
        } else {
          console.error("Error al obtener las tareas: ", await response.text());
        }
      } catch (error) {
        console.error("Error al obtener las tareas: ", error);
      }
    };
    fetchTasksTitles();
  }, [BASE_URL, lists, projectId]);
  // Actualiza las tareas
  const updateTaskList = async (taskId, newListId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lists: newListId, // ID de la nueva lista
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Recargar los tasks después de actualizar uno
      const tasksResponse = await fetch(`${BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!tasksResponse.ok) {
        throw new Error(await tasksResponse.text());
      }

      const data = await tasksResponse.json();
      const projectTasks = data.filter(
        (task) => task.projects?.[0]?._id === projectId
      );

      const tasksByList = lists.reduce((acc, list) => {
        acc[list._id] = projectTasks.filter(
          (task) => task.lists[0]._id === list._id
        );
        return acc;
      }, {});

      setTasks(tasksByList);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Configuramos onDragEnd
  const onDragEnd = (result) => {
    // Propiedades que nos ofrece el objeto result
    // source: lista desde la que se mueve la tarea
    // destination: lista a la que se mueve la tarea
    // draggableId: id de la tarea que se mueve
    const { source, destination, draggableId } = result;
    if (!destination) return;
    // console.log('Source:', source);
    // console.log('Destination:', destination);

    // Obtén el array de tareas para la lista de origen
    const sourceTasks = tasks[source.droppableId];
    if (!sourceTasks) return;

    // Crea una copia del array para modificarlo
    const updatedTasks = Array.from(sourceTasks);

    // Realiza la operación de arrastrar y soltar en la copia del array
    const [removed] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, removed);

    // Actualiza el estado con la copia modificada del array de tareas
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: updatedTasks,
    }));

    // Solicitud a la API para actualizar la lista de la tarea en la base de datos
    updateTaskList(draggableId, destination.droppableId);
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, index) => (
          <StyledPaper key={index}>
            <CssBaseline />
            <ListTitle name={list.name} />
            <Droppable droppableId={list._id}>
              {(provided, snapshot) => (
                <DraggableColumn
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks[list._id]?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <BeebusyCard
                            projectId={projectId}
                            projectName={projectName}
                            taskid={task._id}
                            content={task.name}
                            onUpdateTask={(updatedTask) => {
                              const updatedTasks = tasks[list._id].map((t) =>
                                t._id === updatedTask._id ? updatedTask : t
                              );
                              setTasks((prev) => ({
                                ...prev,
                                [list._id]: updatedTasks,
                              }));
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </DraggableColumn>
              )}
            </Droppable>
            <AddNewElement
              type="card"
              projectId={projectId}
              listId={list._id}
              // Pasamos la actualización
              onAddTask={(newTask) => {
                setTasks((prev) => {
                  const updatedTasks = [...prev[list._id], newTask];
                  return { ...prev, [list._id]: updatedTasks };
                });
              }}
            />
          </StyledPaper>
        ))}
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
const DraggableColumn = styled.div`
  && {
    min-height: 10px;
  }
`;

export default BeebusyList;
