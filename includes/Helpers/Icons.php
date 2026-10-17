<?php

namespace SB\TungoolBuilder\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Icon library shared with the editor (assets/icons/icons.json).
 */
class Icons {

	/**
	 * @var array|null
	 */
	private static $library = null;

	public static function library() {
		if ( null === self::$library ) {
			$file          = TB_PATH . 'assets/icons/icons.json';
			$data          = is_readable( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file.
			self::$library = is_array( $data ) ? $data : array();
		}
		return self::$library;
	}

	/**
	 * Same markup as blocks/src/shared/icons/Icon.js. Decorative (aria-hidden).
	 *
	 * @param string $name       Icon key.
	 * @param string $class_name CSS class.
	 * @return string SVG markup, empty for unknown names.
	 */
	public static function svg( $name, $class_name = 'tb-icon' ) {
		$library = self::library();
		if ( ! is_string( $name ) || empty( $library[ $name ]['path'] ) ) {
			return '';
		}
		return sprintf(
			'<svg class="%1$s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false"><path fill="currentColor" d="%2$s"></path></svg>',
			esc_attr( $class_name ),
			esc_attr( $library[ $name ]['path'] )
		);
	}
}
