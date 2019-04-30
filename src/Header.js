import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';

import { TOGGLE_SIDEBAR, RESET_STORE } from './actions';

const styles = theme => ({
  header: {
    zIndex: theme.zIndex.drawer + 1
  }
});

class Header extends React.Component {
  render() {
    const { classes, target, dispatch } = this.props;

    return (
      <AppBar position="fixed" className={classes.header}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => {dispatch({type: TOGGLE_SIDEBAR})}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
            colmemo
          </Typography>
          <Typography style={{ flexGrow: 1, align: 'center' }}>
            {target}
          </Typography>
          <Button
            color="inherit"
            onClick={() => {dispatch({type: RESET_STORE})}}
          >
            Reset
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
