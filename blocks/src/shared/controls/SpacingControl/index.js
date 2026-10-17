import { __ } from '@wordpress/i18n';
import ResponsiveControl from '../ResponsiveControl';
import { BoxControl } from '../compat';

/**
 * Padding or margin, linked/unlinked (BoxControl's link button), per device.
 * Value: { desktop: { top, right, bottom, left }, tablet: {...}, mobile: {...} }
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {Object}   props.value
 * @param {Function} props.onChange
 * @param {string}   [props.type] 'padding' | 'margin' (margin allows negative values).
 */
export default function SpacingControl( { label, value = {}, onChange, type = 'padding' } ) {
	return (
		<ResponsiveControl
			label={ label || ( type === 'margin' ? __( 'Margin', 'tungool-builder' ) : __( 'Padding', 'tungool-builder' ) ) }
			value={ value }
			onChange={ onChange }
		>
			{ ( { value: sides, onChange: setSides } ) => (
				<BoxControl
					label=""
					values={ sides || {} }
					onChange={ ( next ) => setSides( next ) }
					allowReset
					inputProps={ type === 'margin' ? { min: -999 } : { min: 0 } }
					__nextHasNoMarginBottom
				/>
			) }
		</ResponsiveControl>
	);
}
