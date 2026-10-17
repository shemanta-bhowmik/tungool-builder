<?php
/**
 * TB Icon List — frontend output (<ul> of TB Icon List Items).
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered items.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_il_id      = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_il_layout  = 'inline' === ( $attributes['layout'] ?? '' ) ? 'inline' : 'vertical';
$tb_il_valign  = in_array( $attributes['iconAlign'] ?? '', array( 'start', 'center', 'end' ), true ) ? $attributes['iconAlign'] : 'center';
$tb_il_divider = ! empty( $attributes['divider'] );

if ( $tb_il_id ) {
	// Same as dividerValue() in blocks/src/icon-list/styles.js.
	$tb_il_divider_value = '';
	if ( $tb_il_divider ) {
		$tb_il_style         = in_array( $attributes['dividerStyle'] ?? '', array( 'solid', 'dashed', 'dotted', 'double' ), true ) ? $attributes['dividerStyle'] : 'solid';
		$tb_il_width         = (string) ( $attributes['dividerWidth'] ?? '' );
		$tb_il_dcolor        = $attributes['dividerColor']['normal'] ?? '';
		$tb_il_divider_value = ( '' !== $tb_il_width ? $tb_il_width : '1px' ) . ' ' . $tb_il_style . ' ' . ( '' !== (string) $tb_il_dcolor ? $tb_il_dcolor : 'currentColor' );
	}

	// Same selectors and order as blocks/src/icon-list/styles.js.
	$tb_il_wrap  = '.tb-icon-list.tb-block-' . $tb_il_id;
	$tb_il_item  = $tb_il_wrap . ' > .tb-icon-list-item';
	$tb_il_inner = $tb_il_item . ' > .tb-icon-list-item__inner';
	$tb_il_icon  = is_array( $attributes['iconColor'] ?? null ) ? $attributes['iconColor'] : array();
	$tb_il_text  = is_array( $attributes['textColor'] ?? null ) ? $attributes['textColor'] : array();

	DynamicCSS::add(
		$tb_il_wrap,
		DynamicCSS::from_responsive(
			array(
				'--tb-il-gap'     => $attributes['gap'] ?? array(),
				'--tb-il-align'   => $attributes['align'] ?? array(),
				'--tb-il-divider' => $tb_il_divider_value,
			)
		)
	);
	DynamicCSS::add(
		$tb_il_inner,
		DynamicCSS::from_responsive(
			array_merge(
				array(
					'gap'   => $attributes['iconGap'] ?? array(),
					'color' => $tb_il_text['normal'] ?? '',
				),
				DynamicCSS::typography_map( $attributes['textTypography'] ?? array() )
			)
		)
	);
	DynamicCSS::add( $tb_il_inner . ':hover', DynamicCSS::from_responsive( array( 'color' => $tb_il_text['hover'] ?? '' ) ) );
	DynamicCSS::add(
		$tb_il_item . ' .tb-icon-list-item__icon',
		DynamicCSS::from_responsive(
			array(
				'font-size' => $attributes['iconSize'] ?? array(),
				'color'     => $tb_il_icon['normal'] ?? '',
			)
		)
	);
	DynamicCSS::add( $tb_il_inner . ':hover .tb-icon-list-item__icon', DynamicCSS::from_responsive( array( 'color' => $tb_il_icon['hover'] ?? '' ) ) );
}

$tb_il_classes = array( 'tb-icon-list', 'tb-icon-list--' . $tb_il_layout, 'tb-icon-list--icon-' . $tb_il_valign );
if ( $tb_il_divider ) {
	$tb_il_classes[] = 'tb-icon-list--divider';
}
if ( $tb_il_id ) {
	$tb_il_classes[] = 'tb-block-' . $tb_il_id;
}
$tb_il_wrapper = get_block_wrapper_attributes( array( 'class' => implode( ' ', $tb_il_classes ) ) );
?>
<ul <?php echo $tb_il_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
</ul>
