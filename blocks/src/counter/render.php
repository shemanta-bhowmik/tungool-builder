<?php
/**
 * TB Counter — frontend output. The final number is rendered here (SEO, no-JS,
 * reduced motion); view.js only animates from the start value.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_counter_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_counter_start    = is_numeric( $attributes['start'] ?? null ) ? (float) $attributes['start'] : 0.0;
$tb_counter_end      = is_numeric( $attributes['end'] ?? null ) ? (float) $attributes['end'] : 0.0;
$tb_counter_duration = is_numeric( $attributes['duration'] ?? null ) ? max( 0, (int) $attributes['duration'] ) : 2000;
$tb_counter_decimals = is_numeric( $attributes['decimals'] ?? null ) ? min( 6, max( 0, (int) $attributes['decimals'] ) ) : 0;
$tb_counter_thousand = in_array( $attributes['thousandsSeparator'] ?? ',', array( ',', '.', ' ', '’', '' ), true ) ? $attributes['thousandsSeparator'] ?? ',' : ',';
$tb_counter_point    = ',' === ( $attributes['decimalSeparator'] ?? '.' ) ? ',' : '.';
$tb_counter_prefix   = (string) ( $attributes['prefix'] ?? '' );
$tb_counter_suffix   = (string) ( $attributes['suffix'] ?? '' );
$tb_counter_title    = wp_kses( $attributes['title'] ?? '', array( 'strong' => array(), 'em' => array() ) );
$tb_counter_position = 'above' === ( $attributes['titlePosition'] ?? 'below' ) ? 'above' : 'below';
$tb_counter_icon     = Icons::svg( $attributes['icon'] ?? '' );

// Same as formatNumber() in format.js.
$tb_counter_value = number_format( $tb_counter_end, $tb_counter_decimals, $tb_counter_point, $tb_counter_thousand );

if ( $tb_counter_id ) {
	$tb_counter_wrap = '.tb-counter.tb-block-' . $tb_counter_id;

	// Same selectors and order as blocks/src/counter/styles.js.
	DynamicCSS::add(
		$tb_counter_wrap,
		DynamicCSS::from_responsive(
			array(
				'text-align' => $attributes['align'] ?? array(),
				'gap'        => $attributes['gap'] ?? array(),
			)
		)
	);
	DynamicCSS::add(
		$tb_counter_wrap . ' .tb-counter__number',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['numberTypography'] ?? array() ),
				array( 'color' => $attributes['numberColor']['normal'] ?? '' )
			)
		)
	);
	DynamicCSS::add(
		$tb_counter_wrap . ' .tb-counter__title',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['titleTypography'] ?? array() ),
				array( 'color' => $attributes['titleColor']['normal'] ?? '' )
			)
		)
	);
	DynamicCSS::add(
		$tb_counter_wrap . ' .tb-counter__icon',
		DynamicCSS::from_responsive(
			array(
				'font-size' => $attributes['iconSize'] ?? array(),
				'color'     => $attributes['iconColor']['normal'] ?? '',
			)
		)
	);
}

$tb_counter_config = array(
	'start'     => $tb_counter_start,
	'end'       => $tb_counter_end,
	'duration'  => $tb_counter_duration,
	'decimals'  => $tb_counter_decimals,
	'thousands' => $tb_counter_thousand,
	'point'     => $tb_counter_point,
);

$tb_counter_wrapper = get_block_wrapper_attributes(
	array(
		'class'           => 'tb-counter tb-counter--title-' . $tb_counter_position . ( $tb_counter_id ? ' tb-block-' . $tb_counter_id : '' ),
		'data-tb-counter' => wp_json_encode( $tb_counter_config ),
	)
);

$tb_counter_title_html = '' !== trim( wp_strip_all_tags( $tb_counter_title ) )
	? '<div class="tb-counter__title">' . $tb_counter_title . '</div>'
	: '';
?>
<div <?php echo $tb_counter_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( $tb_counter_icon ) : ?>
		<div class="tb-counter__icon"><?php echo $tb_counter_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg(). ?></div>
	<?php endif; ?>
	<?php echo 'above' === $tb_counter_position ? $tb_counter_title_html : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?>
	<div class="tb-counter__number" aria-hidden="true">
		<?php if ( '' !== $tb_counter_prefix ) : ?>
			<span class="tb-counter__prefix"><?php echo esc_html( $tb_counter_prefix ); ?></span>
		<?php endif; ?>
		<span class="tb-counter__value"><?php echo esc_html( $tb_counter_value ); ?></span>
		<?php if ( '' !== $tb_counter_suffix ) : ?>
			<span class="tb-counter__suffix"><?php echo esc_html( $tb_counter_suffix ); ?></span>
		<?php endif; ?>
	</div>
	<span class="tb-counter__sr"><?php echo esc_html( $tb_counter_prefix . $tb_counter_value . $tb_counter_suffix ); ?></span>
	<?php echo 'below' === $tb_counter_position ? $tb_counter_title_html : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?>
</div>
