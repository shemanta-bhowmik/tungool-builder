import { generateCSS, responsiveToRules, blockSelector } from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function buttonsCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	return generateCSS(
		`.tb-buttons${ selector }`,
		responsiveToRules( {
			'flex-direction': attributes.direction,
			'justify-content': attributes.justify,
			'align-items': attributes.alignItems,
			gap: attributes.gap,
			'flex-wrap': attributes.wrap,
		} )
	);
}
