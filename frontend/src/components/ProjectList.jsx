import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import image from "../assets/images/beebusy_main_img-removebg-preview.png";
import StyledLink from "./style/StyledLink";
import { useTheme } from "@mui/material/styles";

const ProjectList = () => {
  const theme = useTheme();
  const bgColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const [projects, setProjects] = useState([]);
  const role = localStorage.getItem("role");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Obtenemos la info de los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/projects`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error(
            "Error al obtener los proyectos: ",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al obtener los proyectos: ", error);
      }
    };
    fetchProjects();
  }, [BASE_URL, projects]);

  return (
    <div>
      {role === "admin" || role === "worker" ? (
        <ProjectListWrapper bgColor={bgColor} color={color}>
          <h1>Proyectos</h1>
          <ProjectListContent>
            {projects.map((project) => (
              <ProjectListTitle key={project._id}>
                <Link
                  style={{ color: "var(--blackjsdarker)" }}
                  to={`/projects/${project._id}`}
                >
                  <SubtitleStyled color={color}>{project.title}</SubtitleStyled>
                  <DescriptionStyled color={color}>
                    {project.description}
                  </DescriptionStyled>
                </Link>
              </ProjectListTitle>
            ))}
          </ProjectListContent>
        </ProjectListWrapper>
      ) : (
        <ProjectListWrapper bgColor={bgColor} color={color}>
          <h1>
            <span style={{ color: "var(--yellowjs)", fontWeight: "400" }}>
              Bee
            </span>
            busy
          </h1>
          <p>
            <StyledLink to="/login">Inicia sesión</StyledLink> o{" "}
            <StyledLink to="/register">regístrate</StyledLink>
          </p>
          <img
            src={image}
            alt="Imagen pantalla principal"
            loading="lazy"
            style={{ width: "100%" }}
          />
        </ProjectListWrapper>
      )}
    </div>
  );
};

const ProjectListWrapper = styled.section`
  && {
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.color};
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    height: 100vh;
  }
`;
const ProjectListContent = styled.div`
  && {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-column-gap: 1.4em;
  }
`;
const SubtitleStyled = styled.h3`
  && {
    color: ${(props) => props.color};
  }
`;
const DescriptionStyled = styled.p`
  && {
    color: ${(props) => props.color};
  }
`;
const ProjectListTitle = styled.div`
  && {
    padding: 0.6em 0.2em;
    border-top: solid 8px var(--blackjsdarker);
    transition: background-color 0.3s ease;
    :hover {
      background: var(--yellowjs);
    }
  }
`;

export default ProjectList;
