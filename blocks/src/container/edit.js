import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate, store as blocksStore } from '@wordpress/blocks';
import { useUniqueId } from '../shared/hooks';
import Inspector, { TAGS } from './inspector';
import containerCSS from './styles';
import metadata from './block.json';
import './edit.scss';

function Placeholder( { clientId, setAttributes, onSkip, blockProps } ) {
	const variations = useSelect(
		( select ) => select( blocksStore ).getBlockVariations( metadata.name, 'block' ),
		[]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	return (
		<div { ...blockProps }>
			<BlockVariationPicker
				label={ __( 'Container', 'tungool-builder' ) }
				instructions={ __( 'Choose a layout, or skip to start with an empty container.', 'tungool-builder' ) }
				variations={ variations }
				allowSkip
				onSelect={ ( variation ) => {
					if ( ! variation ) {
						onSkip();
						return;
					}
					if ( variation.attributes ) {
						setAttributes( variation.attributes );
					}
					if ( variation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate( variation.innerBlocks ),
							true
						);
					}
				} }
			/>
		</div>
	);
}

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, contentWidth, tagName, background = {}, hideOn = {} } = attributes;
	const [ skipped, setSkipped ] = useState( false );

	useUniqueId( { attributes, setAttributes, clientId } );

	const { hasInnerBlocks, isNested } = useSelect(
		( select ) => {
			const store = select( blockEditorStore );
			return {
				hasInnerBlocks: store.getBlockCount( clientId ) > 0,
				isNested: store.getBlockParentsByBlockName( clientId, metadata.name ).length > 0,
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: [
			'tb-container',
			`tb-container--${ contentWidth === 'full' ? 'full' : 'boxed' }`,
			background?.overlay?.color && 'tb-container--overlay',
			uniqueId && `tb-block-${ uniqueId }`,
			// Editor keeps hidden blocks visible (dimmed) so they stay selectable.
			hideOn.desktop && 'tb-editor-hidden-desktop',
			hideOn.tablet && 'tb-editor-hidden-tablet',
			hideOn.mobile && 'tb-editor-hidden-mobile',
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tb-container__inner' },
		{ renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender }
	);

	const Tag = TAGS.includes( tagName ) ? tagName : 'div';
	const css = containerCSS( attributes );

	if ( ! hasInnerBlocks && ! isNested && ! skipped ) {
		return (
			<Placeholder
				clientId={ clientId }
				setAttributes={ setAttributes }
				onSkip={ () => setSkipped( true ) }
				blockProps={ blockProps }
			/>
		);
	}

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<Tag { ...blockProps }>
				<div { ...innerBlocksProps } />
			</Tag>
		</>
	);
}
