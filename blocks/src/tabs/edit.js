import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	RichText,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Button, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import tabsCSS from './styles';
import './edit.scss';

const TAB = 'tungool-builder/tab';
const TEMPLATE = [
	[ TAB, { title: __( 'Tab 1', 'tungool-builder' ) } ],
	[ TAB, { title: __( 'Tab 2', 'tungool-builder' ) } ],
];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, orientation, fullWidth, iconPosition, defaultTab } = attributes;
	const vertical = orientation === 'vertical';

	useUniqueId( { attributes, setAttributes, clientId } );

	const { tabs, selectedTab } = useSelect(
		( select ) => {
			const store = select( blockEditorStore );
			const children = store.getBlocks( clientId );
			const selected = store.getSelectedBlockClientId();
			const path = selected ? [ selected, ...store.getBlockParents( selected ) ] : [];
			return {
				tabs: children,
				selectedTab: children.findIndex( ( child ) => path.includes( child.clientId ) ),
			};
		},
		[ clientId ]
	);
	const { insertBlock, removeBlock, moveBlocksUp, moveBlocksDown, updateBlockAttributes } =
		useDispatch( blockEditorStore );

	const [ active, setActive ] = useState( defaultTab || 0 );
	const current = Math.min( Math.max( active, 0 ), Math.max( tabs.length - 1, 0 ) );

	// Selecting a block inside a tab (e.g. from List View) shows that tab.
	useEffect( () => {
		if ( selectedTab > -1 ) {
			setActive( selectedTab );
		}
	}, [ selectedTab ] );

	const addTab = () => {
		const block = createBlock( TAB, {
			/* translators: %d: tab number. */
			title: sprintf( __( 'Tab %d', 'tungool-builder' ), tabs.length + 1 ),
		} );
		insertBlock( block, tabs.length, clientId, false );
		setActive( tabs.length );
	};
	const activeTab = tabs[ current ];
	const move = ( dir ) => {
		if ( ! activeTab ) {
			return;
		}
		if ( dir < 0 ) {
			moveBlocksUp( [ activeTab.clientId ], clientId );
		} else {
			moveBlocksDown( [ activeTab.clientId ], clientId );
		}
		setActive( current + dir );
	};
	const removeTab = () => {
		if ( activeTab && tabs.length > 1 ) {
			removeBlock( activeTab.clientId, false );
			setActive( Math.max( current - 1, 0 ) );
		}
	};

	const blockProps = useBlockProps( {
		className: [
			'tb-tabs',
			`tb-tabs--${ vertical ? 'vertical' : 'horizontal' }`,
			fullWidth && 'tb-tabs--full',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tb-tabs__panels' },
		{ allowedBlocks: [ TAB ], template: TEMPLATE, renderAppender: false }
	);

	// Editor only: hide every panel except the active one.
	const hideCSS = uniqueId
		? `.tb-tabs.tb-block-${ uniqueId } > .tb-tabs__panels > .tb-tab:not(:nth-child(${ current + 1 })){display:none}`
		: '';
	const css = tabsCSS( attributes ) + hideCSS;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton icon="plus" label={ __( 'Add tab', 'tungool-builder' ) } onClick={ addTab } />
					<ToolbarButton
						icon={ vertical ? 'arrow-up-alt2' : 'arrow-left-alt2' }
						label={ __( 'Move tab back', 'tungool-builder' ) }
						onClick={ () => move( -1 ) }
						disabled={ current === 0 }
					/>
					<ToolbarButton
						icon={ vertical ? 'arrow-down-alt2' : 'arrow-right-alt2' }
						label={ __( 'Move tab forward', 'tungool-builder' ) }
						onClick={ () => move( 1 ) }
						disabled={ current >= tabs.length - 1 }
					/>
					<ToolbarButton
						icon="trash"
						label={ __( 'Remove tab', 'tungool-builder' ) }
						onClick={ removeTab }
						disabled={ tabs.length < 2 }
					/>
				</ToolbarGroup>
			</BlockControls>
			<Inspector { ...props } tabs={ tabs } activeTab={ activeTab } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<div className="tb-tabs__nav" role="tablist" aria-orientation={ vertical ? 'vertical' : 'horizontal' }>
					{ tabs.map( ( tab, i ) => {
						const icon = tab.attributes.icon ? (
							<span className="tb-tabs__icon" aria-hidden="true">
								<Icon name={ tab.attributes.icon } />
							</span>
						) : null;
						return (
							// eslint-disable-next-line jsx-a11y/click-events-have-key-events
							<div
								key={ tab.clientId }
								className="tb-tabs__title"
								role="tab"
								aria-selected={ i === current ? 'true' : 'false' }
								tabIndex={ -1 }
								onClick={ () => setActive( i ) }
							>
								{ iconPosition !== 'after' && icon }
								<RichText
									tagName="span"
									className="tb-tabs__title-text"
									value={ tab.attributes.title }
									onChange={ ( title ) => updateBlockAttributes( tab.clientId, { title } ) }
									placeholder={ __( 'Tab title', 'tungool-builder' ) }
									allowedFormats={ [ 'core/bold', 'core/italic' ] }
									withoutInteractiveFormatting
								/>
								{ iconPosition === 'after' && icon }
							</div>
						);
					} ) }
					<Button className="tb-tabs__add" icon="plus" label={ __( 'Add tab', 'tungool-builder' ) } onClick={ addTab } />
				</div>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
