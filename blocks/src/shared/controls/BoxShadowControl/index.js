import { __ } from '@wordpress/i18n';
import { RangeControl, ToggleControl, BaseControl, ColorPalette } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';

/**
 * Value: { x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false }
 * Empty object / no color = no shadow. Convert with boxShadowToCSS().
 *
 * @param {Object}   props
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full shadow object.
 */
export default function BoxShadowControl( { value = {}, onChange } ) {
	const [ palette ] = useSettings( 'color.palette' );
	const set = ( key ) => ( next ) => onChange( { ...value, [ key ]: next } );
	const range = ( key, label, min, max ) => (
		<RangeControl
			label={ label }
			value={ value[ key ] ?? 0 }
			min={ min }
			max={ max }
			onChange={ ( next ) => set( key )( next ?? 0 ) }
			allowReset
			resetFallbackValue={ 0 }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	);

	return (
		<div className="tb-box-shadow-control">
			<BaseControl label={ __( 'Shadow color', 'tungool-builder' ) } __nextHasNoMarginBottom>
				<ColorPalette
					colors={ palette || [] }
					value={ value.color || '' }
					onChange={ ( next ) => set( 'color' )( next || '' ) }
					enableAlpha
					clearable
				/>
			</BaseControl>
			{ range( 'x', __( 'Horizontal offset', 'tungool-builder' ), -50, 50 ) }
			{ range( 'y', __( 'Vertical offset', 'tungool-builder' ), -50, 50 ) }
			{ range( 'blur', __( 'Blur', 'tungool-builder' ), 0, 100 ) }
			{ range( 'spread', __( 'Spread', 'tungool-builder' ), -50, 50 ) }
			<ToggleControl
				label={ __( 'Inset', 'tungool-builder' ) }
				checked={ !! value.inset }
				onChange={ set( 'inset' ) }
				__nextHasNoMarginBottom
			/>
		</div>
	);
}

// Kept as an alias so the control and the generators share one implementation.
export { boxShadowValue as boxShadowToCSS } from '../../utils/css';
