<?php
/**
 * TB Accordion Item — frontend output. Closed by default; TB Accordion opens the
 * first item when that option is on. Icons, tag and position come from context.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner blocks.
 * @var WP_Block $block      Block instance.
 */

use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_acc_item_ctx   = $block->context;
$tb_acc_item_id    = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_acc_item_key   = $tb_acc_item_id ? $tb_acc_item_id : wp_unique_id();
$tb_acc_item_tag   = in_array( $tb_acc_item_ctx['tungool-builder/accordionTitleTag'] ?? '', array( 'h2', 'h3', 'h4', 'h5', 'h6', 'div' ), true ) ? $tb_acc_item_ctx['tungool-builder/accordionTitleTag'] : 'h3';
$tb_acc_item_left  = 'left' === ( $tb_acc_item_ctx['tungool-builder/accordionIconPosition'] ?? 'right' );
$tb_acc_item_faq   = ! empty( $tb_acc_item_ctx['tungool-builder/accordionFaq'] );
$tb_acc_item_c_svg = Icons::svg( $tb_acc_item_ctx['tungool-builder/accordionIconClosed'] ?? 'plus' );
$tb_acc_item_o_svg = Icons::svg( $tb_acc_item_ctx['tungool-builder/accordionIconOpen'] ?? 'minus' );
$tb_acc_item_title = wp_kses(
	$attributes['title'] ?? '',
	array(
		'strong' => array(),
		'em'     => array(),
	)
);

$tb_acc_item_icon = '';
if ( $tb_acc_item_c_svg || $tb_acc_item_o_svg ) {
	$tb_acc_item_icon = '<span class="tb-accordion-item__icon" aria-hidden="true">'
		. '<span class="tb-accordion-item__icon-closed">' . $tb_acc_item_c_svg . '</span>'
		. '<span class="tb-accordion-item__icon-open">' . ( $tb_acc_item_o_svg ? $tb_acc_item_o_svg : $tb_acc_item_c_svg ) . '</span>'
		. '</span>';
}
$tb_acc_item_text = '<span class="tb-accordion-item__title-text">' . $tb_acc_item_title . '</span>';

$tb_acc_item_title_id = 'tb-acc-title-' . $tb_acc_item_key;
$tb_acc_item_panel_id = 'tb-acc-panel-' . $tb_acc_item_key;

$tb_acc_item_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'tb-accordion-item tb-accordion-item--icon-' . ( $tb_acc_item_left ? 'left' : 'right' ) . ( $tb_acc_item_id ? ' tb-block-' . $tb_acc_item_id : '' ),
	)
);
?>
<div <?php echo $tb_acc_item_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<<?php echo tag_escape( $tb_acc_item_tag ); ?> class="tb-accordion-item__heading">
		<button
			type="button"
			class="tb-accordion-item__title"
			id="<?php echo esc_attr( $tb_acc_item_title_id ); ?>"
			aria-expanded="false"
			aria-controls="<?php echo esc_attr( $tb_acc_item_panel_id ); ?>"
		><?php echo $tb_acc_item_left ? $tb_acc_item_icon . $tb_acc_item_text : $tb_acc_item_text . $tb_acc_item_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- title via wp_kses, icons via Icons::svg(). ?></button>
	</<?php echo tag_escape( $tb_acc_item_tag ); ?>>
	<div
		class="tb-accordion-item__panel"
		id="<?php echo esc_attr( $tb_acc_item_panel_id ); ?>"
		role="region"
		aria-labelledby="<?php echo esc_attr( $tb_acc_item_title_id ); ?>"
		hidden
	>
		<div class="tb-accordion-item__content"><?php echo $tb_acc_item_faq ? '<!--tb-faq-->' : ''; ?><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?><?php echo $tb_acc_item_faq ? '<!--/tb-faq-->' : ''; ?></div>
	</div>
</div>
