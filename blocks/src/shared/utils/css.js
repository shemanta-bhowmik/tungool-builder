/**
 * Editor CSS generator. Output must match \SB\TungoolBuilder\App\DynamicCSS (PHP)
 * character for character, so editor and frontend look identical.
 */

export const BREAKPOINTS = {
	tablet: 1024,
	mobile: 767,
};

const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

const isEmpty = ( value ) =>
	value === undefined || value === null || String( value ).trim() === '';

// Same rules as DynamicCSS::sanitize_value().
const sanitizeValue = ( value ) => String( value ).replace( /[<>{};]/g, '' ).trim();
const isValidProperty = ( prop ) => /^-{0,2}[a-z][a-z0-9-]*$/.test( prop );

/**
 * Turn { 'padding-top': { desktop, tablet, mobile }, color: 'red' }
 * into { desktop: { ... }, tablet: { ... }, mobile: { ... } }.
 * Plain (non-object) values apply to desktop only.
 *
 * @param {Object} map CSS property → value or responsive object.
 * @return {Object} Rules by device.
 */
export function responsiveToRules( map = {} ) {
	const rules = { desktop: {}, tablet: {}, mobile: {} };
	Object.entries( map ).forEach( ( [ prop, value ] ) => {
		if ( value && typeof value === 'object' ) {
			DEVICES.forEach( ( device ) => {
				if ( ! isEmpty( value[ device ] ) ) {
					rules[ device ][ prop ] = value[ device ];
				}
			} );
		} else if ( ! isEmpty( value ) ) {
			rules.desktop[ prop ] = value;
		}
	} );
	return rules;
}

const declarations = ( props = {} ) =>
	Object.entries( props )
		.filter( ( [ prop, value ] ) => isValidProperty( prop ) && ! isEmpty( value ) )
		.map( ( [ prop, value ] ) => `${ prop }:${ sanitizeValue( value ) };` )
		.filter( ( decl ) => ! decl.endsWith( ':;' ) )
		.join( '' );

/**
 * @param {string} selector e.g. '.tb-block-abc123'
 * @param {Object} rules    { desktop: { prop: value }, tablet: {...}, mobile: {...} }
 * @return {string} CSS, empty string when there is nothing to output.
 */
export function generateCSS( selector, rules = {} ) {
	if ( ! selector ) {
		return '';
	}
	let css = '';
	DEVICES.forEach( ( device ) => {
		const body = declarations( rules[ device ] );
		if ( ! body ) {
			return;
		}
		const block = `${ selector }{${ body }}`;
		css +=
			device === 'desktop'
				? block
				: `@media (max-width:${ BREAKPOINTS[ device ] }px){${ block }}`;
	} );
	return css;
}

export const blockSelector = ( uniqueId ) => ( uniqueId ? `.tb-block-${ uniqueId }` : '' );

/**
 * SpacingControl value → responsiveToRules() map. Mirrors DynamicCSS::spacing_map().
 *
 * @param {string} property 'padding' | 'margin'
 * @param {Object} value    { desktop: { top, right, bottom, left }, tablet, mobile }
 * @return {Object} Map of CSS property → responsive value.
 */
export function spacingMap( property, value = {} ) {
	const map = {};
	[ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
		map[ `${ property }-${ side }` ] = {
			desktop: value?.desktop?.[ side ],
			tablet: value?.tablet?.[ side ],
			mobile: value?.mobile?.[ side ],
		};
	} );
	return map;
}

/**
 * TypographyControl value → responsiveToRules() map. Mirrors DynamicCSS::typography_map().
 *
 * @param {Object} t TypographyControl value.
 * @return {Object} Map of CSS property → value or responsive value.
 */
export function typographyMap( t = {} ) {
	return {
		'font-size': t.fontSize,
		'line-height': t.lineHeight,
		'letter-spacing': t.letterSpacing,
		'font-weight': t.fontWeight,
		'text-transform': t.textTransform,
	};
}

/**
 * BorderControl value → responsiveToRules() map. Mirrors DynamicCSS::border_map().
 * A width without a style falls back to 'solid' so the border is visible.
 *
 * @param {Object} b { width, style, color, radius: { desktop, tablet, mobile } }
 * @return {Object} Map of CSS property → value or responsive value.
 */
export function borderMap( b = {} ) {
	b = b || {};
	return {
		'border-width': b.width,
		'border-style': b.style || ( isEmpty( b.width ) ? '' : 'solid' ),
		'border-color': b.color,
		'border-radius': b.radius,
	};
}

/**
 * BoxShadowControl value → CSS box-shadow value. Mirrors DynamicCSS::box_shadow_value().
 *
 * @param {Object} s { x, y, blur, spread, color, inset }
 * @return {string} '' when no color.
 */
export function boxShadowValue( s = {} ) {
	if ( ! s || isEmpty( s.color ) ) {
		return '';
	}
	const n = ( v ) => `${ Math.round( Number( v ) || 0 ) }px`;
	return `${ s.inset ? 'inset ' : '' }${ n( s.x ) } ${ n( s.y ) } ${ n( s.blur ) } ${ n( s.spread ) } ${ s.color }`;
}

/**
 * Grid columns: a number ("3") becomes repeat(3, minmax(0, 1fr)); anything else
 * ("1fr 2fr") is used as a template. Mirrors DynamicCSS::grid_columns_map().
 *
 * @param {Object} value { desktop, tablet, mobile }
 * @return {Object} Responsive value for grid-template-columns.
 */
export function gridColumnsMap( value = {} ) {
	const out = {};
	DEVICES.forEach( ( device ) => {
		const v = value?.[ device ];
		if ( isEmpty( v ) ) {
			return;
		}
		const s = String( v ).trim();
		out[ device ] = /^\d+$/.test( s ) && Number( s ) > 0 ? `repeat(${ Number( s ) },minmax(0,1fr))` : s;
	} );
	return out;
}

const cssUrl = ( url ) => `url("${ String( url ).replace( /"/g, '%22' ) }")`;

const imageLayers = ( gradient, url ) =>
	[ isEmpty( gradient ) ? '' : gradient, isEmpty( url ) ? '' : cssUrl( url ) ]
		.filter( Boolean )
		.join( ',' );

/**
 * BackgroundControl value → map for the normal state. Mirrors DynamicCSS::background_map().
 *
 * @param {Object} bg BackgroundControl value.
 * @return {Object} Map of CSS property → value.
 */
export function backgroundMap( bg = {} ) {
	bg = bg || {};
	const url = bg.image?.url;
	const hasImage = ! isEmpty( url );
	const pos = bg.position;
	return {
		'background-color': bg.color?.normal,
		'background-image': imageLayers( bg.gradient?.normal, url ),
		'background-size': hasImage ? bg.size : '',
		'background-position':
			hasImage && pos && ! isEmpty( pos.x ) && ! isEmpty( pos.y )
				? `${ Math.round( Number( pos.x ) * 100 ) }% ${ Math.round( Number( pos.y ) * 100 ) }%`
				: '',
		'background-repeat': hasImage ? bg.repeat : '',
		'background-attachment': hasImage ? bg.attachment : '',
	};
}

/**
 * Hover background map. Mirrors DynamicCSS::background_hover_map().
 *
 * @param {Object} bg BackgroundControl value.
 * @return {Object} Map of CSS property → value.
 */
export function backgroundHoverMap( bg = {} ) {
	bg = bg || {};
	const hoverGradient = bg.gradient?.hover;
	return {
		'background-color': bg.color?.hover,
		'background-image': isEmpty( hoverGradient ) ? '' : imageLayers( hoverGradient, bg.image?.url ),
	};
}

/**
 * Overlay (::before) map. Opacity is 0–100. Mirrors DynamicCSS::overlay_map().
 *
 * @param {Object} bg BackgroundControl value.
 * @return {Object} Map of CSS property → value.
 */
export function overlayMap( bg = {} ) {
	const color = bg?.overlay?.color;
	if ( isEmpty( color ) ) {
		return {};
	}
	const raw = bg.overlay.opacity;
	const opacity = isEmpty( raw ) ? 50 : Math.min( 100, Math.max( 0, Number( raw ) || 0 ) );
	return {
		'background-color': color,
		opacity: String( Math.round( opacity ) / 100 ),
	};
}

/**
 * Value for the current device, inheriting desktop → tablet → mobile.
 *
 * @param {Object} value  { desktop, tablet, mobile }
 * @param {string} device Current device.
 * @return {*} Resolved value or undefined.
 */
export function inheritedValue( value = {}, device = 'desktop' ) {
	const order = DEVICES.slice( 0, DEVICES.indexOf( device ) + 1 ).reverse();
	for ( const d of order ) {
		if ( ! isEmpty( value?.[ d ] ) ) {
			return value[ d ];
		}
	}
	return undefined;
}

/**
 * Width mode per device ('auto' | 'full' | 'custom') + custom value → responsive width.
 * Mirrors DynamicCSS::width_map().
 *
 * @param {Object} mode   { desktop, tablet, mobile }
 * @param {Object} custom { desktop, tablet, mobile }
 * @return {Object} Responsive width value.
 */
export function widthMap( mode = {}, custom = {} ) {
	const out = {};
	DEVICES.forEach( ( device ) => {
		const m = mode?.[ device ];
		if ( m === 'full' ) {
			out[ device ] = '100%';
		} else if ( m === 'auto' ) {
			out[ device ] = 'auto';
		} else if ( m === 'custom' && ! isEmpty( custom?.[ device ] ) ) {
			out[ device ] = custom[ device ];
		}
	} );
	return out;
}
