import React from 'react';

import API from '../services/api'

import styled from 'styled-components'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

class UserList extends React.Component<{}> {

  state: any = null;

  constructor(props: any) {
    super(props);
      this.state = {
        users: [],
        isLoading: false,

        openList: false,
        openItem: [ { } ],

        theme: 'light'
      }
  }

  componentDidMount () {
    let openItem = this.state.openItem;

    for (let i=1; i <= 10; i++) {
      openItem.push({ id: i, isOpen: false })
    }

    this.setState({ openItem: openItem })
  }

  private async getUsers () {
    const self = this;

    self.setState({ isLoading: true });

    try {
      const {data} = await API.get('/users');

      if ( data.length < 0 ) {
        throw new Error('Could not fetch data from API');
      } else {
        self.setState({ users: data });
      }

    } catch (e) {
      console.error('api (ERROR): ', e);
    } finally {
      self.setState({
        isLoading: false
      });
    }
  }

  toggleList () {
    this.setState({ openList: !this.state.openList });

    this.getUsers();
  }

  toggleItem = (id: number) => {
    this.setState(state => ({
      ...state,
      openItem: this.state.openItem.map((item: any) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    }));
  };

  toggleTheme () {
    switch (this.state.theme) {
      case 'light':
        this.setState({ theme: 'dark' });
        break;
      default:
        this.setState({ theme: 'light' });
    }
  }

  render () {

    const palletType = this.state.theme
    const darkState = palletType === 'dark';

    const mainPrimaryColor = darkState ? '#252525' : '#f1f1f1';
    const mainSecondaryColor = darkState ? '#f1f1f1' : '#fff';
    const btnColor = darkState ? 'linear-gradient(90deg, rgba(173,90,108,1) 0%, rgba(193,160,104,1) 100%)' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';
    const btnShadow = darkState ? '0 3px 5px 2px rgba(24, 19, 20, .3)' : '0 3px 5px 2px rgba(255, 105, 135, .3)';
    const bgColor = darkState ? '#121212' : '#fff';
    const primaryTextColor = darkState ? '#fff' : '#333';

    const darkTheme = createMuiTheme({
      palette: {
        type: palletType,
        primary: {
          main: mainPrimaryColor
        },
        secondary: {
          main: mainSecondaryColor
        }
      }
    });

    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Tooltip title="Toggle light / dark theme">
              <IconButton edge="start" className="btn" color="inherit" aria-label="menu" onClick={this.toggleTheme.bind(this)}>
                { darkState ? <BrightnessHighIcon /> : <Brightness4Icon /> }
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <ContentContainer style={{background: bgColor}}>
          <Heading>
            Lista de Usuários em React + MaterialUI
          </Heading>

          <Button onClick={this.toggleList.bind(this)} style={{background: btnColor, boxShadow: btnShadow}}>
            { this.state.openList ? 'Ocultar Lista' : 'Mostrar Lista' }
          </Button>

          {
            this.state.isLoading ? 
            <p style={{fontWeight: 400, color: '#aaa'}}> Carregando... </p>
          :
            <ListContainer style={{ opacity: this.state.openList ? '100%' : '0', background: mainPrimaryColor}}>
              <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              style={{width: '100%', display: this.state.openList ? 'block' : 'none' }}
              subheader={
                <ListSubheader style={{textAlign: 'left'}} component="div" id="nested-list-subheader">
                  Users:
                </ListSubheader>
              }>
                {
                  this.state.users.length > 0 &&
                  this.state.users.map((row: any) => (
                    <>
                      <ListItem button onClick={this.toggleItem.bind(this, row.id)} key={row.id} style={{color: primaryTextColor}}>
                        <ListItemAvatar>
                          <Avatar>
                            <AccountCircle />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={row.name} />
                        { this.state.openItem && this.state.openItem.find((item: any) => item.id === row.id).isOpen ? <ExpandLess /> : <ExpandMore /> }
                      </ListItem>
                      <Collapse in={this.state.openItem && this.state.openItem.find((item: any) => item.id === row.id).isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding style={{color: primaryTextColor}}>
                          <ListItem style={{paddingLeft: 32, paddingTop: 0}}>
                            <ListItemText primary="username:" secondary={row.username} />
                          </ListItem>
                          <ListItem style={{paddingLeft: 32, paddingTop: 0}}>
                            <ListItemText primary="email:" secondary={row.email} />
                          </ListItem>
                        </List>
                      </Collapse>
                    </>
                  ))
                }
              </List>
            </ListContainer>
          }
        </ContentContainer>
      </ThemeProvider>
    );
  }
}


const ContentContainer = styled.main`
  height: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListContainer = styled.div`
  display: block;
  width: 75%;
  margin: auto auto 0 auto;
  background: #f1f1f1;
  padding: 8px 0;
  border-radius: 3px;

  transition: opacity ease-in-out .2s;
`;

const Heading = styled.h1`
  font-size: 48px;
  font-weight: 400;
  color: grey;
`;

const Button = styled.button`
  border: 0;
  border-radius: 3px;
  color: #f1f1f1;
  text-transform: uppercase;
  font-weight: 700;
  min-height: 48px;
  padding: 0 40px;
  margin-bottom: 28px;
  max-width: 200px;
  cursor: pointer;
`;

export default UserList;