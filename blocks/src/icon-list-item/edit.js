import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useBlockProps, BlockControls, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, Popover, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { LinkControl } from '../shared/controls/compat';
import { IconPicker } from '../shared/controls';
import Icon from '../shared/icons/Icon';
import './edit.scss';

const LINK_SETTINGS = [
	{ id: 'opensInNewTab', title: __( 'Open in new tab', 'tungool-builder' ) },
	{ id: 'nofollow', title: __( 'Mark as nofollow', 'tungool-builder' ) },
	{ id: 'sponsored', title: __( 'Mark as sponsored', 'tungool-builder' ) },
];

export default function Edit( { attributes, setAttributes, context, isSelected } ) {
	const { icon, text, url, opensInNewTab, nofollow, sponsored } = attributes;
	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ anchor, setAnchor ] = useState( null );
	const iconName = icon || context[ 'tungool-builder/iconListIcon' ] || '';
	const unlink = () => setAttributes( { url: '', opensInNewTab: false, nofollow: false, sponsored: false } );

	const blockProps = useBlockProps( { className: 'tb-icon-list-item' } );

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
					{ url && <ToolbarButton icon="editor-unlink" label={ __( 'Remove link', 'tungool-builder' ) } onClick={ unlink } /> }
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
							unlink();
							setIsEditingLink( false );
						} }
						forceIsEditingLink={ ! url }
					/>
				</Popover>
			) }
			<InspectorControls>
				<PanelBody title={ __( 'Item', 'tungool-builder' ) }>
					<IconPicker
						label={ __( 'Icon (overrides the list default)', 'tungool-builder' ) }
						value={ icon }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<li { ...blockProps }>
				<span className="tb-icon-list-item__inner">
					{ iconName && (
						<span className="tb-icon-list-item__icon" aria-hidden="true">
							<Icon name={ iconName } />
						</span>
					) }
					<RichText
						tagName="span"
						className="tb-icon-list-item__text"
						value={ text }
						onChange={ ( next ) => setAttributes( { text: next } ) }
						placeholder={ __( 'List item', 'tungool-builder' ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						withoutInteractiveFormatting
					/>
				</span>
			</li>
		</>
	);
}
