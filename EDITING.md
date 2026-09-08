# Daanish Islam portfolio — revised edition

Open index.html directly, or serve this folder with a static web server. There are no installation dependencies for visitors. On the source checkout, `node build.cjs` copies public/ into out/.

## Editing

- index.html: all visible copy, project titles, affiliations, case studies, and expandable About panels.
- style.css: base typography, layout, and case-study styling.
- elevated.css: current charcoal/copper visual theme, scroll stage, project covers, and responsive About layout.
- app.js: native-scroll timeline and bounded image-sequence loader.
- content.json: reference export of the original detailed projects. Editing this JSON alone does not change the displayed page.
- assets/Daanish_Islam_Resume.pdf: the supplied resume, copied without modification.

## Opening story — original 3D edition

The introduction is a purpose-built Three.js scene, not a video, image sequence, or edit of the supplied footage. The old footage was inspiration only and remains available in the original project's documentation.

1. Design: an exploded industrial robot assembly resolves from an edge study into solid copper-colored components.
2. Control: inverse kinematics keeps the arm connected as its nozzle moves over a rotating metal disc. Deterministic spray particles and a surface shader show controlled deposition.
3. Verify: the spray fades, the robot recedes, and the camera moves toward the finished surface.

The desktop story has 3.2 viewport heights of active scroll travel. All motion comes from scroll position; reverse scrolling reverses the assembly, process, and camera movement. Rendering runs only on scroll or resize, with capped pixel density and no continuous idle loop.

- story-math.js contains the scene timing and inverse-kinematics calculations.
- coating-scene.js contains the original geometry, lighting, material shader, spray, and camera choreography.
- app.js synchronizes the three HTML chapters with the scene.
- vendor/three.min.js is a locally bundled Three.js 0.160.1 distribution; its MIT license is beside it. No CDN connection is needed at runtime.

Reduced-motion visitors see the solid assembled scene. If WebGL cannot initialize, the generated robot cover remains as a static fallback. The Skip link goes straight to projects. The scene is a conceptual illustration, not a claim to simulate actual HVOF physics or a specific FANUC model.

## Covers and source accuracy

Seven project-inspired CGI covers were generated with the built-in image-generation tool. They are labeled PROJECT CONCEPT; actual documentation remains inside each project. The delivery-droid image received one correction to remove wheels and show a suspended pod. Covers are conceptual illustrations, not exact CAD reconstructions. Prompt records are in assets/covers/.

The original seven project titles and company/organization/course labels are restored. The Redwood and drone drawings have distinct filenames to prevent Windows case-insensitive overwriting: redwood-fixture-drawing.jpg and drone-assembly-drawing.jpg.

Education follows the supplied resume: BS August 2022–May 2026; MS August 2026–December 2027 expected. The resume's newer BS GPA of 3.66 replaces the old page's 3.62. Background includes the current graduate teaching role and relevant industry/research experience. Project dates from the old portfolio are retained; the resume's VIP dates differ and have not been silently merged.

## Mobile layout and validation

Mobile and desktop are responsive versions of this same site and original 3D scene. The mobile layout activates at 900px and below. It uses a dedicated portrait camera, shorter scroll travel (2.05 visible-stage heights; 1.6 in short landscape), simplified copy, and a persistent safe-area-aware navigation bar. The menu supports modal focus, wrapped Tab/Shift+Tab navigation, Escape, a close button, and close-on-link with focus moved to the destination.

There are no mobile or desktop animation video sequences to download. The real-time renderer uses the same procedural geometry, and changes its camera/framing at the breakpoint. The correctly sized poster is selected through picture/media before loading. Project covers use srcset. The 3D library loads only when the story approaches the viewport and is not fetched for reduced motion or data saving. Changing reduced motion after loading disposes the renderer and its geometry/materials. Pixel density is capped at 1.25 on mobile and 1.6 on desktop.

Browser checks ran in local headless Chrome at 320×568, 375×667, 390×844, 430×932, 844×390, and 1440×900. Checked actual WebGL rendering and opening/coating/reveal screenshots, menu open/close and focus wrapping, Escape, anchor offsets, persistent navigation after the story, horizontal overflow, responsive poster requests, reduced-motion no-engine requests, and blocked-engine fallback. Browser page errors: none. A legacy rule that rotated the About label was found during screenshot inspection and corrected.

Safe-area CSS is included. These are emulated browser checks, not tests on physical phones or Safari. Network asset selection was checked; real-world loading speed was not measured.

Open mobile-preview.html for a selectable phone-sized preview. Open index.html for the responsive site itself. The original resume and all seven projects remain included. No new deployment was performed.
