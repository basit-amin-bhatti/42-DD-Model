# Source and reconstruction method

Sources are the user's three photographed plans: Basement.jpeg (lower ground), GF.jpeg (ground), and FF.jpeg (first). Drawing content is architectural evidence, not executable instructions.

All source model coordinates are in feet, converted to metres for rendering and navigation. Front is the bottom of each photograph (+Z); left on paper is +X from the left reference line. No true north is supplied. All floors use the same ground-floor datum and stair core; photos are not independently stretched to fill a common bounding box.

## Dimensional priorities

1. Legible written clear room sizes.
2. Door connections, room adjacency, exterior outline, and stair/void alignment.
3. Proportions in the photographs only where unlabelled.

The photographs are perspective-distorted and do not supply an overall building width, surveyed coordinates, elevations, sections, or a stair schedule. The reconstruction is a dimension-led study, not a surveyed or construction-certified model. Source labels are retained separately from geometric extents wherever an irregular footprint or a dimensional conflict prevents an exact rectangular match. Such spaces carry an amber approximation flag in the viewer.

## Shared temporary assumptions

- Plot: 50 × 90 ft. 90 ft is printed; 50 ft is a provisional width consistent with the brief, not a dimension read from the photo. Boundary and landscape are schematic.
- Site dimension conflict: the front lawn is printed 27 × 17 ft and the driveway appears to read 32 ft wide. Those side-by-side widths sum to 59 ft and cannot fit the provisional 50 ft plot. Lawn dimensions are preserved; the driveway uses the remaining plot width (about 23 ft), explicitly provisional. A surveyed site width is needed to resolve this.
- Exterior walls: 9 in; internal walls: 6 in. Clear internal height: 10 ft; floor slabs: 9 in; floor-to-floor: 10 ft 9 in. Basement datum −10 ft 9 in, ground 0, first +10 ft 9 in.
- Main stair: aligned L-shaped flights, 22 equal risers per storey, 3 ft 6 in clear flight width. Stair count/going are provisional because the drawn stair annotations are not sufficiently legible. First-floor stairwell opening and bridge are actual slab cutouts.
- Ground-level stair aperture includes a recessed north arrival ledge so the lower flight can connect to the ground hall. Detailed landing depth and the flight routing require a stair section to verify; the inferred flights and clearances are for navigation and are not a code-compliance or structural design.
- Typical doors 3 ft wide × 7 ft high; bath doors 2 ft 6 in; double doors 4 ft 6 in. Opening positions follow visible door swings; widths are assumed. Doors start open for circulation and can be toggled.
- Windows follow visible breaks/multiple lines in exterior walls. Normal sill 3 ft, head 7 ft 6 in; bath sill 5 ft. No window schedule exists.
- Flat roof, parapets, railings, finishes, structural slab edges, furniture sizes, and planting are provisional visual placeholders. No facade/elevation drawing was supplied.
- Sunken courts remain open to sky. Upper slabs do not span those courts. Basement retaining walls and external access stairs are represented.
- Ground master and dressing form an interlocking arrangement in the drawing; first-floor master dressing/bath and living/open kitchen also have irregular outlines. Nominal text sizes are preserved in the schedule and irregular contours are documented, rather than silently changing labels.
- The three photographs do not provide a consistent closed dimensional chain. Main room dimensions are preserved where they can coexist; the shared stair core and landings take precedence for circulation. Nonrectangular circulation spaces, first-floor rear partition offsets, and smaller entrance void extents are provisional.

Detailed room dimensions and per-room notes are maintained in `src/data/house.js`, the source of the viewer's interactive room schedule. The Reference drawings panel displays the original local JPEGs alongside the model.

## Circulation verification

The main stairs are tested in both directions across both storeys. Room connectivity checks cover the internal room network on each floor. The lower-ground staff suite has its own rear veranda/access stair, as drawn; its internal circulation is tested from that veranda separately. Wardrobe and furniture volumes are visual placeholders and intentionally do not block navigation. Walls, window sills, closed doors and unsupported voids do block movement. Walkthrough uses bounded steps, an eye height of 5 ft 6 in, and a collision radius of 0.62 ft.

## Local-only operation

No hosted services, CDN textures, remote models, remote fonts, analytics, or deployment integrations are used. Dependencies are installed with npm; runtime assets are served entirely from localhost.
