import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import {
	ResponsiveControl,
	ColorControl,
	IconPicker,
	TypographyControl,
	SpacingControl,
	BorderControl,
} from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';

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
				<PanelBody title={ __( 'Behavior', 'tungool-builder' ) }>
					<ToggleControl
						label={ __( 'First item open', 'tungool-builder' ) }
						checked={ !! attributes.firstOpen }
						onChange={ set( 'firstOpen' ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Allow multiple open', 'tungool-builder' ) }
						checked={ !! attributes.allowMultiple }
						onChange={ set( 'allowMultiple' ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Allow collapsing all', 'tungool-builder' ) }
						help={ __( 'When off, the last open item stays open.', 'tungool-builder' ) }
						checked={ !! attributes.collapsible }
						onChange={ set( 'collapsible' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Title HTML tag', 'tungool-builder' ) }
						value={ attributes.titleTag }
						options={ [ 'h2', 'h3', 'h4', 'h5', 'h6', 'div' ].map( ( t ) => ( { label: t.toUpperCase(), value: t } ) ) }
						onChange={ set( 'titleTag' ) }
						help={ __( 'Wraps the toggle button, which always stays a button.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Output FAQ schema', 'tungool-builder' ) }
						help={ __( 'Adds FAQPage structured data (JSON-LD) built from the titles and content.', 'tungool-builder' ) }
						checked={ !! attributes.faqSchema }
						onChange={ set( 'faqSchema' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody title={ __( 'Icon', 'tungool-builder' ) }>
					<IconPicker label={ __( 'Closed icon', 'tungool-builder' ) } value={ attributes.iconClosed } onChange={ set( 'iconClosed' ) } />
					<IconPicker label={ __( 'Open icon', 'tungool-builder' ) } value={ attributes.iconOpen } onChange={ set( 'iconOpen' ) } />
					<ToggleGroupControl
						label={ __( 'Position', 'tungool-builder' ) }
						value={ attributes.iconPosition }
						onChange={ set( 'iconPosition' ) }
						isBlock
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption value="left" label={ __( 'Left', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="right" label={ __( 'Right', 'tungool-builder' ) } />
					</ToggleGroupControl>
					{ responsiveUnit( __( 'Size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Items', 'tungool-builder' ) } initialOpen={ false }>
					{ responsiveUnit( __( 'Space between items', 'tungool-builder' ), attributes.itemGap, set( 'itemGap' ) ) }
					<BorderControl value={ attributes.itemBorder } onChange={ set( 'itemBorder' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Title', 'tungool-builder' ) } initialOpen={ false }>
					<TypographyControl value={ attributes.titleTypography } onChange={ set( 'titleTypography' ) } />
					<SpacingControl label={ __( 'Padding', 'tungool-builder' ) } value={ attributes.titlePadding } onChange={ set( 'titlePadding' ) } />
					<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ attributes.titleColor } onChange={ set( 'titleColor' ) } hover />
					<ColorControl label={ __( 'Active text color', 'tungool-builder' ) } value={ attributes.titleActiveColor } onChange={ set( 'titleActiveColor' ) } />
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.titleBg } onChange={ set( 'titleBg' ) } hover />
					<ColorControl label={ __( 'Active background', 'tungool-builder' ) } value={ attributes.titleActiveBg } onChange={ set( 'titleActiveBg' ) } />
					<ColorControl label={ __( 'Icon color', 'tungool-builder' ) } value={ attributes.iconColor } onChange={ set( 'iconColor' ) } hover />
				</PanelBody>
				<PanelBody title={ __( 'Content', 'tungool-builder' ) } initialOpen={ false }>
					<SpacingControl label={ __( 'Padding', 'tungool-builder' ) } value={ attributes.contentPadding } onChange={ set( 'contentPadding' ) } />
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.contentBg } onChange={ set( 'contentBg' ) } />
				</PanelBody>
			</InspectorControls>
		</>
	);
}
