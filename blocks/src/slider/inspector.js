import { __, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	Notice,
} from '@wordpress/components';
import { ResponsiveControl, ColorControl, IconPicker } from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';

const opt = ( label, value ) => ( { label, value } );

export default function Inspector( { attributes, setAttributes, slideIds = [], active, onSelectSlide } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const { effect, autoplay, showArrows, showDots } = attributes;
	const { selectBlock } = useDispatch( blockEditorStore );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slides', 'tungool-builder' ) }>
					<div className="tb-slider-slide-list">
						{ slideIds.map( ( id, i ) => (
							<Button
								key={ id }
								variant={ i === active ? 'primary' : 'secondary' }
								onClick={ () => {
									onSelectSlide( i );
									selectBlock( id );
								} }
							>
								{ sprintf(
									/* translators: %d: slide number. */
									__( 'Slide %d', 'tungool-builder' ),
									i + 1
								) }
							</Button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody title={ __( 'Carousel', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Transition', 'tungool-builder' ) }
						value={ effect }
						options={ [ opt( __( 'Slide', 'tungool-builder' ), 'slide' ), opt( __( 'Fade', 'tungool-builder' ), 'fade' ) ] }
						onChange={ set( 'effect' ) }
						__nextHasNoMarginBottom
					/>
					{ effect !== 'fade' && (
						<ResponsiveControl
							label={ __( 'Slides per view', 'tungool-builder' ) }
							value={ attributes.slidesPerView }
							onChange={ set( 'slidesPerView' ) }
						>
							{ ( { value, onChange } ) => (
								<RangeControl
									value={ value ?? '' }
									min={ 1 }
									max={ 6 }
									onChange={ ( next ) => onChange( next ?? '' ) }
									allowReset
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							) }
						</ResponsiveControl>
					) }
					{ effect !== 'fade' && (
						<ResponsiveControl label={ __( 'Gap', 'tungool-builder' ) } value={ attributes.gap } onChange={ set( 'gap' ) }>
							{ ( { value, onChange } ) => (
								<UnitControl
									value={ value ?? '' }
									min={ 0 }
									units={ [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) }
									onChange={ ( next ) => onChange( next ?? '' ) }
									__next40pxDefaultSize
								/>
							) }
						</ResponsiveControl>
					) }
					<RangeControl
						label={ __( 'Transition speed (ms)', 'tungool-builder' ) }
						value={ attributes.speed }
						min={ 0 }
						max={ 3000 }
						step={ 50 }
						onChange={ ( v ) => setAttributes( { speed: v ?? 500 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __( 'Loop', 'tungool-builder' ) }
						help={ __( 'After the last slide, go back to the first.', 'tungool-builder' ) }
						checked={ attributes.loop }
						onChange={ set( 'loop' ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'tungool-builder' ) }
						checked={ autoplay }
						onChange={ set( 'autoplay' ) }
						__nextHasNoMarginBottom
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Autoplay delay (ms)', 'tungool-builder' ) }
								value={ attributes.autoplayDelay }
								min={ 1000 }
								max={ 15000 }
								step={ 250 }
								onChange={ ( v ) => setAttributes( { autoplayDelay: v ?? 5000 } ) }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<ToggleControl
								label={ __( 'Pause on hover and focus', 'tungool-builder' ) }
								checked={ attributes.pauseOnHover }
								onChange={ set( 'pauseOnHover' ) }
								__nextHasNoMarginBottom
							/>
							<Notice status="info" isDismissible={ false }>
								{ __( 'A pause button is shown, and autoplay stays off for visitors who prefer reduced motion.', 'tungool-builder' ) }
							</Notice>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Arrows', 'tungool-builder' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show arrows', 'tungool-builder' ) }
						checked={ showArrows }
						onChange={ set( 'showArrows' ) }
						__nextHasNoMarginBottom
					/>
					{ showArrows && (
						<>
							<IconPicker label={ __( 'Previous icon', 'tungool-builder' ) } value={ attributes.prevIcon } onChange={ set( 'prevIcon' ) } />
							<IconPicker label={ __( 'Next icon', 'tungool-builder' ) } value={ attributes.nextIcon } onChange={ set( 'nextIcon' ) } />
							<SelectControl
								label={ __( 'Position', 'tungool-builder' ) }
								value={ attributes.arrowPosition }
								options={ [
									opt( __( 'Inside, on the sides', 'tungool-builder' ), 'inside' ),
									opt( __( 'Outside, on the sides', 'tungool-builder' ), 'outside' ),
									opt( __( 'Below the slides', 'tungool-builder' ), 'bottom' ),
								] }
								onChange={ set( 'arrowPosition' ) }
								__nextHasNoMarginBottom
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Dots', 'tungool-builder' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show dots', 'tungool-builder' ) }
						checked={ showDots }
						onChange={ set( 'showDots' ) }
						__nextHasNoMarginBottom
					/>
					{ showDots && (
						<SelectControl
							label={ __( 'Style', 'tungool-builder' ) }
							value={ attributes.dotStyle }
							options={ [
								opt( __( 'Dots', 'tungool-builder' ), 'dot' ),
								opt( __( 'Lines', 'tungool-builder' ), 'line' ),
								opt( __( 'Squares', 'tungool-builder' ), 'square' ),
							] }
							onChange={ set( 'dotStyle' ) }
							__nextHasNoMarginBottom
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				{ showArrows && (
					<PanelBody title={ __( 'Arrows', 'tungool-builder' ) } initialOpen={ false }>
						<ResponsiveControl label={ __( 'Icon size', 'tungool-builder' ) } value={ attributes.arrowSize } onChange={ set( 'arrowSize' ) }>
							{ ( { value, onChange } ) => (
								<UnitControl
									value={ value ?? '' }
									min={ 0 }
									units={ [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) }
									onChange={ ( next ) => onChange( next ?? '' ) }
									__next40pxDefaultSize
								/>
							) }
						</ResponsiveControl>
						<ColorControl label={ __( 'Icon color', 'tungool-builder' ) } value={ attributes.arrowColor } onChange={ set( 'arrowColor' ) } hover />
						<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ attributes.arrowBackground } onChange={ set( 'arrowBackground' ) } hover />
						<UnitControl
							label={ __( 'Border radius', 'tungool-builder' ) }
							value={ attributes.arrowRadius }
							min={ 0 }
							units={ [ 'px', '%' ].map( ( u ) => ( { value: u, label: u } ) ) }
							onChange={ ( next ) => setAttributes( { arrowRadius: next ?? '' } ) }
							__next40pxDefaultSize
						/>
					</PanelBody>
				) }
				{ showDots && (
					<PanelBody title={ __( 'Dots', 'tungool-builder' ) } initialOpen={ false }>
						<RangeControl
							label={ __( 'Size (px)', 'tungool-builder' ) }
							value={ attributes.dotSize }
							min={ 4 }
							max={ 30 }
							onChange={ ( v ) => setAttributes( { dotSize: v ?? 10 } ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ attributes.dotColor } onChange={ set( 'dotColor' ) } />
						<ColorControl label={ __( 'Active / hover color', 'tungool-builder' ) } value={ attributes.dotActiveColor } onChange={ set( 'dotActiveColor' ) } />
					</PanelBody>
				) }
			</InspectorControls>

			<InspectorControls group="advanced">
				<TextControl
					label={ __( 'Carousel label (aria-label)', 'tungool-builder' ) }
					value={ attributes.label }
					onChange={ set( 'label' ) }
					help={ __( 'Names the carousel for screen readers, e.g. "Customer reviews". Defaults to "Carousel".', 'tungool-builder' ) }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
			</InspectorControls>
		</>
	);
}
