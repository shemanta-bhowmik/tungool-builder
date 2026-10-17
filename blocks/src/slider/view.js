/**
 * TB Slider — progressive enhancement over a CSS scroll-snap track (slide effect)
 * or a stacked grid (fade effect). One instance per .tb-slider[data-tb-slider];
 * no globals, no document-wide state.
 */
const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

const format = ( template, ...values ) => {
	let i = 0;
	return String( template )
		.replace( /%(\d)\$d/g, ( m, n ) => values[ Number( n ) - 1 ] )
		.replace( /%d/g, () => values[ i++ ] );
};

const isEditable = ( el ) =>
	el.isContentEditable || [ 'INPUT', 'TEXTAREA', 'SELECT' ].includes( el.tagName );

function initSlider( root ) {
	let config = {};
	try {
		config = JSON.parse( root.dataset.tbSlider || '{}' );
	} catch ( e ) {}
	const i18n = config.i18n || {};
	const fade = config.effect === 'fade';
	const track = root.querySelector( ':scope > .tb-slider__viewport > .tb-slider__track' );
	if ( ! track ) {
		return;
	}
	const slides = Array.from( track.children ).filter( ( el ) => el.classList.contains( 'tb-slide' ) );
	const count = slides.length;
	const prevBtn = root.querySelector( '.tb-slider__arrow--prev' );
	const nextBtn = root.querySelector( '.tb-slider__arrow--next' );
	const dotsEl = root.querySelector( '.tb-slider__dots' );
	const status = root.querySelector( ':scope > .tb-slider__status' );
	const toggle = root.querySelector( ':scope > .tb-slider__toggle' );

	let index = 0;
	let perView = 1;
	let maxIndex = 0;
	let dots = [];
	let animation = 0;
	let timer = 0;
	let userPaused = false;
	let hoverPaused = false;

	const rtl = getComputedStyle( root ).direction === 'rtl';

	slides.forEach( ( slide, i ) => {
		slide.setAttribute( 'aria-label', format( i18n.slideOf || '%1$d of %2$d', i + 1, count ) );
	} );

	const readPerView = () => {
		if ( fade ) {
			return 1;
		}
		const v = parseInt( getComputedStyle( root ).getPropertyValue( '--tb-slider-per-view' ), 10 );
		return Math.max( 1, Math.min( count, Number.isFinite( v ) ? v : 1 ) );
	};

	const buildDots = () => {
		if ( ! dotsEl ) {
			return;
		}
		dotsEl.textContent = '';
		dots = [];
		if ( maxIndex < 1 ) {
			return;
		}
		for ( let i = 0; i <= maxIndex; i++ ) {
			const dot = document.createElement( 'button' );
			dot.type = 'button';
			dot.className = 'tb-slider__dot';
			dot.setAttribute( 'aria-label', format( i18n.goTo || 'Go to slide %d', i + 1 ) );
			dot.addEventListener( 'click', () => goTo( i, true ) );
			dotsEl.append( dot );
			dots.push( dot );
		}
	};

	const syncState = () => {
		slides.forEach( ( slide, i ) => {
			const visible = i >= index && i < index + perView;
			slide.classList.toggle( 'is-active', visible );
			slide.toggleAttribute( 'inert', ! visible );
			if ( visible ) {
				slide.removeAttribute( 'aria-hidden' );
			} else {
				slide.setAttribute( 'aria-hidden', 'true' );
			}
		} );
		dots.forEach( ( dot, i ) => {
			if ( i === index ) {
				dot.setAttribute( 'aria-current', 'true' );
			} else {
				dot.removeAttribute( 'aria-current' );
			}
		} );
		if ( ! config.loop ) {
			if ( prevBtn ) {
				prevBtn.disabled = index <= 0;
			}
			if ( nextBtn ) {
				nextBtn.disabled = index >= maxIndex;
			}
		}
	};

	const announce = () => {
		if ( status ) {
			status.textContent = format( i18n.status || 'Slide %1$d of %2$d', index + 1, maxIndex + 1 );
		}
	};

	// Scroll offset of a slide inside the track (handles RTL negative scrollLeft).
	const offsetOf = ( i ) => {
		const slide = slides[ i ];
		if ( ! slide ) {
			return 0;
		}
		const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
		const target = track.scrollLeft + ( rtl ? slide.getBoundingClientRect().right - track.getBoundingClientRect().right : delta );
		return target;
	};

	const scrollToIndex = ( i, animate ) => {
		const target = offsetOf( i );
		cancelAnimationFrame( animation );
		const duration = Number( config.speed ) || 0;
		if ( ! animate || reducedMotion.matches || duration <= 0 ) {
			track.scrollLeft = target;
			return;
		}
		// Custom easing so the speed setting applies; snap is paused meanwhile.
		const start = track.scrollLeft;
		const startTime = performance.now();
		track.style.scrollSnapType = 'none';
		const step = ( now ) => {
			const t = Math.min( 1, ( now - startTime ) / duration );
			const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow( -2 * t + 2, 2 ) / 2;
			track.scrollLeft = start + ( target - start ) * eased;
			if ( t < 1 ) {
				animation = requestAnimationFrame( step );
			} else {
				track.style.scrollSnapType = '';
				animation = 0;
			}
		};
		animation = requestAnimationFrame( step );
	};

	function goTo( i, userAction = false ) {
		let next = i;
		if ( next > maxIndex ) {
			next = config.loop ? 0 : maxIndex;
		} else if ( next < 0 ) {
			next = config.loop ? maxIndex : 0;
		}
		index = next;
		if ( ! fade ) {
			scrollToIndex( index, true );
		}
		syncState();
		if ( userAction ) {
			announce();
			restartTimer();
		}
	}

	// Keep index in sync when the user swipes / scrolls the track directly.
	let scrollTimeout = 0;
	const onScroll = () => {
		if ( animation ) {
			return;
		}
		clearTimeout( scrollTimeout );
		scrollTimeout = setTimeout( () => {
			const first = slides[ 0 ];
			const second = slides[ 1 ];
			const stride = second
				? Math.abs( second.getBoundingClientRect().left - first.getBoundingClientRect().left )
				: track.clientWidth;
			const found = stride ? Math.round( Math.abs( track.scrollLeft ) / stride ) : 0;
			const next = Math.max( 0, Math.min( maxIndex, found ) );
			if ( next !== index ) {
				index = next;
				syncState();
				announce();
			}
		}, 120 );
	};

	const layout = () => {
		perView = readPerView();
		maxIndex = Math.max( 0, count - perView );
		index = Math.min( index, maxIndex );
		buildDots();
		if ( ! fade ) {
			track.scrollLeft = offsetOf( index );
		}
		syncState();
	};

	// Autoplay.
	const canAutoplay = () => config.autoplay && maxIndex > 0 && ( ! reducedMotion.matches || config.forcePlay );
	const isRunning = () => canAutoplay() && ! userPaused && ! hoverPaused && ! document.hidden;

	function restartTimer() {
		clearTimeout( timer );
		if ( isRunning() ) {
			timer = setTimeout( () => {
				goTo( index + 1 );
				restartTimer();
			}, config.delay || 5000 );
		}
	}

	const syncToggle = () => {
		if ( ! toggle ) {
			return;
		}
		toggle.hidden = ! config.autoplay || maxIndex < 1;
		const paused = userPaused || ! canAutoplay();
		toggle.classList.toggle( 'is-paused', paused );
		toggle.setAttribute( 'aria-label', paused ? i18n.play || 'Start autoplay' : i18n.pause || 'Pause autoplay' );
	};

	// Reduced motion: autoplay starts paused; the visitor can still start it.
	userPaused = reducedMotion.matches;

	toggle?.addEventListener( 'click', () => {
		userPaused = ! userPaused;
		if ( ! userPaused && reducedMotion.matches ) {
			// Explicit opt-in overrides the preference for this carousel.
			config.forcePlay = true;
		}
		syncToggle();
		restartTimer();
	} );

	if ( config.autoplay ) {
		const pauseOn = () => {
			hoverPaused = true;
			clearTimeout( timer );
		};
		const pauseOff = () => {
			hoverPaused = false;
			restartTimer();
		};
		if ( config.pauseOnHover ) {
			root.addEventListener( 'mouseenter', pauseOn );
			root.addEventListener( 'mouseleave', pauseOff );
		}
		// Focus inside the carousel always pauses (WAI-ARIA carousel pattern).
		root.addEventListener( 'focusin', pauseOn );
		root.addEventListener( 'focusout', ( event ) => {
			if ( ! root.contains( event.relatedTarget ) ) {
				pauseOff();
			}
		} );
		document.addEventListener( 'visibilitychange', restartTimer );
	}

	prevBtn?.addEventListener( 'click', () => goTo( index - 1, true ) );
	nextBtn?.addEventListener( 'click', () => goTo( index + 1, true ) );

	root.addEventListener( 'keydown', ( event ) => {
		if ( isEditable( event.target ) ) {
			return;
		}
		const back = rtl ? 'ArrowRight' : 'ArrowLeft';
		const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
		const map = { [ back ]: index - 1, [ forward ]: index + 1, Home: 0, End: maxIndex };
		if ( event.key in map ) {
			event.preventDefault();
			goTo( map[ event.key ], true );
		}
	} );

	if ( ! fade ) {
		track.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	if ( 'ResizeObserver' in window ) {
		let raf = 0;
		new window.ResizeObserver( () => {
			cancelAnimationFrame( raf );
			raf = requestAnimationFrame( layout );
		} ).observe( root );
	}

	layout();
	track.classList.add( 'is-ready' );
	syncToggle();
	restartTimer();

	reducedMotion.addEventListener?.( 'change', () => {
		userPaused = reducedMotion.matches || userPaused;
		syncToggle();
		restartTimer();
	} );
}

function init() {
	document.querySelectorAll( '.tb-slider[data-tb-slider]' ).forEach( ( root ) => {
		if ( ! root.dataset.tbSliderReady ) {
			root.dataset.tbSliderReady = '1';
			initSlider( root );
		}
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
