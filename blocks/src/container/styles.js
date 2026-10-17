import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	borderMap,
	boxShadowValue,
	gridColumnsMap,
	backgroundMap,
	backgroundHoverMap,
	overlayMap,
	blockSelector,
} from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function containerCSS( attributes ) {
	const { uniqueId, contentWidth, border = {}, background = {} } = attributes;
	const selector = blockSelector( uniqueId );
	if ( ! selector ) {
		return '';
	}
	const outer = `.tb-container${ selector }`;

	return (
		generateCSS(
			outer,
			responsiveToRules( {
				'min-height': attributes.minHeight,
				...spacingMap( 'padding', attributes.padding ),
				...spacingMap( 'margin', attributes.margin ),
				...backgroundMap( background ),
				...borderMap( border ),
				'box-shadow': boxShadowValue( attributes.boxShadow ),
			} )
		) +
		generateCSS(
			`${ outer }:hover`,
			responsiveToRules( {
				...backgroundHoverMap( background ),
				'border-color': border?.hoverColor,
			} )
		) +
		generateCSS( `${ outer }::before`, responsiveToRules( overlayMap( background ) ) ) +
		generateCSS(
			`${ outer } > .tb-container__inner`,
			responsiveToRules( {
				display: attributes.display,
				'max-width': contentWidth === 'boxed' ? attributes.maxWidth : '',
				'flex-direction': attributes.direction,
				'flex-wrap': attributes.wrap,
				'justify-content': attributes.justify,
				'align-items': attributes.alignItems,
				'grid-template-columns': gridColumnsMap( attributes.gridColumns ),
				gap: attributes.gap,
			} )
		)
	);
}
