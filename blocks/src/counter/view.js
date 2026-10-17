/**
 * TB Counter count-up. The final value is already in the HTML (render.php);
 * this only animates it once when the counter scrolls into view.
 * Skipped entirely with prefers-reduced-motion or without IntersectionObserver.
 */
import { formatNumber } from './format';

const ease = ( t ) => 1 - Math.pow( 1 - t, 3 );

function animate( el, cfg ) {
	const valueEl = el.querySelector( '.tb-counter__value' );
	const { start, end, duration, decimals, thousands, point } = cfg;
	const t0 = performance.now();
	const step = ( now ) => {
		const t = duration > 0 ? Math.min( 1, ( now - t0 ) / duration ) : 1;
		valueEl.textContent = formatNumber( t < 1 ? start + ( end - start ) * ease( t ) : end, decimals, thousands, point );
		if ( t < 1 ) {
			window.requestAnimationFrame( step );
		}
	};
	window.requestAnimationFrame( step );
}

function init() {
	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}
	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					observer.unobserve( entry.target );
					animate( entry.target, entry.target.tbCounter );
				}
			} );
		},
		{ threshold: 0.3 }
	);

	document.querySelectorAll( '.tb-counter[data-tb-counter]' ).forEach( ( el ) => {
		let cfg;
		try {
			cfg = JSON.parse( el.dataset.tbCounter );
		} catch ( e ) {
			return;
		}
		const valueEl = el.querySelector( '.tb-counter__value' );
		if ( ! valueEl || cfg.start === cfg.end ) {
			return;
		}
		el.tbCounter = cfg;
		valueEl.textContent = formatNumber( cfg.start, cfg.decimals, cfg.thousands, cfg.point );
		observer.observe( el );
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
