<?php
/**
 * TB Text — frontend output.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_text_content = $attributes['content'] ?? '';
if ( '' === trim( wp_strip_all_tags( $tb_text_content ) ) ) {
	return;
}

$tb_text_tag      = in_array( $attributes['tagName'] ?? 'p', array( 'p', 'div', 'span' ), true ) ? $attributes['tagName'] : 'p';
$tb_text_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_text_drop_cap = ! empty( $attributes['dropCap'] );

if ( $tb_text_id ) {
	$tb_text_el    = '.tb-text.tb-block-' . $tb_text_id;
	$tb_text_bg    = is_array( $attributes['background'] ?? null ) ? $attributes['background'] : array();
	$tb_text_color = is_array( $attributes['textColor'] ?? null ) ? $attributes['textColor'] : array();
	$tb_text_link  = is_array( $attributes['linkColor'] ?? null ) ? $attributes['linkColor'] : array();
	$tb_text_rule  = is_array( $attributes['columnRule'] ?? null ) ? $attributes['columnRule'] : array();

	// Same selectors and order as blocks/src/text/styles.js.
	DynamicCSS::add(
		$tb_text_el,
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['typography'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['padding'] ?? array() ),
				DynamicCSS::spacing_map( 'margin', $attributes['margin'] ?? array() ),
				array(
					'max-width'  => $attributes['maxWidth'] ?? array(),
					'text-align' => $attributes['align'] ?? array(),
					'color'      => $tb_text_color['normal'] ?? '',
				),
				DynamicCSS::background_map( $tb_text_bg ),
				DynamicCSS::border_map( $attributes['border'] ?? array() ),
				array(
					'box-shadow'        => DynamicCSS::box_shadow_value( $attributes['boxShadow'] ?? array() ),
					'column-count'      => $attributes['columns'] ?? array(),
					'column-gap'        => $attributes['columnGap'] ?? array(),
					'column-rule-width' => $tb_text_rule['width'] ?? '',
					'column-rule-style' => ! empty( $tb_text_rule['style'] ) ? $tb_text_rule['style'] : ( ! empty( $tb_text_rule['width'] ) ? 'solid' : '' ),
					'column-rule-color' => $tb_text_rule['color'] ?? '',
				)
			)
		)
	);
	DynamicCSS::add( $tb_text_el . ':hover', DynamicCSS::from_responsive( DynamicCSS::background_hover_map( $tb_text_bg ) ) );
	DynamicCSS::add( $tb_text_el . ' a', DynamicCSS::from_responsive( array( 'color' => $tb_text_link['normal'] ?? '' ) ) );
	DynamicCSS::add(
		$tb_text_el . ' a:hover,' . $tb_text_el . ' a:focus-visible',
		DynamicCSS::from_responsive( array( 'color' => $tb_text_link['hover'] ?? '' ) )
	);
	if ( $tb_text_drop_cap ) {
		DynamicCSS::add(
			$tb_text_el . '.tb-text--drop-cap::first-letter',
			DynamicCSS::from_responsive(
				array(
					'font-size' => $attributes['dropCapSize'] ?? '',
					'color'     => $attributes['dropCapColor'] ?? '',
				)
			)
		);
	}
}

$tb_text_classes = 'tb-text' . ( $tb_text_drop_cap ? ' tb-text--drop-cap' : '' ) . ( $tb_text_id ? ' tb-block-' . $tb_text_id : '' );
$tb_text_wrapper = get_block_wrapper_attributes( array( 'class' => $tb_text_classes ) );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$tb_text_tag, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- whitelisted tag.
	$tb_text_wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes().
	wp_kses_post( $tb_text_content )
);
