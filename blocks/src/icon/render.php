<?php
/**
 * TB Icon — frontend output. Inline SVG; <a> when a URL is set, otherwise <span>.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;
use SB\TungoolBuilder\Helpers\Svg;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_icon_svg = 'custom' === ( $attributes['iconType'] ?? 'library' )
	? Svg::sanitize( $attributes['customSvg'] ?? '' )
	: Icons::svg( $attributes['icon'] ?? '' );

if ( '' === $tb_icon_svg ) {
	return;
}

$tb_icon_id    = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_icon_view  = in_array( $attributes['view'] ?? '', array( 'default', 'stacked', 'framed' ), true ) ? $attributes['view'] : 'default';
$tb_icon_shape = in_array( $attributes['shape'] ?? '', array( 'circle', 'square', 'rounded' ), true ) ? $attributes['shape'] : 'circle';
$tb_icon_anim  = in_array( $attributes['hoverAnimation'] ?? '', array( 'grow', 'rotate', 'float' ), true ) ? $attributes['hoverAnimation'] : '';
$tb_icon_label = trim( (string) ( $attributes['label'] ?? '' ) );
$tb_icon_url   = $attributes['url'] ?? '';

if ( $tb_icon_id ) {
	$tb_icon_wrap    = '.tb-icon-wrap.tb-block-' . $tb_icon_id;
	$tb_icon_el      = $tb_icon_wrap . ' .tb-icon-el';
	$tb_icon_stacked = 'stacked' === $tb_icon_view;
	$tb_icon_framed  = 'framed' === $tb_icon_view;
	$tb_icon_color   = is_array( $attributes['iconColor'] ?? null ) ? $attributes['iconColor'] : array();
	$tb_icon_bg      = is_array( $attributes['bgColor'] ?? null ) ? $attributes['bgColor'] : array();
	$tb_icon_border  = is_array( $attributes['borderColor'] ?? null ) ? $attributes['borderColor'] : array();

	// Same as rotateMap() in styles.js.
	$tb_icon_rotate = array();
	foreach ( (array) ( $attributes['rotate'] ?? array() ) as $tb_icon_device => $tb_icon_deg ) {
		if ( in_array( $tb_icon_device, DynamicCSS::DEVICES, true ) && is_numeric( $tb_icon_deg ) ) {
			$tb_icon_rotate[ $tb_icon_device ] = 'rotate(' . (int) round( (float) $tb_icon_deg ) . 'deg)';
		}
	}

	// Same selectors and order as blocks/src/icon/styles.js.
	DynamicCSS::add( $tb_icon_wrap, DynamicCSS::from_responsive( array( 'text-align' => $attributes['align'] ?? array() ) ) );
	DynamicCSS::add(
		$tb_icon_el,
		DynamicCSS::from_responsive(
			array(
				'font-size'        => $attributes['size'] ?? array(),
				'padding'          => $attributes['padding'] ?? array(),
				'color'            => $tb_icon_color['normal'] ?? '',
				'background-color' => $tb_icon_stacked ? ( $tb_icon_bg['normal'] ?? '' ) : '',
				'border-color'     => $tb_icon_framed ? ( $tb_icon_border['normal'] ?? '' ) : '',
				'border-width'     => $tb_icon_framed ? ( $attributes['borderWidth'] ?? '' ) : '',
			)
		)
	);
	DynamicCSS::add(
		$tb_icon_el . ':hover,' . $tb_icon_el . ':focus-visible',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_icon_color['hover'] ?? '',
				'background-color' => $tb_icon_stacked ? ( $tb_icon_bg['hover'] ?? '' ) : '',
				'border-color'     => $tb_icon_framed ? ( $tb_icon_border['hover'] ?? '' ) : '',
			)
		)
	);
	DynamicCSS::add( $tb_icon_el . ' > .tb-icon', DynamicCSS::from_responsive( array( 'transform' => $tb_icon_rotate ) ) );
}

$tb_icon_classes = array( 'tb-icon-el', 'tb-icon-el--' . $tb_icon_view );
if ( 'default' !== $tb_icon_view ) {
	$tb_icon_classes[] = 'tb-icon-el--' . $tb_icon_shape;
}
if ( $tb_icon_anim ) {
	$tb_icon_classes[] = 'tb-icon-el--anim-' . $tb_icon_anim;
}

$tb_icon_attrs = array( 'class' => implode( ' ', $tb_icon_classes ) );

if ( '' !== $tb_icon_url ) {
	$tb_icon_tag           = 'a';
	$tb_icon_attrs['href'] = esc_url( $tb_icon_url );
	$tb_icon_rel           = array();
	if ( ! empty( $attributes['opensInNewTab'] ) ) {
		$tb_icon_attrs['target'] = '_blank';
		$tb_icon_rel[]           = 'noopener';
	}
	if ( ! empty( $attributes['nofollow'] ) ) {
		$tb_icon_rel[] = 'nofollow';
	}
	if ( ! empty( $attributes['sponsored'] ) ) {
		$tb_icon_rel[] = 'sponsored';
	}
	if ( $tb_icon_rel ) {
		$tb_icon_attrs['rel'] = implode( ' ', $tb_icon_rel );
	}
	if ( '' !== $tb_icon_label ) {
		$tb_icon_attrs['aria-label'] = $tb_icon_label;
	}
} else {
	$tb_icon_tag = 'span';
	if ( '' !== $tb_icon_label ) {
		$tb_icon_attrs['role']       = 'img';
		$tb_icon_attrs['aria-label'] = $tb_icon_label;
	} else {
		$tb_icon_attrs['aria-hidden'] = 'true';
	}
}

$tb_icon_attr_html = '';
foreach ( $tb_icon_attrs as $tb_icon_attr => $tb_icon_value ) {
	$tb_icon_attr_html .= sprintf( ' %s="%s"', $tb_icon_attr, 'href' === $tb_icon_attr ? $tb_icon_value : esc_attr( $tb_icon_value ) );
}

$tb_icon_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-icon-wrap' . ( $tb_icon_id ? ' tb-block-' . $tb_icon_id : '' ) )
);
?>
<div <?php echo $tb_icon_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<<?php echo $tb_icon_tag . $tb_icon_attr_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed tag; attributes escaped above. ?>>
		<?php echo $tb_icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Icons::svg() escapes; Svg::sanitize() allowlists. ?>
	</<?php echo $tb_icon_tag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed tag. ?>>
</div>
