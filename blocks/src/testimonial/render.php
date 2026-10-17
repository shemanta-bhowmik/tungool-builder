<?php
/**
 * TB Testimonial — frontend output: <figure> > <blockquote> + <figcaption>.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_testi_quote = wp_kses_post( $attributes['quote'] ?? '' );
$tb_testi_name  = wp_kses_post( $attributes['name'] ?? '' );
$tb_testi_role  = wp_kses_post( $attributes['role'] ?? '' );
$tb_testi_has   = static function ( $html ) {
	return '' !== trim( wp_strip_all_tags( $html ) );
};

if ( ! $tb_testi_has( $tb_testi_quote ) && ! $tb_testi_has( $tb_testi_name ) ) {
	return;
}

$tb_testi_id     = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_testi_layout = in_array( $attributes['layout'] ?? '', array( 'card', 'centered', 'avatar-left', 'quote-icon' ), true ) ? $attributes['layout'] : 'card';

if ( $tb_testi_id ) {
	$tb_testi_el     = '.tb-testimonial.tb-block-' . $tb_testi_id;
	$tb_testi_bg     = is_array( $attributes['background'] ?? null ) ? $attributes['background'] : array();
	$tb_testi_border = is_array( $attributes['border'] ?? null ) ? $attributes['border'] : array();
	$tb_testi_c      = static function ( $key ) use ( $attributes ) {
		return is_array( $attributes[ $key ] ?? null ) ? ( $attributes[ $key ]['normal'] ?? '' ) : '';
	};
	$tb_testi_text   = static function ( $typo, $color ) use ( $attributes, $tb_testi_c ) {
		return DynamicCSS::from_responsive(
			array_merge( DynamicCSS::typography_map( $attributes[ $typo ] ?? array() ), array( 'color' => $tb_testi_c( $color ) ) )
		);
	};

	// Same selectors and order as blocks/src/testimonial/styles.js.
	DynamicCSS::add(
		$tb_testi_el,
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				DynamicCSS::background_map( $tb_testi_bg ),
				DynamicCSS::border_map( $tb_testi_border ),
				array(
					'box-shadow'                     => DynamicCSS::box_shadow_value( $attributes['boxShadow'] ?? array() ),
					'--tb-testimonial-avatar-size'   => $attributes['avatarSize'] ?? array(),
					'--tb-testimonial-avatar-radius' => $attributes['avatarRadius'] ?? '',
				)
			)
		)
	);
	DynamicCSS::add(
		$tb_testi_el . ':hover',
		DynamicCSS::from_responsive(
			array_merge( DynamicCSS::background_hover_map( $tb_testi_bg ), array( 'border-color' => $tb_testi_border['hoverColor'] ?? '' ) )
		)
	);
	DynamicCSS::add( $tb_testi_el . ' .tb-testimonial__quote', $tb_testi_text( 'quoteTypography', 'quoteColor' ) );
	DynamicCSS::add( $tb_testi_el . ' .tb-testimonial__name', $tb_testi_text( 'nameTypography', 'nameColor' ) );
	DynamicCSS::add( $tb_testi_el . ' .tb-testimonial__role', $tb_testi_text( 'roleTypography', 'roleColor' ) );
	DynamicCSS::add(
		$tb_testi_el . ' .tb-testimonial__rating',
		DynamicCSS::from_responsive(
			array(
				'font-size'      => $attributes['starSize'] ?? array(),
				'color'          => $tb_testi_c( 'starEmptyColor' ),
				'--tb-star-color' => $tb_testi_c( 'starColor' ),
			)
		)
	);
	DynamicCSS::add(
		$tb_testi_el . ' .tb-testimonial__icon',
		DynamicCSS::from_responsive( array( 'font-size' => $attributes['quoteIconSize'] ?? array(), 'color' => $tb_testi_c( 'quoteIconColor' ) ) )
	);
}

// Avatar.
$tb_testi_avatar = is_array( $attributes['avatar'] ?? null ) ? $attributes['avatar'] : array();
$tb_testi_img    = '';
if ( ! empty( $tb_testi_avatar['url'] ) ) {
	$tb_testi_img = sprintf(
		'<img class="tb-testimonial__avatar" src="%1$s" alt="%2$s" loading="lazy" decoding="async" />',
		esc_url( $tb_testi_avatar['url'] ),
		esc_attr( $tb_testi_avatar['alt'] ?? '' )
	);
}

// Rating: 0–5 in half steps. Same markup as blocks/src/testimonial/stars.js.
$tb_testi_rating = '';
if ( ! empty( $attributes['showRating'] ) ) {
	$tb_testi_value = is_numeric( $attributes['rating'] ?? null ) ? min( 5, max( 0, round( (float) $attributes['rating'] * 2 ) / 2 ) ) : 0;
	$tb_testi_star  = Icons::svg( 'star' );
	$tb_testi_stars = '';
	for ( $tb_testi_i = 1; $tb_testi_i <= 5; $tb_testi_i++ ) {
		$tb_testi_state = 'empty';
		if ( $tb_testi_value >= $tb_testi_i ) {
			$tb_testi_state = 'full';
		} elseif ( $tb_testi_value >= $tb_testi_i - 0.5 ) {
			$tb_testi_state = 'half';
		}
		$tb_testi_stars .= '<span class="tb-star tb-star--' . $tb_testi_state . '">' . $tb_testi_star
			. ( 'empty' === $tb_testi_state ? '' : '<span class="tb-star__fill">' . $tb_testi_star . '</span>' )
			. '</span>';
	}
	$tb_testi_rating = sprintf(
		'<div class="tb-testimonial__rating" role="img" aria-label="%1$s">%2$s</div>',
		/* translators: %s: rating, e.g. 4.5. */
		esc_attr( sprintf( __( 'Rated %s out of 5', 'tungool-builder' ), (string) ( floor( $tb_testi_value ) == $tb_testi_value ? (int) $tb_testi_value : $tb_testi_value ) ) ), // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- float vs int compare.
		$tb_testi_stars
	);
}

$tb_testi_icon = 'quote-icon' === $tb_testi_layout ? Icons::svg( $attributes['quoteIcon'] ?? '' ) : '';
$tb_testi_left = 'avatar-left' === $tb_testi_layout;

$tb_testi_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-testimonial tb-testimonial--' . $tb_testi_layout . ( $tb_testi_id ? ' tb-block-' . $tb_testi_id : '' ) )
);
// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- all parts escaped above (wp_kses_post / esc_* / Icons::svg).
?>
<figure <?php echo $tb_testi_wrapper; ?>>
	<?php
	if ( $tb_testi_icon ) {
		echo '<span class="tb-testimonial__icon" aria-hidden="true">' . $tb_testi_icon . '</span>';
	}
	echo $tb_testi_left ? $tb_testi_img : '';
	echo $tb_testi_rating;
	if ( $tb_testi_has( $tb_testi_quote ) ) {
		echo '<blockquote class="tb-testimonial__quote"><p>' . $tb_testi_quote . '</p></blockquote>';
	}
	if ( $tb_testi_has( $tb_testi_name ) || $tb_testi_has( $tb_testi_role ) || ( $tb_testi_img && ! $tb_testi_left ) ) :
		?>
		<figcaption class="tb-testimonial__caption">
			<?php
			echo $tb_testi_left ? '' : $tb_testi_img;
			echo '<span class="tb-testimonial__meta">';
			if ( $tb_testi_has( $tb_testi_name ) ) {
				echo '<cite class="tb-testimonial__name">' . $tb_testi_name . '</cite>';
			}
			if ( $tb_testi_has( $tb_testi_role ) ) {
				echo '<span class="tb-testimonial__role">' . $tb_testi_role . '</span>';
			}
			echo '</span>';
			?>
		</figcaption>
	<?php endif; ?>
</figure>
<?php
// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
