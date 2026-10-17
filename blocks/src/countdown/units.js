/**
 * Unit split shared by the editor and view.js. Mirrors render.php:
 * the first visible unit absorbs the hidden larger ones (no days → 50 hours).
 */
export const UNITS = [
	{ key: 'days', size: 86400 },
	{ key: 'hours', size: 3600 },
	{ key: 'minutes', size: 60 },
	{ key: 'seconds', size: 1 },
];

/**
 * @param {number}   seconds Remaining seconds.
 * @param {string[]} shown   Visible unit keys.
 * @return {Object} { days: '02', ... } for visible units.
 */
export function splitTime( seconds, shown ) {
	let rest = Math.max( 0, Math.floor( seconds ) );
	const out = {};
	UNITS.forEach( ( { key, size } ) => {
		if ( shown.includes( key ) ) {
			const v = Math.floor( rest / size );
			rest -= v * size;
			out[ key ] = String( v ).padStart( 2, '0' );
		}
	} );
	return out;
}
