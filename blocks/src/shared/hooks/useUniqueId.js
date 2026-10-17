import { useEffect } from '@wordpress/element';
import { useRegistry } from '@wordpress/data';

const makeId = () => Math.random().toString( 36 ).slice( 2, 10 );

/**
 * Keeps attributes.uniqueId set and unique within the editor.
 * - New block (empty id): generates one.
 * - Duplicate/collision: every block except the first one in document order
 *   holding that id gets a new id, so the original keeps its styles.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {string}   props.clientId
 */
export default function useUniqueId( { attributes, setAttributes, clientId } ) {
	const registry = useRegistry();
	const { uniqueId } = attributes;

	useEffect( () => {
		const store = registry.select( 'core/block-editor' );
		const holders = ( id ) =>
			store
				.getClientIdsWithDescendants()
				.filter( ( cid ) => store.getBlockAttributes( cid )?.uniqueId === id );

		if ( uniqueId && holders( uniqueId )[ 0 ] === clientId ) {
			return;
		}

		let id = makeId();
		while ( holders( id ).length ) {
			id = makeId();
		}
		setAttributes( { uniqueId: id } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ uniqueId, clientId ] );

	return uniqueId;
}
