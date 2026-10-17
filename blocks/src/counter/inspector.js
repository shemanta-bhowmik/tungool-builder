import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { ResponsiveControl, TypographyControl, ColorControl, IconPicker } from '../shared/controls';
import { UnitControl, NumberControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );
const UNITS = [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ UNITS } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const num = ( key, fallback ) => ( value ) => {
		const n = parseFloat( value );
		setAttributes( { [ key ]: Number.isFinite( n ) ? n : fallback } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Counter', 'tungool-builder' ) }>
					<NumberControl
						label={ __( 'Start number', 'tungool-builder' ) }
						value={ attributes.start }
						onChange={ num( 'start', 0 ) }
						__next40pxDefaultSize
					/>
					<NumberControl
						label={ __( 'End number', 'tungool-builder' ) }
						value={ attributes.end }
						onChange={ num( 'end', 0 ) }
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Duration (ms)', 'tungool-builder' ) }
						value={ attributes.duration }
						min={ 0 }
						max={ 10000 }
						step={ 100 }
						onChange={ ( value ) => setAttributes( { duration: value ?? 2000 } ) }
						allowReset
						resetFallbackValue={ 2000 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Decimals', 'tungool-builder' ) }
						value={ attributes.decimals }
						min={ 0 }
						max={ 6 }
						onChange={ ( value ) => setAttributes( { decimals: value ?? 0 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={ __( 'Thousands separator', 'tungool-builder' ) }
						value={ attributes.thousandsSeparator }
						options={ [
							opt( __( 'Comma (1,000)', 'tungool-builder' ), ',' ),
							opt( __( 'Dot (1.000)', 'tungool-builder' ), '.' ),
							opt( __( 'Space (1 000)', 'tungool-builder' ), ' ' ),
							opt( __( 'Apostrophe (1’000)', 'tungool-builder' ), '’' ),
							opt( __( 'None (1000)', 'tungool-builder' ), '' ),
						] }
						onChange={ set( 'thousandsSeparator' ) }
						__nextHasNoMarginBottom
					/>
					{ attributes.decimals > 0 && (
						<SelectControl
							label={ __( 'Decimal separator', 'tungool-builder' ) }
							value={ attributes.decimalSeparator }
							options={ [ opt( __( 'Dot (0.5)', 'tungool-builder' ), '.' ), opt( __( 'Comma (0,5)', 'tungool-builder' ), ',' ) ] }
							onChange={ set( 'decimalSeparator' ) }
							__nextHasNoMarginBottom
						/>
					) }
					<TextControl
						label={ __( 'Prefix', 'tungool-builder' ) }
						value={ attributes.prefix }
						onChange={ set( 'prefix' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Suffix', 'tungool-builder' ) }
						value={ attributes.suffix }
						onChange={ set( 'suffix' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={ __( 'Title position', 'tungool-builder' ) }
						value={ attributes.titlePosition }
						options={ [ opt( __( 'Below number', 'tungool-builder' ), 'below' ), opt( __( 'Above number', 'tungool-builder' ), 'above' ) ] }
						onChange={ set( 'titlePosition' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody title={ __( 'Icon', 'tungool-builder' ) } initialOpen={ !! attributes.icon }>
					<IconPicker label={ __( 'Icon', 'tungool-builder' ) } value={ attributes.icon } onChange={ set( 'icon' ) } />
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Layout', 'tungool-builder' ) } initialOpen={ false }>
					<ResponsiveControl label={ __( 'Alignment', 'tungool-builder' ) } value={ attributes.align } onChange={ set( 'align' ) }>
						{ ( { value: v, onChange: c } ) => (
							<ToggleGroupControl
								label={ __( 'Alignment', 'tungool-builder' ) }
								hideLabelFromVision
								value={ v || '' }
								onChange={ ( next ) => c( next === v ? '' : next ) }
								isBlock
								__nextHasNoMarginBottom
							>
								<ToggleGroupControlOption value="left" label={ __( 'Left', 'tungool-builder' ) } />
								<ToggleGroupControlOption value="center" label={ __( 'Center', 'tungool-builder' ) } />
								<ToggleGroupControlOption value="right" label={ __( 'Right', 'tungool-builder' ) } />
							</ToggleGroupControl>
						) }
					</ResponsiveControl>
					{ responsiveUnit( __( 'Gap between parts', 'tungool-builder' ), attributes.gap, set( 'gap' ) ) }
				</PanelBody>
				<PanelBody title={ __( 'Number', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.numberColor } onChange={ set( 'numberColor' ) } />
					<TypographyControl value={ attributes.numberTypography } onChange={ set( 'numberTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Title', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.titleColor } onChange={ set( 'titleColor' ) } />
					<TypographyControl value={ attributes.titleTypography } onChange={ set( 'titleTypography' ) } />
				</PanelBody>
				{ attributes.icon && (
					<PanelBody title={ __( 'Icon', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.iconColor } onChange={ set( 'iconColor' ) } />
						{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
