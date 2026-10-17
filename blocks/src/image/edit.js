import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	useBlockProps,
	RichText,
	BlockControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useUniqueId } from '../shared/hooks';
import { image as icon } from '../shared/icons';
import Inspector from './inspector';
import imageCSS, { HOVER_EFFECTS } from './styles';
import { sizeData } from './media';
import './edit.scss';

const ALLOWED = [ 'image' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { uniqueId, id, url, alt, width, height, sizeSlug, showCaption, caption, hoverEffect } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const { media, imageSizes } = useSelect(
		( select ) => ( {
			media: id ? select( coreStore ).getMedia( id, { context: 'view' } ) : null,
			imageSizes: select( blockEditorStore ).getSettings().imageSizes || [],
		} ),
		[ id ]
	);

	const onSelectImage = ( next ) => {
		if ( ! next?.url && ! next?.source_url ) {
			return;
		}
		const slug = id ? sizeSlug : 'large';
		setAttributes( {
			id: next.id || 0,
			alt: next.alt || next.alt_text || '',
			sizeSlug: slug,
			...sizeData( next, slug ),
		} );
	};

	const onSelectURL = ( nextUrl ) => {
		if ( nextUrl !== url ) {
			setAttributes( { id: 0, url: nextUrl, alt: '', width: 0, height: 0 } );
		}
	};

	const blockProps = useBlockProps( {
		className: [
			'tb-image',
			`tb-image--hover-${ HOVER_EFFECTS.includes( hoverEffect ) ? hoverEffect : 'none' }`,
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );

	if ( ! url ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ icon }
					labels={ {
						title: __( 'Image', 'tungool-builder' ),
						instructions: __( 'Upload an image, pick one from the Media Library, or insert from a URL.', 'tungool-builder' ),
					} }
					onSelect={ onSelectImage }
					onSelectURL={ onSelectURL }
					accept="image/*"
					allowedTypes={ ALLOWED }
				/>
			</div>
		);
	}

	const css = imageCSS( attributes );

	return (
		<>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ url }
					allowedTypes={ ALLOWED }
					accept="image/*"
					onSelect={ onSelectImage }
					onSelectURL={ onSelectURL }
				/>
			</BlockControls>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						icon="editor-quote"
						label={ showCaption ? __( 'Remove caption', 'tungool-builder' ) : __( 'Add caption', 'tungool-builder' ) }
						isPressed={ showCaption }
						onClick={ () => setAttributes( { showCaption: ! showCaption } ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<Inspector { ...props } media={ media } imageSizes={ imageSizes } />
			{ css && <style>{ css }</style> }
			<figure { ...blockProps }>
				<div className="tb-image__media">
					<img
						className="tb-image__img"
						src={ url }
						alt={ alt || media?.alt_text || '' }
						width={ width || undefined }
						height={ height || undefined }
					/>
				</div>
				{ showCaption && ( isSelected || ! RichText.isEmpty( caption ) ) && (
					<RichText
						tagName="figcaption"
						className="tb-image__caption"
						value={ caption }
						onChange={ ( value ) => setAttributes( { caption: value } ) }
						placeholder={ __( 'Add caption', 'tungool-builder' ) }
						identifier="caption"
					/>
				) }
			</figure>
		</>
	);
}
