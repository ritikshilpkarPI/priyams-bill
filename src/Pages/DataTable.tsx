import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Paper, CircularProgress, Box } from '@mui/material';

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowCount,
  paginationMode = 'client',
  onRowClick
}) => {
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.key,
    headerName: col.label,
    sortable: col.sortable ?? true,
    align: "center",
    headerAlign: "center",
    cellClassName:col?.cellClassName || '',
    ...(col.key === 'actions'
      ? {
          flex: 0,
          minWidth: 400,
        }
      : col.key === 'share'
      ? {
          flex: 0,
          minWidth: 200,
        }
      : {
          minWidth: 150,
          flex: 1,
        }),
    
    renderCell: col.render
      ? (params: GridRenderCellParams<any, any>) => col.render?.(params.row)
      : undefined,
  }));
  

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      {isLoading ? (
        <CircularProgress sx={{ m: 2 }} />
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ }}> 
            <DataGrid
              autoHeight
              columns={gridColumns}
              
              rows={data}
              getRowId={(row) =>
                row.id || row._id || row.key || JSON.stringify(row)
              }
              onRowClick={onRowClick}
              rowCount={
                paginationMode === 'server' ? rowCount ?? 0 : data.length
              }
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
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
