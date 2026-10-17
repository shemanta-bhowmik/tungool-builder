<?php
/**
 * Runs when the plugin is deleted from the Plugins screen.
 *
 * @package TungoolBuilder
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Settings option (Phase 5).
delete_option( 'tungool_builder_settings' );
