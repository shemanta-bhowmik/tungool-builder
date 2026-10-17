<?php

namespace SB\TungoolBuilder\App\Traits;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

trait Singleton {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}
