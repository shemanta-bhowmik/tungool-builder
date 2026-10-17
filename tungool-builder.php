<?php
/**
 * Tungool Builder
 *
 * @package           TungoolBuilder
 * @author            Shemanta Bhowmik
 * @copyright         2026 Shemanta Bhowmik
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Tungool Builder
 * Description:       A bundle of dynamic Gutenberg blocks for building pages: layout, content and interactive blocks with responsive controls.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Shemanta Bhowmik
 * Text Domain:       tungool-builder
 * Domain Path:       /languages
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

namespace SB\TungoolBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( Plugin::class ) && is_readable( plugin_dir_path( __FILE__ ) . 'vendor/autoload.php' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
}

class_exists( Plugin::class ) && Plugin::instance()->init();
