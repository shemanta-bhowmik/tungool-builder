/**
 * TB Countdown ticker. render.php prints a correct initial value; this keeps it
 * ticking. The timer region is aria-live="off"; only the end state is announced.
 * Each block instance is handled independently.
 */
import { splitTime } from './units';

const STORAGE_PREFIX = 'tb-countdown-';

function evergreenTarget( key, duration ) {
	const storageKey = STORAGE_PREFIX + key;
	try {
		const saved = parseInt( window.localStorage.getItem( storageKey ), 10 );
		if ( saved > 0 ) {
			return saved;
		}
		const target = Date.now() + duration * 1000;
		window.localStorage.setItem( storageKey, String( target ) );
		return target;
	} catch ( e ) {
		// Storage blocked: the deadline restarts on each page load.
		return Date.now() + duration * 1000;
	}
}

function finish( el, cfg ) {
	const timer = el.querySelector( '.tb-countdown__timer' );
	const status = el.querySelector( '.tb-countdown__status' );
	const message = el.querySelector( '.tb-countdown__message' );

	if ( cfg.onEnd === 'hide' ) {
		el.hidden = true;
		return;
	}
	if ( cfg.onEnd === 'redirect' && /^https?:\/\//i.test( cfg.redirect || '' ) ) {
		if ( status ) {
			status.textContent = cfg.redirectText || '';
		}
		window.location.assign( cfg.redirect );
		return;
	}
	if ( message ) {
		if ( timer ) {
			timer.hidden = true;
		}
		message.hidden = false;
		if ( status ) {
			status.textContent = message.textContent;
		}
	}
}

function start( el ) {
	let cfg;
	try {
		cfg = JSON.parse( el.dataset.tbCountdown );
	} catch ( e ) {
		return;
	}
	const target = cfg.mode === 'evergreen' ? evergreenTarget( cfg.key, cfg.duration ) : cfg.target * 1000;
	if ( ! target ) {
		return;
	}
	const digits = {};
	cfg.units.forEach( ( key ) => {
		digits[ key ] = el.querySelector( `.tb-countdown__item--${ key } .tb-countdown__digits` );
	} );

	let interval;
	const tick = () => {
		const remaining = ( target - Date.now() ) / 1000;
		const parts = splitTime( remaining, cfg.units );
		cfg.units.forEach( ( key ) => {
			if ( digits[ key ] && digits[ key ].textContent !== parts[ key ] ) {
				digits[ key ].textContent = parts[ key ];
			}
		} );
		if ( remaining <= 0 ) {
			window.clearInterval( interval );
			finish( el, cfg );
		}
	};
	tick();
	if ( target > Date.now() ) {
		interval = window.setInterval( tick, 1000 );
	}
}

function init() {
	document.querySelectorAll( '.tb-countdown[data-tb-countdown]' ).forEach( start );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
