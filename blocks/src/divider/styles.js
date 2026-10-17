import { generateCSS, responsiveToRules, typographyMap, blockSelector } from '../shared/utils';

const DEVICES = [ 'desktop', 'tablet', 'mobile' ];
const MARGINS = {
	left: [ '0', 'auto' ],
	center: [ 'auto', 'auto' ],
	right: [ 'auto', '0' ],
};

/**
 * Responsive alignment → responsive margin-left / margin-right. Mirrors render.php.
 *
 * @param {Object} align { desktop, tablet, mobile } 'left' | 'center' | 'right'.
 * @return {Object} Map of CSS property → responsive value.
 */
export function alignMap( align = {} ) {
	const left = {};
	const right = {};
	DEVICES.forEach( ( device ) => {
		const m = MARGINS[ align?.[ device ] ];
		if ( m ) {
			left[ device ] = m[ 0 ];
			right[ device ] = m[ 1 ];
		}
	} );
	return { 'margin-left': left, 'margin-right': right };
}

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function dividerCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-divider${ selector }`;
	const hasElement = [ 'text', 'icon' ].includes( attributes.elementType );

	let css =
		generateCSS(
			wrap,
			responsiveToRules( {
				'padding-top': attributes.spaceAbove,
				'padding-bottom': attributes.spaceBelow,
				'--tb-divider-weight': attributes.weight,
				'--tb-divider-color': attributes.color?.normal,
				'--tb-divider-gradient': attributes.gradient,
			} )
		) +
		generateCSS(
			`${ wrap } > .tb-divider__box`,
			responsiveToRules( { width: attributes.width, ...alignMap( attributes.align ) } )
		);

	if ( hasElement ) {
		css +=
			generateCSS( `${ wrap } .tb-divider__inner`, responsiveToRules( { gap: attributes.gap } ) ) +
			generateCSS(
				`${ wrap } .tb-divider__element`,
				responsiveToRules( {
					...typographyMap( attributes.typography ),
					color: attributes.elementColor?.normal,
				} )
			) +
			generateCSS( `${ wrap } .tb-divider__element > .tb-icon`, responsiveToRules( { 'font-size': attributes.iconSize } ) );
	}
	return css;
}
