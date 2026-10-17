import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
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

const opt = ( label, value ) => ( { label, value } );
const units = ( list ) => list.map( ( u ) => ( { value: u, label: u } ) );

const responsiveUnit = ( label, value, onChange, list = [ 'px', 'em', 'rem' ] ) => (
	<ResponsiveControl label={ label } value={ value } onChange={ onChange }>
		{ ( { value: v, onChange: c } ) => (
			<UnitControl value={ v ?? '' } min={ 0 } units={ units( list ) } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
		) }
	</ResponsiveControl>
);

const stripTags = ( html = '' ) => html.replace( /<[^>]*>/g, '' );

export default function Inspector( { attributes, setAttributes, tabs = [], activeTab } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const vertical = attributes.orientation === 'vertical';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tabs', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Open by default', 'tungool-builder' ) }
						value={ String( attributes.defaultTab ) }
						options={ tabs.map( ( tab, i ) =>
							opt(
								stripTags( tab.attributes.title ) ||
									/* translators: %d: tab number. */
									sprintf( __( 'Tab %d', 'tungool-builder' ), i + 1 ),
								String( i )
							)
						) }
						onChange={ ( next ) => setAttributes( { defaultTab: Number( next ) } ) }
						__nextHasNoMarginBottom
					/>
					{ activeTab && (
						<IconPicker
							label={ __( 'Icon of the current tab', 'tungool-builder' ) }
							value={ activeTab.attributes.icon }
							onChange={ ( icon ) => updateBlockAttributes( activeTab.clientId, { icon } ) }
						/>
					) }
					<ToggleControl
						label={ __( 'Open tab from URL hash', 'tungool-builder' ) }
						help={ __( 'Links to #tab-anchor open that tab. Set the anchor in each tab’s Advanced panel.', 'tungool-builder' ) }
						checked={ !! attributes.hashNavigation }
						onChange={ set( 'hashNavigation' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'tungool-builder' ) }>
					<ToggleGroupControl
						label={ __( 'Orientation', 'tungool-builder' ) }
						value={ attributes.orientation }
						onChange={ set( 'orientation' ) }
						isBlock
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption value="horizontal" label={ __( 'Horizontal', 'tungool-builder' ) } />
						<ToggleGroupControlOption value="vertical" label={ __( 'Vertical', 'tungool-builder' ) } />
					</ToggleGroupControl>
					<ResponsiveControl label={ __( 'Title alignment', 'tungool-builder' ) } value={ attributes.navAlign } onChange={ set( 'navAlign' ) }>
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
					<ToggleControl
						label={ __( 'Full-width titles', 'tungool-builder' ) }
						checked={ !! attributes.fullWidth }
						onChange={ set( 'fullWidth' ) }
						__nextHasNoMarginBottom
					/>
					{ vertical && responsiveUnit( __( 'Title column width', 'tungool-builder' ), attributes.navWidth, set( 'navWidth' ), [ 'px', '%', 'em' ] ) }
					<SelectControl
						label={ __( 'On mobile', 'tungool-builder' ) }
						value={ attributes.mobileMode }
						options={ [
							opt( __( 'Accordion', 'tungool-builder' ), 'accordion' ),
							opt( __( 'Stacked (all open)', 'tungool-builder' ), 'stacked' ),
							opt( __( 'Keep tabs', 'tungool-builder' ), 'none' ),
						] }
						onChange={ set( 'mobileMode' ) }
						help={ __( 'Applies on the frontend below 768px.', 'tungool-builder' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Icon position', 'tungool-builder' ) }
						value={ attributes.iconPosition }
						options={ [ opt( __( 'Before title', 'tungool-builder' ), 'before' ), opt( __( 'After title', 'tungool-builder' ), 'after' ) ] }
						onChange={ set( 'iconPosition' ) }
						__nextHasNoMarginBottom
					/>
					{ responsiveUnit( __( 'Space between titles', 'tungool-builder' ), attributes.titleGap, set( 'titleGap' ) ) }
					{ responsiveUnit( __( 'Space between titles and content', 'tungool-builder' ), attributes.navSpacing, set( 'navSpacing' ) ) }
					{ responsiveUnit( __( 'Icon size', 'tungool-builder' ), attributes.iconSize, set( 'iconSize' ) ) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Titles', 'tungool-builder' ) } initialOpen={ false }>
					<TypographyControl value={ attributes.titleTypography } onChange={ set( 'titleTypography' ) } />
					<SpacingControl label={ __( 'Padding', 'tungool-builder' ) } value={ attributes.titlePadding } onChange={ set( 'titlePadding' ) } />
					<ColorControl label={ __( 'Text color', 'tungool-builder' ) } value={ attributes.titleColor } onChange={ set( 'titleColor' ) } hover />
					<ColorControl label={ __( 'Active text color', 'tungool-builder' ) } value={ attributes.titleActiveColor } onChange={ set( 'titleActiveColor' ) } />
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.titleBg } onChange={ set( 'titleBg' ) } hover />
					<ColorControl label={ __( 'Active background', 'tungool-builder' ) } value={ attributes.titleActiveBg } onChange={ set( 'titleActiveBg' ) } />
					<BorderControl value={ attributes.titleBorder } onChange={ set( 'titleBorder' ) } hover />
					<ColorControl
						label={ __( 'Active border color', 'tungool-builder' ) }
						value={ attributes.titleActiveBorderColor }
						onChange={ set( 'titleActiveBorderColor' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Content panel', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.panelBg } onChange={ set( 'panelBg' ) } />
					<SpacingControl label={ __( 'Padding', 'tungool-builder' ) } value={ attributes.panelPadding } onChange={ set( 'panelPadding' ) } />
					<BorderControl value={ attributes.panelBorder } onChange={ set( 'panelBorder' ) } />
				</PanelBody>
			</InspectorControls>
		</>
	);
}
