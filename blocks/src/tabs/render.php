<?php
/**
 * TB Tabs — frontend output. Builds the tablist from the TB Tab children and
 * renders each child itself so ARIA attributes and the initial state are server-side.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered TB Tab blocks (unused; children are rendered one by one).
 * @var WP_Block $block      Block instance.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_tabs_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_tabs_vertical = 'vertical' === ( $attributes['orientation'] ?? '' );
$tb_tabs_mobile   = in_array( $attributes['mobileMode'] ?? '', array( 'accordion', 'stacked', 'none' ), true ) ? $attributes['mobileMode'] : 'accordion';
$tb_tabs_icon_end = 'after' === ( $attributes['iconPosition'] ?? '' );
$tb_tabs_title_ok = array(
	'strong' => array(),
	'em'     => array(),
);

$tb_tabs_items = array();
foreach ( $block->inner_blocks as $tb_tabs_index => $tb_tabs_inner ) {
	if ( 'tungool-builder/tab' !== $tb_tabs_inner->name ) {
		continue;
	}
	$tb_tabs_uid = sanitize_key( $tb_tabs_inner->attributes['uniqueId'] ?? '' );
	if ( '' === $tb_tabs_uid ) {
		$tb_tabs_uid = $tb_tabs_id . '-' . $tb_tabs_index;
	}
	$tb_tabs_items[] = array(
		'uid'   => $tb_tabs_uid,
		'title' => wp_kses( $tb_tabs_inner->attributes['title'] ?? '', $tb_tabs_title_ok ),
		'icon'  => Icons::svg( $tb_tabs_inner->attributes['icon'] ?? '' ),
		'html'  => $tb_tabs_inner->render(),
	);
}

if ( ! $tb_tabs_items ) {
	return;
}

$tb_tabs_count  = count( $tb_tabs_items );
$tb_tabs_active = (int) ( $attributes['defaultTab'] ?? 0 );
if ( $tb_tabs_active < 0 || $tb_tabs_active >= $tb_tabs_count ) {
	$tb_tabs_active = 0;
}

if ( $tb_tabs_id ) {
	// Same selectors and order as blocks/src/tabs/styles.js (tabsSelectors()).
	$tb_tabs_wrap      = '.tb-tabs.tb-block-' . $tb_tabs_id;
	$tb_tabs_title     = $tb_tabs_wrap . ' > .tb-tabs__nav > .tb-tabs__title';
	$tb_tabs_acc       = $tb_tabs_wrap . ' > .tb-tabs__panels > .tb-tabs__acc-title';
	$tb_tabs_color     = is_array( $attributes['titleColor'] ?? null ) ? $attributes['titleColor'] : array();
	$tb_tabs_bg        = is_array( $attributes['titleBg'] ?? null ) ? $attributes['titleBg'] : array();
	$tb_tabs_border    = is_array( $attributes['titleBorder'] ?? null ) ? $attributes['titleBorder'] : array();
	$tb_tabs_active_c  = is_array( $attributes['titleActiveColor'] ?? null ) ? $attributes['titleActiveColor'] : array();
	$tb_tabs_active_bg = is_array( $attributes['titleActiveBg'] ?? null ) ? $attributes['titleActiveBg'] : array();
	$tb_tabs_active_bc = is_array( $attributes['titleActiveBorderColor'] ?? null ) ? $attributes['titleActiveBorderColor'] : array();
	$tb_tabs_panel_bg  = is_array( $attributes['panelBg'] ?? null ) ? $attributes['panelBg'] : array();

	DynamicCSS::add( $tb_tabs_wrap, DynamicCSS::from_responsive( array( 'gap' => $attributes['navSpacing'] ?? array() ) ) );
	DynamicCSS::add(
		$tb_tabs_wrap . ' > .tb-tabs__nav',
		DynamicCSS::from_responsive(
			array(
				'gap'             => $attributes['titleGap'] ?? array(),
				'justify-content' => $attributes['navAlign'] ?? array(),
				'width'           => $tb_tabs_vertical ? ( $attributes['navWidth'] ?? array() ) : '',
			)
		)
	);
	DynamicCSS::add(
		$tb_tabs_title . ',' . $tb_tabs_acc,
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['titleTypography'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['titlePadding'] ?? array() ),
				array(
					'color'            => $tb_tabs_color['normal'] ?? '',
					'background-color' => $tb_tabs_bg['normal'] ?? '',
				),
				DynamicCSS::border_map( $tb_tabs_border )
			)
		)
	);
	DynamicCSS::add(
		$tb_tabs_title . ':hover,' . $tb_tabs_acc . ':hover',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_tabs_color['hover'] ?? '',
				'background-color' => $tb_tabs_bg['hover'] ?? '',
				'border-color'     => $tb_tabs_border['hoverColor'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_tabs_title . '[aria-selected="true"],' . $tb_tabs_acc . '[aria-expanded="true"]',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_tabs_active_c['normal'] ?? '',
				'background-color' => $tb_tabs_active_bg['normal'] ?? '',
				'border-color'     => $tb_tabs_active_bc['normal'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_tabs_title . ' .tb-tabs__icon,' . $tb_tabs_acc . ' .tb-tabs__icon',
		DynamicCSS::from_responsive( array( 'font-size' => $attributes['iconSize'] ?? array() ) )
	);
	DynamicCSS::add(
		$tb_tabs_wrap . ' > .tb-tabs__panels > .tb-tab',
		DynamicCSS::from_responsive(
			array_merge(
				array( 'background-color' => $tb_tabs_panel_bg['normal'] ?? '' ),
				DynamicCSS::spacing_map( 'padding', $attributes['panelPadding'] ?? array() ),
				DynamicCSS::border_map( $attributes['panelBorder'] ?? array() )
			)
		)
	);
}

/**
 * Title inner markup: optional icon + text, icon order from iconPosition.
 *
 * @param array $item     Tab item.
 * @param bool  $icon_end Icon after the text.
 * @return string Escaped HTML.
 */
$tb_tabs_label = static function ( $item, $icon_end ) {
	$icon = $item['icon'] ? '<span class="tb-tabs__icon" aria-hidden="true">' . $item['icon'] . '</span>' : '';
	$text = '<span class="tb-tabs__title-text">' . $item['title'] . '</span>';
	return $icon_end ? $text . $icon : $icon . $text;
};

$tb_tabs_classes = array(
	'tb-tabs',
	'tb-tabs--' . ( $tb_tabs_vertical ? 'vertical' : 'horizontal' ),
	'tb-tabs--mobile-' . $tb_tabs_mobile,
);
if ( ! empty( $attributes['fullWidth'] ) ) {
	$tb_tabs_classes[] = 'tb-tabs--full';
}
if ( $tb_tabs_id ) {
	$tb_tabs_classes[] = 'tb-block-' . $tb_tabs_id;
}

$tb_tabs_wrapper_attrs = array( 'class' => implode( ' ', $tb_tabs_classes ) );
if ( ! empty( $attributes['hashNavigation'] ) ) {
	$tb_tabs_wrapper_attrs['data-tb-hash'] = 'true';
}
$tb_tabs_wrapper = get_block_wrapper_attributes( $tb_tabs_wrapper_attrs );
?>
<div <?php echo $tb_tabs_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-tabs__nav" role="tablist" aria-orientation="<?php echo esc_attr( $tb_tabs_vertical ? 'vertical' : 'horizontal' ); ?>">
		<?php foreach ( $tb_tabs_items as $tb_tabs_i => $tb_tabs_item ) : ?>
			<?php
			$tb_tabs_on = $tb_tabs_i === $tb_tabs_active;
			// Panel id: the tab's anchor when set, so #anchor deep links work.
			$tb_tabs_proc = new WP_HTML_Tag_Processor( $tb_tabs_item['html'] );
			$tb_tabs_pid  = 'tb-tab-panel-' . $tb_tabs_item['uid'];
			if ( $tb_tabs_proc->next_tag() ) {
				$tb_tabs_existing = $tb_tabs_proc->get_attribute( 'id' );
				if ( is_string( $tb_tabs_existing ) && '' !== $tb_tabs_existing ) {
					$tb_tabs_pid = $tb_tabs_existing;
				}
				$tb_tabs_proc->set_attribute( 'id', $tb_tabs_pid );
				$tb_tabs_proc->set_attribute( 'role', 'tabpanel' );
				$tb_tabs_proc->set_attribute( 'aria-labelledby', 'tb-tab-' . $tb_tabs_item['uid'] );
				$tb_tabs_proc->set_attribute( 'tabindex', '0' );
				if ( ! $tb_tabs_on ) {
					$tb_tabs_proc->set_attribute( 'hidden', true );
				}
			}
			$tb_tabs_items[ $tb_tabs_i ]['html'] = $tb_tabs_proc->get_updated_html();
			$tb_tabs_items[ $tb_tabs_i ]['pid']  = $tb_tabs_pid;
			?>
			<button
				type="button"
				class="tb-tabs__title"
				role="tab"
				id="<?php echo esc_attr( 'tb-tab-' . $tb_tabs_item['uid'] ); ?>"
				aria-controls="<?php echo esc_attr( $tb_tabs_pid ); ?>"
				aria-selected="<?php echo $tb_tabs_on ? 'true' : 'false'; ?>"
				tabindex="<?php echo $tb_tabs_on ? '0' : '-1'; ?>"
			><?php echo $tb_tabs_label( $tb_tabs_item, $tb_tabs_icon_end ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- title via wp_kses, icon via Icons::svg(). ?></button>
		<?php endforeach; ?>
	</div>
	<div class="tb-tabs__panels">
		<?php foreach ( $tb_tabs_items as $tb_tabs_i => $tb_tabs_item ) : ?>
			<?php if ( 'accordion' === $tb_tabs_mobile ) : ?>
				<button
					type="button"
					class="tb-tabs__acc-title"
					aria-controls="<?php echo esc_attr( $tb_tabs_item['pid'] ); ?>"
					aria-expanded="<?php echo $tb_tabs_i === $tb_tabs_active ? 'true' : 'false'; ?>"
				><?php echo $tb_tabs_label( $tb_tabs_item, $tb_tabs_icon_end ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- see above. ?></button>
			<?php elseif ( 'stacked' === $tb_tabs_mobile ) : ?>
				<div class="tb-tabs__acc-title" aria-hidden="true"><?php echo $tb_tabs_label( $tb_tabs_item, $tb_tabs_icon_end ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- see above. ?></div>
			<?php endif; ?>
			<?php echo $tb_tabs_item['html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner block. ?>
		<?php endforeach; ?>
	</div>
</div>
