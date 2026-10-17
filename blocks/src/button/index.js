import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import { button as icon } from '../shared/icons';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	icon,
	edit: Edit,
} );
