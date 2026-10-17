<?php

namespace SB\TungoolBuilder\App;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BlockCategory {

	public function __construct() {
		add_filter( 'block_categories_all', array( $this, 'register_category' ) );
	}

	public function register_category( $categories ) {
		array_unshift(
			$categories,
			array(
				'slug'  => 'tungool-builder',
				'title' => __( 'Tungool Blocks', 'tungool-builder' ),
				'icon'  => null,
			)
		);
		return $categories;
	}
}
