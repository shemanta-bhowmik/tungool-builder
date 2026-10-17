/**
 * TB Tabs — WAI-ARIA tabs pattern (automatic activation), mobile accordion
 * headers and optional #hash deep links. One instance per .tb-tabs element;
 * every query is scoped to that element with :scope so nested tabs stay separate.
 */

function initTabs( root ) {
	const nav = root.querySelector( ':scope > .tb-tabs__nav' );
	const panelsWrap = root.querySelector( ':scope > .tb-tabs__panels' );
	if ( ! nav || ! panelsWrap ) {
		return;
	}
	const tabs = Array.from( nav.querySelectorAll( ':scope > [role="tab"]' ) );
	const panels = tabs.map( ( tab ) =>
		Array.from( panelsWrap.children ).find( ( el ) => el.id === tab.getAttribute( 'aria-controls' ) )
	);
	const heads = Array.from( panelsWrap.querySelectorAll( ':scope > button.tb-tabs__acc-title' ) );
	const vertical = nav.getAttribute( 'aria-orientation' ) === 'vertical';

	const select = ( index, focus = false ) => {
		tabs.forEach( ( tab, i ) => {
			const on = i === index;
			tab.setAttribute( 'aria-selected', on ? 'true' : 'false' );
			tab.tabIndex = on ? 0 : -1;
			if ( panels[ i ] ) {
				panels[ i ].hidden = ! on;
			}
		} );
		heads.forEach( ( head, i ) => head.setAttribute( 'aria-expanded', i === index ? 'true' : 'false' ) );
		if ( focus ) {
			tabs[ index ]?.focus();
		}
	};

	tabs.forEach( ( tab, i ) => {
		tab.addEventListener( 'click', () => select( i ) );
		tab.addEventListener( 'keydown', ( event ) => {
			const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
			const next = vertical ? 'ArrowDown' : 'ArrowRight';
			let target = null;
			if ( event.key === prev ) {
				target = ( i - 1 + tabs.length ) % tabs.length;
			} else if ( event.key === next ) {
				target = ( i + 1 ) % tabs.length;
			} else if ( event.key === 'Home' ) {
				target = 0;
			} else if ( event.key === 'End' ) {
				target = tabs.length - 1;
			}
			if ( target !== null ) {
				event.preventDefault();
				select( target, true );
			}
		} );
	} );

	// Mobile accordion headers: open one, or close it again.
	heads.forEach( ( head, i ) => {
		head.addEventListener( 'click', () => {
			if ( head.getAttribute( 'aria-expanded' ) === 'true' ) {
				head.setAttribute( 'aria-expanded', 'false' );
				if ( panels[ i ] ) {
					panels[ i ].hidden = true;
				}
				return;
			}
			select( i );
		} );
	} );

	if ( root.dataset.tbHash === 'true' ) {
		const fromHash = () => {
			let id = '';
			try {
				id = decodeURIComponent( window.location.hash.slice( 1 ) );
			} catch ( e ) {
				return;
			}
			if ( ! id ) {
				return;
			}
			const index = tabs.findIndex( ( tab, i ) => tab.id === id || panels[ i ]?.id === id );
			if ( index > -1 ) {
				select( index );
				const reduce = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
				root.scrollIntoView( { behavior: reduce ? 'auto' : 'smooth', block: 'start' } );
			}
		};
		fromHash();
		window.addEventListener( 'hashchange', fromHash );
	}
}

document.querySelectorAll( '.tb-tabs' ).forEach( initTabs );
