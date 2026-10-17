import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	boxShadowValue,
	backgroundMap,
	backgroundHoverMap,
} from './css';

export const BUTTON_PRESETS = [ 'primary', 'secondary', 'outline', 'text' ];

/**
 * CSS for one .tb-button element (normal, hover/focus, icon). Shared by the button
 * block and blocks that embed a button. Mirrors \SB\TungoolBuilder\Helpers\Button::add_css().
 *
 * @param {string} el Selector of the .tb-button element.
 * @param {Object} b  { typography, padding, textColor, background, border, boxShadow, iconGap, iconSize, transitionDuration }
 * @return {string} CSS.
 */
export function buttonElementCSS( el, b = {} ) {
	const { border = {}, textColor = {}, background = {} } = b;
	const duration = Number( b.transitionDuration );

	return (
		generateCSS(
			el,
			responsiveToRules( {
				...typographyMap( b.typography ),
				...spacingMap( 'padding', b.padding ),
				color: textColor?.normal,
				...backgroundMap( background ),
				...borderMap( border ),
				'box-shadow': boxShadowValue( b.boxShadow ),
				gap: b.iconGap,
				'transition-duration': Number.isFinite( duration ) && duration >= 0 ? `${ Math.round( duration ) }ms` : '',
			} )
		) +
		generateCSS(
			`${ el }:hover,${ el }:focus-visible`,
			responsiveToRules( {
				color: textColor?.hover,
				...backgroundHoverMap( background ),
				'border-color': border?.hoverColor,
			} )
		) +
		generateCSS( `${ el } .tb-button__icon`, responsiveToRules( { 'font-size': b.iconSize } ) )
	);
}
