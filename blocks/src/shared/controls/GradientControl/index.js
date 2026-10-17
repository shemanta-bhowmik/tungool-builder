import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BaseControl, GradientPicker } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';
import { ToggleGroupControl, ToggleGroupControlOption } from '../compat';

/**
 * Gradient from theme gradients (plus custom), with Normal/Hover state.
 * Value: { normal, hover }
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full { normal, hover } object.
 */
export default function GradientControl( { label, value = {}, onChange } ) {
	const [ gradients ] = useSettings( 'color.gradients' );
	const [ state, setState ] = useState( 'normal' );
	value = value || {};

	return (
		<BaseControl className="tb-gradient-control" label={ label } __nextHasNoMarginBottom>
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
			<GradientPicker
				gradients={ gradients || [] }
				value={ value[ state ] || null }
				onChange={ ( next ) => onChange( { ...value, [ state ]: next || '' } ) }
				clearable
				__nextHasNoMargin
			/>
		</BaseControl>
	);
}
