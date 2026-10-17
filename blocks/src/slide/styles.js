import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	backgroundMap,
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
export default function slideCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const el = `.tb-slide${ selector }`;
	const background = attributes.background || {};

	return (
		generateCSS(
			el,
			responsiveToRules( {
				'min-height': attributes.minHeight,
				...spacingMap( 'padding', attributes.padding ),
				...backgroundMap( background ),
			} )
		) + generateCSS( `${ el }::before`, responsiveToRules( overlayMap( background ) ) )
	);
}
