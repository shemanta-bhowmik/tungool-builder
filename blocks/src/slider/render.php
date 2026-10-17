<?php
/**
 * TB Slider — frontend output. view.js builds the dots, slide labels and behaviour
 * on top of a CSS scroll-snap track, so slides stay swipeable without JS.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered slides.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_slider_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_slider_effect   = 'fade' === ( $attributes['effect'] ?? '' ) ? 'fade' : 'slide';
$tb_slider_arrows   = ! empty( $attributes['showArrows'] );
$tb_slider_dots     = ! empty( $attributes['showDots'] );
$tb_slider_autoplay = ! empty( $attributes['autoplay'] );
$tb_slider_position = in_array( $attributes['arrowPosition'] ?? '', array( 'inside', 'outside', 'bottom' ), true ) ? $attributes['arrowPosition'] : 'inside';
$tb_slider_dot_type = in_array( $attributes['dotStyle'] ?? '', array( 'dot', 'line', 'square' ), true ) ? $attributes['dotStyle'] : 'dot';

$tb_slider_ms = static function ( $value, $fallback ) {
	return (int) round( ( is_numeric( $value ) && $value >= 0 ) ? $value : $fallback );
};

$tb_slider_classes = array( 'tb-slider', 'tb-slider--' . $tb_slider_effect );
if ( $tb_slider_arrows ) {
	$tb_slider_classes[] = 'tb-slider--arrows-' . $tb_slider_position;
}

if ( $tb_slider_id ) {
	$tb_slider_classes[] = 'tb-block-' . $tb_slider_id;
	$tb_slider_el        = '.tb-slider.tb-block-' . $tb_slider_id;
	$tb_slider_dot_size  = $attributes['dotSize'] ?? 10;
	$tb_slider_col       = static function ( $key, $state ) use ( $attributes ) {
		return is_array( $attributes[ $key ] ?? null ) ? ( $attributes[ $key ][ $state ] ?? '' ) : '';
	};

	// Same selectors and order as blocks/src/slider/styles.js.
	DynamicCSS::add(
		$tb_slider_el,
		DynamicCSS::from_responsive(
			array(
				'--tb-slider-per-view'     => 'fade' === $tb_slider_effect ? '' : ( $attributes['slidesPerView'] ?? array() ),
				'--tb-slider-gap'          => $attributes['gap'] ?? array(),
				'--tb-slider-speed'        => $tb_slider_ms( $attributes['speed'] ?? 500, 500 ) . 'ms',
				'--tb-slider-arrow-size'   => $attributes['arrowSize'] ?? array(),
				'--tb-slider-arrow-radius' => $attributes['arrowRadius'] ?? '',
				'--tb-slider-dot-size'     => ( is_numeric( $tb_slider_dot_size ) && $tb_slider_dot_size > 0 ) ? (int) round( $tb_slider_dot_size ) . 'px' : '',
			)
		)
	);
	DynamicCSS::add(
		$tb_slider_el . ' .tb-slider__arrow',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_slider_col( 'arrowColor', 'normal' ),
				'background-color' => $tb_slider_col( 'arrowBackground', 'normal' ),
			)
		)
	);
	DynamicCSS::add(
		$tb_slider_el . ' .tb-slider__arrow:hover,' . $tb_slider_el . ' .tb-slider__arrow:focus-visible',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_slider_col( 'arrowColor', 'hover' ),
				'background-color' => $tb_slider_col( 'arrowBackground', 'hover' ),
			)
		)
	);
	DynamicCSS::add(
		$tb_slider_el . ' .tb-slider__dot',
		DynamicCSS::from_responsive( array( 'background-color' => $tb_slider_col( 'dotColor', 'normal' ) ) )
	);
	DynamicCSS::add(
		$tb_slider_el . ' .tb-slider__dot:hover,' . $tb_slider_el . ' .tb-slider__dot[aria-current="true"]',
		DynamicCSS::from_responsive( array( 'background-color' => $tb_slider_col( 'dotActiveColor', 'normal' ) ) )
	);
}

$tb_slider_config = array(
	'effect'       => $tb_slider_effect,
	'loop'         => ! empty( $attributes['loop'] ),
	'autoplay'     => $tb_slider_autoplay,
	'delay'        => max( 1000, $tb_slider_ms( $attributes['autoplayDelay'] ?? 5000, 5000 ) ),
	'speed'        => $tb_slider_ms( $attributes['speed'] ?? 500, 500 ),
	'pauseOnHover' => ! empty( $attributes['pauseOnHover'] ),
	'i18n'         => array(
		/* translators: %d: slide number. */
		'goTo'    => __( 'Go to slide %d', 'tungool-builder' ),
		/* translators: 1: slide number, 2: total slides. */
		'slideOf' => __( '%1$d of %2$d', 'tungool-builder' ),
		/* translators: 1: slide number, 2: total slides. */
		'status'  => __( 'Slide %1$d of %2$d', 'tungool-builder' ),
		'pause'   => __( 'Pause autoplay', 'tungool-builder' ),
		'play'    => __( 'Start autoplay', 'tungool-builder' ),
	),
);

$tb_slider_label   = trim( (string) ( $attributes['label'] ?? '' ) );
$tb_slider_wrapper = get_block_wrapper_attributes(
	array(
		'class'                => implode( ' ', $tb_slider_classes ),
		'role'                 => 'region',
		'aria-roledescription' => __( 'carousel', 'tungool-builder' ),
		'aria-label'           => '' !== $tb_slider_label ? $tb_slider_label : __( 'Carousel', 'tungool-builder' ),
		'data-tb-slider'       => wp_json_encode( $tb_slider_config ),
	)
);

$tb_slider_arrow = static function ( $dir ) use ( $attributes ) {
	$icon = Icons::svg( 'prev' === $dir ? ( $attributes['prevIcon'] ?? '' ) : ( $attributes['nextIcon'] ?? '' ) );
	if ( '' === $icon ) {
		$icon = Icons::svg( 'prev' === $dir ? 'chevron-left' : 'chevron-right' );
	}
	return sprintf(
		'<button type="button" class="tb-slider__arrow tb-slider__arrow--%1$s" aria-label="%2$s">%3$s</button>',
		esc_attr( $dir ),
		'prev' === $dir ? esc_attr__( 'Previous slide', 'tungool-builder' ) : esc_attr__( 'Next slide', 'tungool-builder' ),
		$icon
	);
};
$tb_slider_bottom = $tb_slider_arrows && 'bottom' === $tb_slider_position;
?>
<div <?php echo $tb_slider_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( $tb_slider_autoplay ) : ?>
		<button type="button" class="tb-slider__toggle" aria-label="<?php esc_attr_e( 'Pause autoplay', 'tungool-builder' ); ?>" hidden>
			<span class="tb-slider__toggle-pause"><?php echo Icons::svg( 'pause' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg(). ?></span>
			<span class="tb-slider__toggle-play"><?php echo Icons::svg( 'play' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg(). ?></span>
		</button>
	<?php endif; ?>
	<div class="tb-slider__viewport">
		<div class="tb-slider__track">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
		</div>
		<?php
		if ( $tb_slider_arrows && ! $tb_slider_bottom ) {
			echo $tb_slider_arrow( 'prev' ) . $tb_slider_arrow( 'next' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the closure.
		}
		?>
	</div>
	<?php if ( $tb_slider_dots || $tb_slider_bottom ) : ?>
		<div class="tb-slider__nav">
			<?php
			echo $tb_slider_bottom ? $tb_slider_arrow( 'prev' ) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the closure.
			if ( $tb_slider_dots ) {
				echo '<div class="tb-slider__dots tb-slider__dots--' . esc_attr( $tb_slider_dot_type ) . '"></div>';
			}
			echo $tb_slider_bottom ? $tb_slider_arrow( 'next' ) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the closure.
			?>
		</div>
	<?php endif; ?>
	<div class="tb-slider__status screen-reader-text" aria-live="polite" aria-atomic="true"></div>
</div>
