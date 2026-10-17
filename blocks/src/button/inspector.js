import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl, Notice } from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	GradientControl,
	BorderControl,
	BoxShadowControl,
	IconPicker,
} from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );
const UNITS = [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, units = UNITS ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { preset, icon, iconPosition, text, ariaLabel, widthMode = {}, customWidth = {}, background = {} } = attributes;
	const iconOnly = !! icon && ! String( text || '' ).replace( /<[^>]*>/g, '' ).trim();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Button', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Style preset', 'tungool-builder' ) }
						value={ preset }
						options={ [
							opt( __( 'Primary', 'tungool-builder' ), 'primary' ),
							opt( __( 'Secondary', 'tungool-builder' ), 'secondary' ),
							opt( __( 'Outline', 'tungool-builder' ), 'outline' ),
							opt( __( 'Text link', 'tungool-builder' ), 'text' ),
						] }
						onChange={ set( 'preset' ) }
						help={ __( 'Colors and borders below override the preset.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
					/>
					<ResponsiveControl
						label={ __( 'Width', 'tungool-builder' ) }
						value={ widthMode }
						onChange={ set( 'widthMode' ) }
					>
						{ ( { device, value: mode, onChange: setMode } ) => (
							<>
								<SelectControl
									value={ mode || '' }
									options={ [
										opt( __( 'Default', 'tungool-builder' ), '' ),
										opt( __( 'Auto', 'tungool-builder' ), 'auto' ),
										opt( __( 'Full width', 'tungool-builder' ), 'full' ),
										opt( __( 'Custom', 'tungool-builder' ), 'custom' ),
									] }
									onChange={ setMode }
									__nextHasNoMarginBottom
								/>
								{ mode === 'custom' && (
									<UnitControl
										value={ customWidth[ device ] ?? '' }
										min={ 0 }
										units={ [ 'px', '%', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) }
										onChange={ ( next ) =>
											setAttributes( { customWidth: { ...customWidth, [ device ]: next ?? '' } } )
										}
										__next40pxDefaultSize
									/>
								) }
							</>
						) }
					</ResponsiveControl>
				</PanelBody>

				<PanelBody title={ __( 'Icon', 'tungool-builder' ) } initialOpen={ !! icon }>
					<IconPicker label={ __( 'Icon', 'tungool-builder' ) } value={ icon } onChange={ set( 'icon' ) } />
					{ icon && (
						<>
							<SelectControl
								label={ __( 'Position', 'tungool-builder' ) }
								value={ iconPosition }
								options={ [
									opt( __( 'Before text', 'tungool-builder' ), 'before' ),
									opt( __( 'After text', 'tungool-builder' ), 'after' ),
								] }
								onChange={ set( 'iconPosition' ) }
								__nextHasNoMarginBottom
							/>
							{ responsiveUnit( __( 'Icon size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
							{ responsiveUnit( __( 'Icon gap', 'tungool-builder' ), attributes.iconGap, set( 'iconGap' ) ) }
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
				</PanelBody>
				<PanelBody title={ __( 'Border & Radius', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } hover />
				</PanelBody>
				<PanelBody title={ __( 'Box Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Hover Transition', 'tungool-builder' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Duration (ms)', 'tungool-builder' ) }
						value={ attributes.transitionDuration }
						min={ 0 }
						max={ 2000 }
						step={ 50 }
						onChange={ ( value ) => setAttributes( { transitionDuration: value ?? 300 } ) }
						allowReset
						resetFallbackValue={ 300 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="advanced">
				<TextControl
					label={ __( 'Accessible label (aria-label)', 'tungool-builder' ) }
					value={ ariaLabel }
					onChange={ set( 'ariaLabel' ) }
					help={ __( 'Describes the button for screen readers. Required when the button shows only an icon.', 'tungool-builder' ) }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
				{ iconOnly && ! ariaLabel && (
					<Notice status="warning" isDismissible={ false }>
						{ __( 'This button has no text. Add an accessible label so screen reader users know what it does.', 'tungool-builder' ) }
					</Notice>
				) }
			</InspectorControls>
		</>
	);
}
