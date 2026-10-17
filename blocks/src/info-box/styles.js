import {
	generateCSS,
	responsiveToRules,
	spacingMap,
	typographyMap,
	borderMap,
	boxShadowValue,
	backgroundMap,
	backgroundHoverMap,
	overlayMap,
	blockSelector,
} from '../shared/utils';
import { buttonElementCSS } from '../shared/utils/button';

const DIRECTIONS = { top: 'column', left: 'row', right: 'row-reverse' };
const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' };

/**
 * Media position per device → flex-direction. Mobile stacks (column) unless set.
 * Mirrors the PHP in info-box/render.php.
 *
 * @param {Object} pos { desktop, tablet, mobile }
 * @return {Object} Responsive flex-direction.
 */
export function directionMap( pos = {} ) {
	const out = {};
	[ 'desktop', 'tablet', 'mobile' ].forEach( ( d ) => {
		if ( DIRECTIONS[ pos?.[ d ] ] ) {
			out[ d ] = DIRECTIONS[ pos[ d ] ];
		}
	} );
	const sideways = [ pos?.desktop, pos?.tablet ].some( ( p ) => p === 'left' || p === 'right' );
	if ( ! out.mobile && sideways ) {
		out.mobile = 'column';
	}
	return out;
}

const justifyMap = ( align = {} ) => {
	const out = {};
	[ 'desktop', 'tablet', 'mobile' ].forEach( ( d ) => {
		if ( JUSTIFY[ align?.[ d ] ] ) {
			out[ d ] = JUSTIFY[ align[ d ] ];
		}
	} );
	return out;
};

const ms = ( v ) => {
	const n = Number( v );
	return Number.isFinite( n ) && n >= 0 ? `${ Math.round( n ) }ms` : '';
};

/**
 * Instance CSS for the editor. render.php builds the same rules with DynamicCSS
 * (same selectors, same order).
 *
 * @param {Object} a Block attributes.
 * @return {string} CSS.
 */
export default function infoBoxCSS( a ) {
	const selector = blockSelector( a.uniqueId );
	if ( ! selector ) {
		return '';
	}
	const el = `.tb-info-box${ selector }`;
	const hover = `${ el }:hover,${ el }:focus-within`;
	const background = a.background || {};
	const border = a.border || {};
	const lift = Number( a.hoverLift );

	return (
		generateCSS(
			el,
			responsiveToRules( {
				'flex-direction': directionMap( a.mediaPosition ),
				gap: a.mediaGap,
				'text-align': a.textAlign,
				...spacingMap( 'padding', a.padding ),
				...backgroundMap( background ),
				...borderMap( border ),
				'box-shadow': boxShadowValue( a.boxShadow ),
				'transition-duration': ms( a.transitionDuration ),
				'--tb-info-media-size': a.mediaSize,
				'--tb-info-media-justify': justifyMap( a.textAlign ),
			} )
		) +
		generateCSS(
			hover,
			responsiveToRules( {
				...backgroundHoverMap( background ),
				'border-color': border.hoverColor,
				'box-shadow': boxShadowValue( a.hoverShadow ),
				transform: Number.isFinite( lift ) && lift > 0 ? `translateY(-${ Math.round( lift ) }px)` : '',
			} )
		) +
		generateCSS( `${ el }::before`, responsiveToRules( overlayMap( background ) ) ) +
		generateCSS(
			`${ el } .tb-info-box__media-inner`,
			responsiveToRules( {
				color: a.mediaColor?.normal,
				'background-color': a.mediaBackground?.normal,
				padding: a.mediaPadding,
				'transition-duration': ms( a.transitionDuration ),
				...( a.mediaType === 'number' ? typographyMap( a.numberTypography ) : {} ),
			} )
		) +
		generateCSS(
			`${ el }:hover .tb-info-box__media-inner,${ el }:focus-within .tb-info-box__media-inner`,
			responsiveToRules( { color: a.mediaColor?.hover, 'background-color': a.mediaBackground?.hover } )
		) +
		generateCSS(
			`${ el } .tb-info-box__title`,
			responsiveToRules( { ...typographyMap( a.titleTypography ), color: a.titleColor?.normal, 'margin-bottom': a.titleSpacing } )
		) +
		generateCSS(
			`${ el }:hover .tb-info-box__title,${ el }:focus-within .tb-info-box__title`,
			responsiveToRules( { color: a.titleColor?.hover } )
		) +
		generateCSS(
			`${ el } .tb-info-box__desc`,
			responsiveToRules( { ...typographyMap( a.descTypography ), color: a.descColor?.normal, 'margin-bottom': a.descSpacing } )
		) +
		generateCSS(
			`${ el }:hover .tb-info-box__desc,${ el }:focus-within .tb-info-box__desc`,
			responsiveToRules( { color: a.descColor?.hover } )
		) +
		( a.showButton ? buttonElementCSS( `${ el } .tb-info-box__button > .tb-button`, a.button || {} ) : '' )
	);
}
