# Mobile walkthrough

The local viewer now uses the full screen on phones and tablets up to 1024 CSS pixels wide. The house dimensions, architectural geometry, furnishings, PBR textures, lighting and effects are retained.

## Touch controls

- **Explore:** drag the house to orbit; pinch to zoom; use two fingers to pan.
- **Walk:** hold the left thumb control to move. Its distance from the centre controls speed; swipe anywhere on the model to look. Movement and look use independent pointer capture so they can be used together.
- **Basement / Ground / First:** tap to start at a safe landing. The active floor follows the walking elevation when using the stairs.
- **Rooms:** choose a space, review its dimensions, then tap **Enter room**. The camera enters at a clear point facing into the room.
- **Plan:** inspect the active floor from above.
- **Settings:** open display and atmosphere controls, reference drawings, model notes, exterior view, image export and fullscreen. Walking pauses while settings or room information is open.

Controls reset on cancellation, backgrounding and floor changes. Walls, closed doors, furnishings, stairs and unsupported voids use the existing collision system. Eye height and field of view are unchanged. Desktop keyboard/mouse controls remain available.

## Loading and rendering

The interface loads before the separately bundled 3D engine, with loading feedback for the scene and local assets. Rendering runs on demand: camera motion and interaction request frames, and the renderer rests once the view settles. Balanced mobile rendering caps pixel ratio at 1; High detail caps it at 1.5. Desktop caps remain 1.2 and 1.75. The original texture maps, lighting, shadows, ambient occlusion and furnishings are used in both profiles.

All resources remain local. The server remains bound to `127.0.0.1`; no hosted service or deployment was created. Use `npm.cmd run dev` for development, or `npm.cmd run build` followed by `npm.cmd run preview` to inspect the production bundle locally.

## Validation

The automated suite covers architecture preservation, navigation/collision, safe room arrivals, thumb dead zone, proportional movement, camera-relative travel, diagonal speed and input reset. Responsive browser checks cover portrait and landscape layouts, floor switching, room entry, settings, touch movement/look and desktop controls. Browser viewport emulation is not a physical-device performance benchmark.
