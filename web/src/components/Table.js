import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import TableFooter from './TableFooter';
import { debounceSearchRender } from './table/DebounceTableSearchRender';

const theme = (maxHeight, props = {}) => {
  const { cell = {} } = props;
  const cellStyle = Object.assign({
    maxWidth: 180,
    minWidth: 32,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    padding: '4px 4px 4px 8px',
    cursor: 'pointer',
    fontSize: 12,
  }, cell);

  // calc(100vh - 170px)
  const scrollMaxHeightCss = `${maxHeight ? maxHeight : 'calc(100vh - 115px)'} !important`;
  console.log(scrollMaxHeightCss);

  return createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        root: {
          // padding: '0px 8px 0px 8px',
        },
      },
      MUIDataTable: {
        paper: {
          padding: 0,
        },
        responsiveScrollMaxHeight: {
          height: scrollMaxHeightCss,
          maxHeight: scrollMaxHeightCss,
        },
      },
      MUIDataTableHeadCell: {
        root: {
          ...cellStyle,
          fontWeight: 'bold',
        },
      },
      MUIDataTableBodyCell: {
        root: cellStyle,
      },
      MUIDataTableSelectCell: {
        expandDisabled: {
          // Soft hide the button.
          visibility: 'hidden',
        },
      },
      MUIDataTableFilter: {
        root: {
          minWidth: 400,
        },
      },
    },
  });
};

console.log(theme);

function Table({ title, description, data, columns, options, nested = false, themeProps, maxHeight }) {
  const onItemClick = (rowData, rowMeta) => {
    const item = data[rowMeta.dataIndex];
    console.log(item);
  };

  // overwrite options
  const updatedOptions = Object.assign({
    pagination: true,
    responsive: nested ? 'stacked' : 'scrollMaxHeight',
    rowsPerPageOptions: nested ? [5, 20, 100] : [10, 20, 100],
    rowsPerPage: nested ? 5 : 20,
    filterType: 'multiselect',
    fixedHeader: true,
    resizableColumns: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onRowClick: onItemClick,
    print: true,
    customSearchRender: debounceSearchRender(500),
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
      return (
        <TableFooter
          description={description}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          textLabels={textLabels} />
      );
    },
  }, options);

  return (
    <MuiThemeProvider theme={theme(maxHeight, themeProps)}>
      <MUIDataTable
        className="data-table"
        title={title}
        data={data}
        columns={columns}
        options={updatedOptions}
      />
    </MuiThemeProvider>
  );
}

Table.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  options: PropTypes.object,
  nested: PropTypes.bool,
  themeProps: PropTypes.object,
  maxHeight: PropTypes.string,
};

export default Table;
