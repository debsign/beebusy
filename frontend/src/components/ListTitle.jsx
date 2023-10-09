import styled from "styled-components"

const ListTitle = ({ name }) => {
    return (
      <StyledListTitleWrapper>
        <StyledListTitle>{name}</StyledListTitle>
      </StyledListTitleWrapper>
    );
  };

const StyledListTitle = styled.h1`
  && {
    font-size: 1.5rem;
    margin: 0;
    padding-top: 6px;
    padding-bottom: 1rem;
  }
`;
const StyledListTitleWrapper = styled.div`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default ListTitle