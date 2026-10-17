import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { useBlockProps, RichText, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { useUniqueId, useDeviceType } from '../shared/hooks';
import { inheritedValue } from '../shared/utils';
import Inspector from './inspector';
import textCSS from './styles';
import './edit.scss';

import { TAGS } from './constants';

const FORMATS = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/strikethrough',
	'core/code',
	'core/text-color', // "Highlight" in the format toolbar
	'core/subscript',
	'core/superscript',
];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, name, mergeBlocks, onReplace, onRemove } = props;
	const { uniqueId, content, tagName, align = {}, dropCap } = attributes;
	const [ device ] = useDeviceType();

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-text', dropCap && 'tb-text--drop-cap', uniqueId && `tb-block-${ uniqueId }` ]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = textCSS( attributes );

	return (
		<>
			<BlockControls group="block">
				<AlignmentToolbar
					value={ inheritedValue( align, device ) }
					onChange={ ( value ) => setAttributes( { align: { ...align, [ device ]: value || '' } } ) }
				/>
			</BlockControls>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<RichText
				{ ...blockProps }
				identifier="content"
				tagName={ TAGS.includes( tagName ) ? tagName : 'p' }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				allowedFormats={ FORMATS }
				placeholder={ __( 'Type text…', 'tungool-builder' ) }
				onSplit={ ( value, isOriginal ) => {
					// Same as core/paragraph: the new block keeps settings but gets a fresh uniqueId.
					const block = createBlock( name, {
						...attributes,
						content: value,
						uniqueId: isOriginal ? uniqueId : '',
					} );
					if ( isOriginal ) {
						block.clientId = clientId;
					}
					return block;
				} }
				onMerge={ mergeBlocks }
				onReplace={ onReplace }
				onRemove={ onRemove }
			/>
		</>
	);
}
