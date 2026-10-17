import { __ } from '@wordpress/i18n';
import { FontSizePicker, SelectControl } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';
import ResponsiveControl from '../ResponsiveControl';
import { UnitControl, NumberControl } from '../compat';

const WEIGHTS = [ '', '100', '200', '300', '400', '500', '600', '700', '800', '900' ];

/**
 * Value:
 * {
 *   fontSize:      { desktop, tablet, mobile },   // e.g. '24px'
 *   lineHeight:    { desktop, tablet, mobile },   // unitless, e.g. '1.4'
 *   letterSpacing: { desktop, tablet, mobile },   // e.g. '0.05em'
 *   fontWeight:    '600',
 *   textTransform: 'uppercase',
 * }
 *
 * @param {Object}   props
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full typography object.
 */
export default function TypographyControl( { value = {}, onChange } ) {
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const set = ( key ) => ( next ) => onChange( { ...value, [ key ]: next } );

	return (
		<div className="tb-typography-control">
			<ResponsiveControl
				label={ __( 'Font size', 'tungool-builder' ) }
				value={ value.fontSize }
				onChange={ set( 'fontSize' ) }
			>
				{ ( { value: v, onChange: c } ) => (
					<FontSizePicker
						fontSizes={ fontSizes || [] }
						value={ v }
						onChange={ ( next ) => c( next === undefined ? '' : String( next ) ) }
						withReset
						__nextHasNoMarginBottom
					/>
				) }
			</ResponsiveControl>

			<SelectControl
				label={ __( 'Font weight', 'tungool-builder' ) }
				value={ value.fontWeight || '' }
				options={ WEIGHTS.map( ( w ) => ( {
					label: w || __( 'Default', 'tungool-builder' ),
					value: w,
				} ) ) }
				onChange={ set( 'fontWeight' ) }
				__nextHasNoMarginBottom
			/>

			<ResponsiveControl
				label={ __( 'Line height', 'tungool-builder' ) }
				value={ value.lineHeight }
				onChange={ set( 'lineHeight' ) }
			>
				{ ( { value: v, onChange: c } ) => (
					<NumberControl
						value={ v ?? '' }
						min={ 0 }
						step={ 0.1 }
						onChange={ ( next ) => c( next ?? '' ) }
						__next40pxDefaultSize
					/>
				) }
			</ResponsiveControl>

			<ResponsiveControl
				label={ __( 'Letter spacing', 'tungool-builder' ) }
				value={ value.letterSpacing }
				onChange={ set( 'letterSpacing' ) }
			>
				{ ( { value: v, onChange: c } ) => (
					<UnitControl
						value={ v ?? '' }
						units={ [
							{ value: 'px', label: 'px', step: 0.5 },
							{ value: 'em', label: 'em', step: 0.01 },
						] }
						onChange={ ( next ) => c( next ?? '' ) }
						__next40pxDefaultSize
					/>
				) }
			</ResponsiveControl>

			<SelectControl
				label={ __( 'Text transform', 'tungool-builder' ) }
				value={ value.textTransform || '' }
				options={ [
					{ label: __( 'Default', 'tungool-builder' ), value: '' },
					{ label: __( 'None', 'tungool-builder' ), value: 'none' },
					{ label: __( 'Uppercase', 'tungool-builder' ), value: 'uppercase' },
					{ label: __( 'Lowercase', 'tungool-builder' ), value: 'lowercase' },
					{ label: __( 'Capitalize', 'tungool-builder' ), value: 'capitalize' },
				] }
				onChange={ set( 'textTransform' ) }
				__nextHasNoMarginBottom
			/>
		</div>
	);
}
