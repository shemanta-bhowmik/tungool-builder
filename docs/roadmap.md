# Roadmap
Status: [ ] todo · [~] built, awaiting visual check · [x] confirmed by Shemanta

## Phase 0 — Setup
- [x] WordPress workspace in VS Code, plugin folder, git, docs added

## Phase 1 — Foundation
- [x] Apply Identity table (name/slug/namespace) everywhere — incl. block names, textdomains, tb- classes
- [x] Restructure to architecture.md tree (Plugin.php, BlockCategory, Assets, Helpers)
- [x] Improved BlockHandler (collection API + fallback + missing-manifest notice)
- [x] Custom block category — "Tungool Blocks", all 3 blocks moved in
- [ ] Block SVG icons (blocks/src/shared/icons)
- [x] webpack.assets.config.js, languages/, real plugin header, uninstall.php
- [ ] Fix heading (known issues 1,4,5,7)
- [ ] Fix card (1,2,6,7)
- [ ] Fix latest-posts (1,3,5,7)

## Phase 2 — Shared layer
- [ ] useUniqueId, useDeviceType hooks
- [ ] ResponsiveControl wrapper (desktop/tablet/mobile tabs)
- [ ] Spacing, Typography, Color (theme palette), Border, BoxShadow controls
- [ ] DynamicCSS (PHP) + editor style generator (JS)
- [ ] Retrofit heading → card → latest-posts

## Phase 3 — Core blocks
- [ ] Container / Section (InnerBlocks)
- [ ] Heading (final)
- [ ] Text / Paragraph
- [ ] Button + Buttons
- [ ] Image
- [ ] Icon (IconPicker)
- [ ] Divider
- [ ] Spacer

## Phase 4 — Interactive blocks
- [ ] Tabs
- [ ] Accordion
- [ ] Slider
- [ ] Counter
- [ ] Countdown
- [ ] Testimonial
- [ ] Post Grid (replaces latest-posts)

## Phase 5 — Product
- [ ] Settings page: enable/disable blocks
- [ ] Conditional asset loading
- [ ] Block patterns
- [ ] .pot translation file
- [ ] readme.txt, screenshots
- [ ] Release zip script (excludes src, node_modules, docs)
