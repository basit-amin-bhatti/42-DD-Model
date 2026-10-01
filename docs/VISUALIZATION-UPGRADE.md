# Local architectural visualization upgrade

## Architectural preservation

`src/data/house.js` and `src/lib/architecture.js` are unchanged. Their original SHA-256 checksums are checked by `tests/structure-preservation.test.js`. Room coordinates, clear dimensions, walls, opening positions, slabs, voids, floor datums and stair profiles remain the approved model. Original unresolved measurements remain documented in PLAN-RECONSTRUCTION.md and the source-plan panel.

Interior and landscape additions are decorative finish selections, since the drawings provide no finish schedule or interior elevations. They should not be interpreted as newly supplied architectural measurements. Modular cabinetry omits sections that intersect the inward clearance of an existing doorway or open passage. False ceilings sit inside the existing 10 ft clear height. Curtains flank existing windows. No new architectural openings were introduced.

## Furnishing and finishes

- All bedroom levels: framed beds, upholstered headboards, mattress/duvet/pillows, bedside cabinets, lamps, benches, rugs, seating and plants.
- Living and drawing/dining spaces: upholstered sofas and cushions, marble coffee tables, books/vases, television consoles, dining chairs and place settings.
- Kitchens: modular base/wall cabinets, hardware, stone counters, sink/faucet, cooktop, oven, hood, fridge and the existing first-floor open kitchen. The source's island annotation controls island placement.
- Bathrooms: vanity, ceramic fixtures, basin/faucet, shower screen, shower fittings, drain, mirror and towel rail. Wardrobes, shelves, office furniture and terrace barbecue fittings are also included.
- Window dressing, wall-mounted switches/sockets, framed artwork, downlights, cove strips, ceiling fittings and a stair-hall pendant.
- Local lawn finish, paving joints, planters, clustered trees, hedges, bollards and detailed car silhouettes within the existing site/porch geometry.

Wood, marble/tile, plaster, woven fabric and ground finishes use local PBR normal and roughness maps. Colour maps use sRGB; data maps remain linear. Finishes use world-space metric UVs so long walls and differently sized furnishings do not stretch a single texture over their whole surface. Fabric colour is deliberately neutral; only the source fabric's normal/roughness maps are used. Physical material settings supply metallic hardware, ceramic clearcoat, fabric sheen and glass/environment reflections.

## Light and reflections

The local 2K HDR environment supplies indirect illumination/reflections. A warm directional sun supplies shadowed daylight. Hemisphere fill, low ambient fill and budgeted rectangular ceiling emitters provide an approximation of bounced indoor illumination. Daylight and Evening presets change the light balance. AgX tone mapping, adjustable exposure, restrained bloom, screen-space ambient occlusion and soft-filtered sun shadows finish the image.

This is **real-time raster rendering with GI-style fill**, not a path-traced, physically converged global-illumination renderer. Indoor area emitters do not cast individual shadows. Glass uses a lightweight reflective transparent physical finish rather than expensive multi-layer refraction. High detail enables one 256 px planar bathroom mirror close to the camera. These choices keep the interactive walkthrough responsive; they are practical limits of this version's realism.

## Navigation

Eye height: 5.5 ft / 1.676 m. Walking FOV: 62° vertically. Normal speed: 4.5 ft/s; Shift: 9 ft/s. Velocity accelerates/decelerates smoothly; mouse look and stair eye elevation are damped. Physical floor support remains the approved stair/slab algorithm. Movement is subdivided to avoid tunnelling through partitions. A quick key tap still produces a small step.

Furniture collision uses rotated footprint volumes generated from the same furniture descriptors. It excludes rugs, small fittings and overhead cabinets. Safe room entry searches supported, unoccupied points instead of placing the visitor inside a coffee table. Stair ascent/descent and safe floor landings are tested with furniture enabled. Pointer lock is used when supported; the embedded browser's fallback is click-to-activate WASD and drag-to-look. Escape releases control.

## Performance and local assets

Balanced: DPR ≤ 1.2, 1024 px sun shadow, half-resolution performance AO, two-sample anti-aliasing, up to six nearby room emitters. High detail: DPR ≤ 1.75, 2048 px sun shadow, full-resolution higher-quality AO, four samples, up to ten room emitters and the nearby mirror.

Instances share unit geometries/materials, surface meshes are cached, and distant object batches switch to simpler geometry. Texture anisotropy is capped at eight. Maps are 1K JPEG; the HDR is 2K. The viewer reports actual frame rate rather than assuming a hardware-independent target. Frame rate varies by GPU, viewport size, floor visibility and quality preset.

All runtime resources are local. No CDN, deployment, analytics or hosted platform is used. CC0 source attribution, original URLs, sizes and checksums are in `public/materials/manifest.json`. The assets come from Poly Haven: Wood Floor, Marble 01, Fabric Pattern 07, Plastered Wall 02, Aerial Grass Rock and Modern Buildings 2 HDR. `scripts/fetch-materials.mjs` can restore missing assets from their original provider and verifies their checksums; normal app use never needs that network step.

## Verification

`npm.cmd test` covers 13 checks: principal written room dimensions, aligned floor/stair datums, void support, wall/open-door/window collision, stair travel both directions, valid structural pieces, safe spawns, room connectivity, valid decorative geometry/safe room arrivals, furniture collision, furnished stair travel, local asset integrity and unchanged architectural source hashes.

`npm.cmd run build` creates the local production bundle in `dist`. Browser verification checks all levels, furnished eye-level views, day/evening lighting, quality selection, inspection/exterior/top views, room entry, WASD/drag look, ceiling controls and renderer errors. This upgrade does not resolve the provisional dimensional interpretations in the original reconstruction.
