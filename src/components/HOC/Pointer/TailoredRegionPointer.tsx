import React from 'react';
import FiberManualRecordSharpIcon from '@material-ui/icons/FiberManualRecordSharp';
import { COLOR_PRIMARY, COLOR_ACCENT_1 } from 'src/const';
import { TailoredRegionMarkers } from 'src/interfaces/idashboard';
import HomeSharpIcon from '@material-ui/icons/HomeSharp';

const TailoredRegionPointer = ({
  lat,
  lng,
  data,
}: {
  lat: number;
  lng: number;
  data: TailoredRegionMarkers;
}) => {
  return (
    <>
      {data.room_type == 'entire_home' ? (
        <FiberManualRecordSharpIcon style={{ fontSize: 14, color: COLOR_PRIMARY }} />
      ) : data.room_type.includes('private') ? (
        <FiberManualRecordSharpIcon style={{ fontSize: 14, color: '#F4B400' }} />
      ) : data.room_type.includes('center') ? (
        <HomeSharpIcon style={{ fontSize: 30, color: COLOR_ACCENT_1 }} />
      ) : (
        <FiberManualRecordSharpIcon style={{ fontSize: 14, color: '#DB4437' }} />
      )}
    </>
  );
};

export default React.memo(TailoredRegionPointer);
