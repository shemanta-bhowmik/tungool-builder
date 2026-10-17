import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { getSettings } from '@wordpress/date';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import countdownCSS from './styles';
import { UNITS, splitTime } from './units';
import './edit.scss';

export const defaultLabels = () => ( {
	days: __( 'Days', 'tungool-builder' ),
	hours: __( 'Hours', 'tungool-builder' ),
	minutes: __( 'Minutes', 'tungool-builder' ),
	seconds: __( 'Seconds', 'tungool-builder' ),
} );

/**
 * "YYYY-MM-DDTHH:mm:ss" in the site timezone → epoch ms (uses the site's current UTC offset).
 *
 * @param {string} date
 * @return {number|null} Epoch ms or null.
 */
export function siteDateToMs( date ) {
	const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec( date || '' );
	if ( ! m ) {
		return null;
	}
	const offset = Number( getSettings()?.timezone?.offset ) || 0;
	return Date.UTC( m[ 1 ], m[ 2 ] - 1, m[ 3 ], m[ 4 ], m[ 5 ], m[ 6 ] || 0 ) - offset * 3600000;
}

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, mode, date, evergreenHours, evergreenMinutes, showLabels, labels = {}, layout, separator } =
		attributes;
	const [ now, setNow ] = useState( Date.now() );

	useUniqueId( { attributes, setAttributes, clientId } );

	useEffect( () => {
		const timer = setInterval( () => setNow( Date.now() ), 1000 );
		return () => clearInterval( timer );
	}, [] );

	const shown = UNITS.map( ( u ) => u.key ).filter(
		( key ) => attributes[ `show${ key[ 0 ].toUpperCase() }${ key.slice( 1 ) }` ]
	);
	const target = siteDateToMs( date );
	const remaining =
		mode === 'evergreen'
			? ( Number( evergreenHours ) || 0 ) * 3600 + ( Number( evergreenMinutes ) || 0 ) * 60
			: Math.max( 0, target ? ( target - now ) / 1000 : 0 );
	const parts = splitTime( remaining, shown );
	const fallback = defaultLabels();
	const isBoxes = layout !== 'inline';

	const blockProps = useBlockProps( {
		className: [ 'tb-countdown', `tb-countdown--${ isBoxes ? 'boxes' : 'inline' }`, uniqueId && `tb-block-${ uniqueId }` ]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = countdownCSS( attributes );

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<div className="tb-countdown__timer">
					{ shown.map( ( key, i ) => (
						<span key={ key } className="tb-countdown__group">
							{ i > 0 && separator && (
								<span className="tb-countdown__sep" aria-hidden="true">
									{ separator }
								</span>
							) }
							<span className={ `tb-countdown__item tb-countdown__item--${ key }` }>
								<span className="tb-countdown__digits">{ parts[ key ] }</span>
								{ showLabels && <span className="tb-countdown__label">{ labels[ key ] || fallback[ key ] }</span> }
							</span>
						</span>
					) ) }
				</div>
				{ mode === 'fixed' && ! target && (
					<p className="tb-countdown__notice">{ __( 'Pick an end date in the block settings.', 'tungool-builder' ) }</p>
				) }
			</div>
		</>
	);
}
