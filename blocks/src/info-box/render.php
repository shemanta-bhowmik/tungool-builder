<?php
/**
 * TB Info Box — frontend output. A whole-box link is a stretched <a> over the box;
 * the button then renders as a non-interactive <span> to avoid nested links.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Button;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_info_id    = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_info_type  = in_array( $attributes['mediaType'] ?? '', array( 'icon', 'image', 'number', 'none' ), true ) ? $attributes['mediaType'] : 'icon';
$tb_info_shape = in_array( $attributes['mediaShape'] ?? '', array( 'none', 'circle', 'square', 'rounded' ), true ) ? $attributes['mediaShape'] : 'none';
$tb_info_tag   = in_array( $attributes['titleTag'] ?? '', array( 'h2', 'h3', 'h4', 'h5', 'h6', 'div' ), true ) ? $attributes['titleTag'] : 'h3';
$tb_info_title = wp_kses_post( $attributes['title'] ?? '' );
$tb_info_desc  = wp_kses_post( $attributes['description'] ?? '' );
$tb_info_link  = (string) ( $attributes['linkUrl'] ?? '' );
$tb_info_bg    = is_array( $attributes['background'] ?? null ) ? $attributes['background'] : array();
$tb_info_btn   = is_array( $attributes['button'] ?? null ) ? $attributes['button'] : array();

if ( $tb_info_id ) {
	$tb_info_el     = '.tb-info-box.tb-block-' . $tb_info_id;
	$tb_info_border = is_array( $attributes['border'] ?? null ) ? $attributes['border'] : array();
	$tb_info_c      = static function ( $key, $state = 'normal' ) use ( $attributes ) {
		return is_array( $attributes[ $key ] ?? null ) ? ( $attributes[ $key ][ $state ] ?? '' ) : '';
	};
	$tb_info_ms     = static function ( $v ) {
		return ( is_numeric( $v ) && $v >= 0 ) ? (int) round( $v ) . 'ms' : '';
	};
	$tb_info_hover  = static function ( $suffix ) use ( $tb_info_el ) {
		return $tb_info_el . ':hover' . $suffix . ',' . $tb_info_el . ':focus-within' . $suffix;
	};

	// Same as directionMap() in styles.js: mobile stacks unless set.
	$tb_info_pos  = is_array( $attributes['mediaPosition'] ?? null ) ? $attributes['mediaPosition'] : array();
	$tb_info_dirs = array( 'top' => 'column', 'left' => 'row', 'right' => 'row-reverse' );
	$tb_info_dir  = array();
	foreach ( array( 'desktop', 'tablet', 'mobile' ) as $tb_info_d ) {
		$tb_info_p = $tb_info_pos[ $tb_info_d ] ?? '';
		if ( is_string( $tb_info_p ) && isset( $tb_info_dirs[ $tb_info_p ] ) ) {
			$tb_info_dir[ $tb_info_d ] = $tb_info_dirs[ $tb_info_p ];
		}
	}
	if ( empty( $tb_info_dir['mobile'] ) && array_intersect( array( $tb_info_pos['desktop'] ?? '', $tb_info_pos['tablet'] ?? '' ), array( 'left', 'right' ) ) ) {
		$tb_info_dir['mobile'] = 'column';
	}
	$tb_info_align   = is_array( $attributes['textAlign'] ?? null ) ? $attributes['textAlign'] : array();
	$tb_info_justify = array();
	foreach ( $tb_info_align as $tb_info_d => $tb_info_a ) {
		$tb_info_map = array( 'left' => 'flex-start', 'center' => 'center', 'right' => 'flex-end' );
		if ( is_string( $tb_info_a ) && isset( $tb_info_map[ $tb_info_a ] ) ) {
			$tb_info_justify[ $tb_info_d ] = $tb_info_map[ $tb_info_a ];
		}
	}
	$tb_info_lift = $attributes['hoverLift'] ?? 0;

	// Same selectors and order as blocks/src/info-box/styles.js.
	DynamicCSS::add(
		$tb_info_el,
		DynamicCSS::from_responsive(
			array_merge(
				array(
					'flex-direction' => $tb_info_dir,
					'gap'            => $attributes['mediaGap'] ?? array(),
					'text-align'     => $tb_info_align,
				),
				DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				DynamicCSS::background_map( $tb_info_bg ),
				DynamicCSS::border_map( $tb_info_border ),
				array(
					'box-shadow'              => DynamicCSS::box_shadow_value( $attributes['boxShadow'] ?? array() ),
					'transition-duration'     => $tb_info_ms( $attributes['transitionDuration'] ?? 300 ),
					'--tb-info-media-size'    => $attributes['mediaSize'] ?? array(),
					'--tb-info-media-justify' => $tb_info_justify,
				)
			)
		)
	);
	DynamicCSS::add(
		$tb_info_hover( '' ),
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::background_hover_map( $tb_info_bg ),
				array(
					'border-color' => $tb_info_border['hoverColor'] ?? '',
					'box-shadow'   => DynamicCSS::box_shadow_value( $attributes['hoverShadow'] ?? array() ),
					'transform'    => ( is_numeric( $tb_info_lift ) && $tb_info_lift > 0 ) ? 'translateY(-' . (int) round( $tb_info_lift ) . 'px)' : '',
				)
			)
		)
	);
	DynamicCSS::add( $tb_info_el . '::before', DynamicCSS::from_responsive( DynamicCSS::overlay_map( $tb_info_bg ) ) );
	DynamicCSS::add(
		$tb_info_el . ' .tb-info-box__media-inner',
		DynamicCSS::from_responsive(
			array_merge(
				array(
					'color'               => $tb_info_c( 'mediaColor' ),
					'background-color'    => $tb_info_c( 'mediaBackground' ),
					'padding'             => $attributes['mediaPadding'] ?? array(),
					'transition-duration' => $tb_info_ms( $attributes['transitionDuration'] ?? 300 ),
				),
				'number' === $tb_info_type ? DynamicCSS::typography_map( $attributes['numberTypography'] ?? array() ) : array()
			)
		)
	);
	DynamicCSS::add(
		$tb_info_hover( ' .tb-info-box__media-inner' ),
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_info_c( 'mediaColor', 'hover' ),
				'background-color' => $tb_info_c( 'mediaBackground', 'hover' ),
			)
		)
	);
	DynamicCSS::add(
		$tb_info_el . ' .tb-info-box__title',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['titleTypography'] ?? array() ),
				array(
					'color'         => $tb_info_c( 'titleColor' ),
					'margin-bottom' => $attributes['titleSpacing'] ?? array(),
				)
			)
		)
	);
	DynamicCSS::add( $tb_info_hover( ' .tb-info-box__title' ), DynamicCSS::from_responsive( array( 'color' => $tb_info_c( 'titleColor', 'hover' ) ) ) );
	DynamicCSS::add(
		$tb_info_el . ' .tb-info-box__desc',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['descTypography'] ?? array() ),
				array(
					'color'         => $tb_info_c( 'descColor' ),
					'margin-bottom' => $attributes['descSpacing'] ?? array(),
				)
			)
		)
	);
	DynamicCSS::add( $tb_info_hover( ' .tb-info-box__desc' ), DynamicCSS::from_responsive( array( 'color' => $tb_info_c( 'descColor', 'hover' ) ) ) );
	if ( ! empty( $attributes['showButton'] ) ) {
		Button::add_css( $tb_info_el . ' .tb-info-box__button > .tb-button', $tb_info_btn );
	}
}

// Media.
$tb_info_media = '';
if ( 'icon' === $tb_info_type ) {
	$tb_info_media = Icons::svg( $attributes['icon'] ?? '' );
} elseif ( 'image' === $tb_info_type && ! empty( $attributes['image']['url'] ) ) {
	$tb_info_img_id = absint( $attributes['image']['id'] ?? 0 );
	$tb_info_alt    = (string) ( $attributes['image']['alt'] ?? '' );
	$tb_info_media  = $tb_info_img_id
		? wp_get_attachment_image( $tb_info_img_id, 'medium', false, array( 'alt' => $tb_info_alt ) )
		: '';
	if ( '' === $tb_info_media ) {
		$tb_info_media = sprintf( '<img src="%1$s" alt="%2$s" loading="lazy" decoding="async" />', esc_url( $attributes['image']['url'] ), esc_attr( $tb_info_alt ) );
	}
} elseif ( 'number' === $tb_info_type && '' !== trim( (string) ( $attributes['number'] ?? '' ) ) ) {
	$tb_info_media = '<span class="tb-info-box__number">' . esc_html( $attributes['number'] ) . '</span>';
}

$tb_info_button = ! empty( $attributes['showButton'] ) ? Button::markup( $tb_info_btn, '' !== $tb_info_link ) : '';

$tb_info_classes = array( 'tb-info-box', 'tb-info-box--media-' . $tb_info_type );
if ( ! empty( $tb_info_bg['overlay']['color'] ) ) {
	$tb_info_classes[] = 'tb-info-box--overlay';
}
if ( '' !== $tb_info_link ) {
	$tb_info_classes[] = 'tb-info-box--linked';
}
if ( $tb_info_id ) {
	$tb_info_classes[] = 'tb-block-' . $tb_info_id;
}

$tb_info_link_html = '';
if ( '' !== $tb_info_link ) {
	$tb_info_label = trim( (string) ( $attributes['linkLabel'] ?? '' ) );
	if ( '' === $tb_info_label ) {
		$tb_info_label = trim( wp_strip_all_tags( $tb_info_title ) );
	}
	if ( '' === $tb_info_label ) {
		$tb_info_label = __( 'Learn more', 'tungool-builder' );
	}
	$tb_info_link_html = sprintf(
		'<a class="tb-info-box__link" href="%1$s" aria-label="%2$s"%3$s></a>',
		esc_url( $tb_info_link ),
		esc_attr( $tb_info_label ),
		! empty( $attributes['linkNewTab'] ) ? ' target="_blank" rel="noopener"' : ''
	);
}

$tb_info_wrapper = get_block_wrapper_attributes( array( 'class' => implode( ' ', $tb_info_classes ) ) );
// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- parts escaped above (wp_kses_post / esc_* / Icons::svg / Button::markup).
?>
<div <?php echo $tb_info_wrapper; ?>>
	<?php if ( '' !== $tb_info_media ) : ?>
		<div class="tb-info-box__media">
			<div class="tb-info-box__media-inner tb-info-box__media-inner--<?php echo esc_attr( $tb_info_shape ); ?>"><?php echo $tb_info_media; ?></div>
		</div>
	<?php endif; ?>
	<div class="tb-info-box__content">
		<?php
		if ( '' !== trim( wp_strip_all_tags( $tb_info_title ) ) ) {
			echo '<' . $tb_info_tag . ' class="tb-info-box__title">' . $tb_info_title . '</' . $tb_info_tag . '>';
		}
		if ( '' !== trim( wp_strip_all_tags( $tb_info_desc ) ) ) {
			echo '<p class="tb-info-box__desc">' . $tb_info_desc . '</p>';
		}
		if ( '' !== $tb_info_button ) {
			echo '<div class="tb-info-box__button tb-button-wrap">' . $tb_info_button . '</div>';
		}
		?>
	</div>
	<?php echo $tb_info_link_html; ?>
</div>
<?php
// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
