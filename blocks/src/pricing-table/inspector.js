import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	Flex,
	FlexItem,
} from '@wordpress/components';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	BorderControl,
	BoxShadowControl,
	IconPicker,
	GradientControl,
} from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );

export default function Inspector( { attributes: a, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const button = a.button || {};
	const buttonBg = button.background || {};
	const setButton = ( key ) => ( value ) => setAttributes( { button: { ...button, [ key ]: value } } );
	const features = Array.isArray( a.features ) ? a.features : [];
	const setFeatures = ( next ) => setAttributes( { features: next } );
	const updateFeature = ( i, patch ) => setFeatures( features.map( ( f, j ) => ( j === i ? { ...f, ...patch } : f ) ) );
	const move = ( i, dir ) => {
		const next = [ ...features ];
		[ next[ i ], next[ i + dir ] ] = [ next[ i + dir ], next[ i ] ];
		setFeatures( next );
	};
	const text = ( key, label, help ) => (
		<TextControl label={ label } help={ help } value={ a[ key ] } onChange={ set( key ) } __nextHasNoMarginBottom __next40pxDefaultSize />
	);
	const typo = ( title, typoKey, colorKey ) => (
		<PanelBody title={ title } initialOpen={ false }>
			<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ a[ colorKey ] } onChange={ set( colorKey ) } />
			<TypographyControl value={ a[ typoKey ] } onChange={ set( typoKey ) } />
		</PanelBody>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Header', 'tungool-builder' ) }>
					{ text( 'badge', __( 'Badge text', 'tungool-builder' ), __( 'e.g. "Most popular". Leave empty for none.', 'tungool-builder' ) ) }
					{ a.badge && (
						<SelectControl
							label={ __( 'Badge style', 'tungool-builder' ) }
							value={ a.badgeStyle }
							options={ [ opt( __( 'Badge', 'tungool-builder' ), 'badge' ), opt( __( 'Corner ribbon', 'tungool-builder' ), 'ribbon' ) ] }
							onChange={ set( 'badgeStyle' ) }
							__nextHasNoMarginBottom
						/>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Price', 'tungool-builder' ) }>
					{ text( 'currency', __( 'Currency symbol', 'tungool-builder' ) ) }
					<SelectControl
						label={ __( 'Currency position', 'tungool-builder' ) }
						value={ a.currencyPosition }
						options={ [ opt( __( 'Before amount', 'tungool-builder' ), 'before' ), opt( __( 'After amount', 'tungool-builder' ), 'after' ) ] }
						onChange={ set( 'currencyPosition' ) }
						__nextHasNoMarginBottom
					/>
					{ text( 'amount', __( 'Amount', 'tungool-builder' ) ) }
					{ text( 'priceDecimals', __( 'Decimals', 'tungool-builder' ), __( 'Shown smaller next to the amount, e.g. "99".', 'tungool-builder' ) ) }
					{ text( 'period', __( 'Period', 'tungool-builder' ), __( 'e.g. "/month". Leave empty for none.', 'tungool-builder' ) ) }
					{ text( 'originalPrice', __( 'Original price (struck through)', 'tungool-builder' ), __( 'Full text, e.g. "$49".', 'tungool-builder' ) ) }
				</PanelBody>
				<PanelBody title={ __( 'Features', 'tungool-builder' ) } initialOpen={ false }>
					{ features.map( ( f, i ) => (
						<div key={ i } className="tb-pricing-feature-setting">
							<TextControl
								label={ __( 'Text', 'tungool-builder' ) }
								value={ f.text }
								onChange={ ( v ) => updateFeature( i, { text: v } ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<ToggleControl
								label={ __( 'Included', 'tungool-builder' ) }
								checked={ !! f.included }
								onChange={ ( v ) => updateFeature( i, { included: v } ) }
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={ __( 'Tooltip (optional)', 'tungool-builder' ) }
								value={ f.tooltip || '' }
								onChange={ ( v ) => updateFeature( i, { tooltip: v } ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<Flex justify="flex-start">
								<FlexItem>
									<Button size="small" icon="arrow-up-alt2" label={ __( 'Move up', 'tungool-builder' ) } disabled={ i === 0 } onClick={ () => move( i, -1 ) } />
									<Button
										size="small"
										icon="arrow-down-alt2"
										label={ __( 'Move down', 'tungool-builder' ) }
										disabled={ i === features.length - 1 }
										onClick={ () => move( i, 1 ) }
									/>
								</FlexItem>
								<FlexItem>
									<Button size="small" variant="tertiary" isDestructive onClick={ () => setFeatures( features.filter( ( _, j ) => j !== i ) ) }>
										{ __( 'Remove', 'tungool-builder' ) }
									</Button>
								</FlexItem>
							</Flex>
						</div>
					) ) }
					<Button variant="secondary" onClick={ () => setFeatures( [ ...features, { text: '', included: true, tooltip: '' } ] ) }>
						{ __( 'Add feature', 'tungool-builder' ) }
					</Button>
					<IconPicker label={ __( 'Included icon', 'tungool-builder' ) } value={ a.includedIcon } onChange={ set( 'includedIcon' ) } />
					<IconPicker label={ __( 'Excluded icon', 'tungool-builder' ) } value={ a.excludedIcon } onChange={ set( 'excludedIcon' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Button', 'tungool-builder' ) } initialOpen={ false }>
					<TextControl
						type="url"
						label={ __( 'URL', 'tungool-builder' ) }
						value={ button.url || '' }
						onChange={ setButton( 'url' ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl label={ __( 'Open in new tab', 'tungool-builder' ) } checked={ !! button.opensInNewTab } onChange={ setButton( 'opensInNewTab' ) } __nextHasNoMarginBottom />
					<ToggleControl label={ __( 'Mark as nofollow', 'tungool-builder' ) } checked={ !! button.nofollow } onChange={ setButton( 'nofollow' ) } __nextHasNoMarginBottom />
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
				</PanelBody>
				<PanelBody title={ __( 'Featured', 'tungool-builder' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Highlight this plan', 'tungool-builder' ) }
						checked={ a.featured }
						onChange={ set( 'featured' ) }
						__nextHasNoMarginBottom
					/>
					{ a.featured && (
						<RangeControl
							label={ __( 'Scale', 'tungool-builder' ) }
							value={ a.featuredScale }
							min={ 1 }
							max={ 1.2 }
							step={ 0.01 }
							onChange={ ( v ) => setAttributes( { featuredScale: v ?? 1.05 } ) }
							allowReset
							resetFallbackValue={ 1.05 }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Card', 'tungool-builder' ) } initialOpen={ false }>
					<ResponsiveControl label={ __( 'Alignment', 'tungool-builder' ) } value={ a.align } onChange={ set( 'align' ) }>
						{ ( { value: v, onChange: c } ) => (
							<ToggleGroupControl label={ __( 'Alignment', 'tungool-builder' ) } hideLabelFromVision value={ v || '' } onChange={ ( next ) => c( next === v ? '' : next ) } isBlock __nextHasNoMarginBottom>
								<ToggleGroupControlOption value="left" label={ __( 'Left', 'tungool-builder' ) } />
								<ToggleGroupControlOption value="center" label={ __( 'Center', 'tungool-builder' ) } />
								<ToggleGroupControlOption value="right" label={ __( 'Right', 'tungool-builder' ) } />
							</ToggleGroupControl>
						) }
					</ResponsiveControl>
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ a.cardBackground } onChange={ set( 'cardBackground' ) } />
					<SpacingControl type="padding" value={ a.cardPadding } onChange={ set( 'cardPadding' ) } />
					<BorderControl value={ a.cardBorder } onChange={ set( 'cardBorder' ) } />
					<BoxShadowControl value={ a.cardShadow } onChange={ set( 'cardShadow' ) } />
				</PanelBody>
				{ a.featured && (
					<PanelBody title={ __( 'Featured style', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Border color', 'tungool-builder' ) } value={ a.featuredBorderColor } onChange={ set( 'featuredBorderColor' ) } />
						<BoxShadowControl value={ a.featuredShadow } onChange={ set( 'featuredShadow' ) } />
					</PanelBody>
				) }
				{ a.badge && (
					<PanelBody title={ __( 'Badge', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ a.badgeColor } onChange={ set( 'badgeColor' ) } />
						<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ a.badgeBackground } onChange={ set( 'badgeBackground' ) } />
					</PanelBody>
				) }
				{ typo( __( 'Title', 'tungool-builder' ), 'titleTypography', 'titleColor' ) }
				{ typo( __( 'Subtitle', 'tungool-builder' ), 'subtitleTypography', 'subtitleColor' ) }
				{ typo( __( 'Price', 'tungool-builder' ), 'priceTypography', 'priceColor' ) }
				{ typo( __( 'Period', 'tungool-builder' ), 'periodTypography', 'periodColor' ) }
				{ a.originalPrice && (
					<PanelBody title={ __( 'Original price', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ a.originalColor } onChange={ set( 'originalColor' ) } />
					</PanelBody>
				) }
				<PanelBody title={ __( 'Features', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ a.featureColor } onChange={ set( 'featureColor' ) } />
					<ColorControl label={ __( 'Included icon color', 'tungool-builder' ) } value={ a.includedColor } onChange={ set( 'includedColor' ) } />
					<ColorControl label={ __( 'Excluded icon color', 'tungool-builder' ) } value={ a.excludedColor } onChange={ set( 'excludedColor' ) } />
					<ResponsiveControl label={ __( 'Gap between items', 'tungool-builder' ) } value={ a.featureGap } onChange={ set( 'featureGap' ) }>
						{ ( { value: v, onChange: c } ) => (
							<UnitControl value={ v ?? '' } min={ 0 } units={ [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
						) }
					</ResponsiveControl>
					<TypographyControl value={ a.featureTypography } onChange={ set( 'featureTypography' ) } />
				</PanelBody>
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
				{ typo( __( 'Footnote', 'tungool-builder' ), 'footnoteTypography', 'footnoteColor' ) }
			</InspectorControls>
		</>
	);
}
