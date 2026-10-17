<?php
/**
 * TB Divider — frontend output. <hr> without a middle element, otherwise a
 * role="separator" box with two line segments around the text or icon.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_divider_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_divider_style    = in_array( $attributes['lineStyle'] ?? '', array( 'solid', 'dashed', 'dotted', 'double', 'zigzag', 'wave', 'slashes' ), true ) ? $attributes['lineStyle'] : 'solid';
$tb_divider_position = in_array( $attributes['elementPosition'] ?? '', array( 'left', 'center', 'right' ), true ) ? $attributes['elementPosition'] : 'center';
$tb_divider_type     = $attributes['elementType'] ?? 'none';

$tb_divider_element = '';
if ( 'icon' === $tb_divider_type ) {
	$tb_divider_element = Icons::svg( $attributes['icon'] ?? '' );
} elseif ( 'text' === $tb_divider_type ) {
	$tb_divider_text = wp_kses( $attributes['text'] ?? '', array( 'strong' => array(), 'em' => array() ) );
	if ( '' !== trim( wp_strip_all_tags( $tb_divider_text ) ) ) {
		$tb_divider_element = '<span class="tb-divider__text">' . $tb_divider_text . '</span>';
	}
}

if ( $tb_divider_id ) {
	$tb_divider_wrap  = '.tb-divider.tb-block-' . $tb_divider_id;
	$tb_divider_color = is_array( $attributes['color'] ?? null ) ? $attributes['color'] : array();

	// Same as alignMap() in styles.js.
	$tb_divider_margins = array(
		'left'   => array( '0', 'auto' ),
		'center' => array( 'auto', 'auto' ),
		'right'  => array( 'auto', '0' ),
	);
	$tb_divider_ml      = array();
	$tb_divider_mr      = array();
	foreach ( (array) ( $attributes['align'] ?? array() ) as $tb_divider_device => $tb_divider_align ) {
		if ( in_array( $tb_divider_device, DynamicCSS::DEVICES, true ) && is_string( $tb_divider_align ) && isset( $tb_divider_margins[ $tb_divider_align ] ) ) {
			$tb_divider_ml[ $tb_divider_device ] = $tb_divider_margins[ $tb_divider_align ][0];
			$tb_divider_mr[ $tb_divider_device ] = $tb_divider_margins[ $tb_divider_align ][1];
		}
	}

	// Same selectors and order as blocks/src/divider/styles.js.
	DynamicCSS::add(
		$tb_divider_wrap,
		DynamicCSS::from_responsive(
			array(
				'padding-top'           => $attributes['spaceAbove'] ?? array(),
				'padding-bottom'        => $attributes['spaceBelow'] ?? array(),
				'--tb-divider-weight'   => $attributes['weight'] ?? array(),
				'--tb-divider-color'    => $tb_divider_color['normal'] ?? '',
				'--tb-divider-gradient' => $attributes['gradient'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_divider_wrap . ' > .tb-divider__box',
		DynamicCSS::from_responsive(
			array(
				'width'        => $attributes['width'] ?? array(),
				'margin-left'  => $tb_divider_ml,
				'margin-right' => $tb_divider_mr,
			)
		)
	);

	if ( in_array( $tb_divider_type, array( 'text', 'icon' ), true ) ) {
		$tb_divider_el_color = is_array( $attributes['elementColor'] ?? null ) ? $attributes['elementColor'] : array();
		DynamicCSS::add( $tb_divider_wrap . ' .tb-divider__inner', DynamicCSS::from_responsive( array( 'gap' => $attributes['gap'] ?? array() ) ) );
		DynamicCSS::add(
			$tb_divider_wrap . ' .tb-divider__element',
			DynamicCSS::from_responsive(
				array_merge(
					DynamicCSS::typography_map( $attributes['typography'] ?? array() ),
					array( 'color' => $tb_divider_el_color['normal'] ?? '' )
				)
			)
		);
		DynamicCSS::add(
			$tb_divider_wrap . ' .tb-divider__element > .tb-icon',
			DynamicCSS::from_responsive( array( 'font-size' => $attributes['iconSize'] ?? array() ) )
		);
	}
}

$tb_divider_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-divider tb-divider--' . $tb_divider_style . ( $tb_divider_id ? ' tb-block-' . $tb_divider_id : '' ) )
);
?>
<div <?php echo $tb_divider_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( '' === $tb_divider_element ) : ?>
		<hr class="tb-divider__box tb-divider__line" />
	<?php else : ?>
		<div class="tb-divider__box tb-divider__inner tb-divider__inner--<?php echo esc_attr( $tb_divider_position ); ?>" role="separator">
			<span class="tb-divider__line"></span>
			<span class="tb-divider__element"><?php echo $tb_divider_element; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses / Icons::svg() above. ?></span>
			<span class="tb-divider__line"></span>
		</div>
	<?php endif; ?>
</div>
