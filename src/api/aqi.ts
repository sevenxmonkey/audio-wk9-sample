const TOKEN = '7b23ea8f27fff545470613749b91945feb6342f5';

export interface Station {
  uid: number,
  aqi: string,
  station: {
    name: string,
    time: string
  }
}

export interface StationDetail {
  geo: number[],
  uid: number,
  aqi: number,
  o3: number,
  pm10: number,
  pm25: number,
  name: string,
  time: string,
}

export async function getAllStations(pointA: string, pointB: string): Promise<Station[]> {
  const response = await fetch(`https://api.waqi.info/v2/map/bounds?latlng=${pointA},${pointB}&networks=all&token=${TOKEN}`);
  const responseData = await response.json();
  if (responseData.status === 'ok') {
    const stations = responseData.data as Station[];
    return stations;
  } else {
    const errorText = responseData.data as string;
    throw (new Error(errorText));
  }
}

export async function getStationDetail(uid: number): Promise<StationDetail> {
  const response = await fetch(`https://api.waqi.info/feed/@${uid}/?token=${TOKEN}`);
  const responseData = await response.json();
  if (responseData.status === 'ok') {
    const stationDetail = {
      geo: responseData?.data?.city?.geo,
      uid: responseData?.data?.idx,
      aqi: responseData?.data?.aqi,
      o3: responseData?.data?.iaqi?.o3?.v,
      pm10: responseData?.data?.iaqi?.pm10?.v,
      pm25: responseData?.data?.iaqi?.pm25?.v,
      name: responseData?.data?.city?.name,
      time: responseData?.data?.time?.iso,
    } as StationDetail;
    return stationDetail
  } else {
    const errorText = responseData.data as string;
    throw (new Error(errorText));
  }
}

export async function getAllStationDetails(pointA: string, pointB: string): Promise<StationDetail[]> {
  try {
    const coveredStations = await getAllStations(pointA, pointB);
    const uids = coveredStations.map(item => item.uid);
    const promises = uids.map(uid => getStationDetail(uid));
    const result = await Promise.all(promises);
    return result
  } catch (error) {
    throw (error);
  }
}