<?php
/**
 * TB Tab — one panel. TB Tabs adds role, id, aria-labelledby and hidden.
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered inner blocks.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_tab_id      = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_tab_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-tab' . ( $tb_tab_id ? ' tb-block-' . $tb_tab_id : '' ) )
);
?>
<div <?php echo $tb_tab_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
</div>
