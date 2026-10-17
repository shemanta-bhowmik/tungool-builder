<?php
/**
 * TB Countdown — frontend output. Prints the current remaining time so the block
 * is correct without JS (or with a cached page, until view.js corrects it).
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_cd_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_cd_mode     = 'evergreen' === ( $attributes['mode'] ?? 'fixed' ) ? 'evergreen' : 'fixed';
$tb_cd_on_end   = in_array( $attributes['onEnd'] ?? '', array( 'message', 'hide', 'redirect' ), true ) ? $attributes['onEnd'] : 'message';
$tb_cd_layout   = 'inline' === ( $attributes['layout'] ?? 'boxes' ) ? 'inline' : 'boxes';
$tb_cd_sep      = in_array( $attributes['separator'] ?? '', array( '', ':', '/', '·', '-' ), true ) ? ( $attributes['separator'] ?? '' ) : '';
$tb_cd_labels   = is_array( $attributes['labels'] ?? null ) ? $attributes['labels'] : array();
$tb_cd_redirect = esc_url_raw( $attributes['redirectUrl'] ?? '' );
$tb_cd_message  = trim( (string) ( $attributes['endMessage'] ?? '' ) );
if ( '' === $tb_cd_message ) {
	$tb_cd_message = __( 'This offer has ended.', 'tungool-builder' );
}

$tb_cd_units = array(
	'days'    => array( 86400, __( 'Days', 'tungool-builder' ), 'showDays' ),
	'hours'   => array( 3600, __( 'Hours', 'tungool-builder' ), 'showHours' ),
	'minutes' => array( 60, __( 'Minutes', 'tungool-builder' ), 'showMinutes' ),
	'seconds' => array( 1, __( 'Seconds', 'tungool-builder' ), 'showSeconds' ),
);
$tb_cd_shown = array();
foreach ( $tb_cd_units as $tb_cd_key => $tb_cd_unit ) {
	if ( ! empty( $attributes[ $tb_cd_unit[2] ] ) ) {
		$tb_cd_shown[] = $tb_cd_key;
	}
}
if ( ! $tb_cd_shown ) {
	return;
}

// Target / remaining seconds.
$tb_cd_target   = 0;
$tb_cd_duration = 0;
if ( 'fixed' === $tb_cd_mode ) {
	if ( empty( $attributes['date'] ) ) {
		return;
	}
	try {
		$tb_cd_target = ( new DateTimeImmutable( (string) $attributes['date'], wp_timezone() ) )->getTimestamp();
	} catch ( Exception $e ) {
		return;
	}
	$tb_cd_remaining = max( 0, $tb_cd_target - time() );
} else {
	$tb_cd_duration  = max( 0, (int) ( $attributes['evergreenHours'] ?? 0 ) ) * 3600 + min( 59, max( 0, (int) ( $attributes['evergreenMinutes'] ?? 0 ) ) ) * 60;
	$tb_cd_remaining = $tb_cd_duration;
	if ( ! $tb_cd_duration ) {
		return;
	}
}

$tb_cd_ended = 'fixed' === $tb_cd_mode && 0 === $tb_cd_remaining;
if ( $tb_cd_ended && 'hide' === $tb_cd_on_end ) {
	return;
}

// Same as splitTime() in units.js.
$tb_cd_parts = array();
$tb_cd_rest  = $tb_cd_remaining;
foreach ( $tb_cd_shown as $tb_cd_key ) {
	$tb_cd_size                = $tb_cd_units[ $tb_cd_key ][0];
	$tb_cd_value               = intdiv( $tb_cd_rest, $tb_cd_size );
	$tb_cd_rest               -= $tb_cd_value * $tb_cd_size;
	$tb_cd_parts[ $tb_cd_key ] = str_pad( (string) $tb_cd_value, 2, '0', STR_PAD_LEFT );
}

if ( $tb_cd_id ) {
	$tb_cd_wrap   = '.tb-countdown.tb-block-' . $tb_cd_id;
	$tb_cd_boxes  = 'boxes' === $tb_cd_layout;
	$tb_cd_digits = is_array( $attributes['digitTypography'] ?? null ) ? $attributes['digitTypography'] : array();

	// Same as justifyMap() in styles.js.
	$tb_cd_justify = array();
	foreach ( (array) ( $attributes['align'] ?? array() ) as $tb_cd_device => $tb_cd_align ) {
		$tb_cd_map = array(
			'left'   => 'flex-start',
			'center' => 'center',
			'right'  => 'flex-end',
		);
		if ( isset( $tb_cd_map[ $tb_cd_align ] ) ) {
			$tb_cd_justify[ $tb_cd_device ] = $tb_cd_map[ $tb_cd_align ];
		}
	}

	// Same selectors and order as blocks/src/countdown/styles.js.
	DynamicCSS::add( $tb_cd_wrap, DynamicCSS::from_responsive( array( 'text-align' => $attributes['align'] ?? array() ) ) );
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__timer',
		DynamicCSS::from_responsive(
			array(
				'gap'             => $attributes['gap'] ?? array(),
				'justify-content' => $tb_cd_justify,
			)
		)
	);
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__item',
		DynamicCSS::from_responsive(
			$tb_cd_boxes
				? array_merge(
					array( 'background-color' => $attributes['boxBackground']['normal'] ?? '' ),
					DynamicCSS::border_map( $attributes['boxBorder'] ?? array() ),
					DynamicCSS::spacing_map( 'padding', $attributes['boxPadding'] ?? array() ),
					array( 'min-width' => $attributes['boxMinWidth'] ?? array() )
				)
				: array()
		)
	);
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__digits',
		DynamicCSS::from_responsive(
			array_merge( DynamicCSS::typography_map( $tb_cd_digits ), array( 'color' => $attributes['digitColor']['normal'] ?? '' ) )
		)
	);
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__label',
		DynamicCSS::from_responsive(
			array_merge( DynamicCSS::typography_map( $attributes['labelTypography'] ?? array() ), array( 'color' => $attributes['labelColor']['normal'] ?? '' ) )
		)
	);
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__sep',
		DynamicCSS::from_responsive(
			array(
				'color'     => $attributes['separatorColor']['normal'] ?? '',
				'font-size' => $tb_cd_digits['fontSize'] ?? array(),
			)
		)
	);
	DynamicCSS::add(
		$tb_cd_wrap . ' .tb-countdown__message',
		DynamicCSS::from_responsive(
			array_merge( DynamicCSS::typography_map( $attributes['messageTypography'] ?? array() ), array( 'color' => $attributes['messageColor']['normal'] ?? '' ) )
		)
	);
}

$tb_cd_config = array(
	'mode'         => $tb_cd_mode,
	'target'       => $tb_cd_target,
	'duration'     => $tb_cd_duration,
	'units'        => $tb_cd_shown,
	'onEnd'        => $tb_cd_on_end,
	'redirect'     => 'redirect' === $tb_cd_on_end ? $tb_cd_redirect : '',
	'redirectText' => __( 'The countdown has ended. Redirecting…', 'tungool-builder' ),
	'key'          => $tb_cd_id ? $tb_cd_id : md5( wp_json_encode( $attributes ) ),
);

$tb_cd_wrapper = get_block_wrapper_attributes(
	array(
		'class'             => 'tb-countdown tb-countdown--' . $tb_cd_layout . ( $tb_cd_id ? ' tb-block-' . $tb_cd_id : '' ),
		'data-tb-countdown' => wp_json_encode( $tb_cd_config ),
	)
);
$tb_cd_show_message = $tb_cd_ended && 'message' === $tb_cd_on_end;
?>
<div <?php echo $tb_cd_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-countdown__timer" role="timer" aria-live="off"<?php echo $tb_cd_show_message ? ' hidden' : ''; ?>>
		<?php foreach ( $tb_cd_shown as $tb_cd_index => $tb_cd_key ) : ?>
			<span class="tb-countdown__group">
				<?php if ( $tb_cd_index > 0 && '' !== $tb_cd_sep ) : ?>
					<span class="tb-countdown__sep" aria-hidden="true"><?php echo esc_html( $tb_cd_sep ); ?></span>
				<?php endif; ?>
				<span class="tb-countdown__item tb-countdown__item--<?php echo esc_attr( $tb_cd_key ); ?>">
					<span class="tb-countdown__digits"><?php echo esc_html( $tb_cd_parts[ $tb_cd_key ] ); ?></span>
					<?php if ( ! empty( $attributes['showLabels'] ) ) : ?>
						<span class="tb-countdown__label"><?php echo esc_html( '' !== trim( (string) ( $tb_cd_labels[ $tb_cd_key ] ?? '' ) ) ? $tb_cd_labels[ $tb_cd_key ] : $tb_cd_units[ $tb_cd_key ][1] ); ?></span>
					<?php endif; ?>
				</span>
			</span>
		<?php endforeach; ?>
	</div>
	<?php if ( 'message' === $tb_cd_on_end ) : ?>
		<p class="tb-countdown__message"<?php echo $tb_cd_show_message ? '' : ' hidden'; ?>><?php echo esc_html( $tb_cd_message ); ?></p>
	<?php endif; ?>
	<div class="tb-countdown__status" aria-live="polite" aria-atomic="true"></div>
</div>
