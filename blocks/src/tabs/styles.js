import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	blockSelector,
} from '../shared/utils';

/**
 * Selectors shared by the editor and render.php. Child combinators keep nested
 * tabs from inheriting the outer instance's styles.
 *
 * @param {string} wrap '.tb-tabs.tb-block-x'
 * @return {Object} Selectors.
 */
export const tabsSelectors = ( wrap ) => {
	const title = `${ wrap } > .tb-tabs__nav > .tb-tabs__title`;
	const accTitle = `${ wrap } > .tb-tabs__panels > .tb-tabs__acc-title`;
	return {
		nav: `${ wrap } > .tb-tabs__nav`,
		titles: `${ title },${ accTitle }`,
		hover: `${ title }:hover,${ accTitle }:hover`,
		active: `${ title }[aria-selected="true"],${ accTitle }[aria-expanded="true"]`,
		icon: `${ title } .tb-tabs__icon,${ accTitle } .tb-tabs__icon`,
		panel: `${ wrap } > .tb-tabs__panels > .tb-tab`,
	};
};

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function tabsCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-tabs${ selector }`;
	const s = tabsSelectors( wrap );
	const { titleColor = {}, titleBg = {}, titleBorder = {}, panelBg = {} } = attributes;
	const vertical = attributes.orientation === 'vertical';

	return (
		generateCSS( wrap, responsiveToRules( { gap: attributes.navSpacing } ) ) +
		generateCSS(
			s.nav,
			responsiveToRules( {
				gap: attributes.titleGap,
				'justify-content': attributes.navAlign,
				width: vertical ? attributes.navWidth : '',
			} )
		) +
		generateCSS(
			s.titles,
			responsiveToRules( {
				...typographyMap( attributes.titleTypography ),
				...spacingMap( 'padding', attributes.titlePadding ),
				color: titleColor?.normal,
				'background-color': titleBg?.normal,
				...borderMap( titleBorder ),
			} )
		) +
		generateCSS(
			s.hover,
			responsiveToRules( {
				color: titleColor?.hover,
				'background-color': titleBg?.hover,
				'border-color': titleBorder?.hoverColor,
			} )
		) +
		generateCSS(
			s.active,
			responsiveToRules( {
				color: attributes.titleActiveColor?.normal,
				'background-color': attributes.titleActiveBg?.normal,
				'border-color': attributes.titleActiveBorderColor?.normal,
			} )
		) +
		generateCSS( s.icon, responsiveToRules( { 'font-size': attributes.iconSize } ) ) +
		generateCSS(
			s.panel,
			responsiveToRules( {
				'background-color': panelBg?.normal,
				...spacingMap( 'padding', attributes.panelPadding ),
				...borderMap( attributes.panelBorder ),
			} )
		)
	);
}
