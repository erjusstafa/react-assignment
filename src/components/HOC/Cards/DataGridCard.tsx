import React from 'react';
import { Grid, Typography, Card, CardContent, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { infoIconStyle } from '../../Dashboards/Market/styles/style';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridRowId,
  GridSelectionModel,
} from '@mui/x-data-grid';
import { DataGridCardPropTypes } from 'src/interfaces/iproptypes';
import {
  COLOR_GREEN,
  COLOR_GREY,
  COLOR_ORANGE,
  COLOR_RED,
  COLOR_TOOLTIP_BACKGROUND,
} from 'src/const';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
      display: 'none',
    },
  },
  dataGridContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dataGridHeaderText: {
    fontSize: 17,
  },
  iconButton: {
    padding: 5,
  },
}));

const DataGridCard = ({
  cardTitle,
  rowData,
  colData,
  height,
  customClasses,
  tooltip,
  deletedRows,
  setDeletedRows,
}: DataGridCardPropTypes) => {
  const classes = useStyles();
  const dataGridStyle = { height: height, width: '100%' };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ allColumns: true }} />
      </GridToolbarContainer>
    );
  };

  const CustomTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: COLOR_TOOLTIP_BACKGROUND,
      color: 'rgba(0, 0, 0, 0.87)',
      width: 600,
      fontSize: theme.typography.pxToRem(12),
      fontWeight: 500,
      border: '1px solid #dadde9',
      margin: '5px',
    },
  }))(Tooltip);

  const handleRowSelection = (model: GridSelectionModel) => {
    if (setDeletedRows) {
      let selectedRows: number[] = [];
      model.forEach((id: GridRowId, index: number, array: GridRowId[]) => {
        selectedRows.push(rowData[id].listingID as number);
      });
      setDeletedRows(selectedRows);
    }
  };

  return (
    <Grid className={classes.dataGridContainer}>
      <Card>
        <CardContent>
          <Typography className={classes.dataGridHeaderText} gutterBottom>
            {cardTitle}
            {tooltip && (
              <CustomTooltip
                title={
                  <React.Fragment>
                    <Grid>
                      <Typography>
                        <span style={{ color: COLOR_ORANGE }}>Orange-colored</span> cells represent
                        booked nights.
                      </Typography>
                      <Typography>
                        <span style={{ color: COLOR_GREEN }}>Green-colored cells</span> represent
                        available nights.
                      </Typography>
                      <Typography>
                        <span style={{ color: COLOR_GREY }}>Grey-colored</span> cells represent
                        blocked (unavailable) nights.
                      </Typography>
                      <Typography>
                        <span style={{ color: COLOR_RED }}>Red-colored</span> cells represent
                        recently booked nights (Within 24 hours).
                      </Typography>
                      <Typography>Arrow represents that the price was changed recently.</Typography>
                      <Typography>
                        (100 -{'>'} 90 represents that the rate was dropped to 90 from 100 in last
                        24 hours.)
                      </Typography>
                    </Grid>
                  </React.Fragment>
                }
              >
                <IconButton className={classes.iconButton}>
                  <InfoOutlinedIcon style={infoIconStyle} />
                </IconButton>
              </CustomTooltip>
            )}
          </Typography>

          <div style={dataGridStyle} className={customClasses?.root}>
            {cardTitle.includes('Competitive') ? (
              <DataGrid
                className={classes.root}
                rows={rowData}
                columns={colData}
                components={{
                  Toolbar: CustomToolbar,
                }}
                // disableColumnFilter
                checkboxSelection
                onSelectionModelChange={handleRowSelection}
              />
            ) : (
              <DataGrid
                rows={rowData}
                columns={colData}
                components={{
                  Toolbar: CustomToolbar,
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DataGridCard;
