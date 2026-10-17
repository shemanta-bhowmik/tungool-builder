import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BaseControl, ColorPalette } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';
import { ToggleGroupControl, ToggleGroupControlOption } from '../compat';

/**
 * Color from the theme palette (plus custom picker), optionally with a hover state.
 * Value: { normal: '#hex', hover: '#hex' }
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full { normal, hover } object.
 * @param {boolean}  [props.hover]  Show the Normal/Hover toggle.
 */
export default function ColorControl( { label, value = {}, onChange, hover = false } ) {
	const [ palette, customEnabled ] = useSettings( 'color.palette', 'color.custom' );
	const [ state, setState ] = useState( 'normal' );
	const active = hover ? state : 'normal';

	return (
		<BaseControl className="tb-color-control" label={ label } __nextHasNoMarginBottom>
			{ hover && (
				<ToggleGroupControl
					label={ __( 'State', 'tungool-builder' ) }
					hideLabelFromVision
					value={ state }
					onChange={ setState }
					isBlock
					__nextHasNoMarginBottom
				>
					<ToggleGroupControlOption value="normal" label={ __( 'Normal', 'tungool-builder' ) } />
					<ToggleGroupControlOption value="hover" label={ __( 'Hover', 'tungool-builder' ) } />
				</ToggleGroupControl>
			) }
			<ColorPalette
				colors={ palette || [] }
				disableCustomColors={ customEnabled === false }
				value={ value[ active ] || '' }
				onChange={ ( next ) => onChange( { ...value, [ active ]: next || '' } ) }
				enableAlpha
				clearable
			/>
		</BaseControl>
	);
}
