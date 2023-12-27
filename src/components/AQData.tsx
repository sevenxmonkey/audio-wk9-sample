import React, { useEffect, useState } from 'react';
import { StationDetail, getAllStationDetails } from '../api/aqi';
import AQCard from './AQCard';
import { Grid } from '@mui/material';

const pointA = '21.092759,121.475477';
const pointB = '31.896018,122.850068';

const AQData = (): JSX.Element => {

  const [data, setData] = useState<StationDetail[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAllStationDetails(pointA, pointB);
        console.log(result);
        setData(result);
      } catch (error) {
        setError((error as Error).message)
      }
      setLoading(false);
    }
    fetchData();
  }, [])

  return (
    <div>
      {isLoading && (<div>'Data loading...'</div>)}
      {error && (<div>{`Error: ${error}`}</div>)}
      <Grid container spacing={2}>
        {!!data.length && data.map((item) => <AQCard key={item.uid} stationDetail={item} />)}
      </Grid>
    </div>
  )
}

export default AQData;