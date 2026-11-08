# Locked picks

Mapping supplied by parent after visual review of Gabriel’s screenshots; screenshots themselves are not mounted here.

| Hero | Source | Note |
|---|---|---|
| brok | /workspace/shots/anime2_brok.png | Kept exact anime2 design |
| sylve | /workspace/shots/anime2_sylve.png | Kept exact anime2 design |
| marea | /workspace/shots/anime2_marea.png | Kept exact anime2 design |
| petrol | /workspace/shots/anime2_petrol.png | Kept exact anime2 design |
| granit | /workspace/shots/anime2_granit.png | Kept exact anime2 design |
| krom | /workspace/shots/anime2_krom.png | Kept exact anime2 design |
| aurel | /workspace/shots/anime2_aurel.png | Kept exact anime2 design |
| lune | /workspace/shots/anime2_lune.png | anime2 neon gothic city and large moon |
| nyx | /workspace/shots/anime3_nyx.png | anime3 serpentine pink-wing dragon with orb |
| zephyr | /workspace/shots/final_zephyr_vivid.png | anime3 white bird with fan; background edit |

## Extraction
final_art/*.png are exact native-resolution pixel crops (x4.5–95.5%, y22.5–80.5%) excluding the old frame/name/cost badges. They trim the composition; not full restored paintings and not upscaled. No kept card was regenerated.

## Zéphyr
Source: anime3_zephyr.png. Edited background adds waterfalls, vivid foliage, brighter sky and energy. Character remains visually close; generative edit cannot guarantee pixel identity.

## Layered frame prototype
frame_showcase/index.html and heroes.html; frames.css. Six tiers, layered art + UI + glow + metal + foil + particles. Transparent foreground masks generated with rembg for character breakout; inspect masks before production. Standalone prototype, no game code changed.

## Final showcase inspection
Both showcase sheets rerendered and inspected with locked sources. Transparent foreground segmentation is enabled from tier 2; Brok uses a manually refined alpha silhouette because automated models erased his black basalt body. Some cutouts retain clipped upper edges and the native interior crops trim composition; these are preview-quality, not full recovered high-resolution paintings. No game files changed.

## Full-composition restoration pass (supersedes crop preview)
All ten final_art/<name>.png now contain generated full-bleed, badge-free restorations from the locked reference cards, rather than tight pixel crops. Kept original reference cards unchanged. These are generative edits: recognizable designs retained, but exact pixel identity cannot be guaranteed. Full images are 768×1024. Alpha cutouts regenerated; Brok silhouette manually refined to preserve dark basalt anatomy. Tiers use independently layered artwork, foreground masks, metallic borders and live animated effects.

Outputs: frames_tiers_brok.png; frames_10_heros.png (T1/T6); frames_anim.mp4 (5 seconds, 24fps, T3/T5/T6). Live prototype: frame_showcase/index.html and heroes.html. No game files changed.
