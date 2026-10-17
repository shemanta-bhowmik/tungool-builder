<?php

namespace SB\TungoolBuilder\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Small helpers shared by block render.php files.
 */
class Render {

	/**
	 * Build a class string from a list; falsy entries are dropped.
	 * Keyed entries ( 'class' => bool ) are included when the value is truthy.
	 *
	 * @param array $classes Class names.
	 * @return string Unescaped class string.
	 */
	public static function class_names( array $classes ) {
		$out = array();
		foreach ( $classes as $key => $value ) {
			if ( is_string( $key ) ) {
				if ( $value ) {
					$out[] = $key;
				}
			} elseif ( $value ) {
				$out[] = $value;
			}
		}
		return implode( ' ', array_unique( $out ) );
	}

	/**
	 * Instance class for a block's uniqueId, e.g. "tb-block-abc123".
	 *
	 * @param string $unique_id Block uniqueId attribute.
	 * @return string Empty string when no id.
	 */
	public static function instance_class( $unique_id ) {
		$unique_id = sanitize_key( (string) $unique_id );
		return $unique_id ? 'tb-block-' . $unique_id : '';
	}
}
