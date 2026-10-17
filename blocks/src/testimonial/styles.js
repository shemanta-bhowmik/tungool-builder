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
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} a Block attributes.
 * @return {string} CSS.
 */
export default function testimonialCSS( a ) {
	const selector = blockSelector( a.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const el = `.tb-testimonial${ selector }`;
	const background = a.background || {};
	const border = a.border || {};
	const c = ( value ) => value?.normal;

	return (
		generateCSS(
			el,
			responsiveToRules( {
				...spacingMap( 'padding', a.padding ),
				...backgroundMap( background ),
				...borderMap( border ),
				'box-shadow': boxShadowValue( a.boxShadow ),
				'--tb-testimonial-avatar-size': a.avatarSize,
				'--tb-testimonial-avatar-radius': a.avatarRadius,
			} )
		) +
		generateCSS(
			`${ el }:hover`,
			responsiveToRules( { ...backgroundHoverMap( background ), 'border-color': border.hoverColor } )
		) +
		generateCSS( `${ el } .tb-testimonial__quote`, responsiveToRules( { ...typographyMap( a.quoteTypography ), color: c( a.quoteColor ) } ) ) +
		generateCSS( `${ el } .tb-testimonial__name`, responsiveToRules( { ...typographyMap( a.nameTypography ), color: c( a.nameColor ) } ) ) +
		generateCSS( `${ el } .tb-testimonial__role`, responsiveToRules( { ...typographyMap( a.roleTypography ), color: c( a.roleColor ) } ) ) +
		generateCSS(
			`${ el } .tb-testimonial__rating`,
			responsiveToRules( { 'font-size': a.starSize, color: c( a.starEmptyColor ), '--tb-star-color': c( a.starColor ) } )
		) +
		generateCSS(
			`${ el } .tb-testimonial__icon`,
			responsiveToRules( { 'font-size': a.quoteIconSize, color: c( a.quoteIconColor ) } )
		)
	);
}
