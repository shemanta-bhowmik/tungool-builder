import { createBlock } from '@wordpress/blocks';

const ALIGNS = [ 'left', 'center', 'right' ];

// Core/TB heading store alignment as a plain string; TB Text stores it per device.
const toResponsive = ( align ) => ( ALIGNS.includes( align ) ? { desktop: align } : {} );
const fromResponsive = ( align ) => ( ALIGNS.includes( align?.desktop ) ? align.desktop : undefined );

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( { content, align } ) =>
				createBlock( 'tungool-builder/text', { content: content || '', align: toResponsive( align ) } ),
		},
		{
			type: 'block',
			blocks: [ 'tungool-builder/heading' ],
			transform: ( { content, align } ) =>
				createBlock( 'tungool-builder/text', { content: content || '', align: toResponsive( align ) } ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( { content, align } ) =>
				createBlock( 'core/paragraph', { content: content || '', align: fromResponsive( align ) } ),
		},
		{
			type: 'block',
			blocks: [ 'tungool-builder/heading' ],
			transform: ( { content, align } ) =>
				createBlock( 'tungool-builder/heading', { content: content || '', align: fromResponsive( align ) || 'left' } ),
		},
	],
};
