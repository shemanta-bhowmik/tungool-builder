import { __ } from '@wordpress/i18n';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	GradientControl,
	BorderControl,
	BoxShadowControl,
} from '../shared/controls';
import { UnitControl, BorderControl as CoreBorderControl } from '../shared/controls/compat';
import { inheritedValue } from '../shared/utils';
import { TAGS } from './constants';

const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, list ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units( list ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { tagName, dropCap, columns = {}, background = {} } = attributes;
	const [ palette ] = useSettings( 'color.palette' );
	const hasColumns = [ 'desktop', 'tablet', 'mobile' ].some( ( d ) => Number( columns[ d ] ) > 1 );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Text', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'HTML tag', 'tungool-builder' ) }
						value={ TAGS.includes( tagName ) ? tagName : 'p' }
						options={ TAGS.map( ( t ) => ( { label: `<${ t }>`, value: t } ) ) }
						onChange={ set( 'tagName' ) }
						__nextHasNoMarginBottom
					/>
					<ResponsiveControl
						label={ __( 'Alignment', 'tungool-builder' ) }
						value={ attributes.align }
						onChange={ set( 'align' ) }
					>
						{ ( { value: v, onChange: c } ) => (
							<SelectControl
								value={ v || '' }
								options={ [
									{ label: __( 'Default', 'tungool-builder' ), value: '' },
									{ label: __( 'Left', 'tungool-builder' ), value: 'left' },
									{ label: __( 'Center', 'tungool-builder' ), value: 'center' },
									{ label: __( 'Right', 'tungool-builder' ), value: 'right' },
									{ label: __( 'Justify', 'tungool-builder' ), value: 'justify' },
								] }
								onChange={ c }
								__nextHasNoMarginBottom
							/>
						) }
					</ResponsiveControl>
					{ responsiveUnit( __( 'Max width', 'tungool-builder' ), attributes.maxWidth, set( 'maxWidth' ), [ 'px', '%', 'ch', 'em', 'rem' ] ) }
				</PanelBody>

				<PanelBody title={ __( 'Drop Cap', 'tungool-builder' ) } initialOpen={ dropCap }>
					<ToggleControl
						label={ __( 'Show a large first letter', 'tungool-builder' ) }
						checked={ dropCap }
						onChange={ set( 'dropCap' ) }
						__nextHasNoMarginBottom
					/>
					{ dropCap && (
						<>
							<UnitControl
								label={ __( 'Size', 'tungool-builder' ) }
								value={ attributes.dropCapSize }
								min={ 0 }
								units={ units( [ 'em', 'px', 'rem' ] ) }
								onChange={ ( next ) => set( 'dropCapSize' )( next ?? '' ) }
								__next40pxDefaultSize
							/>
							<ColorControl
								label={ __( 'Color', 'tungool-builder' ) }
								value={ { normal: attributes.dropCapColor } }
								onChange={ ( next ) => set( 'dropCapColor' )( next.normal || '' ) }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Columns', 'tungool-builder' ) } initialOpen={ false }>
					<ResponsiveControl label={ __( 'Columns', 'tungool-builder' ) } value={ columns } onChange={ set( 'columns' ) }>
						{ ( { device, value: v, onChange: c } ) => (
							<RangeControl
								value={ v ?? inheritedValue( columns, device ) ?? 1 }
								min={ 1 }
								max={ 6 }
								onChange={ ( next ) => c( next ?? '' ) }
								allowReset
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						) }
					</ResponsiveControl>
					{ hasColumns && (
						<>
							{ responsiveUnit( __( 'Column gap', 'tungool-builder' ), attributes.columnGap, set( 'columnGap' ), [ 'px', 'em', 'rem' ] ) }
							<CoreBorderControl
								label={ __( 'Column rule', 'tungool-builder' ) }
								colors={ palette || [] }
								value={ attributes.columnRule }
								onChange={ ( next = {} ) =>
									set( 'columnRule' )( { width: next.width || '', style: next.style || '', color: next.color || '' } )
								}
								enableAlpha
								enableStyle
								withSlider
								__next40pxDefaultSize
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Colors', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl
						label={ __( 'Text color', 'tungool-builder' ) }
						value={ attributes.textColor }
						onChange={ set( 'textColor' ) }
					/>
					<ColorControl
						label={ __( 'Link color', 'tungool-builder' ) }
						value={ attributes.linkColor }
						onChange={ set( 'linkColor' ) }
						hover
					/>
					<ColorControl
						label={ __( 'Background color', 'tungool-builder' ) }
						value={ background.color }
						onChange={ ( color ) => setAttributes( { background: { ...background, color } } ) }
						hover
					/>
					<GradientControl
						label={ __( 'Background gradient', 'tungool-builder' ) }
						value={ background.gradient }
						onChange={ ( gradient ) => setAttributes( { background: { ...background, gradient } } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Typography', 'tungool-builder' ) } initialOpen={ false }>
					<TypographyControl value={ attributes.typography } onChange={ set( 'typography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Spacing', 'tungool-builder' ) } initialOpen={ false }>
					<SpacingControl type="padding" value={ attributes.padding } onChange={ set( 'padding' ) } />
					<SpacingControl type="margin" value={ attributes.margin } onChange={ set( 'margin' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Border & Radius', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Box Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
			</InspectorControls>
		</>
	);
}
