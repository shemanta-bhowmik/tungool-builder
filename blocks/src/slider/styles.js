import { generateCSS, responsiveToRules, blockSelector } from '../shared/utils';

const ms = ( value, fallback ) => {
	const n = Number( value );
	return `${ Math.round( Number.isFinite( n ) && n >= 0 ? n : fallback ) }ms`;
};

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order). Layout values are custom properties read by style.scss
 * (and by view.js for slides per view).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function sliderCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const el = `.tb-slider${ selector }`;
	const { arrowColor = {}, arrowBackground = {}, dotColor = {}, dotActiveColor = {} } = attributes;
	const dot = Number( attributes.dotSize );

	return (
		generateCSS(
			el,
			responsiveToRules( {
				'--tb-slider-per-view': attributes.effect === 'fade' ? '' : attributes.slidesPerView,
				'--tb-slider-gap': attributes.gap,
				'--tb-slider-speed': ms( attributes.speed, 500 ),
				'--tb-slider-arrow-size': attributes.arrowSize,
				'--tb-slider-arrow-radius': attributes.arrowRadius,
				'--tb-slider-dot-size': Number.isFinite( dot ) && dot > 0 ? `${ Math.round( dot ) }px` : '',
			} )
		) +
		generateCSS(
			`${ el } .tb-slider__arrow`,
			responsiveToRules( { color: arrowColor.normal, 'background-color': arrowBackground.normal } )
		) +
		generateCSS(
			`${ el } .tb-slider__arrow:hover,${ el } .tb-slider__arrow:focus-visible`,
			responsiveToRules( { color: arrowColor.hover, 'background-color': arrowBackground.hover } )
		) +
		generateCSS( `${ el } .tb-slider__dot`, responsiveToRules( { 'background-color': dotColor.normal } ) ) +
		generateCSS(
			`${ el } .tb-slider__dot:hover,${ el } .tb-slider__dot[aria-current="true"]`,
			responsiveToRules( { 'background-color': dotActiveColor.normal } )
		)
	);
}
