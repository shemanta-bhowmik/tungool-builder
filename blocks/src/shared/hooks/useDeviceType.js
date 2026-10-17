import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

export const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

/**
 * Editor preview device, synced with the Desktop/Tablet/Mobile preview switcher.
 *
 * @return {[string, Function]} [ 'desktop'|'tablet'|'mobile', setDevice( device ) ]
 */
export default function useDeviceType() {
	const deviceType = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		if ( editor?.getDeviceType ) {
			return editor.getDeviceType();
		}
		// Fallback for older post editor stores.
		return select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.() || 'Desktop';
	}, [] );

	const editorDispatch = useDispatch( 'core/editor' );
	const editPostDispatch = useDispatch( 'core/edit-post' );

	const setDevice = useCallback(
		( device ) => {
			const value = device.charAt( 0 ).toUpperCase() + device.slice( 1 );
			if ( editorDispatch?.setDeviceType ) {
				editorDispatch.setDeviceType( value );
			} else {
				editPostDispatch?.__experimentalSetPreviewDeviceType?.( value );
			}
		},
		[ editorDispatch, editPostDispatch ]
	);

	const device = String( deviceType || 'Desktop' ).toLowerCase();
	return [ DEVICES.includes( device ) ? device : 'desktop', setDevice ];
}
