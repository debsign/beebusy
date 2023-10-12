import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: var(--blackjsdarker);
  text-decoration: underline;
  transition: all 0.3s;

  &:hover {
    color: var(--yellowjs);
    text-decoration: underline;
  }
`;

export default StyledLink;
