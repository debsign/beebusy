import React, { useState } from 'react';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import UsersSearchComponent from './UsersSearchComponent';
import ProjectsSearchComponent from './ProjectsSearchComponent';
import ListsSearchComponent from './ListsSearchComponent';
import TasksSearchComponent from './TasksSearchComponent';

function AdminDashboard() {
  const [value, setValue] = useState('1');
  const role = localStorage.getItem('role');

  return (
    <>
      {role === 'admin' ?
        <ContentWrapper>
          <h1>Dashboard de Administrador</h1>
          <p>En este administrador podrás gestionar de forma sencilla la información de los usuarios, los proyectos, las listas y las tareas.</p>
          <Stack>
            <TabContext value={value}>
              <Stack>
                <Tabs
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="scrollable force tabs example"
                >
                  <Tab label="Usuarios" value="1" />
                  <Tab label="Proyectos" value="2" />
                  <Tab label="Listas" value="3" />
                  <Tab label="Tareas" value="4" />
                </Tabs>
              </Stack>
              <TabPanel value="1"><UsersSearchComponent/></TabPanel>
              <TabPanel value="2"><ProjectsSearchComponent/></TabPanel>
              <TabPanel value="3"><ListsSearchComponent/></TabPanel>
              <TabPanel value="4"><TasksSearchComponent/></TabPanel>
            </TabContext>
          </Stack>
        </ContentWrapper>
      : <ContentWrapper>
        <p>No tienes permisos para acceder a esta página.</p>
      </ContentWrapper> }
    </>
  );
}

const ContentWrapper = styled.section`
  && {
    width: -webkit-fill-available;
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
  }
`;

export default AdminDashboard;