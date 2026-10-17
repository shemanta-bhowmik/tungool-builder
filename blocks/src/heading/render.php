<?php
/**
 * TB Heading — frontend output.
 *
 * @var array $attributes Block attributes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_heading_text = $attributes['content'] ?? '';
if ( '' === trim( wp_strip_all_tags( $tb_heading_text ) ) ) {
	return;
}

$tb_heading_level = absint( $attributes['level'] ?? 2 );
if ( $tb_heading_level < 1 || $tb_heading_level > 6 ) {
	$tb_heading_level = 2;
}

$tb_heading_align = $attributes['align'] ?? 'left';
if ( ! in_array( $tb_heading_align, array( 'left', 'center', 'right' ), true ) ) {
	$tb_heading_align = 'left';
}

$tb_heading_unique_id = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_heading_classes   = sprintf( 'tb-heading tb-heading-%1$d tb-heading-align-%2$s', $tb_heading_level, $tb_heading_align );

if ( $tb_heading_unique_id ) {
	$tb_heading_classes .= ' tb-block-' . $tb_heading_unique_id;
	$tb_heading_selector = '.tb-block-' . $tb_heading_unique_id;

	\SB\TungoolBuilder\App\DynamicCSS::add(
		$tb_heading_selector,
		\SB\TungoolBuilder\App\DynamicCSS::from_responsive(
			array_merge(
				\SB\TungoolBuilder\App\DynamicCSS::typography_map( $attributes['typography'] ?? array() ),
				\SB\TungoolBuilder\App\DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				\SB\TungoolBuilder\App\DynamicCSS::spacing_map( 'margin', $attributes['margin'] ?? array() )
			)
		)
	);

	$tb_heading_hover = $attributes['hoverColor'] ?? '';
	if ( '' !== $tb_heading_hover ) {
		\SB\TungoolBuilder\App\DynamicCSS::add(
			$tb_heading_selector . ':hover',
			\SB\TungoolBuilder\App\DynamicCSS::from_responsive( array( 'color' => $tb_heading_hover . ' !important' ) )
		);
	}
}

$tb_heading_wrapper = get_block_wrapper_attributes( array( 'class' => $tb_heading_classes ) );

printf(
	'<h%1$d %2$s>%3$s</h%1$d>',
	(int) $tb_heading_level,
	$tb_heading_wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes().
	wp_kses_post( $tb_heading_text )
);
