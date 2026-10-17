/**
 * Non-block assets (admin, shared). Blocks are built separately by
 * `wp-scripts --blocks-manifest` into blocks/build/.
 */
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		admin: path.resolve( __dirname, 'assets/src/admin/index.js' ),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'assets/build' ),
	},
};
