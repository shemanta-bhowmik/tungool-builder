const HOVERS = [ 'lift', 'zoom' ];

/**
 * Wrapper classes. Mirrors $tb_pg_classes in render.php.
 *
 * @param {Object} a Block attributes.
 * @return {string} Class string.
 */
export function classNames( a ) {
	return [
		'tb-post-grid',
		`tb-post-grid--${ a.layout === 'list' ? 'list' : 'grid' }`,
		a.equalHeight && 'tb-post-grid--equal',
		HOVERS.includes( a.hoverEffect ) && `tb-post-grid--hover-${ a.hoverEffect }`,
		a.uniqueId && `tb-block-${ a.uniqueId }`,
	]
		.filter( Boolean )
		.join( ' ' );
}
