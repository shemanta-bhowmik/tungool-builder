<?php
/**
 * TB Icon List Item — frontend output. Icon falls back to the list's default icon.
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_ili_text = wp_kses(
	$attributes['text'] ?? '',
	array(
		'strong' => array(),
		'em'     => array(),
		'br'     => array(),
	)
);
$tb_ili_name = ( $attributes['icon'] ?? '' ) !== '' ? $attributes['icon'] : ( $block->context['tungool-builder/iconListIcon'] ?? '' );
$tb_ili_svg  = Icons::svg( $tb_ili_name );

if ( '' === trim( wp_strip_all_tags( $tb_ili_text ) ) && '' === $tb_ili_svg ) {
	return;
}

$tb_ili_url   = $attributes['url'] ?? '';
$tb_ili_inner = '';
if ( '' !== $tb_ili_svg ) {
	$tb_ili_inner .= '<span class="tb-icon-list-item__icon" aria-hidden="true">' . $tb_ili_svg . '</span>';
}
$tb_ili_inner .= '<span class="tb-icon-list-item__text">' . $tb_ili_text . '</span>';

$tb_ili_wrapper = get_block_wrapper_attributes( array( 'class' => 'tb-icon-list-item' ) );
?>
<li <?php echo $tb_ili_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( '' !== $tb_ili_url ) : ?>
		<?php
		$tb_ili_rel = array();
		if ( ! empty( $attributes['opensInNewTab'] ) ) {
			$tb_ili_rel[] = 'noopener';
		}
		if ( ! empty( $attributes['nofollow'] ) ) {
			$tb_ili_rel[] = 'nofollow';
		}
		if ( ! empty( $attributes['sponsored'] ) ) {
			$tb_ili_rel[] = 'sponsored';
		}
		?>
		<a
			class="tb-icon-list-item__inner"
			href="<?php echo esc_url( $tb_ili_url ); ?>"
			<?php if ( ! empty( $attributes['opensInNewTab'] ) ) : ?>
				target="_blank"
			<?php endif; ?>
			<?php if ( $tb_ili_rel ) : ?>
				rel="<?php echo esc_attr( implode( ' ', $tb_ili_rel ) ); ?>"
			<?php endif; ?>
		><?php echo $tb_ili_inner; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- text via wp_kses, icon via Icons::svg(). ?></a>
	<?php else : ?>
		<span class="tb-icon-list-item__inner"><?php echo $tb_ili_inner; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- see above. ?></span>
	<?php endif; ?>
</li>
