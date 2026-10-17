import { generateCSS, responsiveToRules, typographyMap, blockSelector } from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function counterCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-counter${ selector }`;
	const { numberColor = {}, titleColor = {}, iconColor = {} } = attributes;

	return (
		generateCSS( wrap, responsiveToRules( { 'text-align': attributes.align, gap: attributes.gap } ) ) +
		generateCSS(
			`${ wrap } .tb-counter__number`,
			responsiveToRules( { ...typographyMap( attributes.numberTypography ), color: numberColor.normal } )
		) +
		generateCSS(
			`${ wrap } .tb-counter__title`,
			responsiveToRules( { ...typographyMap( attributes.titleTypography ), color: titleColor.normal } )
		) +
		generateCSS(
			`${ wrap } .tb-counter__icon`,
			responsiveToRules( { 'font-size': attributes.iconSize, color: iconColor.normal } )
		)
	);
}
