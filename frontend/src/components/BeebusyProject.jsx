import { useParams } from 'react-router-dom';
import BeebusyList from './BeebusyList';
import AddNewElement from './AddNewElement';
import styled from "styled-components";

const BeebusyProject = () => {
  const { projectId } = useParams();

  return (
    <MainStyled>
      <BeebusyList projectId={projectId} />
      <AddNewElement type="list" />
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
