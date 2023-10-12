import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <FooterWrapper>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} BeeBusy
      </Typography>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 20px;
  /* background-color: var(--yellowjslighter); */
  position: fixed;
  width: 100%;
  bottom: 0;
`;

export default Footer;
