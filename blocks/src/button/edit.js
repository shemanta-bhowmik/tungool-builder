import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	RichText,
	BlockControls,
} from '@wordpress/block-editor';
import { Popover, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { LinkControl } from '../shared/controls/compat';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import buttonCSS from './styles';
import './edit.scss';

const LINK_SETTINGS = [
	{ id: 'opensInNewTab', title: __( 'Open in new tab', 'tungool-builder' ) },
	{ id: 'nofollow', title: __( 'Mark as nofollow', 'tungool-builder' ) },
	{ id: 'sponsored', title: __( 'Mark as sponsored', 'tungool-builder' ) },
];

const PRESETS = [ 'primary', 'secondary', 'outline', 'text' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { uniqueId, text, url, opensInNewTab, nofollow, sponsored, preset, icon, iconPosition, ariaLabel } = attributes;
	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ anchor, setAnchor ] = useState( null );

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-button-wrap', uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
	} );
	const css = buttonCSS( attributes );
	const iconEl = icon ? (
		<span className="tb-button__icon">
			<Icon name={ icon } />
		</span>
	) : null;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="admin-links"
						label={ url ? __( 'Edit link', 'tungool-builder' ) : __( 'Add link', 'tungool-builder' ) }
						onClick={ () => setIsEditingLink( true ) }
						isActive={ !! url }
						ref={ setAnchor }
					/>
					{ url && (
						<ToolbarButton
							icon="editor-unlink"
							label={ __( 'Remove link', 'tungool-builder' ) }
							onClick={ () =>
								setAttributes( { url: '', opensInNewTab: false, nofollow: false, sponsored: false } )
							}
						/>
					) }
				</ToolbarGroup>
			</BlockControls>
			{ isSelected && isEditingLink && (
				<Popover anchor={ anchor } placement="bottom" onClose={ () => setIsEditingLink( false ) } focusOnMount="firstElement">
					<LinkControl
						value={ { url, opensInNewTab, nofollow, sponsored } }
						settings={ LINK_SETTINGS }
						onChange={ ( next ) =>
							setAttributes( {
								url: next.url || '',
								opensInNewTab: !! next.opensInNewTab,
								nofollow: !! next.nofollow,
								sponsored: !! next.sponsored,
							} )
						}
						onRemove={ () => {
							setAttributes( { url: '', opensInNewTab: false, nofollow: false, sponsored: false } );
							setIsEditingLink( false );
						} }
						forceIsEditingLink={ ! url }
					/>
				</Popover>
			) }
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<span
					className={ `tb-button tb-button--${ PRESETS.includes( preset ) ? preset : 'primary' }` }
					aria-label={ ariaLabel || undefined }
				>
					{ iconPosition === 'before' && iconEl }
					<RichText
						tagName="span"
						className="tb-button__text"
						value={ text }
						onChange={ ( value ) => setAttributes( { text: value } ) }
						placeholder={ icon ? '' : __( 'Add text…', 'tungool-builder' ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						withoutInteractiveFormatting
						disableLineBreaks
						identifier="text"
					/>
					{ iconPosition !== 'before' && iconEl }
				</span>
			</div>
		</>
	);
}
