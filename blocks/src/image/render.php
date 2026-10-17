<?php
/**
 * TB Image — frontend output. Media Library images go through wp_get_attachment_image()
 * so srcset, sizes, width/height and loading come from WordPress.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_image_att_id = absint( $attributes['id'] ?? 0 );
$tb_image_url    = (string) ( $attributes['url'] ?? '' );

if ( $tb_image_att_id && ! wp_attachment_is_image( $tb_image_att_id ) ) {
	$tb_image_att_id = 0; // Attachment deleted: fall back to the stored URL.
}
if ( ! $tb_image_att_id && '' === $tb_image_url ) {
	return;
}

if ( ! function_exists( 'tb_image_aspect_map' ) ) {
	/**
	 * Same as aspectMap() in styles.js.
	 *
	 * @param mixed $preset Responsive preset.
	 * @param mixed $custom Responsive custom ratio.
	 * @return array
	 */
	function tb_image_aspect_map( $preset, $custom ) {
		$out = array();
		foreach ( DynamicCSS::DEVICES as $device ) {
			$p = is_array( $preset ) ? (string) ( $preset[ $device ] ?? '' ) : '';
			$c = is_array( $custom ) ? trim( (string) ( $custom[ $device ] ?? '' ) ) : '';
			if ( in_array( $p, array( '1/1', '4/3', '3/2', '16/9', '9/16' ), true ) ) {
				$out[ $device ] = $p;
			} elseif ( 'original' === $p ) {
				$out[ $device ] = 'auto';
			} elseif ( 'custom' === $p && preg_match( '#^\d+(\.\d+)?\s*/\s*\d+(\.\d+)?$#', $c ) ) {
				$out[ $device ] = preg_replace( '/\s+/', '', $c );
			}
		}
		return $out;
	}

	/**
	 * Same as alignMap() in styles.js.
	 *
	 * @param mixed $align Responsive alignment.
	 * @return array
	 */
	function tb_image_align_map( $align ) {
		$left  = array();
		$right = array();
		foreach ( DynamicCSS::DEVICES as $device ) {
			$a = is_array( $align ) ? ( $align[ $device ] ?? '' ) : '';
			if ( in_array( $a, array( 'left', 'center', 'right' ), true ) ) {
				$left[ $device ]  = 'left' === $a ? '0' : 'auto';
				$right[ $device ] = 'right' === $a ? '0' : 'auto';
			}
		}
		return array(
			'margin-left'  => $left,
			'margin-right' => $right,
		);
	}

	/**
	 * Same as filterValue() in styles.js.
	 *
	 * @param mixed    $f         Filters.
	 * @param int|null $grayscale null = omit.
	 * @return string
	 */
	function tb_image_filter_value( $f, $grayscale = null ) {
		$f     = is_array( $f ) ? $f : array();
		$parts = array();
		foreach ( array( 'brightness', 'contrast', 'saturate' ) as $key ) {
			$v = $f[ $key ] ?? '';
			if ( is_numeric( $v ) && $v >= 0 && 100 !== (int) round( $v ) ) {
				$parts[] = $key . '(' . (int) round( $v ) . '%)';
			}
		}
		$blur = $f['blur'] ?? '';
		if ( is_numeric( $blur ) && $blur > 0 ) {
			$parts[] = 'blur(' . (int) round( $blur ) . 'px)';
		}
		if ( null !== $grayscale ) {
			$parts[] = 'grayscale(' . (int) $grayscale . ')';
		}
		return implode( ' ', $parts );
	}
}

$tb_image_uid   = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_image_hover = in_array( $attributes['hoverEffect'] ?? '', array( 'zoom', 'grayscale', 'lift' ), true ) ? $attributes['hoverEffect'] : 'none';

if ( $tb_image_uid ) {
	$tb_image_root  = '.tb-image.tb-block-' . $tb_image_uid;
	$tb_image_media = $tb_image_root . ' .tb-image__media';
	$tb_image_img   = $tb_image_media . ' .tb-image__img';
	$tb_image_dur   = $attributes['transitionDuration'] ?? 300;
	$tb_image_trans = ( is_numeric( $tb_image_dur ) && $tb_image_dur >= 0 ) ? (int) round( $tb_image_dur ) . 'ms' : '';
	$tb_image_op    = $attributes['opacity'] ?? 100;
	$tb_image_gray  = 'grayscale' === $tb_image_hover;
	$tb_image_w     = is_array( $attributes['imgWidth'] ?? null ) ? $attributes['imgWidth'] : array();
	$tb_image_any_w = (bool) array_filter(
		$tb_image_w,
		static function ( $v ) {
			return is_scalar( $v ) && '' !== trim( (string) $v );
		}
	);
	$tb_image_color = is_array( $attributes['captionColor'] ?? null ) ? $attributes['captionColor'] : array();

	// Same selectors and order as blocks/src/image/styles.js.
	DynamicCSS::add(
		$tb_image_media,
		DynamicCSS::from_responsive(
			array_merge(
				array(
					'width'     => $tb_image_w,
					'max-width' => $attributes['maxWidth'] ?? array(),
				),
				tb_image_align_map( $attributes['alignment'] ?? array() ),
				DynamicCSS::border_map( $attributes['border'] ?? array() ),
				array(
					'box-shadow'          => DynamicCSS::box_shadow_value( $attributes['boxShadow'] ?? array() ),
					'transition-duration' => $tb_image_trans,
				)
			)
		)
	);
	DynamicCSS::add(
		$tb_image_img,
		DynamicCSS::from_responsive(
			array(
				'width'               => $tb_image_any_w ? '100%' : '',
				'height'              => $attributes['imgHeight'] ?? array(),
				'aspect-ratio'        => tb_image_aspect_map( $attributes['aspectRatio'] ?? array(), $attributes['customAspectRatio'] ?? array() ),
				'object-fit'          => $attributes['objectFit'] ?? array(),
				'object-position'     => $attributes['objectPosition'] ?? array(),
				'opacity'             => ( is_numeric( $tb_image_op ) && $tb_image_op >= 0 && $tb_image_op < 100 ) ? (string) ( round( $tb_image_op ) / 100 ) : '',
				'filter'              => tb_image_filter_value( $attributes['filters'] ?? array(), $tb_image_gray ? 1 : null ),
				'transition-duration' => $tb_image_trans,
			)
		)
	);
	DynamicCSS::add(
		$tb_image_media . ':hover .tb-image__img,' . $tb_image_media . ':focus-within .tb-image__img',
		DynamicCSS::from_responsive( array( 'filter' => $tb_image_gray ? tb_image_filter_value( $attributes['filters'] ?? array(), 0 ) : '' ) )
	);
	DynamicCSS::add(
		$tb_image_root . ' .tb-image__caption',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['captionTypography'] ?? array() ),
				array(
					'color'      => $tb_image_color['normal'] ?? '',
					'text-align' => $attributes['alignment'] ?? array(),
				)
			)
		)
	);
}

// Image element.
$tb_image_alt  = trim( (string) ( $attributes['alt'] ?? '' ) );
$tb_image_lazy = empty( $attributes['disableLazy'] );

if ( $tb_image_att_id ) {
	$tb_image_size = sanitize_key( $attributes['sizeSlug'] ?? 'large' );
	$tb_image_args = array( 'class' => 'tb-image__img' );
	if ( '' !== $tb_image_alt ) {
		$tb_image_args['alt'] = $tb_image_alt; // Override; otherwise WP uses the Media Library alt.
	}
	if ( ! $tb_image_lazy ) {
		$tb_image_args['loading']       = false;
		$tb_image_args['fetchpriority'] = 'high';
	}
	$tb_image_html = wp_get_attachment_image( $tb_image_att_id, $tb_image_size ? $tb_image_size : 'large', false, $tb_image_args );
	$tb_image_full = wp_get_attachment_image_url( $tb_image_att_id, 'full' );
} else {
	$tb_image_w_attr = absint( $attributes['width'] ?? 0 );
	$tb_image_h_attr = absint( $attributes['height'] ?? 0 );
	$tb_image_html   = sprintf(
		'<img class="tb-image__img" src="%1$s" alt="%2$s"%3$s%4$s />',
		esc_url( $tb_image_url ),
		esc_attr( $tb_image_alt ),
		( $tb_image_w_attr && $tb_image_h_attr ) ? sprintf( ' width="%d" height="%d"', $tb_image_w_attr, $tb_image_h_attr ) : '',
		$tb_image_lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"'
	);
	$tb_image_full   = $tb_image_url;
}

if ( '' === $tb_image_html ) {
	return;
}

// Link / lightbox.
$tb_image_lightbox = ! empty( $attributes['lightbox'] ) && $tb_image_full;
$tb_image_link_to  = $attributes['linkTo'] ?? 'none';
$tb_image_href     = '';

if ( ! $tb_image_lightbox ) {
	if ( 'media' === $tb_image_link_to ) {
		$tb_image_href = (string) $tb_image_full;
	} elseif ( 'attachment' === $tb_image_link_to && $tb_image_att_id ) {
		$tb_image_href = (string) get_attachment_link( $tb_image_att_id );
	} elseif ( 'custom' === $tb_image_link_to ) {
		$tb_image_href = (string) ( $attributes['href'] ?? '' );
	}
}

if ( $tb_image_lightbox ) {
	wp_enqueue_script( generate_block_asset_handle( 'tungool-builder/image', 'viewScript' ) );
	$tb_image_inner = sprintf(
		'<button type="button" class="tb-image__lightbox-trigger" data-tb-lightbox="%1$s" data-tb-close="%2$s" aria-haspopup="dialog" aria-label="%3$s">%4$s</button>',
		esc_url( $tb_image_full ),
		esc_attr__( 'Close', 'tungool-builder' ),
		esc_attr__( 'Enlarge image', 'tungool-builder' ),
		$tb_image_html
	);
} elseif ( '' !== $tb_image_href ) {
	$tb_image_rel = array();
	if ( ! empty( $attributes['opensInNewTab'] ) ) {
		$tb_image_rel[] = 'noopener';
	}
	if ( ! empty( $attributes['nofollow'] ) ) {
		$tb_image_rel[] = 'nofollow';
	}
	if ( ! empty( $attributes['sponsored'] ) ) {
		$tb_image_rel[] = 'sponsored';
	}
	$tb_image_inner = sprintf(
		'<a class="tb-image__link" href="%1$s"%2$s%3$s>%4$s</a>',
		esc_url( $tb_image_href ),
		! empty( $attributes['opensInNewTab'] ) ? ' target="_blank"' : '',
		$tb_image_rel ? ' rel="' . esc_attr( implode( ' ', $tb_image_rel ) ) . '"' : '',
		$tb_image_html
	);
} else {
	$tb_image_inner = $tb_image_html;
}

$tb_image_caption = ! empty( $attributes['showCaption'] ) ? wp_kses_post( $attributes['caption'] ?? '' ) : '';

$tb_image_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'tb-image tb-image--hover-' . $tb_image_hover . ( $tb_image_uid ? ' tb-block-' . $tb_image_uid : '' ),
	)
);
?>
<figure <?php echo $tb_image_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-image__media"><?php echo $tb_image_inner; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_attachment_image() / escaped above. ?></div>
	<?php if ( '' !== trim( wp_strip_all_tags( $tb_image_caption ) ) ) : ?>
		<figcaption class="tb-image__caption"><?php echo $tb_image_caption; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post above. ?></figcaption>
	<?php endif; ?>
</figure>
