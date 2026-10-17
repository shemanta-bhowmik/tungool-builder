import { __ } from '@wordpress/i18n';

const NAME = 'tungool-builder/container';

// Small layout preview icon: one rect per column, widths in 48-unit grid.
const columnsIcon = ( widths ) => {
	let x = 0;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24" width="48" height="24" aria-hidden="true">
			{ widths.map( ( w, i ) => {
				const rect = <rect key={ i } x={ x + 1 } y="1" width={ w - 2 } height="22" rx="2" fill="currentColor" />;
				x += w;
				return rect;
			} ) }
		</svg>
	);
};

const column = () => [ NAME, { contentWidth: 'full' } ];

const grid = ( desktop ) => ( {
	display: { desktop: 'grid' },
	gridColumns: { desktop, mobile: '1' },
	gap: { desktop: '24px' },
} );

/** Variation picker options. scope 'block' = shown only in the placeholder picker. */
const variations = [
	{
		name: 'one-column',
		title: __( '1 column', 'tungool-builder' ),
		icon: columnsIcon( [ 48 ] ),
		attributes: grid( '1' ),
		innerBlocks: [ column() ],
		scope: [ 'block' ],
		isDefault: true,
	},
	{
		name: 'two-columns-equal',
		title: __( '2 columns (50/50)', 'tungool-builder' ),
		icon: columnsIcon( [ 24, 24 ] ),
		attributes: grid( '2' ),
		innerBlocks: [ column(), column() ],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns-equal',
		title: __( '3 columns', 'tungool-builder' ),
		icon: columnsIcon( [ 16, 16, 16 ] ),
		attributes: grid( '3' ),
		innerBlocks: [ column(), column(), column() ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-33-66',
		title: __( '2 columns (33/66)', 'tungool-builder' ),
		icon: columnsIcon( [ 16, 32 ] ),
		attributes: grid( '1fr 2fr' ),
		innerBlocks: [ column(), column() ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-66-33',
		title: __( '2 columns (66/33)', 'tungool-builder' ),
		icon: columnsIcon( [ 32, 16 ] ),
		attributes: grid( '2fr 1fr' ),
		innerBlocks: [ column(), column() ],
		scope: [ 'block' ],
	},
];

export default variations;
