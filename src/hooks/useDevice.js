import { useEffect, useState } from 'react';
export default function useDevice(){
  const read=()=>({compact:matchMedia('(max-width: 1024px)').matches,touch:matchMedia('(pointer: coarse)').matches});
  const [device,setDevice]=useState(read);
  useEffect(()=>{const queries=['(max-width: 1024px)','(pointer: coarse)'].map(q=>matchMedia(q));const update=()=>setDevice(read());queries.forEach(q=>q.addEventListener('change',update));return()=>queries.forEach(q=>q.removeEventListener('change',update));},[]);
  return {...device,handheld:device.compact||device.touch};
}
