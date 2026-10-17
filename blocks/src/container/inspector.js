import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	BorderControl,
	BoxShadowControl,
	BackgroundControl,
} from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';
import { useDeviceType } from '../shared/hooks';
import { inheritedValue } from '../shared/utils';

export const TAGS = [ 'div', 'section', 'header', 'footer', 'main', 'article', 'aside' ];

const opt = ( label, value ) => ( { label, value } );
const DEFAULT = opt( __( 'Default', 'tungool-builder' ), '' );

const DISPLAY = [ DEFAULT, opt( __( 'Flex', 'tungool-builder' ), 'flex' ), opt( __( 'Grid', 'tungool-builder' ), 'grid' ) ];
const DIRECTIONS = [
	DEFAULT,
	opt( __( 'Column', 'tungool-builder' ), 'column' ),
	opt( __( 'Row', 'tungool-builder' ), 'row' ),
	opt( __( 'Column reverse', 'tungool-builder' ), 'column-reverse' ),
	opt( __( 'Row reverse', 'tungool-builder' ), 'row-reverse' ),
];
const JUSTIFY = [
	DEFAULT,
	opt( __( 'Start', 'tungool-builder' ), 'flex-start' ),
	opt( __( 'Center', 'tungool-builder' ), 'center' ),
	opt( __( 'End', 'tungool-builder' ), 'flex-end' ),
	opt( __( 'Space between', 'tungool-builder' ), 'space-between' ),
	opt( __( 'Space around', 'tungool-builder' ), 'space-around' ),
	opt( __( 'Space evenly', 'tungool-builder' ), 'space-evenly' ),
];
const ALIGN = [
	DEFAULT,
	opt( __( 'Stretch', 'tungool-builder' ), 'stretch' ),
	opt( __( 'Start', 'tungool-builder' ), 'flex-start' ),
	opt( __( 'Center', 'tungool-builder' ), 'center' ),
	opt( __( 'End', 'tungool-builder' ), 'flex-end' ),
];
const WRAP = [ DEFAULT, opt( __( 'No wrap', 'tungool-builder' ), 'nowrap' ), opt( __( 'Wrap', 'tungool-builder' ), 'wrap' ) ];
const SIZE_UNITS = [ 'px', '%', 'vw', 'vh', 'rem', 'em' ].map( ( u ) => ( { value: u, label: u } ) );

const responsiveSelect = ( label, value, onChange, options ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<SelectControl value={ v || '' } options={ options } onChange={ c } __nextHasNoMarginBottom />
		) }
	</ResponsiveControl>
);
const responsiveUnit = ( label, value, onChange ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl
				value={ v ?? '' }
				min={ 0 }
				units={ SIZE_UNITS }
				onChange={ ( next ) => c( next ?? '' ) }
				__next40pxDefaultSize
			/>
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { contentWidth, hideOn = {} } = attributes;
	const [ device ] = useDeviceType();
	const display = inheritedValue( attributes.display, device ) || 'flex';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'tungool-builder' ) }>
					{ responsiveSelect( __( 'Display', 'tungool-builder' ), attributes.display, set( 'display' ), DISPLAY ) }

					{ display === 'flex' && (
						<>
							{ responsiveSelect( __( 'Direction', 'tungool-builder' ), attributes.direction, set( 'direction' ), DIRECTIONS ) }
							{ responsiveSelect( __( 'Justify content', 'tungool-builder' ), attributes.justify, set( 'justify' ), JUSTIFY ) }
							{ responsiveSelect( __( 'Align items', 'tungool-builder' ), attributes.alignItems, set( 'alignItems' ), ALIGN ) }
							{ responsiveSelect( __( 'Wrap', 'tungool-builder' ), attributes.wrap, set( 'wrap' ), WRAP ) }
						</>
					) }

					{ display === 'grid' && (
						<>
							<ResponsiveControl
								label={ __( 'Columns', 'tungool-builder' ) }
								value={ attributes.gridColumns }
								onChange={ set( 'gridColumns' ) }
							>
								{ ( { value: v, onChange: c } ) => (
									<TextControl
										value={ v ?? '' }
										onChange={ c }
										help={ __( 'A number (e.g. 3) or a template (e.g. 1fr 2fr).', 'tungool-builder' ) }
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
								) }
							</ResponsiveControl>
							{ responsiveSelect( __( 'Align items', 'tungool-builder' ), attributes.alignItems, set( 'alignItems' ), ALIGN ) }
						</>
					) }

					{ responsiveUnit( __( 'Gap', 'tungool-builder' ), attributes.gap, set( 'gap' ) ) }
				</PanelBody>

				<PanelBody title={ __( 'Size', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Content width', 'tungool-builder' ) }
						value={ contentWidth }
						options={ [
							opt( __( 'Boxed', 'tungool-builder' ), 'boxed' ),
							opt( __( 'Full width', 'tungool-builder' ), 'full' ),
						] }
						onChange={ set( 'contentWidth' ) }
						help={ __( 'Boxed limits the content to the theme content width, or the max width below.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
					/>
					{ contentWidth === 'boxed' &&
						responsiveUnit( __( 'Content max width', 'tungool-builder' ), attributes.maxWidth, set( 'maxWidth' ) ) }
					{ responsiveUnit( __( 'Min height', 'tungool-builder' ), attributes.minHeight, set( 'minHeight' ) ) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Background', 'tungool-builder' ) } initialOpen={ false }>
					<BackgroundControl value={ attributes.background } onChange={ set( 'background' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Spacing', 'tungool-builder' ) } initialOpen={ false }>
					<SpacingControl type="padding" value={ attributes.padding } onChange={ set( 'padding' ) } />
					<SpacingControl type="margin" value={ attributes.margin } onChange={ set( 'margin' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Border & Radius', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } hover />
				</PanelBody>
				<PanelBody title={ __( 'Box Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="advanced">
				<SelectControl
					label={ __( 'HTML element', 'tungool-builder' ) }
					value={ attributes.tagName }
					options={ TAGS.map( ( t ) => opt( `<${ t }>`, t ) ) }
					onChange={ set( 'tagName' ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Hide on desktop', 'tungool-builder' ) }
					checked={ !! hideOn.desktop }
					onChange={ ( v ) => setAttributes( { hideOn: { ...hideOn, desktop: v } } ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Hide on tablet', 'tungool-builder' ) }
					checked={ !! hideOn.tablet }
					onChange={ ( v ) => setAttributes( { hideOn: { ...hideOn, tablet: v } } ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Hide on mobile', 'tungool-builder' ) }
					checked={ !! hideOn.mobile }
					onChange={ ( v ) => setAttributes( { hideOn: { ...hideOn, mobile: v } } ) }
					__nextHasNoMarginBottom
				/>
			</InspectorControls>
		</>
	);
}
