import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	boxShadowValue,
	blockSelector,
} from '../shared/utils';
import { buttonElementCSS } from '../shared/utils/button';

const color = ( c ) => c?.normal;

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} a Block attributes.
 * @return {string} CSS.
 */
export default function pricingCSS( a ) {
	const selector = blockSelector( a.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-pricing${ selector }`;
	const btn = `${ wrap } .tb-pricing__action > .tb-button`;
	const scale = Number( a.featuredScale );
	const part = ( cls, typography, c ) =>
		generateCSS( `${ wrap } ${ cls }`, responsiveToRules( { ...typographyMap( typography ), color: color( c ) } ) );

	return (
		generateCSS(
			wrap,
			responsiveToRules( {
				'text-align': a.align,
				'background-color': color( a.cardBackground ),
				...borderMap( a.cardBorder ),
				...spacingMap( 'padding', a.cardPadding ),
				'box-shadow': boxShadowValue( a.cardShadow ),
			} )
		) +
		generateCSS(
			`${ wrap }.tb-pricing--featured`,
			responsiveToRules( {
				'border-color': color( a.featuredBorderColor ),
				'box-shadow': boxShadowValue( a.featuredShadow ),
				'--tb-pricing-scale': Number.isFinite( scale ) && scale > 0 ? String( scale ) : '',
			} )
		) +
		generateCSS(
			`${ wrap } .tb-pricing__badge`,
			responsiveToRules( { color: color( a.badgeColor ), 'background-color': color( a.badgeBackground ) } )
		) +
		part( '.tb-pricing__title', a.titleTypography, a.titleColor ) +
		part( '.tb-pricing__subtitle', a.subtitleTypography, a.subtitleColor ) +
		part( '.tb-pricing__amount-wrap', a.priceTypography, a.priceColor ) +
		part( '.tb-pricing__period', a.periodTypography, a.periodColor ) +
		generateCSS( `${ wrap } .tb-pricing__original`, responsiveToRules( { color: color( a.originalColor ) } ) ) +
		generateCSS(
			`${ wrap } .tb-pricing__features`,
			responsiveToRules( { ...typographyMap( a.featureTypography ), color: color( a.featureColor ), gap: a.featureGap } )
		) +
		generateCSS( `${ wrap } .tb-pricing__feature--included .tb-pricing__feature-icon`, responsiveToRules( { color: color( a.includedColor ) } ) ) +
		generateCSS( `${ wrap } .tb-pricing__feature--excluded .tb-pricing__feature-icon`, responsiveToRules( { color: color( a.excludedColor ) } ) ) +
		buttonElementCSS( btn, a.button || {} ) +
		part( '.tb-pricing__footnote', a.footnoteTypography, a.footnoteColor )
	);
}
