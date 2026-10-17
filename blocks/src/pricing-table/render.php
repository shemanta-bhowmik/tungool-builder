<?php
/**
 * TB Pricing Table — frontend output.
 *
 * @var array $attributes Block attributes.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\Helpers\Button;
use SB\TungoolBuilder\Helpers\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_pt_kses     = array(
	'strong' => array(),
	'em'     => array(),
);
$tb_pt_id       = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_pt_featured = ! empty( $attributes['featured'] );
$tb_pt_title    = wp_kses( $attributes['title'] ?? '', $tb_pt_kses );
$tb_pt_subtitle = wp_kses( $attributes['subtitle'] ?? '', $tb_pt_kses );
$tb_pt_footnote = wp_kses( $attributes['footnote'] ?? '', $tb_pt_kses );
$tb_pt_badge    = trim( (string) ( $attributes['badge'] ?? '' ) );
$tb_pt_ribbon   = 'ribbon' === ( $attributes['badgeStyle'] ?? 'badge' );
$tb_pt_currency = (string) ( $attributes['currency'] ?? '' );
$tb_pt_after    = 'after' === ( $attributes['currencyPosition'] ?? 'before' );
$tb_pt_amount   = (string) ( $attributes['amount'] ?? '' );
$tb_pt_decimals = (string) ( $attributes['priceDecimals'] ?? '' );
$tb_pt_period   = (string) ( $attributes['period'] ?? '' );
$tb_pt_original = (string) ( $attributes['originalPrice'] ?? '' );
$tb_pt_features = is_array( $attributes['features'] ?? null ) ? $attributes['features'] : array();
$tb_pt_button   = is_array( $attributes['button'] ?? null ) ? $attributes['button'] : array();
$tb_pt_inc_icon = Icons::svg( $attributes['includedIcon'] ?? 'check' );
$tb_pt_exc_icon = Icons::svg( $attributes['excludedIcon'] ?? 'close' );
$tb_pt_has      = static function ( $html ) {
	return '' !== trim( wp_strip_all_tags( $html ) );
};

if ( $tb_pt_id ) {
	$tb_pt_wrap  = '.tb-pricing.tb-block-' . $tb_pt_id;
	$tb_pt_btn   = $tb_pt_wrap . ' .tb-pricing__action > .tb-button';
	$tb_pt_scale = $attributes['featuredScale'] ?? 1.05;
	$tb_pt_color = static function ( $key ) use ( $attributes ) {
		return $attributes[ $key ]['normal'] ?? '';
	};
	$tb_pt_part  = static function ( $cls, $typo_key, $color_key ) use ( $attributes, $tb_pt_wrap, $tb_pt_color ) {
		DynamicCSS::add(
			$tb_pt_wrap . ' ' . $cls,
			DynamicCSS::from_responsive(
				array_merge( DynamicCSS::typography_map( $attributes[ $typo_key ] ?? array() ), array( 'color' => $tb_pt_color( $color_key ) ) )
			)
		);
	};

	// Same selectors and order as blocks/src/pricing-table/styles.js.
	DynamicCSS::add(
		$tb_pt_wrap,
		DynamicCSS::from_responsive(
			array_merge(
				array(
					'text-align'       => $attributes['align'] ?? array(),
					'background-color' => $tb_pt_color( 'cardBackground' ),
				),
				DynamicCSS::border_map( $attributes['cardBorder'] ?? array() ),
				DynamicCSS::spacing_map( 'padding', $attributes['cardPadding'] ?? array() ),
				array( 'box-shadow' => DynamicCSS::box_shadow_value( $attributes['cardShadow'] ?? array() ) )
			)
		)
	);
	DynamicCSS::add(
		$tb_pt_wrap . '.tb-pricing--featured',
		DynamicCSS::from_responsive(
			array(
				'border-color'      => $tb_pt_color( 'featuredBorderColor' ),
				'box-shadow'        => DynamicCSS::box_shadow_value( $attributes['featuredShadow'] ?? array() ),
				'--tb-pricing-scale' => ( is_numeric( $tb_pt_scale ) && $tb_pt_scale > 0 ) ? (string) ( 0 + $tb_pt_scale ) : '',
			)
		)
	);
	DynamicCSS::add(
		$tb_pt_wrap . ' .tb-pricing__badge',
		DynamicCSS::from_responsive(
			array(
				'color'            => $tb_pt_color( 'badgeColor' ),
				'background-color' => $tb_pt_color( 'badgeBackground' ),
			)
		)
	);
	$tb_pt_part( '.tb-pricing__title', 'titleTypography', 'titleColor' );
	$tb_pt_part( '.tb-pricing__subtitle', 'subtitleTypography', 'subtitleColor' );
	$tb_pt_part( '.tb-pricing__amount-wrap', 'priceTypography', 'priceColor' );
	$tb_pt_part( '.tb-pricing__period', 'periodTypography', 'periodColor' );
	DynamicCSS::add( $tb_pt_wrap . ' .tb-pricing__original', DynamicCSS::from_responsive( array( 'color' => $tb_pt_color( 'originalColor' ) ) ) );
	DynamicCSS::add(
		$tb_pt_wrap . ' .tb-pricing__features',
		DynamicCSS::from_responsive(
			array_merge(
				DynamicCSS::typography_map( $attributes['featureTypography'] ?? array() ),
				array(
					'color' => $tb_pt_color( 'featureColor' ),
					'gap'   => $attributes['featureGap'] ?? array(),
				)
			)
		)
	);
	DynamicCSS::add( $tb_pt_wrap . ' .tb-pricing__feature--included .tb-pricing__feature-icon', DynamicCSS::from_responsive( array( 'color' => $tb_pt_color( 'includedColor' ) ) ) );
	DynamicCSS::add( $tb_pt_wrap . ' .tb-pricing__feature--excluded .tb-pricing__feature-icon', DynamicCSS::from_responsive( array( 'color' => $tb_pt_color( 'excludedColor' ) ) ) );
	Button::add_css( $tb_pt_btn, $tb_pt_button );
	$tb_pt_part( '.tb-pricing__footnote', 'footnoteTypography', 'footnoteColor' );
}

$tb_pt_wrapper = get_block_wrapper_attributes(
	array( 'class' => 'tb-pricing' . ( $tb_pt_featured ? ' tb-pricing--featured' : '' ) . ( $tb_pt_id ? ' tb-block-' . $tb_pt_id : '' ) )
);

$tb_pt_button_html   = Button::markup( $tb_pt_button );
$tb_pt_currency_html = '' !== $tb_pt_currency ? '<span class="tb-pricing__currency">' . esc_html( $tb_pt_currency ) . '</span>' : '';
?>
<div <?php echo $tb_pt_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<?php if ( '' !== $tb_pt_badge ) : ?>
		<span class="tb-pricing__badge tb-pricing__badge--<?php echo $tb_pt_ribbon ? 'ribbon' : 'badge'; ?>"><?php echo esc_html( $tb_pt_badge ); ?></span>
	<?php endif; ?>
	<?php if ( $tb_pt_has( $tb_pt_title ) || $tb_pt_has( $tb_pt_subtitle ) ) : ?>
		<div class="tb-pricing__header">
			<?php if ( $tb_pt_has( $tb_pt_title ) ) : ?>
				<h3 class="tb-pricing__title"><?php echo $tb_pt_title; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?></h3>
			<?php endif; ?>
			<?php if ( $tb_pt_has( $tb_pt_subtitle ) ) : ?>
				<p class="tb-pricing__subtitle"><?php echo $tb_pt_subtitle; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?></p>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	<?php if ( '' !== $tb_pt_amount ) : ?>
		<div class="tb-pricing__price">
			<?php if ( '' !== $tb_pt_original ) : ?>
				<del class="tb-pricing__original"><span class="tb-pricing__sr"><?php esc_html_e( 'Original price:', 'tungool-builder' ); ?> </span><?php echo esc_html( $tb_pt_original ); ?></del>
				<span class="tb-pricing__sr"><?php esc_html_e( 'Current price:', 'tungool-builder' ); ?></span>
			<?php endif; ?>
			<span class="tb-pricing__amount-wrap">
				<?php echo $tb_pt_after ? '' : $tb_pt_currency_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>
				<span class="tb-pricing__amount"><?php echo esc_html( $tb_pt_amount ); ?></span>
				<?php if ( '' !== $tb_pt_decimals ) : ?>
					<span class="tb-pricing__decimals"><span class="tb-pricing__sr">.</span><?php echo esc_html( $tb_pt_decimals ); ?></span>
				<?php endif; ?>
				<?php echo $tb_pt_after ? $tb_pt_currency_html : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>
			</span>
			<?php if ( '' !== $tb_pt_period ) : ?>
				<span class="tb-pricing__period"><?php echo esc_html( $tb_pt_period ); ?></span>
			<?php endif; ?>
		</div>
	<?php endif; ?>
	<?php if ( $tb_pt_features ) : ?>
		<ul class="tb-pricing__features">
			<?php
			foreach ( $tb_pt_features as $tb_pt_feature ) :
				if ( ! is_array( $tb_pt_feature ) ) {
					continue;
				}
				$tb_pt_included = ! empty( $tb_pt_feature['included'] );
				$tb_pt_text     = wp_kses( $tb_pt_feature['text'] ?? '', $tb_pt_kses );
				$tb_pt_tooltip  = trim( (string) ( $tb_pt_feature['tooltip'] ?? '' ) );
				if ( ! $tb_pt_has( $tb_pt_text ) ) {
					continue;
				}
				?>
				<li class="tb-pricing__feature tb-pricing__feature--<?php echo $tb_pt_included ? 'included' : 'excluded'; ?>">
					<span class="tb-pricing__feature-icon"><?php echo $tb_pt_included ? $tb_pt_inc_icon : $tb_pt_exc_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg(). ?></span>
					<span class="tb-pricing__feature-text">
						<span class="tb-pricing__sr"><?php echo $tb_pt_included ? esc_html__( 'Included:', 'tungool-builder' ) : esc_html__( 'Not included:', 'tungool-builder' ); ?> </span>
						<?php echo $tb_pt_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?>
					</span>
					<?php if ( '' !== $tb_pt_tooltip ) : ?>
						<span class="tb-pricing__tip" tabindex="0">
							<?php echo Icons::svg( 'info' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG built with esc_attr in Icons::svg(). ?>
							<span class="tb-pricing__tip-text" role="tooltip"><?php echo esc_html( $tb_pt_tooltip ); ?></span>
						</span>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
	<?php if ( '' !== $tb_pt_button_html ) : ?>
		<div class="tb-pricing__action tb-button-wrap"><?php echo $tb_pt_button_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in Button::markup(). ?></div>
	<?php endif; ?>
	<?php if ( $tb_pt_has( $tb_pt_footnote ) ) : ?>
		<p class="tb-pricing__footnote"><?php echo $tb_pt_footnote; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses above. ?></p>
	<?php endif; ?>
</div>
