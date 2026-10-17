<?php
/**
 * TB Accordion — frontend output. Renders each item itself so the first item can
 * be opened server-side, and optionally prints FAQPage JSON-LD from the items.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered items (unused; children are rendered one by one).
 * @var WP_Block $block      Block instance.
 */

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_acc_id    = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_acc_open  = ! empty( $attributes['firstOpen'] );
$tb_acc_faq   = ! empty( $attributes['faqSchema'] );
$tb_acc_html  = '';
$tb_acc_qa    = array();
$tb_acc_first = true;

$tb_acc_answer_tags = array(
	'p'      => array(),
	'br'     => array(),
	'a'      => array( 'href' => true ),
	'strong' => array(),
	'b'      => array(),
	'em'     => array(),
	'i'      => array(),
	'ul'     => array(),
	'ol'     => array(),
	'li'     => array(),
	'h2'     => array(),
	'h3'     => array(),
	'h4'     => array(),
	'h5'     => array(),
	'h6'     => array(),
);

foreach ( $block->inner_blocks as $tb_acc_inner ) {
	if ( 'tungool-builder/accordion-item' !== $tb_acc_inner->name ) {
		continue;
	}
	$tb_acc_item = $tb_acc_inner->render();

	// FAQ answer = content between the markers printed by accordion-item/render.php.
	if ( $tb_acc_faq ) {
		$tb_acc_start = strpos( $tb_acc_item, '<!--tb-faq-->' );
		$tb_acc_end   = strpos( $tb_acc_item, '<!--/tb-faq-->' );
		$tb_acc_q     = trim( wp_strip_all_tags( $tb_acc_inner->attributes['title'] ?? '' ) );
		if ( false !== $tb_acc_start && false !== $tb_acc_end && '' !== $tb_acc_q ) {
			$tb_acc_a = substr( $tb_acc_item, $tb_acc_start + 13, $tb_acc_end - $tb_acc_start - 13 );
			$tb_acc_a = trim( preg_replace( '/\s+/', ' ', wp_kses( $tb_acc_a, $tb_acc_answer_tags ) ) );
			if ( '' !== $tb_acc_a ) {
				$tb_acc_qa[] = array(
					'@type'          => 'Question',
					'name'           => $tb_acc_q,
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => $tb_acc_a,
					),
				);
			}
		}
		$tb_acc_item = str_replace( array( '<!--tb-faq-->', '<!--/tb-faq-->' ), '', $tb_acc_item );
	}

	if ( $tb_acc_first && $tb_acc_open ) {
		$tb_acc_proc = new WP_HTML_Tag_Processor( $tb_acc_item );
		if ( $tb_acc_proc->next_tag() ) {
			$tb_acc_proc->add_class( 'is-open' );
		}
		if ( $tb_acc_proc->next_tag( array( 'class_name' => 'tb-accordion-item__title' ) ) ) {
			$tb_acc_proc->set_attribute( 'aria-expanded', 'true' );
		}
		if ( $tb_acc_proc->next_tag( array( 'class_name' => 'tb-accordion-item__panel' ) ) ) {
			$tb_acc_proc->remove_attribute( 'hidden' );
		}
		$tb_acc_item = $tb_acc_proc->get_updated_html();
	}
	$tb_acc_first = false;
	$tb_acc_html .= $tb_acc_item;
}

if ( '' === $tb_acc_html ) {
	return;
}

if ( $tb_acc_id ) {
	// Same selectors and order as blocks/src/accordion/styles.js.
	$tb_acc_wrap     = '.tb-accordion.tb-block-' . $tb_acc_id;
	$tb_acc_item_sel = $tb_acc_wrap . ' > .tb-accordion-item';
	$tb_acc_title    = $tb_acc_item_sel . ' > .tb-accordion-item__heading > .tb-accordion-item__title';
	$tb_acc_color    = is_array( $attributes['titleColor'] ?? null ) ? $attributes['titleColor'] : array();
	$tb_acc_bg       = is_array( $attributes['titleBg'] ?? null ) ? $attributes['titleBg'] : array();
	$tb_acc_icon_c   = is_array( $attributes['iconColor'] ?? null ) ? $attributes['iconColor'] : array();
	$tb_acc_active_c = is_array( $attributes['titleActiveColor'] ?? null ) ? $attributes['titleActiveColor'] : array();
	$tb_acc_active_b = is_array( $attributes['titleActiveBg'] ?? null ) ? $attributes['titleActiveBg'] : array();
	$tb_acc_cbg      = is_array( $attributes['contentBg'] ?? null ) ? $attributes['contentBg'] : array();

	DynamicCSS::add( $tb_acc_wrap, DynamicCSS::from_responsive( array( 'gap' => $attributes['itemGap'] ?? array() ) ) );
	DynamicCSS::add( $tb_acc_item_sel, DynamicCSS::from_responsive( DynamicCSS::border_map( $attributes['itemBorder'] ?? array() ) ) );
	DynamicCSS::add(
		$tb_acc_title,
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['titleTypography'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['titlePadding'] ?? array() ),
				array(
					'color'            => $tb_acc_color['normal'] ?? '',
					'background-color' => $tb_acc_bg['normal'] ?? '',
				)
			)
		)
	);
	DynamicCSS::add(
		$tb_acc_title . ':hover',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_acc_color['hover'] ?? '',
				'background-color' => $tb_acc_bg['hover'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_acc_title . '[aria-expanded="true"]',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_acc_active_c['normal'] ?? '',
				'background-color' => $tb_acc_active_b['normal'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_acc_title . ' .tb-accordion-item__icon',
		DynamicCSS::from_responsive(
			array(
				'font-size' => $attributes['iconSize'] ?? array(),
				'color'     => $tb_acc_icon_c['normal'] ?? '',
			)
		)
	);
	DynamicCSS::add(
		$tb_acc_title . ':hover .tb-accordion-item__icon',
		DynamicCSS::from_responsive( array( 'color' => $tb_acc_icon_c['hover'] ?? '' ) )
	);
	DynamicCSS::add(
		$tb_acc_item_sel . ' > .tb-accordion-item__panel > .tb-accordion-item__content',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::spacing_map( 'padding', $attributes['contentPadding'] ?? array() ),
				array( 'background-color' => $tb_acc_cbg['normal'] ?? '' )
			)
		)
	);
}

$tb_acc_attrs = array(
	'class'               => 'tb-accordion' . ( $tb_acc_id ? ' tb-block-' . $tb_acc_id : '' ),
	'data-tb-multiple'    => empty( $attributes['allowMultiple'] ) ? 'false' : 'true',
	'data-tb-collapsible' => ( $attributes['collapsible'] ?? true ) ? 'true' : 'false',
);
$tb_acc_wrapper = get_block_wrapper_attributes( $tb_acc_attrs );
?>
<div <?php echo $tb_acc_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php echo $tb_acc_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- rendered inner blocks. ?>
</div>
<?php
if ( $tb_acc_qa ) {
	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode(
			array(
				'@context'   => 'https://schema.org',
				'@type'      => 'FAQPage',
				'mainEntity' => $tb_acc_qa,
			),
			JSON_UNESCAPED_UNICODE | JSON_HEX_TAG
		)
	);
}
