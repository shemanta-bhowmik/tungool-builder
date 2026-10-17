<?php
/**
 * TB Slide — frontend output. The slider's view.js adds the "N of M" label.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered inner blocks.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_slide_id    = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_slide_bg    = is_array( $attributes['background'] ?? null ) ? $attributes['background'] : array();
$tb_slide_align = in_array( $attributes['verticalAlign'] ?? '', array( 'top', 'center', 'bottom' ), true ) ? $attributes['verticalAlign'] : 'center';

$tb_slide_classes = array( 'tb-slide', 'tb-slide--' . $tb_slide_align );
if ( ! empty( $tb_slide_bg['overlay']['color'] ) ) {
	$tb_slide_classes[] = 'tb-slide--overlay';
}

if ( $tb_slide_id ) {
	$tb_slide_classes[] = 'tb-block-' . $tb_slide_id;
	$tb_slide_el        = '.tb-slide.tb-block-' . $tb_slide_id;

	// Same selectors and order as blocks/src/slide/styles.js.
	DynamicCSS::add(
		$tb_slide_el,
		DynamicCSS::from_responsive(
			array_merge(
				array( 'min-height' => $attributes['minHeight'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				DynamicCSS::background_map( $tb_slide_bg )
			)
		)
	);
	DynamicCSS::add( $tb_slide_el . '::before', DynamicCSS::from_responsive( DynamicCSS::overlay_map( $tb_slide_bg ) ) );
}

$tb_slide_wrapper = get_block_wrapper_attributes(
	array(
		'class'                => implode( ' ', $tb_slide_classes ),
		'role'                 => 'group',
		'aria-roledescription' => __( 'slide', 'tungool-builder' ),
	)
);
?>
<div <?php echo $tb_slide_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-slide__inner">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
	</div>
</div>
