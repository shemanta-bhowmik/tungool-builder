import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	FormFileUpload,
	Notice,
} from '@wordpress/components';
import { ResponsiveControl, ColorControl, IconPicker } from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';
import { sanitizeSvg, SVG_MAX_BYTES } from '../shared/utils';

const opt = ( label, value ) => ( { label, value } );
const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, list = [ 'px', 'em', 'rem' ] ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units( list ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { iconType, icon, customSvg, label, view, shape, hoverAnimation, url } = attributes;
	const customInvalid = iconType === 'custom' && !! customSvg && ! sanitizeSvg( customSvg );

	const onUpload = ( event ) => {
		const file = event.target.files?.[ 0 ];
		event.target.value = '';
		if ( ! file || file.size > SVG_MAX_BYTES ) {
			return;
		}
		file.text().then( ( text ) => setAttributes( { customSvg: text } ) );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Icon', 'tungool-builder' ) }>
					<ToggleGroupControl
						label={ __( 'Source', 'tungool-builder' ) }
						value={ iconType }
						onChange={ set( 'iconType' ) }
						isBlock
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption value="library" label={ __( 'Library', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="custom" label={ __( 'Custom SVG', 'tungool-builder' ) } />
					</ToggleGroupControl>
					{ iconType === 'custom' ? (
						<>
							<FormFileUpload accept=".svg,image/svg+xml" onChange={ onUpload } variant="secondary">
								{ __( 'Upload SVG file', 'tungool-builder' ) }
							</FormFileUpload>
							<TextareaControl
								label={ __( 'Or paste SVG code', 'tungool-builder' ) }
								value={ customSvg }
								onChange={ set( 'customSvg' ) }
								rows={ 5 }
								help={ __( 'Scripts, event handlers and external references are removed. Max 100 KB.', 'tungool-builder' ) }
								__nextHasNoMarginBottom
							/>
							{ customInvalid && (
								<Notice status="warning" isDismissible={ false }>
									{ __( 'This is not a valid SVG.', 'tungool-builder' ) }
								</Notice>
							) }
						</>
					) : (
						<IconPicker label={ __( 'Icon', 'tungool-builder' ) } value={ icon } onChange={ set( 'icon' ) } />
					) }
					<TextControl
						label={ __( 'Accessible label', 'tungool-builder' ) }
						value={ label }
						onChange={ set( 'label' ) }
						help={ __( 'Leave empty if the icon is decorative. Required when the icon is a link.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{ url && ! label && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'This icon links somewhere. Add an accessible label so screen reader users know where.', 'tungool-builder' ) }
						</Notice>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'View', 'tungool-builder' ) }
						value={ view }
						options={ [
							opt( __( 'Default', 'tungool-builder' ), 'default' ),
							opt( __( 'Stacked (filled)', 'tungool-builder' ), 'stacked' ),
							opt( __( 'Framed (border)', 'tungool-builder' ), 'framed' ),
						] }
						onChange={ set( 'view' ) }
						__nextHasNoMarginBottom
					/>
					{ view !== 'default' && (
						<SelectControl
							label={ __( 'Shape', 'tungool-builder' ) }
							value={ shape }
							options={ [
								opt( __( 'Circle', 'tungool-builder' ), 'circle' ),
								opt( __( 'Square', 'tungool-builder' ), 'square' ),
								opt( __( 'Rounded', 'tungool-builder' ), 'rounded' ),
							] }
							onChange={ set( 'shape' ) }
							__nextHasNoMarginBottom
						/>
					) }
					{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.size, set( 'size' ) ) }
					{ responsiveUnit( __( 'Padding', 'tungool-builder' ), attributes.padding, set( 'padding' ) ) }
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
					<ResponsiveControl label={ __( 'Rotation (deg)', 'tungool-builder' ) } value={ attributes.rotate } onChange={ set( 'rotate' ) }>
						{ ( { value: v, onChange: c } ) => (
							<RangeControl
								value={ v === '' || v === undefined ? undefined : Number( v ) }
								min={ -180 }
								max={ 180 }
								onChange={ ( next ) => c( next === undefined ? '' : String( next ) ) }
								allowReset
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						) }
					</ResponsiveControl>
					<SelectControl
						label={ __( 'Hover animation', 'tungool-builder' ) }
						value={ hoverAnimation }
						options={ [
							opt( __( 'None', 'tungool-builder' ), 'none' ),
							opt( __( 'Grow', 'tungool-builder' ), 'grow' ),
							opt( __( 'Rotate', 'tungool-builder' ), 'rotate' ),
							opt( __( 'Float', 'tungool-builder' ), 'float' ),
						] }
						onChange={ set( 'hoverAnimation' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Colors', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Icon color', 'tungool-builder' ) } value={ attributes.iconColor } onChange={ set( 'iconColor' ) } hover />
					{ view === 'stacked' && (
						<ColorControl label={ __( 'Background color', 'tungool-builder' ) } value={ attributes.bgColor } onChange={ set( 'bgColor' ) } hover />
					) }
					{ view === 'framed' && (
						<>
							<ColorControl label={ __( 'Border color', 'tungool-builder' ) } value={ attributes.borderColor } onChange={ set( 'borderColor' ) } hover />
							<UnitControl
								label={ __( 'Border width', 'tungool-builder' ) }
								value={ attributes.borderWidth }
								min={ 0 }
								units={ units( [ 'px' ] ) }
								onChange={ ( next ) => setAttributes( { borderWidth: next ?? '' } ) }
								__next40pxDefaultSize
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
		</>
	);
}
