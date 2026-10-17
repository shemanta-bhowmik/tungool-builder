import Edit from './edit';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'tungool-builder/latest-posts', {
    ...metadata,
    edit: Edit,
} );