import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { ResponsiveControl } from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';
import { useUniqueId } from '../shared/hooks';
import buttonsCSS from './styles';
import './edit.scss';

const ALLOWED = [ 'tungool-builder/button' ];
const TEMPLATE = [ [ 'tungool-builder/button', { text: __( 'Button', 'tungool-builder' ) } ] ];

const opt = ( label, value ) => ( { label, value } );
const DEFAULT = opt( __( 'Default', 'tungool-builder' ), '' );
const DIRECTIONS = [ DEFAULT, opt( __( 'Row', 'tungool-builder' ), 'row' ), opt( __( 'Column', 'tungool-builder' ), 'column' ) ];
const JUSTIFY = [
	DEFAULT,
	opt( __( 'Start', 'tungool-builder' ), 'flex-start' ),
	opt( __( 'Center', 'tungool-builder' ), 'center' ),
	opt( __( 'End', 'tungool-builder' ), 'flex-end' ),
	opt( __( 'Space between', 'tungool-builder' ), 'space-between' ),
];
const ALIGN = [
	DEFAULT,
	opt( __( 'Start', 'tungool-builder' ), 'flex-start' ),
	opt( __( 'Center', 'tungool-builder' ), 'center' ),
	opt( __( 'End', 'tungool-builder' ), 'flex-end' ),
	opt( __( 'Stretch', 'tungool-builder' ), 'stretch' ),
];
const WRAP = [ DEFAULT, opt( __( 'Wrap', 'tungool-builder' ), 'wrap' ), opt( __( 'No wrap', 'tungool-builder' ), 'nowrap' ) ];

const responsiveSelect = ( label, value, onChange, options ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<SelectControl value={ v || '' } options={ options } onChange={ c } __nextHasNoMarginBottom />
		) }
	</ResponsiveControl>
);

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { uniqueId, stackOnMobile } = attributes;
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [
			'tb-buttons',
			stackOnMobile && 'tb-buttons--stack-mobile',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED,
		template: TEMPLATE,
		orientation: 'horizontal',
	} );
	const css = buttonsCSS( attributes );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'tungool-builder' ) }>
					{ responsiveSelect( __( 'Direction', 'tungool-builder' ), attributes.direction, set( 'direction' ), DIRECTIONS ) }
					{ responsiveSelect( __( 'Justify', 'tungool-builder' ), attributes.justify, set( 'justify' ), JUSTIFY ) }
					{ responsiveSelect( __( 'Align', 'tungool-builder' ), attributes.alignItems, set( 'alignItems' ), ALIGN ) }
					<ResponsiveControl label={ __( 'Gap', 'tungool-builder' ) } value={ attributes.gap } onChange={ set( 'gap' ) }>
						{ ( { value: v, onChange: c } ) => (
							<UnitControl
								value={ v ?? '' }
								min={ 0 }
								units={ [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) }
								onChange={ ( next ) => c( next ?? '' ) }
								__next40pxDefaultSize
							/>
						) }
					</ResponsiveControl>
					{ responsiveSelect( __( 'Wrap', 'tungool-builder' ), attributes.wrap, set( 'wrap' ), WRAP ) }
					<ToggleControl
						label={ __( 'Stack full width on mobile', 'tungool-builder' ) }
						checked={ !! stackOnMobile }
						onChange={ set( 'stackOnMobile' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			{ css && <style>{ css }</style> }
			<div { ...innerBlocksProps } />
		</>
	);
}
