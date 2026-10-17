import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	GradientControl,
	BorderControl,
	BoxShadowControl,
	BackgroundControl,
	IconPicker,
} from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );
const UNITS = [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, units = UNITS ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

export const TITLE_TAGS = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'div' ];

export default function Inspector( { attributes, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { mediaType, image = {}, showButton, button = {}, linkUrl } = attributes;
	const setButton = ( key ) => ( value ) => setAttributes( { button: { ...button, [ key ]: value } } );
	const buttonBg = button.background || {};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Media', 'tungool-builder' ) }>
					<ToggleGroupControl
						label={ __( 'Type', 'tungool-builder' ) }
						value={ mediaType }
						onChange={ set( 'mediaType' ) }
						isBlock
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption value="icon" label={ __( 'Icon', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="image" label={ __( 'Image', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="number" label={ __( 'Number', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="none" label={ __( 'None', 'tungool-builder' ) } />
					</ToggleGroupControl>
					{ mediaType === 'icon' && (
						<IconPicker label={ __( 'Icon', 'tungool-builder' ) } value={ attributes.icon } onChange={ set( 'icon' ) } />
					) }
					{ mediaType === 'image' && (
						<>
							<BaseControl label={ __( 'Image', 'tungool-builder' ) } __nextHasNoMarginBottom>
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={ [ 'image' ] }
										value={ image.id }
										onSelect={ ( media ) =>
											setAttributes( { image: { id: media.id, url: media.url, alt: media.alt || '' } } )
										}
										render={ ( { open } ) => (
											<div style={ { display: 'flex', gap: 8 } }>
												<Button variant="secondary" onClick={ open }>
													{ image.url ? __( 'Replace', 'tungool-builder' ) : __( 'Select image', 'tungool-builder' ) }
												</Button>
												{ image.url && (
													<Button variant="tertiary" isDestructive onClick={ () => setAttributes( { image: {} } ) }>
														{ __( 'Remove', 'tungool-builder' ) }
													</Button>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
							</BaseControl>
							{ image.url && (
								<TextControl
									label={ __( 'Alt text', 'tungool-builder' ) }
									value={ image.alt || '' }
									onChange={ ( alt ) => setAttributes( { image: { ...image, alt } } ) }
									help={ __( 'Leave empty if the image is decorative.', 'tungool-builder' ) }
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							) }
						</>
					) }
					{ mediaType === 'number' && (
						<TextControl
							label={ __( 'Number or short text', 'tungool-builder' ) }
							value={ attributes.number }
							onChange={ set( 'number' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					{ mediaType !== 'none' && (
						<ResponsiveControl
							label={ __( 'Position', 'tungool-builder' ) }
							value={ attributes.mediaPosition }
							onChange={ set( 'mediaPosition' ) }
						>
							{ ( { value, onChange } ) => (
								<SelectControl
									value={ value || '' }
									options={ [
										opt( __( 'Inherit', 'tungool-builder' ), '' ),
										opt( __( 'Top', 'tungool-builder' ), 'top' ),
										opt( __( 'Left', 'tungool-builder' ), 'left' ),
										opt( __( 'Right', 'tungool-builder' ), 'right' ),
									] }
									onChange={ onChange }
									help={ __( 'Left/right stack on mobile unless a mobile position is set.', 'tungool-builder' ) }
									__nextHasNoMarginBottom
								/>
							) }
						</ResponsiveControl>
					) }
					<ResponsiveControl label={ __( 'Alignment', 'tungool-builder' ) } value={ attributes.textAlign } onChange={ set( 'textAlign' ) }>
						{ ( { value, onChange } ) => (
							<SelectControl
								value={ value || '' }
								options={ [
									opt( __( 'Default', 'tungool-builder' ), '' ),
									opt( __( 'Left', 'tungool-builder' ), 'left' ),
									opt( __( 'Center', 'tungool-builder' ), 'center' ),
									opt( __( 'Right', 'tungool-builder' ), 'right' ),
								] }
								onChange={ onChange }
								__nextHasNoMarginBottom
							/>
						) }
					</ResponsiveControl>
				</PanelBody>

				<PanelBody title={ __( 'Title', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'HTML tag', 'tungool-builder' ) }
						value={ attributes.titleTag }
						options={ TITLE_TAGS.map( ( t ) => opt( t.toUpperCase(), t ) ) }
						onChange={ set( 'titleTag' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Button', 'tungool-builder' ) } initialOpen={ showButton }>
					<ToggleControl
						label={ __( 'Show button', 'tungool-builder' ) }
						checked={ showButton }
						onChange={ set( 'showButton' ) }
						__nextHasNoMarginBottom
					/>
					{ showButton && (
						<>
							<TextControl
								label={ __( 'URL', 'tungool-builder' ) }
								type="url"
								value={ button.url || '' }
								onChange={ setButton( 'url' ) }
								help={ linkUrl ? __( 'The whole box is a link, so the button is shown as part of it and uses the box link.', 'tungool-builder' ) : undefined }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<ToggleControl
								label={ __( 'Open in new tab', 'tungool-builder' ) }
								checked={ !! button.opensInNewTab }
								onChange={ setButton( 'opensInNewTab' ) }
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={ __( 'Mark as nofollow', 'tungool-builder' ) }
								checked={ !! button.nofollow }
								onChange={ setButton( 'nofollow' ) }
								__nextHasNoMarginBottom
							/>
							<SelectControl
								label={ __( 'Style preset', 'tungool-builder' ) }
								value={ button.preset || 'primary' }
								options={ [
									opt( __( 'Primary', 'tungool-builder' ), 'primary' ),
									opt( __( 'Secondary', 'tungool-builder' ), 'secondary' ),
									opt( __( 'Outline', 'tungool-builder' ), 'outline' ),
									opt( __( 'Text link', 'tungool-builder' ), 'text' ),
								] }
								onChange={ setButton( 'preset' ) }
								__nextHasNoMarginBottom
							/>
							<IconPicker label={ __( 'Button icon', 'tungool-builder' ) } value={ button.icon || '' } onChange={ setButton( 'icon' ) } />
							{ button.icon && (
								<SelectControl
									label={ __( 'Icon position', 'tungool-builder' ) }
									value={ button.iconPosition || 'after' }
									options={ [ opt( __( 'Before text', 'tungool-builder' ), 'before' ), opt( __( 'After text', 'tungool-builder' ), 'after' ) ] }
									onChange={ setButton( 'iconPosition' ) }
									__nextHasNoMarginBottom
								/>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Box link', 'tungool-builder' ) } initialOpen={ !! linkUrl }>
					<TextControl
						label={ __( 'Link the whole box to', 'tungool-builder' ) }
						type="url"
						value={ linkUrl }
						onChange={ set( 'linkUrl' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{ linkUrl && (
						<>
							<ToggleControl
								label={ __( 'Open in new tab', 'tungool-builder' ) }
								checked={ attributes.linkNewTab }
								onChange={ set( 'linkNewTab' ) }
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={ __( 'Link label (screen readers)', 'tungool-builder' ) }
								value={ attributes.linkLabel }
								onChange={ set( 'linkLabel' ) }
								help={ __( 'Defaults to the title.', 'tungool-builder' ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				{ mediaType !== 'none' && (
					<PanelBody title={ __( 'Media', 'tungool-builder' ) } initialOpen={ false }>
						{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.mediaSize, set( 'mediaSize' ), [ 'px', 'em', 'rem', '%' ].map( ( u ) => ( { value: u, label: u } ) ) ) }
						{ responsiveUnit( __( 'Gap to content', 'tungool-builder' ), attributes.mediaGap, set( 'mediaGap' ) ) }
						<SelectControl
							label={ __( 'Background shape', 'tungool-builder' ) }
							value={ attributes.mediaShape }
							options={ [
								opt( __( 'None', 'tungool-builder' ), 'none' ),
								opt( __( 'Circle', 'tungool-builder' ), 'circle' ),
								opt( __( 'Square', 'tungool-builder' ), 'square' ),
								opt( __( 'Rounded', 'tungool-builder' ), 'rounded' ),
							] }
							onChange={ set( 'mediaShape' ) }
							__nextHasNoMarginBottom
						/>
						{ attributes.mediaShape !== 'none' && responsiveUnit( __( 'Shape padding', 'tungool-builder' ), attributes.mediaPadding, set( 'mediaPadding' ) ) }
						{ mediaType !== 'image' && (
							<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.mediaColor } onChange={ set( 'mediaColor' ) } hover />
						) }
						<ColorControl label={ __( 'Shape color', 'tungool-builder' ) } value={ attributes.mediaBackground } onChange={ set( 'mediaBackground' ) } hover />
						{ mediaType === 'number' && (
							<TypographyControl value={ attributes.numberTypography } onChange={ set( 'numberTypography' ) } />
						) }
					</PanelBody>
				) }
				<PanelBody title={ __( 'Title', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.titleColor } onChange={ set( 'titleColor' ) } hover />
					{ responsiveUnit( __( 'Space below', 'tungool-builder' ), attributes.titleSpacing, set( 'titleSpacing' ) ) }
					<TypographyControl value={ attributes.titleTypography } onChange={ set( 'titleTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Description', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.descColor } onChange={ set( 'descColor' ) } hover />
					{ responsiveUnit( __( 'Space below', 'tungool-builder' ), attributes.descSpacing, set( 'descSpacing' ) ) }
					<TypographyControl value={ attributes.descTypography } onChange={ set( 'descTypography' ) } />
				</PanelBody>
				{ showButton && (
					<PanelBody title={ __( 'Button', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ button.textColor } onChange={ setButton( 'textColor' ) } hover />
						<ColorControl
							label={ __( 'Background color', 'tungool-builder' ) }
							value={ buttonBg.color }
							onChange={ ( color ) => setButton( 'background' )( { ...buttonBg, color } ) }
							hover
						/>
						<GradientControl
							label={ __( 'Background gradient', 'tungool-builder' ) }
							value={ buttonBg.gradient }
							onChange={ ( gradient ) => setButton( 'background' )( { ...buttonBg, gradient } ) }
						/>
						<TypographyControl value={ button.typography } onChange={ setButton( 'typography' ) } />
						<SpacingControl type="padding" value={ button.padding } onChange={ setButton( 'padding' ) } />
						<BorderControl value={ button.border } onChange={ setButton( 'border' ) } hover />
					</PanelBody>
				) }
				<PanelBody title={ __( 'Box', 'tungool-builder' ) } initialOpen={ false }>
					<BackgroundControl value={ attributes.background } onChange={ set( 'background' ) } />
					<SpacingControl type="padding" value={ attributes.padding } onChange={ set( 'padding' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Border & Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } hover />
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Hover', 'tungool-builder' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Lift (px)', 'tungool-builder' ) }
						value={ attributes.hoverLift }
						min={ 0 }
						max={ 30 }
						onChange={ ( v ) => setAttributes( { hoverLift: v ?? 0 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Transition (ms)', 'tungool-builder' ) }
						value={ attributes.transitionDuration }
						min={ 0 }
						max={ 2000 }
						step={ 50 }
						onChange={ ( v ) => setAttributes( { transitionDuration: v ?? 300 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<BaseControl label={ __( 'Shadow on hover', 'tungool-builder' ) } __nextHasNoMarginBottom>
						<BoxShadowControl value={ attributes.hoverShadow } onChange={ set( 'hoverShadow' ) } />
					</BaseControl>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
