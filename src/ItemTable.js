import React from 'react';

import classNames from 'classnames';

import { AutoSizer, Table, Column, SortDirection } from 'react-virtualized';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { withStyles } from '@material-ui/core/styles';

import { EDIT_ITEM, FOCUS_ITEM } from './actions';

const itemTableWidth = '75%';

const styles = theme => ({
  container: {
    overflowY: 'scroll',
    flex: '1 1 auto',
    height: '100vh',
    width: itemTableWidth,
  },
  table: {
    square: true,
    fontFamily: theme.typography.fontFamily,
  },
  flexible: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
  toolbar: theme.mixins.toolbar,
});

class ItemTable extends React.PureComponent {
  state = {
    sortBy: undefined,
    sortDirection: undefined,
    focusedAttr: null,
    focusedIndex: null,
    editing: false,
  };

  direction = {
    [SortDirection.ASC]: 'asc',
    [SortDirection.DESC]: 'desc'
  };

  alignment = type => {
    switch (type) {
      case 'string':
        return 'left'
      case 'int':
        return 'right'
      case 'float':
        return 'right'
      case 'bool':
        return 'right'
      default:
        return 'center'
    }
  };

  stringify = (data, type) => {
    switch (type) {
      case 'string':
        return data
      case 'int':
        return data
      case 'bool':
        return data ? '✅' : '  ';
      case 'float':
        return data
      default:
        return data
    }
  }

  sortFunc = ({sortBy, sortDirection}) => {
    const sortAsc = (a, b) => {
      if (a[sortBy] < b[sortBy]) { return -1; }
      if (a[sortBy] > b[sortBy]) { return 1; }
      return 0;
    };

    const sortDesc = (a, b) => {
      if (a[sortBy] > b[sortBy]) { return -1; }
      if (a[sortBy] < b[sortBy]) { return 1; }
      return 0;
    };

    switch (sortDirection) {
      case SortDirection.ASC:
        this.props.rows.sort(sortAsc);
        break;
      case SortDirection.DESC:
        this.props.rows.sort(sortDesc);
        break;
      default:
        break;
    }
    this.setState({sortBy, sortDirection});
  };

  headerRenderer = ({ columnIndex, dataKey, sortBy, sortDirection }) => {
    const { classes, cols, headerHeight } = this.props;

    return (
      <TableCell
        component="div"
        className={classNames(
          classes.tableCell,
          classes.flexible,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={this.alignment(cols[columnIndex].type)}
      >
        <TableSortLabel
          active={dataKey === sortBy}
          direction={this.direction[sortDirection]}
        >
          {cols[columnIndex].label}
        </TableSortLabel>
      </TableCell>
    );
  };

  cellRenderer = ({ cellData, columnIndex, rowIndex }) => {
    const { classes, cols, onRowClick, rowHeight, dispatch } = this.props;

    var data = undefined;
    if (this.state.editing &&
       (this.state.focusedAttr === cols[columnIndex].key) &&
       (this.state.focusedIndex === rowIndex)) {
      data = (
        <TextField
          autoFocus
          defaultValue={cellData}
          onBlur={(event) => {
            dispatch({
              type: EDIT_ITEM,
              index: this.state.focusedIndex,
              attr: this.state.focusedAttr,
              value: event.target.value
            });
            this.setState({editing: false, focusedAttr: null, focusedIndex: null})
          }}
        />
      );
    }
    else {
      data = this.stringify(cellData, cols[columnIndex].type);
    }

    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexible, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={this.alignment(cols[columnIndex].type)}
      >
        {data}
      </TableCell>
    );
  };

  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;

    return classNames(classes.tableRow, classes.flexible, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  TableBody = (height, width) => {
    const { classes, dispatch, cols, rows } = this.props;
    const {headerHeight, rowHeight } = this.props;

    return (
      <Table
        className={classes.table}
        width={width}
        height={height}
        headerHeight={headerHeight}
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        rowHeight={rowHeight}
        sort={this.sortFunc}
        sortBy={this.state.sortBy}
        sortDirection={this.state.sortDirection}
        rowClassName={this.getRowClassName}
        onRowClick={event =>
          dispatch({type: FOCUS_ITEM, value: event.rowData.title})
        }
        onRowDoubleClick={({ event, index, rowData }) => {
          this.setState({focusedIndex: index, editing: true});
        }}
        onColumnClick={({ columnData, dataKey, event }) => {
          this.setState({focusedAttr: dataKey});
        }}
      >
        {cols.map((props, index) => (
          <Column
            className={classNames(classes.flexible, props.className)}
            key={props.key}
            dataKey={props.key}
            headerRenderer={
              props => this.headerRenderer({...props, columnIndex: index})
            }
            cellRenderer={this.cellRenderer}
            {...props}
          />
        ))}
      </Table>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.container}>
        <div className={classes.toolbar} />
        <AutoSizer>
          {({ height, width }) => this.TableBody(height-64, width)}
        </AutoSizer>
      </Paper>
    );
  }
}

ItemTable.defaultProps = {
  headerHeight: 28,
  rowHeight: 28
};

export default withStyles(styles)(ItemTable);
