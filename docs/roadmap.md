# Roadmap
Status: [ ] todo · [~] built, awaiting visual check · [x] confirmed by Shemanta

## Phase 0 — Setup
- [x] WordPress workspace in VS Code, plugin folder, git, docs added

## Phase 1 — Foundation
- [x] Apply Identity table (name/slug/namespace) everywhere — incl. block names, textdomains, tb- classes
- [x] Restructure to architecture.md tree (Plugin.php, BlockCategory, Assets, Helpers)
- [x] Improved BlockHandler (collection API + fallback + missing-manifest notice)
- [x] Custom block category — "Tungool Blocks", all 3 blocks moved in
- [~] Block SVG icons (blocks/src/shared/icons) — heading done; card, latest-posts pending
- [x] webpack.assets.config.js, languages/, real plugin header, uninstall.php
- [~] Fix heading (known issues 1,4,5,7)
- [ ] Fix card (1,2,6,7)
- [ ] Fix latest-posts (1,3,5,7)

## Phase 2 — Shared layer
- [~] useUniqueId, useDeviceType hooks
- [~] ResponsiveControl wrapper (desktop/tablet/mobile tabs)
- [~] Spacing, Typography, Color (theme palette), Border, BoxShadow controls
- [~] DynamicCSS (PHP) + editor style generator (JS) — output parity verified by script
- [~] Retrofit heading → card → latest-posts — heading built, awaiting check

## Phase 3 — Core blocks
- [~] Container / Section (InnerBlocks)
- [ ] Heading (final)
- [~] Text / Paragraph (tungool-builder/text) — built, awaiting check
- [~] Button + Buttons
- [~] Image — built, awaiting visual check (lightbox view.js loads only when enabled)
- [~] Icon (IconPicker) — inline SVG, library + sanitized custom SVG (Helpers\Svg)
- [~] Divider
- [~] Spacer

## Phase 4 — Interactive blocks
- [~] Tabs (+ Tab) — built, awaiting visual check (view.js module)
- [~] Accordion (+ Item) — built, awaiting visual check (view.js module, FAQ schema)
- [~] Slider + Slide — scroll-snap + view.js module, fade/slide, autoplay w/ pause button, a11y carousel pattern
- [~] Counter — built, awaiting visual check (count-up via view.js, final value server-rendered)
- [~] Countdown — built, awaiting visual check (fixed + evergreen, end actions)
- [~] Testimonial — figure/blockquote/figcaption, 4 layouts, half-star rating
- [~] Icon List (+ Item) — built, awaiting visual check
- [~] Info Box — icon/image/number media, shared button (Helpers\Button + shared/styles/_button.scss), box link, hover lift
- [~] Pricing Table — built, awaiting visual check (reuses .tb-button styles)
- [~] Post Grid (replaces latest-posts) — built, awaiting visual check; latest-posts hidden from inserter + transform added; load more via REST (App\PostGrid)

## Phase 5 — Product
- [ ] Settings page: enable/disable blocks
- [ ] Conditional asset loading
- [ ] Block patterns
- [ ] .pot translation file
- [ ] readme.txt, screenshots
- [ ] Release zip script (excludes src, node_modules, docs)
