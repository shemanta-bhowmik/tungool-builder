<?php
/**
 * TB Buttons — frontend output.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered TB Button blocks.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_buttons_id      = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_buttons_classes = array( 'tb-buttons' );

if ( ! empty( $attributes['stackOnMobile'] ) ) {
	$tb_buttons_classes[] = 'tb-buttons--stack-mobile';
}

if ( $tb_buttons_id ) {
	$tb_buttons_classes[] = 'tb-block-' . $tb_buttons_id;

	// Same rules as blocks/src/buttons/styles.js.
	DynamicCSS::add(
		'.tb-buttons.tb-block-' . $tb_buttons_id,
		DynamicCSS::from_responsive(
			array(
				'flex-direction'  => $attributes['direction'] ?? array(),
				'justify-content' => $attributes['justify'] ?? array(),
				'align-items'     => $attributes['alignItems'] ?? array(),
				'gap'             => $attributes['gap'] ?? array(),
				'flex-wrap'       => $attributes['wrap'] ?? array(),
			)
		)
	);
}

$tb_buttons_wrapper = get_block_wrapper_attributes( array( 'class' => implode( ' ', $tb_buttons_classes ) ) );
?>
<div <?php echo $tb_buttons_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
</div>
