import Edit from './edit';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( metadata.name, {
    ...metadata,
    edit: Edit,
} );