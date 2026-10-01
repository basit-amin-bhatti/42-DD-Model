# DHA Residence — local architectural viewer

A React + React Three Fiber / Three.js reconstruction of the three supplied floor-plan photographs. **Everything runs locally. No site, deployment, hosted model, CDN, analytics or remote runtime assets are used.**

## Run

Requires Node.js 22.12+ (tested here with Node 24).

```powershell
npm.cmd install
npm.cmd run dev
```

Open **http://127.0.0.1:5173/**. The development server is bound to loopback only. `npm.cmd run build` creates the local production build in `dist`; `npm.cmd run preview` serves that build locally at port 4173.

## Explore

- **Basement / Ground / First:** enter a floor study with upper levels and ceilings hidden. Coordinates and stairs share one vertical datum.
- **3D view:** drag to orbit, scroll to zoom, right-drag to pan. The building icon shows the complete exterior; the focus icon restores inspection mode.
- **Top view:** overhead view of the active level, with real stairwell and entrance slab openings.
- **Walk:** click the canvas, then use **WASD / arrow keys + mouse**. **Shift** increases speed. **Escape** releases the mouse. Where an embedded browser declines pointer lock, click to activate movement and **drag to look**. Follow the stairs to change floors, use level buttons to start at a landing, or choose **Enter room** from a room card.
- **Phones / tablets:** use the full-screen Explore / Plan / Walk bar and the three floor buttons. In Walk, hold the left thumb control to move and swipe the model to look. Rooms provides quick entry; Settings holds the display controls and other tools. Pinch to zoom in Explore.
- **Model display:** toggle cut walls, upper floors, ceilings, labels and furniture. More options include door position, the site, and exploded levels.
- Click a room or its mini-map polygon to see written dimensions, geometric extents and local uncertainties. **Reference plans** opens the original three local JPEGs.
- **Save image** downloads a PNG of the current 3D canvas. Fullscreen is also available.
- **Atmosphere:** daylight/evening lighting, exposure and Balanced/High detail rendering. Interior lighting can be disabled independently. The render readout reports measured frame rate during continuous interaction. The renderer rests when idle.

The completed visual upgrade is documented in [docs/VISUALIZATION-UPGRADE.md](docs/VISUALIZATION-UPGRADE.md). It adds local PBR finishes, furnished interiors, curtains, electrical fittings, ceiling details, lights and landscaping while preserving both architectural source files byte-for-byte.

Mobile controls and rendering changes are documented in [docs/MOBILE-WALKTHROUGH.md](docs/MOBILE-WALKTHROUGH.md).

## Accuracy and assumptions

Source feet/inches are authored in `src/data/house.js`; rendering and cameras use metres. Legible principal room dimensions are preserved. Photograph proportions are used only to place details absent from the dimension schedule.

Read `docs/PLAN-RECONSTRUCTION.md` and the in-app **Measurements & assumptions** panel. Heights, wall thicknesses, stair details, roof/facade, most openings and furniture are provisional because no sections, elevations or opening schedules were supplied. The 50 ft assumed plot width conflicts with the apparent combined front lawn/driveway labels; that inconsistency is explicitly recorded. Amber notes identify irregular or unclear room geometry. This is a navigable architectural study, not a surveyed or construction-certified model.

## Project structure

```text
public/plans/                 Original supplied JPEGs, unchanged
src/data/house.js             Feet-based dimensions, rooms, outlines, holes and assumptions
src/lib/architecture.js       Shared partitions, physical openings, stairs, support and collisions
src/components/House.jsx      Walls, glazing, slabs, terraces, railings, site and stairs
public/materials/             Local CC0 PBR maps, HDR and source/checksum manifest
src/lib/furnishing.js          Detailed procedural furnishings and door clearances
src/lib/furniture-collision.js Furniture collision and safe room arrivals
src/rendering/Materials.jsx    Shared PBR materials with metric texture mapping
src/rendering/Lighting.jsx     HDR, sunlight and budgeted indoor area lighting
src/components/Furniture.jsx   Instanced furnished interiors
src/components/InteriorDetails.jsx Curtains, ceilings, fittings and local mirror
src/components/Landscape.jsx   Plants, trees and landscape details
src/components/Primitives.jsx Instanced geometry and cached slab meshes
src/components/Navigation.jsx Orbit and first-person controls
src/components/LabelProjector.jsx Camera-projected DOM labels
src/components/MiniMap.jsx    Clickable plan locator and live walking position
src/components/Scene.jsx      WebGL canvas, lighting and renderer error boundary
src/App.jsx                  Explorer UI, room cards, source drawings and dimension schedule
tests/                       Dimensions, openings, stair continuity room-access and touch-input checks
```

Furniture, wall parts, railings and stairs use shared instanced geometry; slab meshes and materials are cached. Distant batches use simpler rounded/spherical geometry. Pixel ratio is capped at 1.2 in Balanced and 1.75 in High detail on desktop, and 1 / 1.5 on handheld layouts. The UI and 3D engine load separately; frames render on demand. All textures and the environment load from the local project. Transparent glazing is batched separately.

## Verification

```powershell
npm.cmd test
npm.cmd run build
```

Tests exercise source room sizes, floor datums, aligned stair geometry, ascent/descent between all levels, real voids, closed-door/window collision, safe spawns and room connectivity. Browser checks cover all floor selectors, overhead and exterior views, furniture/ceiling controls, room information, source drawings, WASD movement, mouse look and Escape behavior.

The walkthrough uses a 1.68 m eye height, 62° vertical field of view, damped acceleration/mouse look and smoothed stair elevation. Furniture collision uses the same descriptors as the rendered objects; door clearances stay open, and room entry selects an unoccupied point. Hide furniture for unobstructed inspection. The controller preserves wall/closed-door collision and unsupported void protection; it is not a general rigid-body physics simulation.
