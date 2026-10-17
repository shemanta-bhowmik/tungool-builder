# Block conventions — the recipe for every block

## Folder
```
blocks/src/<block-slug>/
├── block.json
├── index.js        # registerBlockType( metadata.name, { ...metadata, edit: Edit, icon } )
├── edit.js         # Editor UI
├── inspector.js    # InspectorControls (split out once >1 panel)
├── render.php      # Frontend output (dynamic)
├── edit.scss       # Editor-only styles (keep minimal)
├── style.scss      # Frontend + editor styles
└── view.js         # ONLY if the block needs frontend JS (then declare viewScriptModule/viewScript)
```
Container blocks (InnerBlocks): `index.js` adds `save: () => <InnerBlocks.Content />`; render.php outputs `$content` inside the wrapper.

## block.json template
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "tungool-builder/<block-slug>",
  "version": "1.0.0",
  "title": "<Title>",
  "category": "tungool-builder",
  "description": "<One real sentence>",
  "keywords": [],
  "textdomain": "tungool-builder",
  "attributes": {
    "uniqueId": { "type": "string", "default": "" }
  },
  "supports": {
    "html": false,
    "anchor": true,
    "className": true
  },
  "example": { "attributes": {} },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "render": "file:./render.php"
}
```
Prefer core `supports` (color, typography, spacing, border) where they are enough; use shared custom controls only for what core can't do (e.g. responsive values, hover states).

## edit.js skeleton
```js
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import './edit.scss';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	useUniqueId( { attributes, setAttributes, clientId } );
	const blockProps = useBlockProps( {
		className: `tb-<slug> tb-block-${ attributes.uniqueId }`,
	} );
	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>{ /* markup identical to render.php */ }</div>
		</>
	);
}
```

## render.php skeleton
```php
<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

$unique_id = sanitize_key( $attributes['uniqueId'] ?? '' );
$wrapper   = get_block_wrapper_attributes( array(
	'class' => 'tb-<slug>' . ( $unique_id ? ' tb-block-' . $unique_id : '' ),
) );

// \SB\TungoolBuilder\App\DynamicCSS::add( '.tb-block-' . $unique_id, $rules );
?>
<div <?php echo $wrapper; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
	<?php /* escaped output, balanced in every branch */ ?>
</div>
```

## Parity rule
Editor markup and class names must match render.php so style.scss looks identical in both.

## Frontend JS
- Frontend JS lives in `view.js`, declared as `viewScriptModule` in block.json (`"viewScriptModule": "file:./view.js"`), so it only loads on pages where the block is used.
- Use the WordPress Interactivity API (`@wordpress/interactivity`) for stateful behaviour (tabs, accordion, countdown). Plain JS modules only where that is clearly simpler.
- No jQuery, no external libraries unless Shemanta approves them.
- Keyboard and screen reader support is required — follow the WAI-ARIA Authoring Practices pattern for the widget (roles, `aria-*` states, focus management, arrow/Home/End keys where the pattern defines them).
- Respect `prefers-reduced-motion`: when set, disable animations and transitions (CSS media query + skip JS-driven motion).
- Everything must work with multiple instances on one page — scope state per block (Interactivity API context / per-element instances), never use global IDs or document-wide selectors.

## Definition of done (Claude Code reports, Shemanta confirms)
- [ ] `npm run build` passes with no errors/warnings for the block
- [ ] Inserts from inserter under the plugin category, preview (`example`) shows
- [ ] All controls update the editor live
- [ ] Frontend matches editor; block supports (color/align/className/anchor) apply
- [ ] Two instances on one page don't affect each other
- [ ] Responsive values verified at tablet/mobile widths
- [ ] No PHP notices (WP_DEBUG on), no console errors
- [ ] Strings translatable; output escaped
- [ ] Confirmed visually by Shemanta → mark done in roadmap.md
