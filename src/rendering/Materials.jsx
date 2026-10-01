import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import assets from '../data/material-assets.json';
export const PALETTE={wall:'#f3efe7',cap:'#c2b7a7',stone:'#ece7df',slab:'#c3b9a9',wood:'#b28c65',darkwood:'#4a3326',fabric:'#e9dfcf',sage:'#a1afa0',dark:'#242827',metal:'#333937',glass:'#eef6f6',white:'#faf9f4',tile:'#e8e6e0',water:'#92b2ba',grass:'#728052',court:'#b8b3a4',asphalt:'#9c9c92',roof:'#e5e0d7',brass:'#bfa06c',chrome:'#e0e5e4',linen:'#eee7db',leather:'#9a6b49',ceramic:'#faf9f5',rug:'#cfc3b0',oak:'#c8ac82',marble:'#f4f0e9',cabinet:'#e4dfd4',leaf:'#526c37',leafLight:'#7e9854',leafDark:'#354b29',soil:'#3a2a1e',emissive:'#ffe5bd',screen:'#111a1f',car:'#c5c9c8',black:'#161b1b'};
const Context=createContext(null);
const entries=assets.assets.flatMap(a=>Object.entries(a.maps).map(([type,m])=>({id:a.id,type,url:`/materials/${m.file}`}))).filter(e=>!(e.id==="fabric_pattern_07"&&e.type==="diff"));
function metricUV(material,scale){
  material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
    vec4 finishPosition = vec4(transformed, 1.0);
    vec3 finishNormal = objectNormal;
    #ifdef USE_INSTANCING
      finishPosition = instanceMatrix * finishPosition;
      finishNormal = mat3(instanceMatrix) * finishNormal;
    #endif
    finishPosition = modelMatrix * finishPosition;
    finishNormal = normalize(mat3(modelMatrix) * finishNormal);
    vec3 finishAxis = abs(finishNormal);
    vec2 finishUV = finishAxis.y > max(finishAxis.x,finishAxis.z) ? finishPosition.xz : (finishAxis.x > finishAxis.z ? finishPosition.zy : finishPosition.xy);
    finishUV /= ${Number(scale).toFixed(5)};
    #ifdef USE_MAP
      vMapUv = finishUV;
    #endif
    #ifdef USE_NORMALMAP
      vNormalMapUv = finishUV;
    #endif
    #ifdef USE_ROUGHNESSMAP
      vRoughnessMapUv = finishUV;
    #endif
  `);};
  material.customProgramCacheKey=()=>`metric-finish-${scale}`;
}
export function MaterialProvider({children}){
  const {gl}=useThree();
  const loaded=useLoader(THREE.TextureLoader,entries.map(e=>e.url));
  const library=useMemo(()=>{
    const textures=new Map(),cache=new Map();
    entries.forEach((entry,i)=>{const t=loaded[i];t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=entry.type==='diff'?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());textures.set(`${entry.id}/${entry.type}`,t);});
    const set=id=>({map:textures.get(`${id}/diff`),roughnessMap:textures.get(`${id}/rough`),normalMap:textures.get(`${id}/nor_gl`)});
    const wood=set('wood_floor'),marble=set('marble_01'),fabric=set('fabric_pattern_07'),plaster=set(assets.assets.find(a=>/plaster/.test(a.id)).id),grass=set('aerial_grass_rock');
    const spec={
      wall:{...plaster,color:'#fffdf8',roughness:.92,normalScale:new THREE.Vector2(.065,.065),scale:2},
      wood:{...wood,color:'#d4b28b',roughness:.55,normalScale:new THREE.Vector2(.2,.2),scale:2.3,clearcoat:.15},
      oak:{...wood,color:'#f4e7d0',roughness:.52,normalScale:new THREE.Vector2(.14,.14),scale:2.3,clearcoat:.15},
      darkwood:{...wood,color:'#806348',roughness:.45,normalScale:new THREE.Vector2(.14,.14),scale:2.3},
      stone:{...marble,color:'#fffaf2',roughness:.62,normalScale:new THREE.Vector2(.18,.18),scale:3.2,clearcoat:.12},
      marble:{...marble,color:'#ffffff',roughness:.3,normalScale:new THREE.Vector2(.06,.06),scale:3.2,clearcoat:.35,clearcoatRoughness:.12},
      tile:{...marble,color:'#eeece8',roughness:.45,normalScale:new THREE.Vector2(.1,.1),scale:2.6},
      fabric:{normalMap:fabric.normalMap,roughnessMap:fabric.roughnessMap,roughness:1,normalScale:new THREE.Vector2(.2,.2),sheen:1,sheenColor:new THREE.Color('#f9f1e2'),sheenRoughness:.8,scale:.3},
      linen:{normalMap:fabric.normalMap,roughnessMap:fabric.roughnessMap,roughness:1,normalScale:new THREE.Vector2(.15,.15),sheen:.7,scale:.22},
      sage:{normalMap:fabric.normalMap,roughnessMap:fabric.roughnessMap,roughness:.98,normalScale:new THREE.Vector2(.16,.16),sheen:.7,scale:.3},
      rug:{normalMap:fabric.normalMap,roughness:1,normalScale:new THREE.Vector2(.4,.4),sheen:.5,scale:.25},
      leather:{roughness:.5,clearcoat:.2,clearcoatRoughness:.4},metal:{metalness:.9,roughness:.3},brass:{metalness:.88,roughness:.26},chrome:{metalness:1,roughness:.12},
      glass:{color:'#edf5f4',metalness:0,roughness:.07,transparent:true,opacity:.2,depthWrite:false,ior:1.5,clearcoat:1,clearcoatRoughness:.04,side:THREE.DoubleSide,envMapIntensity:1.8},
      ceramic:{roughness:.17,clearcoat:1,clearcoatRoughness:.09},white:{roughness:.32,clearcoat:.25},cabinet:{roughness:.42,clearcoat:.15},
      grass:{...grass,color:'#b9c59a',roughness:1,normalScale:new THREE.Vector2(.4,.4),scale:3},
      court:{...plaster,roughness:.95,normalScale:new THREE.Vector2(.15,.15),scale:2.5},roof:{...plaster,roughness:.92,normalScale:new THREE.Vector2(.1,.1),scale:3},
      leaf:{roughness:.55,side:THREE.DoubleSide},leafLight:{roughness:.6,side:THREE.DoubleSide},leafDark:{roughness:.6,side:THREE.DoubleSide},
      screen:{roughness:.14,metalness:.15,emissive:'#253b43',emissiveIntensity:.12},
      emissive:{emissive:'#ffdeb2',emissiveIntensity:3.5,toneMapped:false,roughness:.5},car:{metalness:.65,roughness:.25,clearcoat:1,clearcoatRoughness:.08},
    };
    return {get(name='wall',tint='#ffffff'){
      const key=`${name}|${tint}`;if(cache.has(key))return cache.get(key);
      const settings=spec[name]||{}, {scale,...parameters}=settings;
      const color=new THREE.Color(parameters.color||PALETTE[name]||(name.startsWith('#')?name:'#f0ebe2')).multiply(new THREE.Color(tint));
      const m=new THREE.MeshPhysicalMaterial({roughness:.8,envMapIntensity:1,...parameters,color});if(scale)metricUV(m,scale);cache.set(key,m);return m;
    },dispose(){cache.forEach(m=>m.dispose());}};
  },[loaded,gl]);
  useEffect(()=>()=>library.dispose(),[library]);
  return <Context.Provider value={library}>{children}</Context.Provider>;
}
export function useMaterials(){const value=useContext(Context);if(!value)throw Error('MaterialProvider missing');return value;}
