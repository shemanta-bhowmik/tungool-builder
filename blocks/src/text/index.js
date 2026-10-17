import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import transforms from './transforms';
import metadata from './block.json';
import { text as icon } from '../shared/icons';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	transforms,
	merge: ( attributes, attributesToMerge ) => ( {
		content: ( attributes.content || '' ) + ( attributesToMerge.content || '' ),
	} ),
} );
