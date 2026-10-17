import { generateCSS, responsiveToRules, blockSelector } from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rule with DynamicCSS.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function spacerCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	return generateCSS( `.tb-spacer${ selector }`, responsiveToRules( { height: attributes.height } ) );
}
