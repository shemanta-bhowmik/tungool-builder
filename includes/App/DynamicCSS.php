<?php

namespace SB\TungoolBuilder\App;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Collects per-instance block CSS during render and prints it once per page
 * in <style id="tb-dynamic-css">. Output matches blocks/src/shared/utils/css.js.
 *
 * Usage in render.php:
 *   DynamicCSS::add( '.tb-block-' . $unique_id, DynamicCSS::from_responsive( array(
 *       'padding-top' => $attributes['padding'] ?? array(),
 *   ) ) );
 */
class DynamicCSS {

	const DEVICES = array( 'desktop', 'tablet', 'mobile' );

	/**
	 * Selector => CSS. Keyed so the same block rendered twice is printed once.
	 *
	 * @var array<string,string>
	 */
	private static $styles = array();

	/**
	 * @var bool
	 */
	private static $printed = false;

	public function __construct() {
		// Block themes render the template before wp_head, so styles are known by then.
		// Classic themes render content after wp_head, so print in the footer instead.
		add_action( 'wp_head', array( $this, 'maybe_print_head' ), 100 );
		add_action( 'wp_footer', array( __CLASS__, 'print_styles' ), 20 );
	}

	/**
	 * Breakpoints in px (max-width). Must match BREAKPOINTS in css.js.
	 *
	 * @return array{tablet:int,mobile:int}
	 */
	public static function breakpoints() {
		return apply_filters(
			'tb_breakpoints',
			array(
				'tablet' => 1024,
				'mobile' => 767,
			)
		);
	}

	/**
	 * @param string $selector e.g. '.tb-block-abc123'.
	 * @param array  $rules    array( 'desktop' => array( prop => value ), 'tablet' => ..., 'mobile' => ... ).
	 */
	public static function add( $selector, array $rules ) {
		$css = self::generate( $selector, $rules );
		if ( '' !== $css ) {
			self::$styles[ $selector ] = $css;
		}
	}

	/**
	 * Same as responsiveToRules() in css.js.
	 *
	 * @param array $map CSS property => value or array( desktop, tablet, mobile ).
	 * @return array Rules by device.
	 */
	public static function from_responsive( array $map ) {
		$rules = array_fill_keys( self::DEVICES, array() );
		foreach ( $map as $prop => $value ) {
			if ( is_array( $value ) ) {
				foreach ( self::DEVICES as $device ) {
					if ( isset( $value[ $device ] ) && ! self::is_empty( $value[ $device ] ) ) {
						$rules[ $device ][ $prop ] = $value[ $device ];
					}
				}
			} elseif ( ! self::is_empty( $value ) ) {
				$rules['desktop'][ $prop ] = $value;
			}
		}
		return $rules;
	}

	/**
	 * Same as spacingMap() in css.js.
	 *
	 * @param string $property 'padding' or 'margin'.
	 * @param mixed  $value    array( desktop => array( top, right, bottom, left ), tablet, mobile ).
	 * @return array
	 */
	public static function spacing_map( $property, $value ) {
		$value = is_array( $value ) ? $value : array();
		$map   = array();
		foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
			$sides = array();
			foreach ( self::DEVICES as $device ) {
				$sides[ $device ] = $value[ $device ][ $side ] ?? null;
			}
			$map[ $property . '-' . $side ] = $sides;
		}
		return $map;
	}

	/**
	 * Same as typographyMap() in css.js.
	 *
	 * @param mixed $t TypographyControl value.
	 * @return array
	 */
	public static function typography_map( $t ) {
		$t = is_array( $t ) ? $t : array();
		return array(
			'font-size'      => $t['fontSize'] ?? null,
			'line-height'    => $t['lineHeight'] ?? null,
			'letter-spacing' => $t['letterSpacing'] ?? null,
			'font-weight'    => $t['fontWeight'] ?? null,
			'text-transform' => $t['textTransform'] ?? null,
		);
	}

	/**
	 * Same as borderMap() in css.js.
	 *
	 * @param mixed $b BorderControl value.
	 * @return array
	 */
	public static function border_map( $b ) {
		$b     = is_array( $b ) ? $b : array();
		$style = $b['style'] ?? '';
		if ( self::is_empty( $style ) ) {
			$style = self::is_empty( $b['width'] ?? null ) ? '' : 'solid';
		}
		return array(
			'border-width'  => $b['width'] ?? null,
			'border-style'  => $style,
			'border-color'  => $b['color'] ?? null,
			'border-radius' => $b['radius'] ?? null,
		);
	}

	/**
	 * Same as boxShadowValue() in css.js.
	 *
	 * @param mixed $s BoxShadowControl value.
	 * @return string
	 */
	public static function box_shadow_value( $s ) {
		if ( ! is_array( $s ) || self::is_empty( $s['color'] ?? null ) ) {
			return '';
		}
		$n = static function ( $v ) {
			return (int) round( is_numeric( $v ) ? (float) $v : 0 ) . 'px';
		};
		return ( ! empty( $s['inset'] ) ? 'inset ' : '' )
			. $n( $s['x'] ?? 0 ) . ' ' . $n( $s['y'] ?? 0 ) . ' ' . $n( $s['blur'] ?? 0 ) . ' ' . $n( $s['spread'] ?? 0 ) . ' ' . $s['color'];
	}

	/**
	 * Same as gridColumnsMap() in css.js.
	 *
	 * @param mixed $value Responsive columns value.
	 * @return array
	 */
	public static function grid_columns_map( $value ) {
		$value = is_array( $value ) ? $value : array();
		$out   = array();
		foreach ( self::DEVICES as $device ) {
			$v = $value[ $device ] ?? null;
			if ( self::is_empty( $v ) ) {
				continue;
			}
			$v              = trim( (string) $v );
			$out[ $device ] = ( ctype_digit( $v ) && (int) $v > 0 ) ? 'repeat(' . (int) $v . ',minmax(0,1fr))' : $v;
		}
		return $out;
	}

	/**
	 * Same as backgroundMap() in css.js.
	 *
	 * @param mixed $bg BackgroundControl value.
	 * @return array
	 */
	public static function background_map( $bg ) {
		$bg        = is_array( $bg ) ? $bg : array();
		$url       = $bg['image']['url'] ?? '';
		$has_image = ! self::is_empty( $url );
		$pos       = $bg['position'] ?? null;
		$position  = '';
		if ( $has_image && is_array( $pos ) && ! self::is_empty( $pos['x'] ?? null ) && ! self::is_empty( $pos['y'] ?? null ) ) {
			$position = (int) round( (float) $pos['x'] * 100 ) . '% ' . (int) round( (float) $pos['y'] * 100 ) . '%';
		}
		return array(
			'background-color'      => $bg['color']['normal'] ?? null,
			'background-image'      => self::image_layers( $bg['gradient']['normal'] ?? '', $url ),
			'background-size'       => $has_image ? ( $bg['size'] ?? '' ) : '',
			'background-position'   => $position,
			'background-repeat'     => $has_image ? ( $bg['repeat'] ?? '' ) : '',
			'background-attachment' => $has_image ? ( $bg['attachment'] ?? '' ) : '',
		);
	}

	/**
	 * Same as backgroundHoverMap() in css.js.
	 *
	 * @param mixed $bg BackgroundControl value.
	 * @return array
	 */
	public static function background_hover_map( $bg ) {
		$bg             = is_array( $bg ) ? $bg : array();
		$hover_gradient = $bg['gradient']['hover'] ?? '';
		return array(
			'background-color' => $bg['color']['hover'] ?? null,
			'background-image' => self::is_empty( $hover_gradient ) ? '' : self::image_layers( $hover_gradient, $bg['image']['url'] ?? '' ),
		);
	}

	/**
	 * Same as overlayMap() in css.js.
	 *
	 * @param mixed $bg BackgroundControl value.
	 * @return array
	 */
	public static function overlay_map( $bg ) {
		$color = is_array( $bg ) ? ( $bg['overlay']['color'] ?? null ) : null;
		if ( self::is_empty( $color ) ) {
			return array();
		}
		$raw     = $bg['overlay']['opacity'] ?? null;
		$opacity = self::is_empty( $raw ) ? 50 : min( 100, max( 0, is_numeric( $raw ) ? (float) $raw : 0 ) );
		return array(
			'background-color' => $color,
			'opacity'          => (string) ( round( $opacity ) / 100 ),
		);
	}

	private static function image_layers( $gradient, $url ) {
		$layers = array();
		if ( ! self::is_empty( $gradient ) ) {
			$layers[] = $gradient;
		}
		if ( ! self::is_empty( $url ) ) {
			$layers[] = 'url("' . str_replace( '"', '%22', (string) $url ) . '")';
		}
		return implode( ',', $layers );
	}

	/**
	 * Same as widthMap() in css.js.
	 *
	 * @param mixed $mode   Responsive width mode.
	 * @param mixed $custom Responsive custom width.
	 * @return array
	 */
	public static function width_map( $mode, $custom ) {
		$mode   = is_array( $mode ) ? $mode : array();
		$custom = is_array( $custom ) ? $custom : array();
		$out    = array();
		foreach ( self::DEVICES as $device ) {
			$m = $mode[ $device ] ?? '';
			if ( 'full' === $m ) {
				$out[ $device ] = '100%';
			} elseif ( 'auto' === $m ) {
				$out[ $device ] = 'auto';
			} elseif ( 'custom' === $m && ! self::is_empty( $custom[ $device ] ?? null ) ) {
				$out[ $device ] = $custom[ $device ];
			}
		}
		return $out;
	}

	/**
	 * Same as generateCSS() in css.js.
	 *
	 * @param string $selector CSS selector.
	 * @param array  $rules    Rules by device.
	 * @return string
	 */
	public static function generate( $selector, array $rules ) {
		if ( '' === (string) $selector ) {
			return '';
		}
		$breakpoints = self::breakpoints();
		$css         = '';
		foreach ( self::DEVICES as $device ) {
			$body = self::declarations( $rules[ $device ] ?? array() );
			if ( '' === $body ) {
				continue;
			}
			$block = $selector . '{' . $body . '}';
			$css  .= 'desktop' === $device
				? $block
				: '@media (max-width:' . (int) $breakpoints[ $device ] . 'px){' . $block . '}';
		}
		return $css;
	}

	public function maybe_print_head() {
		if ( wp_is_block_theme() ) {
			self::print_styles();
		}
	}

	public static function print_styles() {
		if ( self::$printed || empty( self::$styles ) ) {
			return;
		}
		self::$printed = true;
		printf(
			'<style id="tb-dynamic-css">%s</style>' . "\n",
			wp_strip_all_tags( implode( '', self::$styles ) ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- values sanitized in declarations().
		);
	}

	private static function declarations( array $props ) {
		$out = '';
		foreach ( $props as $prop => $value ) {
			if ( ! preg_match( '/^-{0,2}[a-z][a-z0-9-]*$/', (string) $prop ) || self::is_empty( $value ) ) {
				continue;
			}
			$value = self::sanitize_value( $value );
			if ( '' !== $value ) {
				$out .= $prop . ':' . $value . ';';
			}
		}
		return $out;
	}

	private static function sanitize_value( $value ) {
		return trim( str_replace( array( '<', '>', '{', '}', ';' ), '', (string) $value ) );
	}

	private static function is_empty( $value ) {
		return null === $value || is_array( $value ) || '' === trim( (string) $value );
	}
}
