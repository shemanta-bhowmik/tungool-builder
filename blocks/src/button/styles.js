import { generateCSS, responsiveToRules, widthMap, blockSelector } from '../shared/utils';
import { buttonElementCSS } from '../shared/utils/button';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function buttonCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-button-wrap${ selector }`;

	return (
		generateCSS( wrap, responsiveToRules( { width: widthMap( attributes.widthMode, attributes.customWidth ) } ) ) +
		buttonElementCSS( `${ wrap } > .tb-button`, attributes )
	);
}
