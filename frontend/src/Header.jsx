import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { IconButton, Switch } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import avatarWoman from "./assets/images/avatar-woman.svg";
import avatarMan from "./assets/images/avatar-man.svg";

// Redux
import { useSelector } from "react-redux";
import { selectHasNewNotifications } from "../features/notificationSlice";

import logo from "./assets/images/bee.png";

import { useAuth } from "./AuthContext";
import StyledLink from "./components/style/StyledLink";
import { useTheme } from "@mui/material/styles";

function Header({ toggleDark, handleModeChange }) {
  const theme = useTheme();
  const bgColor = theme.palette.header.background;
  const color = theme.palette.header.color;
  // 1. Definición de variables
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  // Para controlar las notificaciones
  const hasNewNotifications = useSelector(selectHasNewNotifications);
  // 2. Funciones
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  // Submenu
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // Para la verificación de rol y token
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    if (storedRole && storedToken) {
      setUserRole(storedRole);
    }
  }, []);
  // Para obtener la imagen del avatar
  useEffect(() => {
    const fetchUser = async () => {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const userID = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userID || !token) return;

      try {
        const response = await fetch(`${BASE_URL}/api/user/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error("La respuesta no es JSON");
          }
        } else {
          console.error("Error al obtener la información del usuario");
        }
      } catch (error) {
        console.error("Error en fetch:", error);
      }
    };

    fetchUser();
  }, []);
  // Para verificar que funcionan las notificaciones
  // useEffect(() => {
  //     console.log("Has new notifications:", hasNewNotifications);
  // }, [hasNewNotifications]);

  // 3. Resultado
  return (
    <>
      {isMenuOpen && <Overlay onClick={closeMenu} />}
      <HeaderStyled>
        <div>
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Logo src={logo} alt="BeeBusy Logo" />
          </Link>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Switch checked={toggleDark} onChange={handleModeChange} />
          {!isAuthenticated && (
            <Tooltip title="Iniciar sesión">
              <Link to="/login">
                <IconButton>
                  <LoginIcon />
                </IconButton>
              </Link>
            </Tooltip>
          )}
        </div>
        {isAuthenticated && (
          <div>
            <IconButton>
              <NotificationsNoneIcon style={{ position: "relative" }} />
              {hasNewNotifications && <RedSpot />}
            </IconButton>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {user && user.avatar ? (
                user.avatar.includes("avatar-woman") ? (
                  <Avatar src={avatarWoman} alt="Avatar de la usuaria" />
                ) : user.avatar.includes("avatar-man") ? (
                  <Avatar src={avatarMan} alt="Avatar del usuario" />
                ) : (
                  <AccountCircleIcon />
                )
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItemStyled
                bgcolor={bgColor}
                color={color}
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
                sx={{
                  backgroundColor: bgColor,
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>{" "}
                Mi perfil
              </MenuItemStyled>
              <MenuItemStyled
                bgcolor={bgColor}
                color={color}
                onClick={() => {
                  handleClose();
                  navigate("/dashboard");
                }}
                sx={{
                  backgroundColor: bgColor,
                }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Mi escritorio
              </MenuItemStyled>
              <MenuItemStyled
                bgcolor={bgColor}
                color={color}
                onClick={logout}
                sx={{
                  backgroundColor: bgColor,
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItemStyled>
            </Menu>
          </div>
        )}
      </HeaderStyled>
      <MenuStyled isOpen={isMenuOpen}>
        <Link to="/">
          <Logo src={logo} alt="BeeBusy Logo" />
        </Link>
        <NavStyled>
          <StyledLink to="/about">Acerca de</StyledLink>
          <StyledLink to="/contact">Contacto</StyledLink>
          {!isAuthenticated && (
            <>
              <StyledLink to="/login">Iniciar sesión</StyledLink>
              <StyledLink to="/register">Registrarse</StyledLink>
            </>
          )}
          {isAuthenticated && (
            <>
              <StyledLink to="/dashboard">Dashboard</StyledLink>
              <StyledLink to="/admin">Admin Dashboard</StyledLink>
            </>
          )}
        </NavStyled>
      </MenuStyled>
    </>
  );
}
const HeaderStyled = styled.header`
  && {
    position: fixed;
    top: 0;
    width: 100%;
    overflow: hidden;
    transition: 0.5s ease;
    z-index: 1;
    display: flex;
    align-items: center;
    padding-block: 5px;
    justify-content: space-between;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  }
  div {
    display: flex;
    align-items: center;
  }
`;
const MenuItemStyled = styled(MenuItem)`
  &&:hover {
    background-color: ${(props) => props.bgcolor};
    color: ${(props) => props.color};
  }
`;
const MenuStyled = styled.div`
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  position: fixed;
  height: 100vh;
  width: 0px;
  background-color: var(--white);
  overflow: hidden;
  transition: 0.5s ease;
  z-index: 2;
  ${(props) =>
    props.isOpen &&
    css`
      width: 250px;
    `}
  && > a {
    text-align: center;
    width: 100%;
    display: block;
    padding-block: 1rem;
  }
`;

const NavStyled = styled.nav`
  display: flex;
  flex-direction: column;
  padding-inline: 1rem;
  && > a {
    padding-block: 10px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
`;
const RedSpot = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

export default Header;
