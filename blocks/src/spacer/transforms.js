import { createBlock } from '@wordpress/blocks';

const DEFAULT = '100px';
const PRESET = /^var:preset\|spacing\|([\w-]+)$/;
const PRESET_CSS = /^var\(--wp--preset--spacing--([\w-]+)\)$/;

// core/spacer height: number (old), '100px', or 'var:preset|spacing|50'.
const fromCore = ( height ) => {
	if ( typeof height === 'number' ) {
		return `${ height }px`;
	}
	const value = String( height || '' ).trim();
	const preset = value.match( PRESET );
	if ( preset ) {
		return `var(--wp--preset--spacing--${ preset[ 1 ] })`;
	}
	return value || DEFAULT;
};

const toCore = ( height ) => {
	const value = String( height || '' ).trim();
	const preset = value.match( PRESET_CSS );
	if ( preset ) {
		return `var:preset|spacing|${ preset[ 1 ] }`;
	}
	return value || DEFAULT;
};

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( { height } ) =>
				createBlock( 'tungool-builder/spacer', { height: { desktop: fromCore( height ) } } ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( { height } ) => createBlock( 'core/spacer', { height: toCore( height?.desktop ) } ),
		},
	],
};
