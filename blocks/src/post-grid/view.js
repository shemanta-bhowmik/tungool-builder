/**
 * TB Post Grid "load more". Only enqueued (from render.php) when a grid on the
 * page uses load more and has more than one page. Each grid is independent.
 */
function setup( el ) {
	let cfg;
	try {
		cfg = JSON.parse( el.dataset.tbPostGrid );
	} catch ( e ) {
		return;
	}
	const button = el.querySelector( '.tb-post-grid__loadmore-btn' );
	const items = el.querySelector( '.tb-post-grid__items' );
	const status = el.querySelector( '.tb-post-grid__status' );
	if ( ! button || ! items ) {
		return;
	}

	button.addEventListener( 'click', async () => {
		if ( button.getAttribute( 'aria-busy' ) === 'true' ) {
			return;
		}
		button.setAttribute( 'aria-busy', 'true' );
		button.disabled = true;
		try {
			const res = await window.fetch( cfg.endpoint, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.restNonce },
				body: JSON.stringify( { payload: cfg.payload, sig: cfg.sig, nonce: cfg.nonce, page: cfg.page + 1 } ),
			} );
			if ( ! res.ok ) {
				throw new Error( String( res.status ) );
			}
			const data = await res.json();
			const tpl = document.createElement( 'template' );
			tpl.innerHTML = data.html || '';
			const cards = Array.from( tpl.content.children );
			items.append( ...cards );
			cfg.page += 1;
			cfg.pages = data.pages || cfg.pages;

			// Move focus to the first new post so keyboard users continue from there.
			cards[ 0 ]?.querySelector( 'a:not([tabindex="-1"])' )?.focus();
			if ( status ) {
				status.textContent = ( cfg.loaded || '%d' ).replace( '%d', String( cards.length ) );
			}
			if ( cfg.page >= cfg.pages || ! cards.length ) {
				button.closest( '.tb-post-grid__loadmore' )?.remove();
				return;
			}
		} catch ( e ) {
			if ( status ) {
				status.textContent = cfg.error || '';
			}
		}
		button.disabled = false;
		button.removeAttribute( 'aria-busy' );
	} );
}

function init() {
	document.querySelectorAll( '.tb-post-grid[data-tb-post-grid]' ).forEach( setup );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
