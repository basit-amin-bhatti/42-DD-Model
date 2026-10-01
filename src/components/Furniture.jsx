import { useMemo } from 'react';
import { Blocks } from './Primitives.jsx';
import { furnishRoom, openKitchenParts } from '../lib/furnishing.js';
export function Furniture({rooms}){const items=useMemo(()=>rooms.flatMap(furnishRoom),[rooms]);return <Blocks items={items}/>;}
export function OpenKitchen(){const items=useMemo(openKitchenParts,[]);return <Blocks items={items}/>;}
