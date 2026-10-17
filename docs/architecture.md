# Architecture

Derived from the existing gb-addons project (git: "Class 30–32"). Keep its patterns; fix its issues.

## File tree (target)
```
tungool-builder/
├── tungool-builder.php              # Bootstrap: header, namespace, require vendor/autoload.php, Plugin::instance()->init()
├── uninstall.php              # Delete plugin options
├── index.php                  # Silence is golden
├── composer.json              # PSR-4  "SB\\TungoolBuilder\\": "includes/"
├── package.json
├── webpack.assets.config.js   # Non-block assets (was referenced as assets.config.js but missing)
├── CLAUDE.md
├── README.md / readme.txt
├── docs/
├── includes/
│   ├── Plugin.php             # Main class (renamed from GbAddons.php)
│   ├── App/
│   │   ├── Traits/Singleton.php
│   │   ├── BlockHandler.php
│   │   ├── BlockCategory.php
│   │   ├── Assets.php
│   │   ├── DynamicCSS.php
│   │   └── Settings.php       # Phase 5
│   └── Helpers/Render.php
├── blocks/
│   ├── src/
│   │   ├── shared/
│   │   │   ├── controls/      # ResponsiveControl, SpacingControl, TypographyControl,
│   │   │   │                  # ColorControl, BorderControl, BoxShadowControl, IconPicker
│   │   │   ├── hooks/         # useUniqueId, useDeviceType
│   │   │   ├── utils/         # attribute schema helpers, css generators
│   │   │   ├── styles/        # _variables.scss, _mixins.scss
│   │   │   └── icons/         # Block SVG icons
│   │   └── <block>/           # see block-conventions.md
│   └── build/                 # generated
├── assets/src/ → assets/build/
├── languages/
└── vendor/
```

`blocks/src/shared` contains no block.json, so the manifest build ignores it as a block; blocks import from it.

## PHP flow
1. `tungool-builder.php` — header (real metadata, Requires at least 6.5, Requires PHP 7.4), defines nothing else.
2. `Plugin::init()` — define constants: `TB_VERSION` (time() if `TB_DEV`), `TB_FILE`, `TB_PATH`, `TB_URL`; hook `plugins_loaded`.
3. `init_plugin()` — instantiate modules: BlockCategory, BlockHandler, Assets, DynamicCSS (Settings in phase 5). Load textdomain on `init`.
4. `BlockHandler::register_blocks()` on `init`:
   - If `wp_register_block_types_from_metadata_collection` exists (WP 6.8+), use it with the build dir + manifest.
   - Else if `wp_register_block_metadata_collection` exists (6.7), register collection then loop `register_block_type`.
   - Else loop manifest keys → `register_block_type( path )`.
   - Guard: if manifest file is missing, show an admin notice "run npm run build" instead of fatal error.
   - Phase 5: skip blocks disabled in Settings.
5. `BlockCategory` — `block_categories_all` filter, prepend category slug `tungool-builder`, title "Tungool Blocks".

## Dynamic CSS / responsive pipeline
- Every block with style controls has attribute `uniqueId` (string). `useUniqueId` sets it on first insert and regenerates on duplicate (check for collisions in the editor store).
- Wrapper class: `tb-block-{uniqueId}`.
- Style attributes stored as objects per device: `{ desktop: '', tablet: '', mobile: '' }`.
- Editor: the block renders a scoped `<style>` from the same generator so the editor matches the frontend.
- Frontend: `render.php` calls `\SB\TungoolBuilder\App\DynamicCSS::add( $selector, $rules_by_device )`; DynamicCSS collects all rules and prints ONE `<style id="tb-dynamic-css">` (wp_footer or wp_add_inline_style on a registered handle). Breakpoints: tablet ≤1024px, mobile ≤767px (constants, filterable).
- Static styles (shared look) go in style.scss using CSS custom properties; per-instance values go through DynamicCSS.

## Known issues in the original code (must be fixed in Phase 1)
1. heading/card render.php don't use `get_block_wrapper_attributes()` → block supports (color, align, className) never reach frontend. latest-posts uses it but adds a duplicate `class=""`.
2. card prints a global `<style>.card-block{}` — multiple cards overwrite each other. Uses `sanitize_post()` on text (wrong). Always prints `<img>` even when empty.
3. latest-posts: closing `</div>` inside the `if` → unbalanced markup when no posts. `rest_sanitize_boolean()` called with extra arg. Editor shows `<h2>` while frontend shows `<h3>`; editor titles unescaped/unlinked mismatch. Missing `wp_reset_postdata` only in branch.
4. heading: `level` is `type: number` with default `"2"` and SelectControl saves strings → use numbers (or core `HeadingLevelDropdown`). Typo support key `"background:"`. Content escaped with esc_html strips RichText formatting → use wp_kses_post.
5. heading & latest-posts declare `viewScript: file:./view.js` which doesn't exist. `assets.config.js` referenced in package.json doesn't exist.
6. All blocks: category `text`, icon `smiley`, copy-pasted description. card has hardcoded color list.
7. edit.js passes `className` after `{...useBlockProps()}` — overrides generated classes. Use `useBlockProps({ className })`.
8. `languages/` missing; header metadata placeholder ("Your Name or Company Name", example.com, Requires at least 5.2).
