import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FooterWrapper = styled.footer`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  text-align: center;
  padding: 20px;
  position: fixed;
  width: 100%;
  bottom: 0;
`;

const Footer = () => {
  const theme = useTheme();
  const bgColor = theme.palette.footer.background;
  const color = theme.palette.footer.color;

  return (
    <FooterWrapper bgColor={bgColor} color={color}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} BeeBusy
      </Typography>
    </FooterWrapper>
  );
};

export default Footer;
