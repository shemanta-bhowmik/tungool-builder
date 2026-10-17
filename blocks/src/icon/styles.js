import { generateCSS, responsiveToRules, blockSelector } from '../shared/utils';

const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

/**
 * Responsive degrees → responsive transform. Mirrors the rotate block in render.php.
 *
 * @param {Object} value { desktop, tablet, mobile } numbers (deg).
 * @return {Object} Responsive transform value.
 */
export function rotateMap( value = {} ) {
	const out = {};
	DEVICES.forEach( ( device ) => {
		const v = value?.[ device ];
		if ( v !== undefined && v !== null && v !== '' && Number.isFinite( Number( v ) ) ) {
			out[ device ] = `rotate(${ Math.round( Number( v ) ) }deg)`;
		}
	} );
	return out;
}

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function iconCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const { view, iconColor = {}, bgColor = {}, borderColor = {} } = attributes;
	const wrap = `.tb-icon-wrap${ selector }`;
	const el = `${ wrap } .tb-icon-el`;
	const stacked = view === 'stacked';
	const framed = view === 'framed';

	return (
		generateCSS( wrap, responsiveToRules( { 'text-align': attributes.align } ) ) +
		generateCSS(
			el,
			responsiveToRules( {
				'font-size': attributes.size,
				padding: attributes.padding,
				color: iconColor?.normal,
				'background-color': stacked ? bgColor?.normal : '',
				'border-color': framed ? borderColor?.normal : '',
				'border-width': framed ? attributes.borderWidth : '',
			} )
		) +
		generateCSS(
			`${ el }:hover,${ el }:focus-visible`,
			responsiveToRules( {
				color: iconColor?.hover,
				'background-color': stacked ? bgColor?.hover : '',
				'border-color': framed ? borderColor?.hover : '',
			} )
		) +
		generateCSS( `${ el } > .tb-icon`, responsiveToRules( { transform: rotateMap( attributes.rotate ) } ) )
	);
}
