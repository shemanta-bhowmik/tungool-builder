import { registerBlockType, createBlock } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import { image as icon } from '../shared/icons';
import './style.scss';

// core/image caption may be a RichTextData object (WP 6.5+) or a string.
const captionString = ( caption ) => ( caption ? String( caption.toHTMLString?.() ?? caption ) : '' );

registerBlockType( metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { id, url, alt, caption, sizeSlug } ) => {
					const text = captionString( caption );
					return createBlock( metadata.name, {
						id: id || 0,
						url: url || '',
						alt: alt || '',
						sizeSlug: sizeSlug || 'large',
						caption: text,
						showCaption: !! text,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { id, url, alt, caption, showCaption, sizeSlug } ) =>
					createBlock( 'core/image', {
						id: id || undefined,
						url,
						alt,
						caption: showCaption ? caption : '',
						sizeSlug: id ? sizeSlug : undefined,
					} ),
			},
		],
	},
} );
