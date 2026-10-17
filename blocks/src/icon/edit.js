import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { Popover, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { LinkControl } from '../shared/controls/compat';
import { useUniqueId } from '../shared/hooks';
import { sanitizeSvg } from '../shared/utils';
import Icon, { library } from '../shared/icons/Icon';
import Inspector from './inspector';
import iconCSS from './styles';
import './edit.scss';

const LINK_SETTINGS = [
	{ id: 'opensInNewTab', title: __( 'Open in new tab', 'tungool-builder' ) },
	{ id: 'nofollow', title: __( 'Mark as nofollow', 'tungool-builder' ) },
	{ id: 'sponsored', title: __( 'Mark as sponsored', 'tungool-builder' ) },
];

export const VIEWS = [ 'default', 'stacked', 'framed' ];
export const SHAPES = [ 'circle', 'square', 'rounded' ];
export const ANIMATIONS = [ 'none', 'grow', 'rotate', 'float' ];

/**
 * Class list for the inner element. Same as render.php.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Classes.
 */
export const iconClasses = ( { view, shape, hoverAnimation } ) => {
	const v = VIEWS.includes( view ) ? view : 'default';
	return [
		'tb-icon-el',
		`tb-icon-el--${ v }`,
		v !== 'default' && `tb-icon-el--${ SHAPES.includes( shape ) ? shape : 'circle' }`,
		ANIMATIONS.includes( hoverAnimation ) && hoverAnimation !== 'none' && `tb-icon-el--anim-${ hoverAnimation }`,
	]
		.filter( Boolean )
		.join( ' ' );
};

export default function Edit( props ) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { uniqueId, iconType, icon, customSvg, label, url, opensInNewTab, nofollow, sponsored } = attributes;
	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ anchor, setAnchor ] = useState( null );

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-icon-wrap', uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
	} );
	const css = iconCSS( attributes );
	const custom = iconType === 'custom' ? sanitizeSvg( customSvg ) : '';
	let svg = null;
	if ( iconType === 'custom' ) {
		svg = custom ? <RawHTML>{ custom }</RawHTML> : null;
	} else if ( library[ icon ] ) {
		svg = <Icon name={ icon } />;
	}
	const unlink = () => setAttributes( { url: '', opensInNewTab: false, nofollow: false, sponsored: false } );

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
						<ToolbarButton icon="editor-unlink" label={ __( 'Remove link', 'tungool-builder' ) } onClick={ unlink } />
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
							unlink();
							setIsEditingLink( false );
						} }
						forceIsEditingLink={ ! url }
					/>
				</Popover>
			) }
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ svg ? (
					<span
						className={ iconClasses( attributes ) }
						role={ label ? 'img' : undefined }
						aria-label={ label || undefined }
						aria-hidden={ label ? undefined : 'true' }
					>
						{ svg }
					</span>
				) : (
					<span className="tb-icon-wrap__placeholder">
						{ iconType === 'custom'
							? __( 'Paste or upload an SVG in the block settings.', 'tungool-builder' )
							: __( 'Choose an icon in the block settings.', 'tungool-builder' ) }
					</span>
				) }
			</div>
		</>
	);
}
