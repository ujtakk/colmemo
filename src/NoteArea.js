import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import { UPDATE_NOTE } from './actions';

const noteAreaWidth = '25%';

const styles = theme => ({
  drawer: {
    width: noteAreaWidth,
  },
  drawerPaper: {
    width: noteAreaWidth,
  },
  content: {
    padding: theme.spacing(1),
    flexGrow: 1,
    overflow: 'scroll',
    overflowX: 'hidden',
  },
  noteArea: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12
  },
  toolbar: theme.mixins.toolbar,
  thumbnail: {
    padding: theme.spacing(1),
  }
});

class NoteArea extends React.Component {
  render() {
    const { classes, dispatch, text } = this.props;

    const handleChange = event => {
      dispatch({type: UPDATE_NOTE, value: event.target.value});
    };

    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="right"
        position="absolute"
      >
        <div className={classes.toolbar} />
        <Paper className={classes.content}>
          <TextField
            fullWidth={true}
            multiline={true}
            value={text}
            onChange={handleChange}
          />
        </Paper>
      </Drawer>
    );
  }
}

export default withStyles(styles)(NoteArea);
