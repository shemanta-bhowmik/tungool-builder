/**
 * TB Image lightbox. Only enqueued (from render.php) when a block on the page
 * has the lightbox enabled. One shared <dialog> handles every trigger.
 */
let dialog;
let lastTrigger;

function getDialog( closeLabel ) {
	if ( dialog ) {
		return dialog;
	}
	dialog = document.createElement( 'dialog' );
	dialog.className = 'tb-image-lightbox';

	const close = document.createElement( 'button' );
	close.type = 'button';
	close.className = 'tb-image-lightbox__close';
	close.setAttribute( 'aria-label', closeLabel || 'Close' );
	close.textContent = '×';
	close.addEventListener( 'click', () => dialog.close() );

	const img = document.createElement( 'img' );
	img.className = 'tb-image-lightbox__img';
	img.alt = '';

	dialog.append( close, img );
	// Click on the backdrop (outside the image) closes.
	dialog.addEventListener( 'click', ( event ) => {
		if ( event.target === dialog ) {
			dialog.close();
		}
	} );
	dialog.addEventListener( 'close', () => {
		img.removeAttribute( 'src' );
		document.documentElement.style.overflow = '';
		lastTrigger?.focus();
	} );
	document.body.append( dialog );
	return dialog;
}

document.addEventListener( 'click', ( event ) => {
	const trigger = event.target.closest?.( '.tb-image__lightbox-trigger[data-tb-lightbox]' );
	if ( ! trigger ) {
		return;
	}
	const d = getDialog( trigger.dataset.tbClose );
	if ( typeof d.showModal !== 'function' ) {
		window.open( trigger.dataset.tbLightbox, '_blank', 'noopener' );
		return;
	}
	const source = trigger.querySelector( 'img' );
	const img = d.querySelector( '.tb-image-lightbox__img' );
	img.src = trigger.dataset.tbLightbox;
	img.alt = source?.alt || '';
	d.setAttribute( 'aria-label', img.alt || trigger.getAttribute( 'aria-label' ) );
	lastTrigger = trigger;
	document.documentElement.style.overflow = 'hidden';
	d.showModal();
} );
