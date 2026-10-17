import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BaseControl, Button, Dropdown, SearchControl } from '@wordpress/components';
import Icon, { library } from '../../icons/Icon';
import './editor.scss';

/**
 * Pick an icon from the shared library. Value is the icon key ('' = none).
 *
 * @param {Object}   props
 * @param {string}   props.label
 * @param {string}   props.value
 * @param {Function} props.onChange
 */
export default function IconPicker( { label, value = '', onChange } ) {
	const [ search, setSearch ] = useState( '' );
	const term = search.trim().toLowerCase();
	const names = Object.keys( library ).filter(
		( name ) => ! term || name.includes( term ) || library[ name ].label.toLowerCase().includes( term )
	);

	return (
		<BaseControl className="tb-icon-picker" label={ label } __nextHasNoMarginBottom>
			<div className="tb-icon-picker__row">
				<Dropdown
					popoverProps={ { placement: 'left-start' } }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button variant="secondary" onClick={ onToggle } aria-expanded={ isOpen }>
							{ value && library[ value ] ? (
								<>
									<Icon name={ value } />
									<span>{ library[ value ].label }</span>
								</>
							) : (
								__( 'Choose icon', 'tungool-builder' )
							) }
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<div className="tb-icon-picker__popover">
							<SearchControl value={ search } onChange={ setSearch } __nextHasNoMarginBottom />
							<div className="tb-icon-picker__grid">
								{ names.map( ( name ) => (
									<Button
										key={ name }
										label={ library[ name ].label }
										isPressed={ value === name }
										onClick={ () => {
											onChange( name );
											onClose();
										} }
									>
										<Icon name={ name } />
									</Button>
								) ) }
							</div>
						</div>
					) }
				/>
				{ value && (
					<Button variant="tertiary" isDestructive onClick={ () => onChange( '' ) }>
						{ __( 'Remove', 'tungool-builder' ) }
					</Button>
				) }
			</div>
		</BaseControl>
	);
}
