import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowCount,
  expandedRows,
  onToggleExpand,
}) => {
  const gridColumns: GridColDef[] = [
    ...(expandedRows
      ? [
          {
            field: 'expand',
            headerName: '',
            width: 50,
            renderCell: (params: GridRenderCellParams) => {
              console.log(params.row.isSubRow);
              console.log({ expandedRows });

              if (params.row.isSubRow) return null;

              const isExpanded =
                expandedRows?.includes(params.row._id) ?? false;
              console.log(params.row.isSubRow);

              return (
                <IconButton
                  size="small"
                  onClick={() => onToggleExpand?.(params.row._id)}
                >
                  {isExpanded ? (
                    <Remove fontSize="small" />
                  ) : (
                    <Add fontSize="small" />
                  )}
                </IconButton>
              );
            },
          },
        ]
      : []),
    ...columns.map((col) => ({
      field: col.key,
      headerName: col.label,
      sortable: col.sortable ?? true,
      renderCell: (params: GridRenderCellParams) => {
        const value = col.render ? col.render(params.row) : params.value;
        return (
          <Box
            pl={params.row.isSubRow ? 4 : 1}
            display="flex"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      },
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
          : col.key === 'transactionId'
            ? {
                flex: 0,
                minWidth: 250,
              }
            : {
                minWidth: 150,
                flex: 1,
              }),
    })),
  ];

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      {isLoading ? (
        <CircularProgress sx={{ m: 2 }} />
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <DataGrid
            autoHeight
            columns={gridColumns}
            rows={data}
            getRowId={(row) => row._id}
            rowCount={data.length}
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
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold', 
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
