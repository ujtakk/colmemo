import React from 'react';

import { connect } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Header from './Header';
import Sidebar from './Sidebar';
import ItemTable from './ItemTable';
import NoteArea from './NoteArea';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'dark'
  }
});

function App(props) {
  const { dispatch } = props;
  const { openSidebar, focusedItem, attrs, items, notes } = props.state;

  const noteText = focusedItem in notes ? notes[focusedItem] : '';

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        dispatch={dispatch}
        target={focusedItem}
      />
      <Grid container>
        <Sidebar dispatch={dispatch} showing={openSidebar} />
        <ItemTable dispatch={dispatch} cols={attrs} rows={items} />
        <NoteArea dispatch={dispatch} text={noteText} />
      </Grid>
    </MuiThemeProvider>
  );
}

function mapStateToProps(state) {
  return {state};
}

function mapDispatchToProps(dispatch) {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
