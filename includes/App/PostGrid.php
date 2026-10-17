<?php

namespace SB\TungoolBuilder\App;

use WP_Error;
use WP_Query;
use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TB Post Grid: query building, card markup and the "load more" REST endpoint.
 * blocks/src/post-grid/render.php and the REST route share this so both output
 * identical cards. Card markup must match blocks/src/post-grid/card.js.
 */
class PostGrid {

	const REST_NAMESPACE = 'tungool-builder/v1';
	const REST_ROUTE     = '/post-grid';
	const NONCE_ACTION   = 'tb_post_grid';
	const MAX_PER_PAGE   = 50;
	const PARTS          = array( 'image', 'title', 'meta', 'excerpt', 'readMore' );
	const ORDERBY        = array( 'date', 'modified', 'title', 'menu_order', 'comment_count', 'rand' );
	const TITLE_TAGS     = array( 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' );

	/**
	 * Attributes the endpoint needs to rebuild the query and the cards.
	 */
	const PAYLOAD_KEYS = array(
		'postType',
		'taxonomy',
		'terms',
		'includePosts',
		'excludePosts',
		'authors',
		'order',
		'orderBy',
		'offset',
		'perPage',
		'excludeCurrent',
		'sticky',
		'partsOrder',
		'showImage',
		'showTitle',
		'showMeta',
		'showExcerpt',
		'showReadMore',
		'imageSize',
		'lazyLoad',
		'titleTag',
		'metaDate',
		'metaAuthor',
		'metaTerms',
		'metaTaxonomy',
		'metaComments',
		'excerptLength',
		'readMoreText',
		'readMorePreset',
	);

	/**
	 * Nesting guard: generated excerpts run the_content, which could render this block again.
	 *
	 * @var int
	 */
	private static $depth = 0;

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_route' ) );
	}

	public function register_route() {
		register_rest_route(
			self::REST_NAMESPACE,
			self::REST_ROUTE,
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_load_more' ),
				'permission_callback' => array( $this, 'rest_permission' ),
				'args'                => array(
					'payload' => array(
						'type'     => 'string',
						'required' => true,
					),
					'sig'     => array(
						'type'     => 'string',
						'required' => true,
					),
					'page'    => array(
						'type'     => 'integer',
						'required' => true,
						'minimum'  => 1,
					),
					'nonce'   => array(
						'type'     => 'string',
						'required' => true,
					),
				),
			)
		);
	}

	/**
	 * Public endpoint (visitors load more posts); the nonce ties requests to a rendered page.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return true|WP_Error
	 */
	public function rest_permission( WP_REST_Request $request ) {
		if ( ! wp_verify_nonce( (string) $request->get_param( 'nonce' ), self::NONCE_ACTION ) ) {
			return new WP_Error( 'tb_invalid_nonce', __( 'This page has expired. Please reload it.', 'tungool-builder' ), array( 'status' => 403 ) );
		}
		return true;
	}

	/**
	 * @param WP_REST_Request $request Request.
	 * @return array|WP_Error
	 */
	public function rest_load_more( WP_REST_Request $request ) {
		$payload = (string) $request->get_param( 'payload' );
		if ( ! hash_equals( self::sign( $payload ), (string) $request->get_param( 'sig' ) ) ) {
			return new WP_Error( 'tb_invalid_signature', __( 'Invalid request.', 'tungool-builder' ), array( 'status' => 400 ) );
		}
		$data = json_decode( $payload, true );
		if ( ! is_array( $data ) || ! is_array( $data['a'] ?? null ) ) {
			return new WP_Error( 'tb_invalid_payload', __( 'Invalid request.', 'tungool-builder' ), array( 'status' => 400 ) );
		}

		$attributes = $data['a'];
		$page       = max( 1, (int) $request->get_param( 'page' ) );
		$query      = new WP_Query( self::query_args( $attributes, (int) ( $data['c'] ?? 0 ), $page, true ) );

		return array(
			'html'  => self::render_cards( $query, $attributes ),
			'count' => (int) $query->post_count,
			'pages' => self::total_pages( $query, $attributes ),
		);
	}

	/**
	 * @param string $payload JSON payload.
	 * @return string HMAC.
	 */
	public static function sign( $payload ) {
		return hash_hmac( 'sha256', (string) $payload, wp_salt( 'nonce' ) );
	}

	/**
	 * Signed JSON for the load-more button.
	 *
	 * @param array $attributes Block attributes.
	 * @param int   $current_id Post being viewed.
	 * @return string
	 */
	public static function payload( array $attributes, $current_id ) {
		return (string) wp_json_encode(
			array(
				'a' => array_intersect_key( $attributes, array_flip( self::PAYLOAD_KEYS ) ),
				'c' => (int) $current_id,
			)
		);
	}

	public static function per_page( array $a ) {
		return min( self::MAX_PER_PAGE, max( 1, (int) ( $a['perPage'] ?? 6 ) ) );
	}

	/**
	 * @param array $a          Block attributes.
	 * @param int   $current_id Post being viewed (for "exclude current post").
	 * @param int   $page       1-based page.
	 * @param bool  $count      Whether total rows are needed (pagination).
	 * @return array WP_Query args.
	 */
	public static function query_args( array $a, $current_id, $page = 1, $count = false ) {
		$post_type = sanitize_key( $a['postType'] ?? 'post' );
		if ( ! post_type_exists( $post_type ) || ! is_post_type_viewable( $post_type ) ) {
			$post_type = 'post';
		}
		$per_page = self::per_page( $a );
		$orderby  = in_array( $a['orderBy'] ?? '', self::ORDERBY, true ) ? $a['orderBy'] : 'date';
		$ids      = static function ( $value ) {
			return array_values( array_filter( array_map( 'absint', is_array( $value ) ? $value : array() ) ) );
		};

		$args = array(
			'post_type'           => $post_type,
			'post_status'         => 'publish',
			'posts_per_page'      => $per_page,
			// WP_Query ignores 'paged' when 'offset' is set, so page through the offset ourselves.
			'offset'              => max( 0, (int) ( $a['offset'] ?? 0 ) ) + ( max( 1, (int) $page ) - 1 ) * $per_page,
			'orderby'             => $orderby,
			'order'               => 'ASC' === strtoupper( (string) ( $a['order'] ?? 'DESC' ) ) ? 'ASC' : 'DESC',
			'ignore_sticky_posts' => true,
			'no_found_rows'       => ! $count,
		);

		$taxonomy = sanitize_key( $a['taxonomy'] ?? '' );
		$terms    = $ids( $a['terms'] ?? array() );
		if ( $taxonomy && $terms && is_object_in_taxonomy( $post_type, $taxonomy ) ) {
			$args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				array(
					'taxonomy' => $taxonomy,
					'field'    => 'term_id',
					'terms'    => $terms,
				),
			);
		}

		$authors = $ids( $a['authors'] ?? array() );
		if ( $authors ) {
			$args['author__in'] = $authors;
		}

		$include = $ids( $a['includePosts'] ?? array() );
		$exclude = $ids( $a['excludePosts'] ?? array() );
		if ( ! empty( $a['excludeCurrent'] ) && $current_id ) {
			$exclude[] = (int) $current_id;
		}

		$sticky_mode = $a['sticky'] ?? 'ignore';
		if ( 'post' === $post_type && in_array( $sticky_mode, array( 'exclude', 'only' ), true ) ) {
			$sticky = $ids( get_option( 'sticky_posts', array() ) );
			if ( 'exclude' === $sticky_mode ) {
				$exclude = array_merge( $exclude, $sticky );
			} else {
				$include = $include ? array_values( array_intersect( $include, $sticky ) ) : $sticky;
				if ( ! $include ) {
					$include = array( 0 ); // No sticky posts: match nothing.
				}
			}
		}

		// WP_Query drops post__not_in when post__in is set, so subtract here.
		if ( $include ) {
			$include          = array_values( array_diff( $include, $exclude ) );
			$args['post__in'] = $include ? $include : array( 0 );
		} elseif ( $exclude ) {
			$args['post__not_in'] = array_values( array_unique( $exclude ) ); // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in
		}

		return apply_filters( 'tb_post_grid_query_args', $args, $a );
	}

	/**
	 * Pages available after the block's base offset.
	 *
	 * @param WP_Query $query Query run with $count = true.
	 * @param array    $a     Block attributes.
	 * @return int
	 */
	public static function total_pages( WP_Query $query, array $a ) {
		$found = max( 0, (int) $query->found_posts - max( 0, (int) ( $a['offset'] ?? 0 ) ) );
		return (int) ceil( $found / self::per_page( $a ) );
	}

	/**
	 * Visible parts in display order. Mirrors visibleParts() in card.js.
	 *
	 * @param array $a Block attributes.
	 * @return string[]
	 */
	public static function parts( array $a ) {
		$order = is_array( $a['partsOrder'] ?? null ) ? array_values( array_intersect( $a['partsOrder'], self::PARTS ) ) : array();
		$order = array_values( array_unique( array_merge( $order, self::PARTS ) ) );
		return array_values(
			array_filter(
				$order,
				static function ( $part ) use ( $a ) {
					$defaults = array(
						'image'    => true,
						'title'    => true,
						'meta'     => true,
						'excerpt'  => true,
						'readMore' => false,
					);
					$key      = 'show' . ucfirst( $part );
					return array_key_exists( $key, $a ) ? ! empty( $a[ $key ] ) : $defaults[ $part ];
				}
			)
		);
	}

	/**
	 * @param WP_Query $query Query.
	 * @param array    $a     Block attributes.
	 * @return string Cards HTML.
	 */
	public static function render_cards( WP_Query $query, array $a ) {
		if ( self::$depth > 0 ) {
			return '';
		}
		++self::$depth;
		$html  = '';
		$parts = self::parts( $a );
		while ( $query->have_posts() ) {
			$query->the_post();
			$html .= self::render_card( get_the_ID(), $parts, $a );
		}
		wp_reset_postdata();
		--self::$depth;
		return $html;
	}

	/**
	 * One card, inside the loop. Same markup as card.js.
	 *
	 * @param int      $post_id Post ID.
	 * @param string[] $parts   Visible parts in order.
	 * @param array    $a       Block attributes.
	 * @return string
	 */
	private static function render_card( $post_id, array $parts, array $a ) {
		$link  = get_permalink( $post_id );
		$title = get_the_title( $post_id );
		$out   = '';

		foreach ( $parts as $part ) {
			switch ( $part ) {
				case 'image':
					if ( ! has_post_thumbnail( $post_id ) ) {
						break;
					}
					$size = sanitize_key( $a['imageSize'] ?? 'medium_large' );
					$img  = get_the_post_thumbnail(
						$post_id,
						$size ? $size : 'medium_large',
						array(
							'class'   => 'tb-post-grid__img',
							'loading' => ( $a['lazyLoad'] ?? true ) ? 'lazy' : false,
						)
					);
					// Decorative duplicate of the title link: hidden from AT and skipped by Tab.
					$out .= '<a class="tb-post-grid__media" href="' . esc_url( $link ) . '" tabindex="-1" aria-hidden="true">' . $img . '</a>';
					break;

				case 'title':
					$tag  = in_array( $a['titleTag'] ?? 'h3', self::TITLE_TAGS, true ) ? $a['titleTag'] : 'h3';
					$out .= sprintf(
						'<%1$s class="tb-post-grid__title"><a href="%2$s">%3$s</a></%1$s>',
						$tag,
						esc_url( $link ),
						'' !== $title ? esc_html( wp_strip_all_tags( $title ) ) : esc_html__( '(no title)', 'tungool-builder' )
					);
					break;

				case 'meta':
					$items = array();
					if ( $a['metaDate'] ?? true ) {
						$items[] = '<span class="tb-post-grid__meta-item tb-post-grid__date"><time datetime="' . esc_attr( get_the_date( 'c', $post_id ) ) . '">' . esc_html( get_the_date( '', $post_id ) ) . '</time></span>';
					}
					if ( $a['metaAuthor'] ?? true ) {
						$items[] = '<span class="tb-post-grid__meta-item tb-post-grid__author">' . esc_html( get_the_author_meta( 'display_name', (int) get_post_field( 'post_author', $post_id ) ) ) . '</span>';
					}
					if ( ! empty( $a['metaTerms'] ) ) {
						$taxonomy = sanitize_key( $a['metaTaxonomy'] ?? 'category' );
						$terms    = $taxonomy ? get_the_terms( $post_id, $taxonomy ) : false;
						if ( is_array( $terms ) && $terms ) {
							$items[] = '<span class="tb-post-grid__meta-item tb-post-grid__terms">' . esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) ) . '</span>';
						}
					}
					if ( ! empty( $a['metaComments'] ) ) {
						$count   = (int) get_comments_number( $post_id );
						/* translators: %s: number of comments. */
						$items[] = '<span class="tb-post-grid__meta-item tb-post-grid__comments">' . esc_html( sprintf( _n( '%s comment', '%s comments', $count, 'tungool-builder' ), number_format_i18n( $count ) ) ) . '</span>';
					}
					if ( $items ) {
						$out .= '<div class="tb-post-grid__meta">' . implode( '', $items ) . '</div>';
					}
					break;

				case 'excerpt':
					$length  = min( 200, max( 1, (int) ( $a['excerptLength'] ?? 20 ) ) );
					$excerpt = wp_trim_words( wp_strip_all_tags( get_the_excerpt( $post_id ) ), $length, '…' );
					if ( '' !== $excerpt ) {
						$out .= '<p class="tb-post-grid__excerpt">' . esc_html( $excerpt ) . '</p>';
					}
					break;

				case 'readMore':
					$text   = trim( (string) ( $a['readMoreText'] ?? '' ) );
					$text   = '' !== $text ? $text : __( 'Read more', 'tungool-builder' );
					$preset = in_array( $a['readMorePreset'] ?? '', array( 'primary', 'secondary', 'outline', 'text' ), true ) ? $a['readMorePreset'] : 'text';
					$out   .= sprintf(
						'<div class="tb-post-grid__more"><a class="tb-button tb-button--%1$s" href="%2$s"><span class="tb-button__text">%3$s</span><span class="tb-post-grid__sr">: %4$s</span></a></div>',
						esc_attr( $preset ),
						esc_url( $link ),
						esc_html( $text ),
						esc_html( wp_strip_all_tags( $title ) )
					);
					break;
			}
		}

		return '<article class="tb-post-grid__card">' . $out . '</article>';
	}
}
