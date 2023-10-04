import { useNavigate } from 'react-router-dom'
import styled, { css } from "styled-components"
import { IconButton, Switch } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react'
import {Menu, MenuItem} from '@mui/material';
import { Link } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';

import logo from './assets/images/bee.png';

import { useAuth } from './AuthContext';

function Header({ toggleDark, handleModeChange }) {
    const { isAuthenticated, logout } = useAuth();

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // submenu
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    // Logout
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('token');
    
        if (storedRole && storedToken) {
          setUserRole(storedRole);
        }
    }, []);

    console.log(isAuthenticated);
      
    return (
        <>
            {isMenuOpen && <Overlay onClick={closeMenu} />}
            <HeaderStyled>
                <div>
                    <IconButton onClick={toggleMenu}>
                        <MenuIcon/>
                    </IconButton>
                    <Link to="/"><Logo src={logo} alt="BeeBusy Logo"/></Link>
                </div>
                <div  style={{marginLeft: 'auto'}}>
                    <Switch checked={toggleDark} onChange={handleModeChange} />
                    {!isAuthenticated &&
                        <Tooltip title="Iniciar sesión">
                            <Link to="/login">
                                <IconButton>
                                    <LoginIcon/>
                                </IconButton>
                            </Link>
                        </Tooltip>
                    }
                </div>
                {isAuthenticated && 
                    <div>
                        <IconButton>
                            <NotificationsNoneIcon/>
                        </IconButton>
                        <IconButton         
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}>
                            <AccountCircleIcon/>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem component={Link} href='#' onClick={handleClose}>
                                <ListItemIcon>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon> Mi perfil
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate('/dashboard');
                            }}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon> 
                                Mi escritorio
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </div>
                }

            </HeaderStyled>
            <MenuStyled isOpen={isMenuOpen}>
                <Link to="/"><Logo src={logo} alt="BeeBusy Logo"/></Link>
                <NavStyled>
                    <Link to="/about">Acerca de</Link>
                    <Link to="/contact">Contacto</Link>
                    <Link to="/login"></Link>
                    <Link to="/register">Registrarse</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/admin">Admin Dashboard</Link>
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
        box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    }
    div {
        display: flex;
        align-items: center;
    }
`;
const MenuStyled = styled.div`
    position: fixed;
    height: 100vh;
    width: 0px;
    background: #111111;
    overflow: hidden;
    transition: 0.5s ease;
    z-index: 2;

    ${props => props.isOpen && css`
        width: 250px;
    `}
`;

const NavStyled = styled.nav`
  display: flex;
  flex-direction: column;
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


export default Header