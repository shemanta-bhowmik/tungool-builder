/**
 * TB Accordion — WAI-ARIA accordion pattern with height animation. One instance
 * per .tb-accordion element; queries use :scope so nested accordions stay separate.
 */

const DURATION = 250;
const reduceMotion = () => window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

function animate( panel, open ) {
	panel._tbAnim?.cancel();
	if ( open ) {
		panel.hidden = false;
	}
	if ( reduceMotion() || typeof panel.animate !== 'function' ) {
		panel.hidden = ! open;
		return;
	}
	const height = `${ panel.scrollHeight }px`;
	panel.style.overflow = 'hidden';
	const anim = panel.animate(
		[ { height: open ? '0px' : height }, { height: open ? height : '0px' } ],
		{ duration: DURATION, easing: 'ease' }
	);
	panel._tbAnim = anim;
	anim.onfinish = () => {
		panel.style.overflow = '';
		panel.hidden = ! open;
		panel._tbAnim = null;
	};
}

function initAccordion( root ) {
	const multiple = root.dataset.tbMultiple === 'true';
	const collapsible = root.dataset.tbCollapsible !== 'false';
	const items = Array.from( root.querySelectorAll( ':scope > .tb-accordion-item' ) )
		.map( ( item ) => ( {
			item,
			button: item.querySelector( ':scope > .tb-accordion-item__heading > .tb-accordion-item__title' ),
			panel: item.querySelector( ':scope > .tb-accordion-item__panel' ),
		} ) )
		.filter( ( entry ) => entry.button && entry.panel );

	const setOpen = ( entry, open ) => {
		if ( ( entry.button.getAttribute( 'aria-expanded' ) === 'true' ) === open ) {
			return;
		}
		entry.button.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		entry.item.classList.toggle( 'is-open', open );
		animate( entry.panel, open );
	};

	items.forEach( ( entry, i ) => {
		entry.button.addEventListener( 'click', () => {
			const isOpen = entry.button.getAttribute( 'aria-expanded' ) === 'true';
			if ( isOpen ) {
				const othersOpen = items.some( ( e ) => e !== entry && e.button.getAttribute( 'aria-expanded' ) === 'true' );
				if ( collapsible || othersOpen ) {
					setOpen( entry, false );
				}
				return;
			}
			if ( ! multiple ) {
				items.forEach( ( other ) => other !== entry && setOpen( other, false ) );
			}
			setOpen( entry, true );
		} );

		// Optional APG keys: move focus between headers.
		entry.button.addEventListener( 'keydown', ( event ) => {
			const keys = {
				ArrowDown: ( i + 1 ) % items.length,
				ArrowUp: ( i - 1 + items.length ) % items.length,
				Home: 0,
				End: items.length - 1,
			};
			if ( event.key in keys ) {
				event.preventDefault();
				items[ keys[ event.key ] ].button.focus();
			}
		} );
	} );
}

document.querySelectorAll( '.tb-accordion' ).forEach( initAccordion );
