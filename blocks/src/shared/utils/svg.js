/**
 * Editor-preview SVG sanitizer. Mirrors \SB\TungoolBuilder\Helpers\Svg::sanitize(),
 * which is the authoritative sanitizer on the frontend.
 */

export const SVG_MAX_BYTES = 102400;

const ELEMENTS = [
	'svg', 'g', 'path', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'rect', 'defs',
	'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'symbol', 'use', 'title',
	'desc', 'text', 'tspan',
];

const ATTRIBUTES = [
	'viewbox', 'width', 'height', 'preserveaspectratio', 'id', 'class', 'd', 'x', 'y', 'x1', 'y1',
	'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'points', 'transform', 'fill', 'fill-rule',
	'fill-opacity', 'clip-rule', 'clip-path', 'mask', 'stroke', 'stroke-width', 'stroke-linecap',
	'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
	'stroke-opacity', 'opacity', 'offset', 'stop-color', 'stop-opacity', 'gradientunits',
	'gradienttransform', 'spreadmethod', 'clippathunits', 'maskunits', 'font-size', 'font-family',
	'font-weight', 'text-anchor', 'href', 'xlink:href',
];

const isSafeValue = ( name, value ) => {
	if ( /(javascript|data|vbscript)\s*:/i.test( value ) ) {
		return false;
	}
	if ( name === 'href' || name === 'xlink:href' ) {
		return /^#[\w.-]+$/.test( value );
	}
	const urls = [ ...value.matchAll( /url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi ) ];
	return urls.every( ( m ) => m[ 2 ].trim().startsWith( '#' ) );
};

const cleanNode = ( el ) => {
	[ ...el.childNodes ].forEach( ( child ) => {
		if ( child.nodeType === 1 ) {
			if ( ELEMENTS.includes( child.localName.toLowerCase() ) ) {
				cleanNode( child );
			} else {
				child.remove();
			}
		} else if ( child.nodeType !== 3 ) {
			child.remove();
		}
	} );
	[ ...el.attributes ].forEach( ( attr ) => {
		const name = attr.name.toLowerCase();
		if ( ! ATTRIBUTES.includes( name ) || ! isSafeValue( name, attr.value.trim() ) ) {
			el.removeAttribute( attr.name );
		}
	} );
};

/**
 * @param {string} raw         Untrusted SVG markup.
 * @param {string} [className] Class for the root <svg>.
 * @return {string} Clean SVG markup, '' when invalid.
 */
export function sanitizeSvg( raw, className = 'tb-icon' ) {
	if ( typeof raw !== 'string' || ! raw.trim() || raw.length > SVG_MAX_BYTES ) {
		return '';
	}
	if ( /<!(DOCTYPE|ENTITY)/i.test( raw ) ) {
		return '';
	}
	const doc = new window.DOMParser().parseFromString( raw.trim(), 'image/svg+xml' );
	const root = doc.documentElement;
	if ( ! root || root.localName.toLowerCase() !== 'svg' || doc.getElementsByTagName( 'parsererror' ).length ) {
		return '';
	}
	cleanNode( root );
	if ( ! root.hasAttribute( 'viewBox' ) ) {
		const w = parseFloat( root.getAttribute( 'width' ) );
		const h = parseFloat( root.getAttribute( 'height' ) );
		if ( w > 0 && h > 0 ) {
			root.setAttribute( 'viewBox', `0 0 ${ w } ${ h }` );
		}
	}
	root.setAttribute( 'class', className );
	root.setAttribute( 'width', '1em' );
	root.setAttribute( 'height', '1em' );
	root.setAttribute( 'aria-hidden', 'true' );
	root.setAttribute( 'focusable', 'false' );
	return new window.XMLSerializer().serializeToString( root );
}
