import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	boxShadowValue,
	gridColumnsMap,
	blockSelector,
} from '../shared/utils';

const RATIOS = [ '16/9', '4/3', '3/2', '1', '3/4', '2/3' ];

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} a Block attributes.
 * @return {string} CSS.
 */
export default function postGridCSS( a ) {
	const selector = blockSelector( a.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-post-grid${ selector }`;
	const card = `${ wrap } .tb-post-grid__card`;

	return (
		generateCSS(
			`${ wrap } .tb-post-grid__items`,
			responsiveToRules( {
				'grid-template-columns': a.layout === 'list' ? {} : gridColumnsMap( a.columns ),
				gap: a.gap,
			} )
		) +
		generateCSS(
			card,
			responsiveToRules( {
				'background-color': a.cardBackground?.normal,
				...borderMap( a.cardBorder ),
				...spacingMap( 'padding', a.cardPadding ),
				'box-shadow': boxShadowValue( a.cardShadow ),
			} )
		) +
		generateCSS(
			`${ card }:hover`,
			responsiveToRules( {
				'background-color': a.cardBackground?.hover,
				'border-color': a.cardBorder?.hoverColor,
				'box-shadow': boxShadowValue( a.cardHoverShadow ),
			} )
		) +
		generateCSS(
			`${ wrap } .tb-post-grid__img`,
			responsiveToRules( {
				'aspect-ratio': RATIOS.includes( a.imageRatio ) ? a.imageRatio : '',
				'border-radius': a.imageRadius,
			} )
		) +
		generateCSS(
			`${ wrap } .tb-post-grid__title`,
			responsiveToRules( { ...typographyMap( a.titleTypography ), color: a.titleColor?.normal } )
		) +
		generateCSS( `${ wrap } .tb-post-grid__title a:hover`, responsiveToRules( { color: a.titleColor?.hover } ) ) +
		generateCSS(
			`${ wrap } .tb-post-grid__meta`,
			responsiveToRules( { ...typographyMap( a.metaTypography ), color: a.metaColor?.normal } )
		) +
		generateCSS(
			`${ wrap } .tb-post-grid__excerpt`,
			responsiveToRules( { ...typographyMap( a.excerptTypography ), color: a.excerptColor?.normal } )
		) +
		generateCSS( `${ wrap } .tb-post-grid__more .tb-button`, responsiveToRules( { color: a.readMoreColor?.normal } ) ) +
		generateCSS(
			`${ wrap } .tb-post-grid__more .tb-button:hover,${ wrap } .tb-post-grid__more .tb-button:focus-visible`,
			responsiveToRules( { color: a.readMoreColor?.hover } )
		)
	);
}
