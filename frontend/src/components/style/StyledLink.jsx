import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: var(--yellowjs);
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: var(--yellowjs);
  }
`;

export default StyledLink;
