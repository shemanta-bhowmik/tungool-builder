<?php
/**
 * TB Spacer — frontend output: an empty, hidden-from-assistive-tech box.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_spacer_id = sanitize_key( $attributes['uniqueId'] ?? '' );

if ( $tb_spacer_id ) {
	// Same selector as blocks/src/spacer/styles.js.
	DynamicCSS::add(
		'.tb-spacer.tb-block-' . $tb_spacer_id,
		DynamicCSS::from_responsive( array( 'height' => $attributes['height'] ?? array() ) )
	);
}

$tb_spacer_wrapper = get_block_wrapper_attributes(
	array(
		'class'       => 'tb-spacer' . ( $tb_spacer_id ? ' tb-block-' . $tb_spacer_id : '' ),
		'aria-hidden' => 'true',
	)
);
?>
<div <?php echo $tb_spacer_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>></div>
