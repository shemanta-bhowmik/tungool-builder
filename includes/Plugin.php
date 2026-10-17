<?php

namespace SB\TungoolBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {
	use App\Traits\Singleton;

	public function init() {
		$this->define_constants();
		add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
	}

	public function define_constants() {
		define( 'TB_VERSION', defined( 'TB_DEV' ) && TB_DEV ? (string) time() : '1.0.0' );
		define( 'TB_FILE', dirname( __DIR__ ) . '/tungool-builder.php' );
		define( 'TB_PATH', plugin_dir_path( TB_FILE ) );
		define( 'TB_URL', plugin_dir_url( TB_FILE ) );
	}

	public function init_plugin() {
		$this->includes();
		$this->init_hooks();
	}

	public function includes() {
		new App\BlockCategory();
		new App\BlockHandler();
		new App\Assets();
		new App\DynamicCSS();
		new App\PostGrid();
	}

	public function init_hooks() {
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	public function load_textdomain() {
		load_plugin_textdomain( 'tungool-builder', false, dirname( plugin_basename( TB_FILE ) ) . '/languages' );
	}
}
