import { __ } from '@wordpress/i18n';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, BaseControl, GradientPicker } from '@wordpress/components';
import { ResponsiveControl, ColorControl, TypographyControl, IconPicker } from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );
const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, list = [ 'px', 'em', 'rem' ] ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units( list ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

const alignGroup = ( label, value, onChange ) => (
	<ToggleGroupControl
		label={ label }
		hideLabelFromVision
		value={ value || '' }
		onChange={ ( next ) => onChange( next === value ? '' : next ) }
		isBlock
		__nextHasNoMarginBottom
	>
		<ToggleGroupControlOption value="left" label={ __( 'Left', 'tungool-builder' ) } />
		<ToggleGroupControlOption value="center" label={ __( 'Center', 'tungool-builder' ) } />
		<ToggleGroupControlOption value="right" label={ __( 'Right', 'tungool-builder' ) } />
	</ToggleGroupControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const [ gradients ] = useSettings( 'color.gradients' );
	const { lineStyle, elementType, icon, elementPosition } = attributes;
	const pattern = [ 'zigzag', 'wave', 'slashes' ].includes( lineStyle );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Divider', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Style', 'tungool-builder' ) }
						value={ lineStyle }
						options={ [
							opt( __( 'Solid', 'tungool-builder' ), 'solid' ),
							opt( __( 'Dashed', 'tungool-builder' ), 'dashed' ),
							opt( __( 'Dotted', 'tungool-builder' ), 'dotted' ),
							opt( __( 'Double', 'tungool-builder' ), 'double' ),
							opt( __( 'Zigzag', 'tungool-builder' ), 'zigzag' ),
							opt( __( 'Wave', 'tungool-builder' ), 'wave' ),
							opt( __( 'Slashes', 'tungool-builder' ), 'slashes' ),
						] }
						onChange={ set( 'lineStyle' ) }
						__nextHasNoMarginBottom
					/>
					{ responsiveUnit( __( 'Width', 'tungool-builder' ), attributes.width, set( 'width' ), [ '%', 'px' ] ) }
					{ responsiveUnit(
						pattern ? __( 'Pattern height', 'tungool-builder' ) : __( 'Weight', 'tungool-builder' ),
						attributes.weight,
						set( 'weight' ),
						[ 'px' ]
					) }
					<ResponsiveControl label={ __( 'Alignment', 'tungool-builder' ) } value={ attributes.align } onChange={ set( 'align' ) }>
						{ ( { value: v, onChange: c } ) => alignGroup( __( 'Alignment', 'tungool-builder' ), v, c ) }
					</ResponsiveControl>
					{ responsiveUnit( __( 'Space above', 'tungool-builder' ), attributes.spaceAbove, set( 'spaceAbove' ) ) }
					{ responsiveUnit( __( 'Space below', 'tungool-builder' ), attributes.spaceBelow, set( 'spaceBelow' ) ) }
				</PanelBody>

				<PanelBody title={ __( 'Middle element', 'tungool-builder' ) } initialOpen={ elementType !== 'none' }>
					<SelectControl
						label={ __( 'Element', 'tungool-builder' ) }
						value={ elementType }
						options={ [
							opt( __( 'None', 'tungool-builder' ), 'none' ),
							opt( __( 'Text', 'tungool-builder' ), 'text' ),
							opt( __( 'Icon', 'tungool-builder' ), 'icon' ),
						] }
						onChange={ set( 'elementType' ) }
						__nextHasNoMarginBottom
					/>
					{ elementType === 'icon' && (
						<>
							<IconPicker label={ __( 'Icon', 'tungool-builder' ) } value={ icon } onChange={ set( 'icon' ) } />
							{ responsiveUnit( __( 'Icon size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
						</>
					) }
					{ elementType !== 'none' && (
						<>
							<BaseControl label={ __( 'Position', 'tungool-builder' ) } __nextHasNoMarginBottom>
								{ alignGroup( __( 'Position', 'tungool-builder' ), elementPosition, ( next ) =>
									setAttributes( { elementPosition: next || 'center' } )
								) }
							</BaseControl>
							{ responsiveUnit( __( 'Gap', 'tungool-builder' ), attributes.gap, set( 'gap' ) ) }
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Line color', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.color } onChange={ set( 'color' ) } />
					<BaseControl label={ __( 'Gradient (overrides color)', 'tungool-builder' ) } __nextHasNoMarginBottom>
						<GradientPicker
							gradients={ gradients || [] }
							value={ attributes.gradient || null }
							onChange={ ( next ) => setAttributes( { gradient: next || '' } ) }
							clearable
							__nextHasNoMargin
						/>
					</BaseControl>
				</PanelBody>
				{ elementType !== 'none' && (
					<PanelBody title={ __( 'Middle element', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.elementColor } onChange={ set( 'elementColor' ) } />
						{ elementType === 'text' && (
							<TypographyControl value={ attributes.typography } onChange={ set( 'typography' ) } />
						) }
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
