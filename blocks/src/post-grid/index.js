import { registerBlockType, createBlock } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import { postGrid as icon } from '../shared/icons';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'tungool-builder/latest-posts' ],
				transform: ( { postType, postToShow, displayImage, displayExcerpt } ) =>
					createBlock( metadata.name, {
						postType: postType || 'post',
						perPage: postToShow > 0 ? Math.min( postToShow, 50 ) : 12,
						showImage: !! displayImage,
						showExcerpt: !! displayExcerpt,
					} ),
			},
		],
	},
} );
