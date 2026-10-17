import { generateCSS, responsiveToRules, typographyMap, blockSelector } from '../shared/utils';

/**
 * Divider shorthand. Mirrors the divider value in render.php.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} e.g. '1px solid #ddd', '' when off.
 */
export const dividerValue = ( { divider, dividerStyle, dividerWidth, dividerColor } ) => {
	if ( ! divider ) {
		return '';
	}
	const style = [ 'solid', 'dashed', 'dotted', 'double' ].includes( dividerStyle ) ? dividerStyle : 'solid';
	return `${ dividerWidth || '1px' } ${ style } ${ dividerColor?.normal || 'currentColor' }`;
};

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order). Layout values are custom properties read by style.scss.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function iconListCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-icon-list${ selector }`;
	const item = `${ wrap } > .tb-icon-list-item`;
	const { iconColor = {}, textColor = {} } = attributes;

	return (
		generateCSS(
			wrap,
			responsiveToRules( {
				'--tb-il-gap': attributes.gap,
				'--tb-il-align': attributes.align,
				'--tb-il-divider': dividerValue( attributes ),
			} )
		) +
		generateCSS(
			`${ item } > .tb-icon-list-item__inner`,
			responsiveToRules( { gap: attributes.iconGap, color: textColor?.normal, ...typographyMap( attributes.textTypography ) } )
		) +
		generateCSS( `${ item } > .tb-icon-list-item__inner:hover`, responsiveToRules( { color: textColor?.hover } ) ) +
		generateCSS(
			`${ item } .tb-icon-list-item__icon`,
			responsiveToRules( { 'font-size': attributes.iconSize, color: iconColor?.normal } )
		) +
		generateCSS( `${ item } > .tb-icon-list-item__inner:hover .tb-icon-list-item__icon`, responsiveToRules( { color: iconColor?.hover } ) )
	);
}
