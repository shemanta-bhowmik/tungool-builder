import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';
import {
	ResponsiveControl,
	TypographyControl,
	ColorControl,
	BorderControl,
	BoxShadowControl,
} from '../shared/controls';
import { UnitControl, LinkControl } from '../shared/controls/compat';
import { sizeData } from './media';

const opt = ( label, value ) => ( { label, value } );
const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );
const SIZE_UNITS = units( [ 'px', '%', 'vw', 'em', 'rem' ] );
const HEIGHT_UNITS = units( [ 'px', 'vh', 'em', 'rem' ] );

const responsiveUnit = ( label, value, onChange, unitList ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ unitList } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

const responsiveSelect = ( label, value, onChange, options ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<SelectControl value={ v || '' } options={ options } onChange={ c } __nextHasNoMarginBottom __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

const filterRange = ( label, key, filters, setFilters, max, fallback ) => (
	<RangeControl
		label={ label }
		value={ filters[ key ] ?? fallback }
		min={ 0 }
		max={ max }
		onChange={ ( v ) => setFilters( { ...filters, [ key ]: v ?? '' } ) }
		allowReset
		resetFallbackValue={ fallback }
		__nextHasNoMarginBottom
		__next40pxDefaultSize
	/>
);

export default function Inspector( { attributes, setAttributes, media, imageSizes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { id, alt, sizeSlug, showCaption, disableLazy, linkTo, href, lightbox, aspectRatio = {}, customAspectRatio = {} } = attributes;
	const filters = attributes.filters || {};

	const available = media?.media_details?.sizes || {};
	const sizeOptions = imageSizes
		.filter( ( s ) => available[ s.slug ] )
		.map( ( s ) => opt( s.name, s.slug ) );
	if ( ! sizeOptions.some( ( o ) => o.value === 'full' ) ) {
		sizeOptions.push( opt( __( 'Full Size', 'tungool-builder' ), 'full' ) );
	}

	const linkOptions = [
		opt( __( 'None', 'tungool-builder' ), 'none' ),
		opt( __( 'Media file', 'tungool-builder' ), 'media' ),
		...( id ? [ opt( __( 'Attachment page', 'tungool-builder' ), 'attachment' ) ] : [] ),
		opt( __( 'Custom URL', 'tungool-builder' ), 'custom' ),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image', 'tungool-builder' ) }>
					<TextareaControl
						label={ __( 'Alternative text', 'tungool-builder' ) }
						value={ alt }
						placeholder={ media?.alt_text || '' }
						onChange={ set( 'alt' ) }
						help={
							id
								? __( 'Describe the image for screen readers. Leave empty to use the alt text from the Media Library.', 'tungool-builder' )
								: __( 'Describe the image for screen readers. Leave empty if it is decorative.', 'tungool-builder' )
						}
						__nextHasNoMarginBottom
					/>
					{ !! id && media && (
						<SelectControl
							label={ __( 'Image size', 'tungool-builder' ) }
							value={ sizeSlug }
							options={ sizeOptions }
							onChange={ ( slug ) => setAttributes( { sizeSlug: slug, ...sizeData( media, slug ) } ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					<ToggleControl
						label={ __( 'Show caption', 'tungool-builder' ) }
						checked={ showCaption }
						onChange={ set( 'showCaption' ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Disable lazy loading', 'tungool-builder' ) }
						checked={ disableLazy }
						onChange={ set( 'disableLazy' ) }
						help={ __( 'For images visible without scrolling (e.g. a hero). Loads immediately with high priority.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Link', 'tungool-builder' ) } initialOpen={ linkTo !== 'none' || lightbox }>
					<ToggleControl
						label={ __( 'Open in lightbox on click', 'tungool-builder' ) }
						checked={ lightbox }
						onChange={ set( 'lightbox' ) }
						help={ lightbox ? __( 'The lightbox replaces the link.', 'tungool-builder' ) : undefined }
						__nextHasNoMarginBottom
					/>
					{ ! lightbox && (
						<>
							<SelectControl
								label={ __( 'Link to', 'tungool-builder' ) }
								value={ linkTo }
								options={ linkOptions }
								onChange={ set( 'linkTo' ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							{ linkTo === 'custom' && (
								<BaseControl label={ __( 'URL', 'tungool-builder' ) } __nextHasNoMarginBottom>
									<LinkControl
										value={ href ? { url: href } : undefined }
										settings={ [] }
										onChange={ ( next ) => setAttributes( { href: next?.url || '' } ) }
										onRemove={ () => setAttributes( { href: '' } ) }
									/>
								</BaseControl>
							) }
							{ linkTo !== 'none' && (
								<>
									<ToggleControl
										label={ __( 'Open in new tab', 'tungool-builder' ) }
										checked={ attributes.opensInNewTab }
										onChange={ set( 'opensInNewTab' ) }
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={ __( 'Mark as nofollow', 'tungool-builder' ) }
										checked={ attributes.nofollow }
										onChange={ set( 'nofollow' ) }
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={ __( 'Mark as sponsored', 'tungool-builder' ) }
										checked={ attributes.sponsored }
										onChange={ set( 'sponsored' ) }
										__nextHasNoMarginBottom
									/>
								</>
							) }
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Size & Position', 'tungool-builder' ) }>
					{ responsiveSelect( __( 'Alignment', 'tungool-builder' ), attributes.alignment, set( 'alignment' ), [
						opt( __( 'Default', 'tungool-builder' ), '' ),
						opt( __( 'Left', 'tungool-builder' ), 'left' ),
						opt( __( 'Center', 'tungool-builder' ), 'center' ),
						opt( __( 'Right', 'tungool-builder' ), 'right' ),
					] ) }
					{ responsiveUnit( __( 'Width', 'tungool-builder' ), attributes.imgWidth, set( 'imgWidth' ), SIZE_UNITS ) }
					{ responsiveUnit( __( 'Max width', 'tungool-builder' ), attributes.maxWidth, set( 'maxWidth' ), SIZE_UNITS ) }
					{ responsiveUnit( __( 'Height', 'tungool-builder' ), attributes.imgHeight, set( 'imgHeight' ), HEIGHT_UNITS ) }
					<ResponsiveControl
						label={ __( 'Aspect ratio', 'tungool-builder' ) }
						value={ aspectRatio }
						onChange={ set( 'aspectRatio' ) }
					>
						{ ( { device, value: v, onChange: c } ) => (
							<>
								<SelectControl
									value={ v || '' }
									options={ [
										opt( __( 'Default', 'tungool-builder' ), '' ),
										opt( __( 'Original', 'tungool-builder' ), 'original' ),
										opt( __( 'Square 1:1', 'tungool-builder' ), '1/1' ),
										opt( __( 'Standard 4:3', 'tungool-builder' ), '4/3' ),
										opt( __( 'Classic 3:2', 'tungool-builder' ), '3/2' ),
										opt( __( 'Wide 16:9', 'tungool-builder' ), '16/9' ),
										opt( __( 'Tall 9:16', 'tungool-builder' ), '9/16' ),
										opt( __( 'Custom', 'tungool-builder' ), 'custom' ),
									] }
									onChange={ c }
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
								{ v === 'custom' && (
									<TextControl
										value={ customAspectRatio[ device ] ?? '' }
										placeholder="21/9"
										help={ __( 'Width / height, e.g. 21/9 or 2.35/1.', 'tungool-builder' ) }
										onChange={ ( next ) =>
											setAttributes( { customAspectRatio: { ...customAspectRatio, [ device ]: next } } )
										}
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
								) }
							</>
						) }
					</ResponsiveControl>
					{ responsiveSelect( __( 'Object fit', 'tungool-builder' ), attributes.objectFit, set( 'objectFit' ), [
						opt( __( 'Default (cover)', 'tungool-builder' ), '' ),
						opt( __( 'Cover', 'tungool-builder' ), 'cover' ),
						opt( __( 'Contain', 'tungool-builder' ), 'contain' ),
						opt( __( 'Fill', 'tungool-builder' ), 'fill' ),
						opt( __( 'None', 'tungool-builder' ), 'none' ),
						opt( __( 'Scale down', 'tungool-builder' ), 'scale-down' ),
					] ) }
					{ responsiveSelect( __( 'Object position', 'tungool-builder' ), attributes.objectPosition, set( 'objectPosition' ), [
						opt( __( 'Default (center)', 'tungool-builder' ), '' ),
						opt( __( 'Top left', 'tungool-builder' ), 'left top' ),
						opt( __( 'Top center', 'tungool-builder' ), 'center top' ),
						opt( __( 'Top right', 'tungool-builder' ), 'right top' ),
						opt( __( 'Center left', 'tungool-builder' ), 'left center' ),
						opt( __( 'Center', 'tungool-builder' ), 'center center' ),
						opt( __( 'Center right', 'tungool-builder' ), 'right center' ),
						opt( __( 'Bottom left', 'tungool-builder' ), 'left bottom' ),
						opt( __( 'Bottom center', 'tungool-builder' ), 'center bottom' ),
						opt( __( 'Bottom right', 'tungool-builder' ), 'right bottom' ),
					] ) }
				</PanelBody>
				<PanelBody title={ __( 'Border & Radius', 'tungool-builder' ) } initialOpen={ false }>
					<BorderControl value={ attributes.border } onChange={ set( 'border' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Box Shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ attributes.boxShadow } onChange={ set( 'boxShadow' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Effects', 'tungool-builder' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Opacity (%)', 'tungool-builder' ) }
						value={ attributes.opacity }
						min={ 0 }
						max={ 100 }
						onChange={ ( v ) => setAttributes( { opacity: v ?? 100 } ) }
						allowReset
						resetFallbackValue={ 100 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					{ filterRange( __( 'Brightness (%)', 'tungool-builder' ), 'brightness', filters, set( 'filters' ), 200, 100 ) }
					{ filterRange( __( 'Contrast (%)', 'tungool-builder' ), 'contrast', filters, set( 'filters' ), 200, 100 ) }
					{ filterRange( __( 'Saturation (%)', 'tungool-builder' ), 'saturate', filters, set( 'filters' ), 200, 100 ) }
					{ filterRange( __( 'Blur (px)', 'tungool-builder' ), 'blur', filters, set( 'filters' ), 20, 0 ) }
				</PanelBody>
				<PanelBody title={ __( 'Hover', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Hover effect', 'tungool-builder' ) }
						value={ attributes.hoverEffect }
						options={ [
							opt( __( 'None', 'tungool-builder' ), 'none' ),
							opt( __( 'Zoom', 'tungool-builder' ), 'zoom' ),
							opt( __( 'Grayscale to color', 'tungool-builder' ), 'grayscale' ),
							opt( __( 'Lift', 'tungool-builder' ), 'lift' ),
						] }
						onChange={ set( 'hoverEffect' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Transition duration (ms)', 'tungool-builder' ) }
						value={ attributes.transitionDuration }
						min={ 0 }
						max={ 2000 }
						step={ 50 }
						onChange={ ( v ) => setAttributes( { transitionDuration: v ?? 300 } ) }
						allowReset
						resetFallbackValue={ 300 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
				{ showCaption && (
					<PanelBody title={ __( 'Caption', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.captionColor } onChange={ set( 'captionColor' ) } />
						<TypographyControl value={ attributes.captionTypography } onChange={ set( 'captionTypography' ) } />
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
