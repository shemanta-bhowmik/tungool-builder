<?php

namespace SB\TungoolBuilder\App;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BlockHandler {

	public function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
	}

	public function register_blocks() {
		$build_dir = TB_PATH . 'blocks/build';
		$manifest  = $build_dir . '/blocks-manifest.php';

		if ( ! is_readable( $manifest ) ) {
			add_action( 'admin_notices', array( $this, 'missing_manifest_notice' ) );
			return;
		}

		// WP 6.8+: register every block in the collection with one call.
		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection( $build_dir, $manifest );
			return;
		}

		// WP 6.7: register the collection so block.json reads come from the manifest.
		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			wp_register_block_metadata_collection( $build_dir, $manifest );
		}

		$manifest_data = require $manifest;
		foreach ( array_keys( $manifest_data ) as $block_name ) {
			register_block_type( $build_dir . '/' . $block_name );
		}
	}

	public function missing_manifest_notice() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}
		printf(
			'<div class="notice notice-error"><p>%s</p></div>',
			esc_html__( 'Tungool Builder: block build files are missing. Run "npm run build" in the plugin folder.', 'tungool-builder' )
		);
	}
}
