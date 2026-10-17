<?php

namespace SB\TungoolBuilder\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitizes user-supplied SVG markup (pasted or uploaded in the editor).
 * Allowlist based: unknown elements/attributes, scripts, on* handlers and any
 * external reference (href / url() not pointing at a local #fragment) are removed.
 * Mirrors blocks/src/shared/utils/svg.js (used for the editor preview only).
 */
class Svg {

	const MAX_BYTES = 102400;

	const ELEMENTS = array(
		'svg',
		'g',
		'path',
		'circle',
		'ellipse',
		'line',
		'polyline',
		'polygon',
		'rect',
		'defs',
		'lineargradient',
		'radialgradient',
		'stop',
		'clippath',
		'mask',
		'symbol',
		'use',
		'title',
		'desc',
		'text',
		'tspan',
	);

	const ATTRIBUTES = array(
		'viewbox',
		'width',
		'height',
		'preserveaspectratio',
		'id',
		'class',
		'd',
		'x',
		'y',
		'x1',
		'y1',
		'x2',
		'y2',
		'cx',
		'cy',
		'r',
		'rx',
		'ry',
		'fx',
		'fy',
		'points',
		'transform',
		'fill',
		'fill-rule',
		'fill-opacity',
		'clip-rule',
		'clip-path',
		'mask',
		'stroke',
		'stroke-width',
		'stroke-linecap',
		'stroke-linejoin',
		'stroke-miterlimit',
		'stroke-dasharray',
		'stroke-dashoffset',
		'stroke-opacity',
		'opacity',
		'offset',
		'stop-color',
		'stop-opacity',
		'gradientunits',
		'gradienttransform',
		'spreadmethod',
		'clippathunits',
		'maskunits',
		'font-size',
		'font-family',
		'font-weight',
		'text-anchor',
		'href',
		'xlink:href',
	);

	/**
	 * @param string $raw        Untrusted SVG markup.
	 * @param string $class_name Class for the root <svg>.
	 * @return string Clean SVG (decorative: aria-hidden), or '' when invalid.
	 */
	public static function sanitize( $raw, $class_name = 'tb-icon' ) {
		if ( ! is_string( $raw ) || '' === trim( $raw ) || strlen( $raw ) > self::MAX_BYTES || ! class_exists( 'DOMDocument' ) ) {
			return '';
		}
		// No DTDs/entities (XXE, billion laughs).
		if ( preg_match( '/<!(DOCTYPE|ENTITY)/i', $raw ) ) {
			return '';
		}

		$dom      = new \DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$loaded   = $dom->loadXML( trim( $raw ), LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		$root = $loaded ? $dom->documentElement : null;
		if ( ! $root || 'svg' !== strtolower( $root->localName ) ) {
			return '';
		}

		self::clean_node( $root );

		// Size via CSS (1em); keep proportions with a viewBox.
		if ( ! $root->hasAttribute( 'viewBox' ) ) {
			$w = (float) $root->getAttribute( 'width' );
			$h = (float) $root->getAttribute( 'height' );
			if ( $w > 0 && $h > 0 ) {
				$root->setAttribute( 'viewBox', '0 0 ' . $w . ' ' . $h );
			}
		}
		$root->setAttribute( 'class', $class_name );
		$root->setAttribute( 'width', '1em' );
		$root->setAttribute( 'height', '1em' );
		$root->setAttribute( 'aria-hidden', 'true' );
		$root->setAttribute( 'focusable', 'false' );

		$out = $dom->saveXML( $root );
		return is_string( $out ) ? $out : '';
	}

	private static function clean_node( \DOMElement $el ) {
		// Iterate over a copy: removing while walking a live list skips nodes.
		foreach ( iterator_to_array( $el->childNodes ) as $child ) {
			if ( $child instanceof \DOMElement ) {
				if ( in_array( strtolower( $child->localName ), self::ELEMENTS, true ) ) {
					self::clean_node( $child );
				} else {
					$el->removeChild( $child );
				}
			} elseif ( ! ( $child instanceof \DOMText ) || $child instanceof \DOMCdataSection ) {
				$el->removeChild( $child ); // Comments, processing instructions, CDATA.
			}
		}

		foreach ( iterator_to_array( $el->attributes ) as $attr ) {
			$name  = strtolower( $attr->nodeName );
			$value = trim( (string) $attr->nodeValue );
			if ( ! in_array( $name, self::ATTRIBUTES, true ) || ! self::is_safe_value( $name, $value ) ) {
				$el->removeAttributeNode( $attr );
			}
		}
	}

	private static function is_safe_value( $name, $value ) {
		if ( preg_match( '/(javascript|data|vbscript)\s*:/i', $value ) ) {
			return false;
		}
		if ( 'href' === $name || 'xlink:href' === $name ) {
			return 1 === preg_match( '/^#[\w.-]+$/', $value );
		}
		// url() only to local fragments, e.g. fill="url(#grad)".
		if ( preg_match_all( '/url\s*\(\s*([\'"]?)(.*?)\1\s*\)/i', $value, $m ) ) {
			foreach ( $m[2] as $target ) {
				if ( '#' !== substr( trim( $target ), 0, 1 ) ) {
					return false;
				}
			}
		}
		return true;
	}
}
