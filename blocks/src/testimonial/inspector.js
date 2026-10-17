import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { BaseControl, Button, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	BorderControl,
	BoxShadowControl,
	BackgroundControl,
	IconPicker,
} from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';

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
	const { layout, avatar = {}, showRating, rating } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Testimonial', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Layout', 'tungool-builder' ) }
						value={ layout }
						options={ [
							opt( __( 'Card', 'tungool-builder' ), 'card' ),
							opt( __( 'Centered', 'tungool-builder' ), 'centered' ),
							opt( __( 'Avatar left', 'tungool-builder' ), 'avatar-left' ),
							opt( __( 'Quote icon', 'tungool-builder' ), 'quote-icon' ),
						] }
						onChange={ set( 'layout' ) }
						__nextHasNoMarginBottom
					/>
					{ layout === 'quote-icon' && (
						<IconPicker label={ __( 'Quote icon', 'tungool-builder' ) } value={ attributes.quoteIcon } onChange={ set( 'quoteIcon' ) } />
					) }
					<BaseControl label={ __( 'Avatar', 'tungool-builder' ) } __nextHasNoMarginBottom>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ avatar.id }
								onSelect={ ( media ) =>
									setAttributes( {
										avatar: {
											id: media.id,
											url: media.sizes?.thumbnail?.url || media.url,
											alt: media.alt || '',
										},
									} )
								}
								render={ ( { open } ) => (
									<div style={ { display: 'flex', gap: 8 } }>
										<Button variant="secondary" onClick={ open }>
											{ avatar.url ? __( 'Replace', 'tungool-builder' ) : __( 'Select image', 'tungool-builder' ) }
										</Button>
										{ avatar.url && (
											<Button variant="tertiary" isDestructive onClick={ () => setAttributes( { avatar: {} } ) }>
												{ __( 'Remove', 'tungool-builder' ) }
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>
					</BaseControl>
					{ avatar.url && (
						<TextControl
							label={ __( 'Avatar alt text', 'tungool-builder' ) }
							value={ avatar.alt || '' }
							onChange={ ( alt ) => setAttributes( { avatar: { ...avatar, alt } } ) }
							help={ __( 'Leave empty if the name next to it already identifies the person.', 'tungool-builder' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					<ToggleControl
						label={ __( 'Show rating', 'tungool-builder' ) }
						checked={ showRating }
						onChange={ set( 'showRating' ) }
						__nextHasNoMarginBottom
					/>
					{ showRating && (
						<RangeControl
							label={ __( 'Rating', 'tungool-builder' ) }
							value={ rating }
							min={ 0 }
							max={ 5 }
							step={ 0.5 }
							onChange={ ( v ) => setAttributes( { rating: v ?? 5 } ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Card', 'tungool-builder' ) } initialOpen={ false }>
					<BackgroundControl value={ attributes.background } onChange={ set( 'background' ) } />
					<SpacingControl type="padding" value={ attributes.padding } onChange={ set( 'padding' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Border & Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } hover />
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Quote', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.quoteColor } onChange={ set( 'quoteColor' ) } />
					<TypographyControl value={ attributes.quoteTypography } onChange={ set( 'quoteTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Name', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.nameColor } onChange={ set( 'nameColor' ) } />
					<TypographyControl value={ attributes.nameTypography } onChange={ set( 'nameTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Role / company', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.roleColor } onChange={ set( 'roleColor' ) } />
					<TypographyControl value={ attributes.roleTypography } onChange={ set( 'roleTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Avatar', 'tungool-builder' ) } initialOpen={ false }>
					{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.avatarSize, set( 'avatarSize' ) ) }
					<UnitControl
						label={ __( 'Border radius', 'tungool-builder' ) }
						value={ attributes.avatarRadius }
						min={ 0 }
						units={ [ 'px', '%' ].map( ( u ) => ( { value: u, label: u } ) ) }
						onChange={ ( next ) => setAttributes( { avatarRadius: next ?? '' } ) }
						__next40pxDefaultSize
					/>
				</PanelBody>
				{ showRating && (
					<PanelBody title={ __( 'Stars', 'tungool-builder' ) } initialOpen={ false }>
						{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.starSize, set( 'starSize' ) ) }
						<ColorControl label={ __( 'Filled color', 'tungool-builder' ) } value={ attributes.starColor } onChange={ set( 'starColor' ) } />
						<ColorControl label={ __( 'Empty color', 'tungool-builder' ) } value={ attributes.starEmptyColor } onChange={ set( 'starEmptyColor' ) } />
					</PanelBody>
				) }
				{ layout === 'quote-icon' && (
					<PanelBody title={ __( 'Quote icon', 'tungool-builder' ) } initialOpen={ false }>
						{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.quoteIconSize, set( 'quoteIconSize' ) ) }
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.quoteIconColor } onChange={ set( 'quoteIconColor' ) } />
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
