import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { ResponsiveControl, ColorControl, IconPicker, TypographyControl } from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );
const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units( [ 'px', 'em', 'rem' ] ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'List', 'tungool-builder' ) }>
					<IconPicker label={ __( 'Default icon', 'tungool-builder' ) } value={ attributes.defaultIcon } onChange={ set( 'defaultIcon' ) } />
					<ToggleGroupControl label={ __( 'Layout', 'tungool-builder' ) } value={ attributes.layout } onChange={ set( 'layout' ) } isBlock __nextHasNoMarginBottom>
						<ToggleGroupControlOption value="vertical" label={ __( 'Vertical', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="inline" label={ __( 'Inline', 'tungool-builder' ) } />
					</ToggleGroupControl>
					{ responsiveUnit( __( 'Space between items', 'tungool-builder' ), attributes.gap, set( 'gap' ) ) }
					<ResponsiveControl label={ __( 'Alignment', 'tungool-builder' ) } value={ attributes.align } onChange={ set( 'align' ) }>
						{ ( { value: v, onChange: c } ) => (
							<SelectControl
								value={ v || '' }
								options={ [
									opt( __( 'Default', 'tungool-builder' ), '' ),
									opt( __( 'Start', 'tungool-builder' ), 'flex-start' ),
									opt( __( 'Center', 'tungool-builder' ), 'center' ),
									opt( __( 'End', 'tungool-builder' ), 'flex-end' ),
								] }
								onChange={ c }
								__nextHasNoMarginBottom
							/>
						) }
					</ResponsiveControl>
					<ToggleControl label={ __( 'Divider between items', 'tungool-builder' ) } checked={ !! attributes.divider } onChange={ set( 'divider' ) } __nextHasNoMarginBottom />
					{ attributes.divider && (
						<>
							<SelectControl
								label={ __( 'Divider style', 'tungool-builder' ) }
								value={ attributes.dividerStyle }
								options={ [
									opt( __( 'Solid', 'tungool-builder' ), 'solid' ),
									opt( __( 'Dashed', 'tungool-builder' ), 'dashed' ),
									opt( __( 'Dotted', 'tungool-builder' ), 'dotted' ),
									opt( __( 'Double', 'tungool-builder' ), 'double' ),
								] }
								onChange={ set( 'dividerStyle' ) }
								__nextHasNoMarginBottom
							/>
							<UnitControl
								label={ __( 'Divider width', 'tungool-builder' ) }
								value={ attributes.dividerWidth }
								min={ 0 }
								units={ units( [ 'px' ] ) }
								onChange={ ( next ) => setAttributes( { dividerWidth: next ?? '' } ) }
								__next40pxDefaultSize
							/>
							<ColorControl label={ __( 'Divider color', 'tungool-builder' ) } value={ attributes.dividerColor } onChange={ set( 'dividerColor' ) } />
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Icon', 'tungool-builder' ) } initialOpen={ false }>
					{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
					{ responsiveUnit( __( 'Space after icon', 'tungool-builder' ), attributes.iconGap, set( 'iconGap' ) ) }
					<SelectControl
						label={ __( 'Vertical alignment', 'tungool-builder' ) }
						value={ attributes.iconAlign }
						options={ [
							opt( __( 'Top', 'tungool-builder' ), 'start' ),
							opt( __( 'Middle', 'tungool-builder' ), 'center' ),
							opt( __( 'Bottom', 'tungool-builder' ), 'end' ),
						] }
						onChange={ set( 'iconAlign' ) }
						__nextHasNoMarginBottom
					/>
					<ColorControl label={ __( 'Icon color', 'tungool-builder' ) } value={ attributes.iconColor } onChange={ set( 'iconColor' ) } hover />
				</PanelBody>
				<PanelBody title={ __( 'Text', 'tungool-builder' ) } initialOpen={ false }>
					<TypographyControl value={ attributes.textTypography } onChange={ set( 'textTypography' ) } />
					<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ attributes.textColor } onChange={ set( 'textColor' ) } hover />
				</PanelBody>
			</InspectorControls>
		</>
	);
}
