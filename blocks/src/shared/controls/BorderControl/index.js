import { __ } from '@wordpress/i18n';
import { useSettings } from '@wordpress/block-editor';
import ResponsiveControl from '../ResponsiveControl';
import ColorControl from '../ColorControl';
import { BorderControl as CoreBorderControl, UnitControl } from '../compat';

/**
 * Value:
 * {
 *   width: '1px', style: 'solid', color: '#hex',
 *   radius: { desktop: '8px', tablet: '', mobile: '' },
 *   hoverColor: '#hex',   // only with the `hover` prop
 * }
 *
 * @param {Object}   props
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full border object.
 * @param {boolean}  [props.hover]  Show a hover border color.
 */
export default function BorderControl( { value = {}, onChange, hover = false } ) {
	const [ palette ] = useSettings( 'color.palette' );
	const { radius, hoverColor, ...border } = value;

	return (
		<div className="tb-border-control">
			<CoreBorderControl
				label={ __( 'Border', 'tungool-builder' ) }
				colors={ palette || [] }
				value={ border }
				onChange={ ( next = {} ) =>
					onChange( { ...value, width: next.width || '', style: next.style || '', color: next.color || '' } )
				}
				enableAlpha
				enableStyle
				withSlider
				__next40pxDefaultSize
			/>
			{ hover && (
				<ColorControl
					label={ __( 'Border color on hover', 'tungool-builder' ) }
					value={ { normal: hoverColor } }
					onChange={ ( next ) => onChange( { ...value, hoverColor: next.normal || '' } ) }
				/>
			) }
			<ResponsiveControl
				label={ __( 'Border radius', 'tungool-builder' ) }
				value={ radius }
				onChange={ ( next ) => onChange( { ...value, radius: next } ) }
			>
				{ ( { value: v, onChange: c } ) => (
					<UnitControl
						value={ v ?? '' }
						min={ 0 }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: '%', label: '%' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( next ) => c( next ?? '' ) }
						__next40pxDefaultSize
					/>
				) }
			</ResponsiveControl>
		</div>
	);
}
