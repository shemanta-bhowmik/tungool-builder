import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	blockSelector,
} from '../shared/utils';

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order). Child combinators keep nested accordions separate.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function accordionCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-accordion${ selector }`;
	const item = `${ wrap } > .tb-accordion-item`;
	const title = `${ item } > .tb-accordion-item__heading > .tb-accordion-item__title`;
	const { titleColor = {}, titleBg = {}, iconColor = {} } = attributes;

	return (
		generateCSS( wrap, responsiveToRules( { gap: attributes.itemGap } ) ) +
		generateCSS( item, responsiveToRules( borderMap( attributes.itemBorder ) ) ) +
		generateCSS(
			title,
			responsiveToRules( {
				...typographyMap( attributes.titleTypography ),
				...spacingMap( 'padding', attributes.titlePadding ),
				color: titleColor?.normal,
				'background-color': titleBg?.normal,
			} )
		) +
		generateCSS(
			`${ title }:hover`,
			responsiveToRules( { color: titleColor?.hover, 'background-color': titleBg?.hover } )
		) +
		generateCSS(
			`${ title }[aria-expanded="true"]`,
			responsiveToRules( {
				color: attributes.titleActiveColor?.normal,
				'background-color': attributes.titleActiveBg?.normal,
			} )
		) +
		generateCSS(
			`${ title } .tb-accordion-item__icon`,
			responsiveToRules( { 'font-size': attributes.iconSize, color: iconColor?.normal } )
		) +
		generateCSS( `${ title }:hover .tb-accordion-item__icon`, responsiveToRules( { color: iconColor?.hover } ) ) +
		generateCSS(
			`${ item } > .tb-accordion-item__panel > .tb-accordion-item__content`,
			responsiveToRules( {
				...spacingMap( 'padding', attributes.contentPadding ),
				'background-color': attributes.contentBg?.normal,
			} )
		)
	);
}
