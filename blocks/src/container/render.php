<?php
/**
 * TB Container — frontend output.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered inner blocks.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_container_tag = $attributes['tagName'] ?? 'div';
if ( ! in_array( $tb_container_tag, array( 'div', 'section', 'header', 'footer', 'main', 'article', 'aside' ), true ) ) {
	$tb_container_tag = 'div';
}

$tb_container_width   = ( $attributes['contentWidth'] ?? 'boxed' ) === 'full' ? 'full' : 'boxed';
$tb_container_id      = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_container_bg      = is_array( $attributes['background'] ?? null ) ? $attributes['background'] : array();
$tb_container_border  = is_array( $attributes['border'] ?? null ) ? $attributes['border'] : array();
$tb_container_hide_on = is_array( $attributes['hideOn'] ?? null ) ? $attributes['hideOn'] : array();

$tb_container_classes = array( 'tb-container', 'tb-container--' . $tb_container_width );
if ( ! empty( $tb_container_bg['overlay']['color'] ) ) {
	$tb_container_classes[] = 'tb-container--overlay';
}
foreach ( array( 'desktop', 'tablet', 'mobile' ) as $tb_container_device ) {
	if ( ! empty( $tb_container_hide_on[ $tb_container_device ] ) ) {
		$tb_container_classes[] = 'tb-hide-' . $tb_container_device;
	}
}

if ( $tb_container_id ) {
	$tb_container_classes[] = 'tb-block-' . $tb_container_id;
	$tb_container_outer     = '.tb-container.tb-block-' . $tb_container_id;

	// Same selectors and order as blocks/src/container/styles.js.
	DynamicCSS::add(
		$tb_container_outer,
		DynamicCSS::from_responsive(
			array_merge(
				array( 'min-height' => $attributes['minHeight'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				DynamicCSS::spacing_map( 'margin', $attributes['margin'] ?? array() ),
				DynamicCSS::background_map( $tb_container_bg ),
				DynamicCSS::border_map( $tb_container_border ),
				array( 'box-shadow' => DynamicCSS::box_shadow_value( $attributes['boxShadow'] ?? array() ) )
			)
		)
	);
	DynamicCSS::add(
		$tb_container_outer . ':hover',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::background_hover_map( $tb_container_bg ),
				array( 'border-color' => $tb_container_border['hoverColor'] ?? '' )
			)
		)
	);
	DynamicCSS::add( $tb_container_outer . '::before', DynamicCSS::from_responsive( DynamicCSS::overlay_map( $tb_container_bg ) ) );
	DynamicCSS::add(
		$tb_container_outer . ' > .tb-container__inner',
		DynamicCSS::from_responsive(
			array(
				'display'               => $attributes['display'] ?? array(),
				'max-width'             => 'boxed' === $tb_container_width ? ( $attributes['maxWidth'] ?? array() ) : '',
				'flex-direction'        => $attributes['direction'] ?? array(),
				'flex-wrap'             => $attributes['wrap'] ?? array(),
				'justify-content'       => $attributes['justify'] ?? array(),
				'align-items'           => $attributes['alignItems'] ?? array(),
				'grid-template-columns' => DynamicCSS::grid_columns_map( $attributes['gridColumns'] ?? array() ),
				'gap'                   => $attributes['gap'] ?? array(),
			)
		)
	);
}

$tb_container_wrapper = get_block_wrapper_attributes( array( 'class' => implode( ' ', $tb_container_classes ) ) );
?>
<<?php echo esc_html( $tb_container_tag ); ?> <?php echo $tb_container_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-container__inner">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
	</div>
</<?php echo esc_html( $tb_container_tag ); ?>>
