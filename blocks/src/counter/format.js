/**
 * Number formatting shared by the editor and view.js.
 * Mirrors number_format() in render.php.
 *
 * @param {number} value
 * @param {number} decimals
 * @param {string} thousands Thousands separator ('' for none).
 * @param {string} point     Decimal separator.
 * @return {string} Formatted number.
 */
export function formatNumber( value, decimals = 0, thousands = ',', point = '.' ) {
	const d = clampDecimals( decimals );
	const num = Number( value ) || 0;
	const factor = Math.pow( 10, d );
	const abs = Math.round( Math.abs( num ) * factor ) / factor;
	const [ int, frac = '' ] = abs.toFixed( d ).split( '.' );
	const grouped = int.replace( /\B(?=(\d{3})+(?!\d))/g, thousands );
	return ( num < 0 && abs !== 0 ? '-' : '' ) + grouped + ( d ? point + frac : '' );
}

export const clampDecimals = ( decimals ) => Math.max( 0, Math.min( 6, parseInt( decimals, 10 ) || 0 ) );
