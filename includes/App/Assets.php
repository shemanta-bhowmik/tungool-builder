<?php

namespace SB\TungoolBuilder\App;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers non-block assets built by webpack.assets.config.js into assets/build/.
 * Handles are only registered here; the feature that needs them enqueues them.
 */
class Assets {

	/**
	 * Entry names from webpack.assets.config.js.
	 *
	 * @var string[]
	 */
	private $entries = array( 'admin' );

	public function __construct() {
		add_action( 'init', array( $this, 'register_assets' ) );
	}

	public function register_assets() {
		foreach ( $this->entries as $entry ) {
			$asset_file = TB_PATH . 'assets/build/' . $entry . '.asset.php';
			if ( ! is_readable( $asset_file ) ) {
				continue;
			}

			$asset  = require $asset_file;
			$handle = 'tb-' . $entry;

			wp_register_script(
				$handle,
				TB_URL . 'assets/build/' . $entry . '.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);
			wp_set_script_translations( $handle, 'tungool-builder', TB_PATH . 'languages' );

			if ( file_exists( TB_PATH . 'assets/build/' . $entry . '.css' ) ) {
				wp_register_style(
					$handle,
					TB_URL . 'assets/build/' . $entry . '.css',
					array(),
					$asset['version']
				);
			}
		}
	}
}
