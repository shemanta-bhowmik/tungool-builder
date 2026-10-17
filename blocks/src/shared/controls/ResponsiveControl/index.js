import { __ } from '@wordpress/i18n';
import { BaseControl, Button, ButtonGroup } from '@wordpress/components';
import { useDeviceType, DEVICES } from '../../hooks';
import './editor.scss';

const ICONS = { desktop: 'desktop', tablet: 'tablet', mobile: 'smartphone' };
const LABELS = {
	desktop: __( 'Desktop', 'tungool-builder' ),
	tablet: __( 'Tablet', 'tungool-builder' ),
	mobile: __( 'Mobile', 'tungool-builder' ),
};

/**
 * Device tabs around any control. Stores { desktop, tablet, mobile }.
 * The active tab follows (and switches) the editor preview device.
 *
 * <ResponsiveControl label="Padding" value={ attributes.padding }
 *     onChange={ ( padding ) => setAttributes( { padding } ) }>
 *     { ( { value, onChange } ) => <UnitControl value={ value } onChange={ onChange } /> }
 * </ResponsiveControl>
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {Object}   props.value    { desktop, tablet, mobile }
 * @param {Function} props.onChange Receives the full responsive object.
 * @param {Function} props.children Render prop: ( { device, value, onChange } ).
 */
export default function ResponsiveControl( { label, value = {}, onChange, children } ) {
	const [ device, setDevice ] = useDeviceType();

	const onDeviceChange = ( next ) => onChange( { ...value, [ device ]: next } );

	return (
		<BaseControl className="tb-responsive-control" __nextHasNoMarginBottom>
			<div className="tb-responsive-control__header">
				{ label && <BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel> }
				<ButtonGroup className="tb-responsive-control__devices">
					{ DEVICES.map( ( d ) => (
						<Button
							key={ d }
							size="small"
							icon={ ICONS[ d ] }
							label={ LABELS[ d ] }
							isPressed={ device === d }
							onClick={ () => setDevice( d ) }
						/>
					) ) }
				</ButtonGroup>
			</div>
			{ children( { device, value: value[ device ], onChange: onDeviceChange } ) }
		</BaseControl>
	);
}
