import React from 'react';
import { StationDetail } from '../api/aqi';
import { Card, Typography } from '@mui/material';

const AQCard = ({ stationDetail }: { stationDetail: StationDetail }): JSX.Element => {
  return (
    <Card variant="outlined" sx={{width: 300, minHeight: 100}}>
      <Typography >
        {stationDetail.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {stationDetail.geo.join(',')}
      </Typography>
      <Typography variant="h5" component="div">
        {stationDetail.aqi}
      </Typography>
    </Card>
  );
}

export default AQCard;