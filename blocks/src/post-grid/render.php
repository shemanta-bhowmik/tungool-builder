<?php
/**
 * TB Post Grid — frontend output. Query and cards come from App\PostGrid,
 * which the load-more REST endpoint also uses.
 *
 * @var array    $attributes Block attributes.
 * @var WP_Block $block      Block instance.
 */

use SB\TungoolBuilder\App\DynamicCSS;
use SB\TungoolBuilder\App\PostGrid;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tb_pg_id         = sanitize_key( $attributes['uniqueId'] ?? '' );
$tb_pg_pagination = in_array( $attributes['pagination'] ?? 'none', array( 'none', 'numbers', 'loadMore' ), true ) ? $attributes['pagination'] : 'none';
$tb_pg_list       = 'list' === ( $attributes['layout'] ?? 'grid' );
$tb_pg_hover      = in_array( $attributes['hoverEffect'] ?? '', array( 'lift', 'zoom' ), true ) ? $attributes['hoverEffect'] : '';
$tb_pg_current_id = isset( $block->context['postId'] ) ? (int) $block->context['postId'] : (int) get_queried_object_id();
if ( ! is_singular() && ! isset( $block->context['postId'] ) ) {
	$tb_pg_current_id = 0;
}

// Page-number pagination uses a per-block query var so several grids can page independently.
$tb_pg_var  = 'tb-pg-' . ( $tb_pg_id ? $tb_pg_id : 'x' );
$tb_pg_page = 'numbers' === $tb_pg_pagination && isset( $_GET[ $tb_pg_var ] ) ? max( 1, absint( wp_unslash( $_GET[ $tb_pg_var ] ) ) ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only paging.

$tb_pg_query = new WP_Query( PostGrid::query_args( $attributes, $tb_pg_current_id, $tb_pg_page, 'none' !== $tb_pg_pagination ) );
$tb_pg_pages = 'none' !== $tb_pg_pagination ? PostGrid::total_pages( $tb_pg_query, $attributes ) : 1;
$tb_pg_cards = PostGrid::render_cards( $tb_pg_query, $attributes );

if ( '' === $tb_pg_cards ) {
	return;
}

if ( $tb_pg_id ) {
	$tb_pg_wrap   = '.tb-post-grid.tb-block-' . $tb_pg_id;
	$tb_pg_card   = $tb_pg_wrap . ' .tb-post-grid__card';
	$tb_pg_ratio  = in_array( $attributes['imageRatio'] ?? '', array( '16/9', '4/3', '3/2', '1', '3/4', '2/3' ), true ) ? $attributes['imageRatio'] : '';
	$tb_pg_typo   = static function ( $selector, $typo_key, $color_key ) use ( $attributes ) {
		DynamicCSS::add(
			$selector,
			DynamicCSS::from_responsive(
				array_merge( DynamicCSS::typography_map( $attributes[ $typo_key ] ?? array() ), array( 'color' => $attributes[ $color_key ]['normal'] ?? '' ) )
			)
		);
	};
	$tb_pg_border = is_array( $attributes['cardBorder'] ?? null ) ? $attributes['cardBorder'] : array();

	// Same selectors and order as blocks/src/post-grid/styles.js.
	DynamicCSS::add(
		$tb_pg_wrap . ' .tb-post-grid__items',
		DynamicCSS::from_responsive(
			array(
				'grid-template-columns' => $tb_pg_list ? array() : DynamicCSS::grid_columns_map( $attributes['columns'] ?? array() ),
				'gap'                   => $attributes['gap'] ?? array(),
			)
		)
	);
	DynamicCSS::add(
		$tb_pg_card,
		DynamicCSS::from_responsive(
			array_merge(
				array( 'background-color' => $attributes['cardBackground']['normal'] ?? '' ),
				DynamicCSS::border_map( $tb_pg_border ),
				DynamicCSS::spacing_map( 'padding', $attributes['cardPadding'] ?? array() ),
				array( 'box-shadow' => DynamicCSS::box_shadow_value( $attributes['cardShadow'] ?? array() ) )
			)
		)
	);
	DynamicCSS::add(
		$tb_pg_card . ':hover',
		DynamicCSS::from_responsive(
			array(
				'background-color' => $attributes['cardBackground']['hover'] ?? '',
				'border-color'     => $tb_pg_border['hoverColor'] ?? '',
				'box-shadow'       => DynamicCSS::box_shadow_value( $attributes['cardHoverShadow'] ?? array() ),
			)
		)
	);
	DynamicCSS::add(
		$tb_pg_wrap . ' .tb-post-grid__img',
		DynamicCSS::from_responsive(
			array(
				'aspect-ratio'  => $tb_pg_ratio,
				'border-radius' => $attributes['imageRadius'] ?? array(),
			)
		)
	);
	$tb_pg_typo( $tb_pg_wrap . ' .tb-post-grid__title', 'titleTypography', 'titleColor' );
	DynamicCSS::add( $tb_pg_wrap . ' .tb-post-grid__title a:hover', DynamicCSS::from_responsive( array( 'color' => $attributes['titleColor']['hover'] ?? '' ) ) );
	$tb_pg_typo( $tb_pg_wrap . ' .tb-post-grid__meta', 'metaTypography', 'metaColor' );
	$tb_pg_typo( $tb_pg_wrap . ' .tb-post-grid__excerpt', 'excerptTypography', 'excerptColor' );
	DynamicCSS::add( $tb_pg_wrap . ' .tb-post-grid__more .tb-button', DynamicCSS::from_responsive( array( 'color' => $attributes['readMoreColor']['normal'] ?? '' ) ) );
	DynamicCSS::add(
		$tb_pg_wrap . ' .tb-post-grid__more .tb-button:hover,' . $tb_pg_wrap . ' .tb-post-grid__more .tb-button:focus-visible',
		DynamicCSS::from_responsive( array( 'color' => $attributes['readMoreColor']['hover'] ?? '' ) )
	);
}

// Same as classNames() in classes.js.
$tb_pg_classes = 'tb-post-grid tb-post-grid--' . ( $tb_pg_list ? 'list' : 'grid' )
	. ( ! empty( $attributes['equalHeight'] ) ? ' tb-post-grid--equal' : '' )
	. ( $tb_pg_hover ? ' tb-post-grid--hover-' . $tb_pg_hover : '' )
	. ( $tb_pg_id ? ' tb-block-' . $tb_pg_id : '' );

$tb_pg_extra = array( 'class' => $tb_pg_classes );
if ( 'loadMore' === $tb_pg_pagination && $tb_pg_pages > 1 ) {
	$tb_pg_payload                   = PostGrid::payload( $attributes, $tb_pg_current_id );
	$tb_pg_extra['data-tb-post-grid'] = wp_json_encode(
		array(
			'endpoint'  => rest_url( PostGrid::REST_NAMESPACE . PostGrid::REST_ROUTE ),
			'restNonce' => wp_create_nonce( 'wp_rest' ),
			'nonce'     => wp_create_nonce( PostGrid::NONCE_ACTION ),
			'payload'   => $tb_pg_payload,
			'sig'       => PostGrid::sign( $tb_pg_payload ),
			'page'      => 1,
			'pages'     => $tb_pg_pages,
			/* translators: %d: number of posts loaded. */
			'loaded'    => __( '%d more posts loaded.', 'tungool-builder' ),
			'error'     => __( 'Could not load more posts. Please try again.', 'tungool-builder' ),
		)
	);
	wp_enqueue_script( generate_block_asset_handle( 'tungool-builder/post-grid', 'viewScript' ) );
}

$tb_pg_wrapper = get_block_wrapper_attributes( $tb_pg_extra );
?>
<div <?php echo $tb_pg_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="tb-post-grid__items">
		<?php echo $tb_pg_cards; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in PostGrid::render_card(). ?>
	</div>
	<?php if ( 'numbers' === $tb_pg_pagination && $tb_pg_pages > 1 ) : ?>
		<nav class="tb-post-grid__pagination" aria-label="<?php esc_attr_e( 'Posts pagination', 'tungool-builder' ); ?>">
			<?php
			echo paginate_links( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core escapes links.
				array(
					'base'      => esc_url_raw( add_query_arg( $tb_pg_var, '%#%' ) ),
					'format'    => '',
					'current'   => $tb_pg_page,
					'total'     => $tb_pg_pages,
					'prev_text' => __( '« Previous', 'tungool-builder' ),
					'next_text' => __( 'Next »', 'tungool-builder' ),
				)
			);
			?>
		</nav>
	<?php elseif ( 'loadMore' === $tb_pg_pagination && $tb_pg_pages > 1 ) : ?>
		<div class="tb-post-grid__loadmore">
			<button type="button" class="tb-button tb-button--outline tb-post-grid__loadmore-btn">
				<span class="tb-button__text"><?php echo esc_html( '' !== trim( (string) ( $attributes['loadMoreText'] ?? '' ) ) ? $attributes['loadMoreText'] : __( 'Load more', 'tungool-builder' ) ); ?></span>
			</button>
		</div>
		<div class="tb-post-grid__sr tb-post-grid__status" aria-live="polite"></div>
	<?php endif; ?>
</div>
