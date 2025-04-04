import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Paper, CircularProgress } from '@mui/material';

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  isLoading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowCount,
  paginationMode = 'client',
}) => {
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.key,
    headerName: col.label,
    sortable: col.sortable ?? true,
    flex: 1,
    renderCell: col.render
      ? (params: GridRenderCellParams<any, any>) => col.render?.(params.row)
      : undefined,
  }));

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      {isLoading ? (
        <CircularProgress sx={{ m: 2 }} />
      ) : (
        <DataGrid
          columns={gridColumns}
          rows={data}
          getRowId={(row) =>
            row.id || row._id || row.key || JSON.stringify(row)
          }
          rowCount={paginationMode === 'server' ? (rowCount ?? 0) : data.length}
          paginationMode={paginationMode}
          paginationModel={{
            pageSize: rowsPerPage,
            page: page,
          }}
          onPaginationModelChange={({ page, pageSize }) => {
            onPageChange?.(null, page);
            onRowsPerPageChange?.({
              target: { value: String(pageSize) },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
        />
      )}
    </Paper>
  );
};

export default ReusableTable;
