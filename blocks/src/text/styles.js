import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	boxShadowValue,
	backgroundMap,
	backgroundHoverMap,
	blockSelector,
} from '../shared/utils';

/**
 * Column rule { width, style, color } → map. A width without a style falls back to 'solid'.
 *
 * @param {Object} r Column rule value.
 * @return {Object} Map of CSS property → value.
 */
export const columnRuleMap = ( r = {} ) => ( {
	'column-rule-width': r?.width,
	'column-rule-style': r?.style || ( r?.width ? 'solid' : '' ),
	'column-rule-color': r?.color,
} );

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function textCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const el = `.tb-text${ selector }`;
	const { textColor = {}, linkColor = {}, background = {} } = attributes;

	return (
		generateCSS(
			el,
			responsiveToRules( {
				...typographyMap( attributes.typography ),
				...spacingMap( 'padding', attributes.padding ),
				...spacingMap( 'margin', attributes.margin ),
				'max-width': attributes.maxWidth,
				'text-align': attributes.align,
				color: textColor?.normal,
				...backgroundMap( background ),
				...borderMap( attributes.border ),
				'box-shadow': boxShadowValue( attributes.boxShadow ),
				'column-count': attributes.columns,
				'column-gap': attributes.columnGap,
				...columnRuleMap( attributes.columnRule ),
			} )
		) +
		generateCSS( `${ el }:hover`, responsiveToRules( backgroundHoverMap( background ) ) ) +
		generateCSS( `${ el } a`, responsiveToRules( { color: linkColor?.normal } ) ) +
		generateCSS( `${ el } a:hover,${ el } a:focus-visible`, responsiveToRules( { color: linkColor?.hover } ) ) +
		( attributes.dropCap
			? generateCSS(
				`${ el }.tb-text--drop-cap::first-letter`,
				responsiveToRules( { 'font-size': attributes.dropCapSize, color: attributes.dropCapColor } )
			)
			: '' )
	);
}
