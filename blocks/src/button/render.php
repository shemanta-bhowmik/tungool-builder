<?php
/**
 * TB Button — frontend output. <a> when a URL is set, otherwise <button type="button">.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Button;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_button_text = wp_kses( $attributes['text'] ?? '', array( 'strong' => array(), 'em' => array() ) );
$tb_button_icon = Icons::svg( $attributes['icon'] ?? '' );

if ( '' === trim( wp_strip_all_tags( $tb_button_text ) ) && '' === $tb_button_icon ) {
	return;
}

$tb_button_id     = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_button_preset = in_array( $attributes['preset'] ?? '', array( 'primary', 'secondary', 'outline', 'text' ), true ) ? $attributes['preset'] : 'primary';
$tb_button_url    = $attributes['url'] ?? '';

if ( $tb_button_id ) {
	$tb_button_wrap = '.tb-button-wrap.tb-block-' . $tb_button_id;
	$tb_button_el   = $tb_button_wrap . ' > .tb-button';

	// Same selectors and order as blocks/src/button/styles.js (element rules: Helpers\Button).
	DynamicCSS::add(
		$tb_button_wrap,
		DynamicCSS::from_responsive( array( 'width' => DynamicCSS::width_map( $attributes['widthMode'] ?? array(), $attributes['customWidth'] ?? array() ) ) )
	);
	Button::add_css( $tb_button_el, $attributes );
}

$tb_button_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-button-wrap' . ( $tb_button_id ? ' tb-block-' . $tb_button_id : '' ) )
);

$tb_button_inner_attrs = array( 'class' => 'tb-button tb-button--' . $tb_button_preset );
if ( '' !== ( $attributes['ariaLabel'] ?? '' ) ) {
	$tb_button_inner_attrs['aria-label'] = $attributes['ariaLabel'];
}

if ( '' !== $tb_button_url ) {
	$tb_button_tag                 = 'a';
	$tb_button_inner_attrs['href'] = esc_url( $tb_button_url );
	$tb_button_rel                 = array();
	if ( ! empty( $attributes['opensInNewTab'] ) ) {
		$tb_button_inner_attrs['target'] = '_blank';
		$tb_button_rel[]                 = 'noopener';
	}
	if ( ! empty( $attributes['nofollow'] ) ) {
		$tb_button_rel[] = 'nofollow';
	}
	if ( ! empty( $attributes['sponsored'] ) ) {
		$tb_button_rel[] = 'sponsored';
	}
	if ( $tb_button_rel ) {
		$tb_button_inner_attrs['rel'] = implode( ' ', $tb_button_rel );
	}
} else {
	$tb_button_tag                 = 'button';
	$tb_button_inner_attrs['type'] = 'button';
}

$tb_button_attr_html = '';
foreach ( $tb_button_inner_attrs as $tb_button_attr => $tb_button_value ) {
	$tb_button_attr_html .= sprintf( ' %s="%s"', $tb_button_attr, 'href' === $tb_button_attr ? $tb_button_value : esc_attr( $tb_button_value ) );
}

$tb_button_icon_html = $tb_button_icon ? '<span class="tb-button__icon">' . $tb_button_icon . '</span>' : '';
$tb_button_before    = 'before' === ( $attributes['iconPosition'] ?? 'after' );
?>
<div <?php echo $tb_button_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<<?php echo $tb_button_tag . $tb_button_attr_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed tag; attributes escaped above. ?>>
		<?php
		echo $tb_button_before ? $tb_button_icon_html : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg().
		if ( '' !== trim( wp_strip_all_tags( $tb_button_text ) ) ) {
			echo '<span class="tb-button__text">' . $tb_button_text . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above.
		}
		echo $tb_button_before ? '' : $tb_button_icon_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg().
		?>
	</<?php echo $tb_button_tag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed tag. ?>>
</div>
