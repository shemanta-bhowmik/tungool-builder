import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	DateTimePicker,
	Dropdown,
	Button,
	BaseControl,
} from '@wordpress/components';
import { getSettings, dateI18n } from '@wordpress/date';
import { ResponsiveControl, SpacingControl, TypographyControl, ColorControl, BorderControl } from '../shared/controls';
import { UnitControl, ToggleGroupControl, ToggleGroupControlOption } from '../shared/controls/compat';
import { defaultLabels } from './edit';

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
	const { mode, date, onEnd, labels = {}, layout } = attributes;
	const settings = getSettings();
	const is12Hour = /a(?!\\)/i.test( ( settings?.formats?.time || '' ).toLowerCase().replace( /\\\\/g, '' ) );
	const fallback = defaultLabels();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Countdown', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Mode', 'tungool-builder' ) }
						value={ mode }
						options={ [
							opt( __( 'Fixed date & time', 'tungool-builder' ), 'fixed' ),
							opt( __( 'Evergreen (per visitor)', 'tungool-builder' ), 'evergreen' ),
						] }
						onChange={ set( 'mode' ) }
						help={
							mode === 'evergreen'
								? __( 'Each visitor gets their own deadline, starting on their first visit (stored in their browser).', 'tungool-builder' )
								: __( 'Uses the site timezone from Settings → General.', 'tungool-builder' )
						}
						__nextHasNoMarginBottom
					/>
					{ mode === 'fixed' ? (
						<BaseControl label={ __( 'Ends at', 'tungool-builder' ) } __nextHasNoMarginBottom>
							<Dropdown
								popoverProps={ { placement: 'left-start' } }
								renderToggle={ ( { isOpen, onToggle } ) => (
									<Button variant="secondary" onClick={ onToggle } aria-expanded={ isOpen }>
										{ date ? dateI18n( `${ settings.formats.date } ${ settings.formats.time }`, date ) : __( 'Pick date & time', 'tungool-builder' ) }
									</Button>
								) }
								renderContent={ () => (
									<DateTimePicker
										currentDate={ date || undefined }
										onChange={ ( next ) => setAttributes( { date: next || '' } ) }
										is12Hour={ is12Hour }
									/>
								) }
							/>
						</BaseControl>
					) : (
						<>
							<RangeControl
								label={ __( 'Hours', 'tungool-builder' ) }
								value={ attributes.evergreenHours }
								min={ 0 }
								max={ 720 }
								onChange={ ( v ) => setAttributes( { evergreenHours: v ?? 0 } ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<RangeControl
								label={ __( 'Minutes', 'tungool-builder' ) }
								value={ attributes.evergreenMinutes }
								min={ 0 }
								max={ 59 }
								onChange={ ( v ) => setAttributes( { evergreenMinutes: v ?? 0 } ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Units & labels', 'tungool-builder' ) } initialOpen={ false }>
					{ [ 'days', 'hours', 'minutes', 'seconds' ].map( ( key ) => {
						const attr = `show${ key[ 0 ].toUpperCase() }${ key.slice( 1 ) }`;
						return (
							<div key={ key } className="tb-countdown-unit-setting">
								<ToggleControl
									label={ fallback[ key ] }
									checked={ !! attributes[ attr ] }
									onChange={ set( attr ) }
									__nextHasNoMarginBottom
								/>
								{ attributes[ attr ] && attributes.showLabels && (
									<TextControl
										label={ __( 'Label', 'tungool-builder' ) }
										hideLabelFromVision
										placeholder={ fallback[ key ] }
										value={ labels[ key ] || '' }
										onChange={ ( v ) => setAttributes( { labels: { ...labels, [ key ]: v } } ) }
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									/>
								) }
							</div>
						);
					} ) }
					<ToggleControl
						label={ __( 'Show labels', 'tungool-builder' ) }
						checked={ attributes.showLabels }
						onChange={ set( 'showLabels' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'When it ends', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Action', 'tungool-builder' ) }
						value={ onEnd }
						options={ [
							opt( __( 'Show a message', 'tungool-builder' ), 'message' ),
							opt( __( 'Hide the block', 'tungool-builder' ), 'hide' ),
							opt( __( 'Redirect to URL', 'tungool-builder' ), 'redirect' ),
						] }
						onChange={ set( 'onEnd' ) }
						__nextHasNoMarginBottom
					/>
					{ onEnd === 'message' && (
						<TextareaControl
							label={ __( 'Message', 'tungool-builder' ) }
							value={ attributes.endMessage }
							placeholder={ __( 'This offer has ended.', 'tungool-builder' ) }
							onChange={ set( 'endMessage' ) }
							__nextHasNoMarginBottom
						/>
					) }
					{ onEnd === 'redirect' && (
						<TextControl
							type="url"
							label={ __( 'Redirect URL', 'tungool-builder' ) }
							value={ attributes.redirectUrl }
							onChange={ set( 'redirectUrl' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Layout', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Layout', 'tungool-builder' ) }
						value={ layout }
						options={ [ opt( __( 'Boxes', 'tungool-builder' ), 'boxes' ), opt( __( 'Inline', 'tungool-builder' ), 'inline' ) ] }
						onChange={ set( 'layout' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Separator', 'tungool-builder' ) }
						value={ attributes.separator }
						options={ [ opt( __( 'None', 'tungool-builder' ), '' ), opt( ':', ':' ), opt( '/', '/' ), opt( '·', '·' ), opt( '-', '-' ) ] }
						onChange={ set( 'separator' ) }
						__nextHasNoMarginBottom
					/>
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
					{ responsiveUnit( __( 'Gap', 'tungool-builder' ), attributes.gap, set( 'gap' ) ) }
				</PanelBody>
				<PanelBody title={ __( 'Digits', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.digitColor } onChange={ set( 'digitColor' ) } />
					<TypographyControl value={ attributes.digitTypography } onChange={ set( 'digitTypography' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Labels', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.labelColor } onChange={ set( 'labelColor' ) } />
					<TypographyControl value={ attributes.labelTypography } onChange={ set( 'labelTypography' ) } />
				</PanelBody>
				{ layout !== 'inline' && (
					<PanelBody title={ __( 'Boxes', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.boxBackground } onChange={ set( 'boxBackground' ) } />
						<BorderControl value={ attributes.boxBorder } onChange={ set( 'boxBorder' ) } />
						<SpacingControl type="padding" value={ attributes.boxPadding } onChange={ set( 'boxPadding' ) } />
						{ responsiveUnit( __( 'Minimum width', 'tungool-builder' ), attributes.boxMinWidth, set( 'boxMinWidth' ) ) }
					</PanelBody>
				) }
				{ attributes.separator && (
					<PanelBody title={ __( 'Separator', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.separatorColor } onChange={ set( 'separatorColor' ) } />
					</PanelBody>
				) }
				{ onEnd === 'message' && (
					<PanelBody title={ __( 'End message', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.messageColor } onChange={ set( 'messageColor' ) } />
						<TypographyControl value={ attributes.messageTypography } onChange={ set( 'messageTypography' ) } />
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
