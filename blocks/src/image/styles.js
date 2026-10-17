import {
	generateCSS,
	responsiveToRules,
	typographyMap,
	borderMap,
	boxShadowValue,
	blockSelector,
} from '../shared/utils';

const DEVICES = [ 'desktop', 'tablet', 'mobile' ];
const isEmpty = ( v ) => v === undefined || v === null || String( v ).trim() === '';

export const ASPECT_RATIOS = [ '1/1', '4/3', '3/2', '16/9', '9/16' ];
export const HOVER_EFFECTS = [ 'none', 'zoom', 'grayscale', 'lift' ];

/**
 * Preset or custom ratio per device. Mirrors tb_image_aspect_map() in render.php.
 *
 * @param {Object} preset { desktop, tablet, mobile } — '' | '1/1' … | 'custom'
 * @param {Object} custom { desktop, tablet, mobile } — e.g. '21/9'
 * @return {Object} Responsive aspect-ratio value.
 */
export function aspectMap( preset = {}, custom = {} ) {
	const out = {};
	DEVICES.forEach( ( device ) => {
		const p = preset?.[ device ];
		if ( ASPECT_RATIOS.includes( p ) ) {
			out[ device ] = p;
		} else if ( p === 'original' ) {
			out[ device ] = 'auto';
		} else if ( p === 'custom' && /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test( String( custom?.[ device ] ?? '' ).trim() ) ) {
			out[ device ] = String( custom[ device ] ).replace( /\s+/g, '' );
		}
	} );
	return out;
}

/**
 * Alignment per device → auto margins. Mirrors tb_image_align_map() in render.php.
 *
 * @param {Object} align { desktop, tablet, mobile } — 'left' | 'center' | 'right'
 * @return {Object} Map of margin-left / margin-right / text-align (caption) values.
 */
export function alignMap( align = {} ) {
	const left = {};
	const right = {};
	DEVICES.forEach( ( device ) => {
		const a = align?.[ device ];
		if ( a === 'left' || a === 'center' || a === 'right' ) {
			left[ device ] = a === 'left' ? '0' : 'auto';
			right[ device ] = a === 'right' ? '0' : 'auto';
		}
	} );
	return { 'margin-left': left, 'margin-right': right };
}

/**
 * CSS filter value. Mirrors tb_image_filter_value() in render.php.
 *
 * @param {Object}      f         { brightness, contrast, saturate, blur }
 * @param {number|null} grayscale null = omit, 1 or 0 = append grayscale().
 * @return {string} Filter value or ''.
 */
export function filterValue( f = {}, grayscale = null ) {
	f = f || {};
	const parts = [];
	[ 'brightness', 'contrast', 'saturate' ].forEach( ( key ) => {
		const v = Number( f[ key ] );
		if ( ! isEmpty( f[ key ] ) && Number.isFinite( v ) && v >= 0 && Math.round( v ) !== 100 ) {
			parts.push( `${ key }(${ Math.round( v ) }%)` );
		}
	} );
	const blur = Number( f.blur );
	if ( ! isEmpty( f.blur ) && Number.isFinite( blur ) && blur > 0 ) {
		parts.push( `blur(${ Math.round( blur ) }px)` );
	}
	if ( grayscale !== null ) {
		parts.push( `grayscale(${ grayscale })` );
	}
	return parts.join( ' ' );
}

const anyWidth = ( w = {} ) => DEVICES.some( ( d ) => ! isEmpty( w?.[ d ] ) );

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function imageCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const root = `.tb-image${ selector }`;
	const media = `${ root } .tb-image__media`;
	const img = `${ media } .tb-image__img`;
	const duration = Number( attributes.transitionDuration );
	const transition = Number.isFinite( duration ) && duration >= 0 ? `${ Math.round( duration ) }ms` : '';
	const opacity = Number( attributes.opacity );
	const grayscale = attributes.hoverEffect === 'grayscale';

	return (
		generateCSS(
			media,
			responsiveToRules( {
				width: attributes.imgWidth,
				'max-width': attributes.maxWidth,
				...alignMap( attributes.alignment ),
				...borderMap( attributes.border ),
				'box-shadow': boxShadowValue( attributes.boxShadow ),
				'transition-duration': transition,
			} )
		) +
		generateCSS(
			img,
			responsiveToRules( {
				width: anyWidth( attributes.imgWidth ) ? '100%' : '',
				height: attributes.imgHeight,
				'aspect-ratio': aspectMap( attributes.aspectRatio, attributes.customAspectRatio ),
				'object-fit': attributes.objectFit,
				'object-position': attributes.objectPosition,
				opacity: Number.isFinite( opacity ) && opacity >= 0 && opacity < 100 ? String( Math.round( opacity ) / 100 ) : '',
				filter: filterValue( attributes.filters, grayscale ? 1 : null ),
				'transition-duration': transition,
			} )
		) +
		generateCSS(
			`${ media }:hover .tb-image__img,${ media }:focus-within .tb-image__img`,
			responsiveToRules( { filter: grayscale ? filterValue( attributes.filters, 0 ) : '' } )
		) +
		generateCSS(
			`${ root } .tb-image__caption`,
			responsiveToRules( {
				...typographyMap( attributes.captionTypography ),
				color: attributes.captionColor?.normal,
				'text-align': attributes.alignment,
			} )
		)
	);
}
