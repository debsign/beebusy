import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BeebusyList from "./BeebusyList";
import AddNewElement from "./AddNewElement";
import styled from "styled-components";

const BeebusyProject = () => {
  const { projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [project, setProject] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Obtenemos la info del proyecto
  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/project/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error(
            "Error al obtener la info del proyecto: ",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al obtener la info del proyecto: ", error);
      }
    };
    fetchProject();
  }, [BASE_URL, projectId]);
  // Añadimos lista
  const handleAddList = async (newList) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const listId = newList._id; // Obtenemos el ID de la nueva lista

    if (!listId) {
      console.error("ID de la lista no encontrado");
      return;
    }

    // Ahora, añadimos la nueva lista al proyecto
    const response = await fetch(
      `${BASE_URL}/api/project/${projectId}/addList`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, listId }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.project) {
        setLists((prevLists) => [
          ...prevLists,
          { _id: newList._id, name: newList.name },
        ]);
      } else {
        console.error("Error al añadir la lista al proyecto");
      }
    } else {
      console.error("Error al añadir la lista al proyecto");
    }
  };

  return (
    <MainStyled>
      <h1>{project.title}</h1>
      <ContentProject>
        <BeebusyList projectId={projectId} projectName={project.title} />
        <AddNewElement
          type="list"
          onAdd={handleAddList}
          projectId={projectId}
        />
      </ContentProject>
    </MainStyled>
  );
};

const MainStyled = styled.main`
  padding-inline: 1rem;
  padding-block: 3rem;
  height: calc(100vh - 60px);
`;
const ContentProject = styled.section`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: auto;
  white-space: nowrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 20px;
  grid-auto-flow: column;
  height: 100%;
`;

export default BeebusyProject;
