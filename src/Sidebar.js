import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';

import { withStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
// import ListIcon from '@material-ui/icons/List';
// import CreateIcon from '@material-ui/icons/CreateNewFolder';
// import DeleteIcon from '@material-ui/icons/Delete';
import ImportIcon from '@material-ui/icons/Attachment';
import ExportIcon from '@material-ui/icons/SaveAlt';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import uuidv4 from 'uuid/v4';

import * as type from './actions';

const sideBarWidth = '15%';

const styles = theme => ({
  drawer: {
    width: sideBarWidth,
    flexShrink: 0,
    zIndex: theme.zIndex.drawer,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
  },
  drawerPaper: {
    width: sideBarWidth,
  },
  dialog: {
  },
  toolbar: theme.mixins.toolbar,
});

class Sidebar extends React.Component {
  state = {
    ptr: null,
    pop: [false, false, false, false, false, false, false],
    newItem: '',
    attrKey: '',
    attrType: '',
    attrLabel: '',
    fileObj: undefined,
  };

  openPop = (index) => () => {
    const newPop = [false, false, false, false, false, false, false];
    newPop[index] = !this.state.pop[index];
    this.setState({ptr: index});
    this.setState({pop: newPop});
  };

  closePop = (query=null) => () => {
    const { dispatch } = this.props;
    const newPop = [false, false, false, false, false, false, false];
    newPop[this.state.ptr] = !this.state.pop[this.state.ptr];
    this.setState({ptr: null});
    this.setState({pop: newPop});
    if (query != null) {
      dispatch(query);
    }
  };

  AddDialog = (key, index) => {
    const { dialog, form } = this.props.classes;
    return (
      <Dialog className={dialog} key={key} open={this.state.pop[index]}>
        <DialogTitle>
          Add new item
        </DialogTitle>
        <DialogContent>
          <Typography>
            Enter the item name
          </Typography>
          <form className={form} noValidate>
            <TextField
              id="name"
              label="Item Name"
              margin="normal"
              onChange={e => this.setState({newItem: e.target.value})}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closePop()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.closePop({
              type: type.ADD_ITEM,
              value: this.state.newItem
            })}
            color="secondary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  EditDialog = (key, index) => {
    const { dialog, form, formControl } = this.props.classes;
    return (
      <Dialog className={dialog} key={key} open={this.state.pop[index]}>
        <DialogTitle>
          Edit attributes
        </DialogTitle>
        <DialogContent>
          <Typography>
            Add new column for each items
          </Typography>
          <form className={form} noValidate>
            <TextField
              label="Attribute Name"
              margin="normal"
              onChange={e => this.setState({
                attrKey: uuidv4(),
                attrLabel: e.target.value,
              })}
            />
            <FormControl className={formControl}>
              <InputLabel htmlFor="attr-type">
                Attribute Type
              </InputLabel>
              <Select
                value={this.state.attrType}
                onChange={e => {this.setState({attrType: e.target.value})}}
              >
                <MenuItem value="string">string</MenuItem>
                <MenuItem value="int">int</MenuItem>
                <MenuItem value="float">float</MenuItem>
                <MenuItem value="bool">bool</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closePop()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.closePop({
              type: type.ADD_ATTR,
              value: {
                key: this.state.attrKey,
                type: this.state.attrType,
                label: this.state.attrLabel,
                width: (this.state.attrType === 'string' ? 200 : 100),
              },
            })}
            color="secondary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  storeReader = () => {
    const reader = new FileReader();
    reader.onload = event => {
      const content = JSON.parse(event.target.result);
      const { attrs, items, notes } = JSON.parse(content['persist:root']);
      const newState = {
          attrs: JSON.parse(attrs),
          items: JSON.parse(items),
          notes: JSON.parse(notes),
      };
      this.closePop({type: type.RESET_STORE, value: newState})();
    };
    reader.readAsText(this.state.fileObj);
  };

  ImportDialog = (key, index) => {
    const { dialog } = this.props.classes;
    return (
      <Dialog className={dialog} key={key} open={this.state.pop[index]}>
        <DialogTitle>
          Import the table
        </DialogTitle>
        <DialogContent>
          <Typography>
            Select the source file
          </Typography>
          <Input
            type="file"
            onChange={e => this.setState({fileObj: e.target.files[0]})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closePop()} color="primary">
            Cancel
          </Button>
          <Button onClick={this.storeReader} color="secondary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  storeWriter = () => {
    const content = JSON.stringify(Object.assign({}, localStorage));
    const writer = document.createElement('a');
    writer.href = window.URL.createObjectURL(new Blob([content]));
    writer.download = 'localStorage.json';
    writer.click();
    this.closePop()();
  };

  ExportDialog = (key, index) => {
    const { dialog } = this.props.classes;
    return (
      <Dialog className={dialog} key={key} open={this.state.pop[index]}>
        <DialogTitle>
          Export the table
        </DialogTitle>
        <DialogContent>
          <Typography>
            Would you download the table?
            (dump localStorage from redux-persist)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closePop()} color="primary">
            Cancel
          </Button>
          <Button onClick={this.storeWriter} color="secondary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  operations = [
    {key: 'Add',    icon: <AddIcon />,    dialog: this.AddDialog   },
    {key: 'Edit',   icon: <EditIcon />,   dialog: this.EditDialog  },
    {key: 'Import', icon: <ImportIcon />, dialog: this.ImportDialog},
    {key: 'Export', icon: <ExportIcon />, dialog: this.ExportDialog},
  ];

  render() {
    const { classes, showing } = this.props;

    return (
      <div>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          classes={{ paper: classes.drawerPaper }}
          open={showing}
        >
          <div className={classes.toolbar} />
          <List>
            {this.operations.map(
              (op, index) => (
                <ListItem key={op.key} button onClick={this.openPop(index)}>
                  <ListItemIcon>{op.icon}</ListItemIcon>
                  <ListItemText primary={op.key} />
                </ListItem>
              )
            )}
          </List>
        </Drawer>
        {this.operations.map((op, index) => op.dialog(op.key, index))}
      </div>
    );
  }
}

export default withStyles(styles)(Sidebar);
