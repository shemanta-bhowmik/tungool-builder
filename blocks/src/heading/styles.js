import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	blockSelector,
} from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function headingCSS( attributes ) {
	const { uniqueId, typography, padding, margin, hoverColor } = attributes;
	const selector = blockSelector( uniqueId );
	if ( ! selector ) {
		return '';
	}
	return (
		generateCSS(
			selector,
			responsiveToRules( {
				...typographyMap( typography ),
				...spacingMap( 'padding', padding ),
				...spacingMap( 'margin', margin ),
			} )
		) +
		generateCSS(
			`${ selector }:hover`,
			responsiveToRules( { color: hoverColor ? `${ hoverColor } !important` : '' } )
		)
	);
}
