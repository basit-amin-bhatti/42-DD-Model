import { Component, Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import House from './House.jsx';
import Navigation from './Navigation.jsx';
import LabelProjector from './LabelProjector.jsx';
import Lighting from '../rendering/Lighting.jsx';
import { MaterialProvider } from '../rendering/Materials.jsx';
import { useProgress } from '@react-three/drei';
class SceneError extends Component {
  state={error:null};
  static getDerivedStateFromError(error){return {error};}
  render(){return this.state.error?<div className="scene-failure"><h2>3D view could not start</h2><p>{this.state.error.message}</p><p>Reload the viewer or select Balanced rendering if your browser cannot support the effects.</p><button onClick={()=>window.location.reload()}>Reload viewer</button></div>:this.props.children;}
}
function RendererSettings({options}){const {gl,scene}=useThree();useEffect(()=>{gl.toneMappingExposure=options.exposure||1.1;gl.shadowMap.type=THREE.PCFSoftShadowMap;scene.background=new THREE.Color(options.lighting==='evening'?'#53606b':'#e3e5e4');},[gl,scene,options.exposure,options.lighting]);return null;}
function FrameRate({onReport}){const sample=useRef({time:0,frames:0});useFrame((_,delta)=>{const s=sample.current;if(delta>.25){s.time=0;s.frames=0;return;}s.time+=delta;s.frames++;if(s.time>2){onReport?.(Math.round(s.frames/s.time));s.time=0;s.frames=0;}});return null;}
function AssetLoading(){const {active,progress}=useProgress();return active&&<div className="asset-loading" role="status"><p>Preparing your house</p><small>Loading local materials · {Math.round(progress)}%</small><div className="asset-progress"><span style={{width:`${progress}%`}}/></div></div>;}
export default function Scene(props){const baseY=props.options.explode?-7.4:-3.69,high=props.options.quality==='high',dpr=props.handheld?(high?1.5:1):(high?1.75:1.2);return <SceneError><Canvas frameloop="demand" shadows dpr={[1,dpr]} camera={{position:[28,28,40],fov:38,near:.05,far:240}} gl={{antialias:false,powerPreference:'high-performance',preserveDrawingBuffer:true,toneMapping:THREE.NoToneMapping,outputColorSpace:THREE.SRGBColorSpace}}>
  <RendererSettings options={props.options}/>
  <FrameRate onReport={props.onFrameRate}/>
  <Suspense fallback={null}><MaterialProvider><Lighting {...props}/><House {...props}/><Navigation {...props}/><LabelProjector {...props}/></MaterialProvider></Suspense>
  {props.options.referenceGrid&&<gridHelper args={[75,75,'#b8bdb5','#ccd0c7']} position={[5,baseY+.02,10]}/>}
  <mesh rotation={[-Math.PI/2,0,0]} position={[5,baseY,10]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#b7b4a8" roughness={1}/></mesh>
  <EffectComposer multisampling={high?4:2} depthBuffer>
    <N8AO halfRes={!high} quality={high?'high':'performance'} aoRadius={.32} distanceFalloff={.8} intensity={1.15} color="#342f29"/>
    <Bloom intensity={.12} luminanceThreshold={1.1} luminanceSmoothing={.35} mipmapBlur/>
    <ToneMapping mode={ToneMappingMode.AGX}/>
    <Vignette offset={.25} darkness={.12}/>
  </EffectComposer>
</Canvas><AssetLoading/></SceneError>;}
