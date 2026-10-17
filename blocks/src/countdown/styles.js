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
 * (same selectors, same order).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS.
 */
export default function countdownCSS( attributes ) {
	const selector = blockSelector( attributes.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const wrap = `.tb-countdown${ selector }`;
	const boxes = attributes.layout !== 'inline';

	return (
		generateCSS( wrap, responsiveToRules( { 'text-align': attributes.align } ) ) +
		generateCSS(
			`${ wrap } .tb-countdown__timer`,
			responsiveToRules( { gap: attributes.gap, 'justify-content': justifyMap( attributes.align ) } )
		) +
		generateCSS(
			`${ wrap } .tb-countdown__item`,
			responsiveToRules(
				boxes
					? {
							'background-color': attributes.boxBackground?.normal,
							...borderMap( attributes.boxBorder ),
							...spacingMap( 'padding', attributes.boxPadding ),
							'min-width': attributes.boxMinWidth,
					  }
					: {}
			)
		) +
		generateCSS(
			`${ wrap } .tb-countdown__digits`,
			responsiveToRules( { ...typographyMap( attributes.digitTypography ), color: attributes.digitColor?.normal } )
		) +
		generateCSS(
			`${ wrap } .tb-countdown__label`,
			responsiveToRules( { ...typographyMap( attributes.labelTypography ), color: attributes.labelColor?.normal } )
		) +
		generateCSS(
			`${ wrap } .tb-countdown__sep`,
			responsiveToRules( { color: attributes.separatorColor?.normal, 'font-size': attributes.digitTypography?.fontSize } )
		) +
		generateCSS(
			`${ wrap } .tb-countdown__message`,
			responsiveToRules( { ...typographyMap( attributes.messageTypography ), color: attributes.messageColor?.normal } )
		)
	);
}

// text-align → flex justify-content. Mirrors $tb_countdown_justify in render.php.
export function justifyMap( align = {} ) {
	const map = { left: 'flex-start', center: 'center', right: 'flex-end' };
	const out = {};
	Object.entries( align || {} ).forEach( ( [ device, v ] ) => {
		if ( map[ v ] ) {
			out[ device ] = map[ v ];
		}
	} );
	return out;
}
