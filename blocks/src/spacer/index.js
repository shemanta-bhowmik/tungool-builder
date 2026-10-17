import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import transforms from './transforms';
import { spacer as icon } from '../shared/icons';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	transforms,
} );
