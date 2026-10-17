import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useBlockProps, useInnerBlocksProps, RichText, store as blockEditorStore } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import './edit.scss';

const TEMPLATE = [ [ 'core/paragraph', { placeholder: __( 'Item content…', 'tungool-builder' ) } ] ];
const TAGS = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'div' ];

export default function Edit( { attributes, setAttributes, clientId, context, isSelected } ) {
	const { uniqueId, title } = attributes;
	const [ toggled, setToggled ] = useState( false );

	useUniqueId( { attributes, setAttributes, clientId } );

	const hasSelectedChild = useSelect(
		( select ) => select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	// In the editor an item opens while it (or its content) is selected, or when toggled.
	const open = toggled || isSelected || hasSelectedChild;

	const Tag = TAGS.includes( context[ 'tungool-builder/accordionTitleTag' ] ) ? context[ 'tungool-builder/accordionTitleTag' ] : 'h3';
	const left = context[ 'tungool-builder/accordionIconPosition' ] === 'left';
	const closedIcon = context[ 'tungool-builder/accordionIconClosed' ] ?? 'plus';
	const openIcon = context[ 'tungool-builder/accordionIconOpen' ] || closedIcon;

	const blockProps = useBlockProps( {
		className: [
			'tb-accordion-item',
			`tb-accordion-item--icon-${ left ? 'left' : 'right' }`,
			open && 'is-open',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const { children, ...innerProps } = useInnerBlocksProps( { className: 'tb-accordion-item__content' }, { template: TEMPLATE, templateLock: false } );

	const icon = ( closedIcon || openIcon ) && (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<span className="tb-accordion-item__icon" aria-hidden="true" onClick={ () => setToggled( ! open ) }>
			<span className="tb-accordion-item__icon-closed">
				<Icon name={ closedIcon } />
			</span>
			<span className="tb-accordion-item__icon-open">
				<Icon name={ openIcon } />
			</span>
		</span>
	);
	const text = (
		<RichText
			tagName="span"
			className="tb-accordion-item__title-text"
			value={ title }
			onChange={ ( next ) => setAttributes( { title: next } ) }
			placeholder={ __( 'Item title', 'tungool-builder' ) }
			allowedFormats={ [ 'core/bold', 'core/italic' ] }
			withoutInteractiveFormatting
		/>
	);

	return (
		<div { ...blockProps }>
			<Tag className="tb-accordion-item__heading">
				<div className="tb-accordion-item__title" aria-expanded={ open ? 'true' : 'false' }>
					{ left ? icon : text }
					{ left ? text : icon }
				</div>
			</Tag>
			<div className="tb-accordion-item__panel" hidden={ ! open }>
				<div { ...innerProps }>{ children }</div>
			</div>
		</div>
	);
}
