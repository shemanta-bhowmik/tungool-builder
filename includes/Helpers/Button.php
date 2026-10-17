<?php

namespace SB\TungoolBuilder\Helpers;

use SB\TungoolBuilder\App\DynamicCSS;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared TB Button output for the button block and blocks that embed a button.
 * CSS mirrors blocks/src/shared/utils/button.js; the look is shared/styles/_button.scss.
 */
class Button {

	const PRESETS = array( 'primary', 'secondary', 'outline', 'text' );

	/**
	 * Same as buttonElementCSS() in button.js.
	 *
	 * @param string $el Selector of the .tb-button element.
	 * @param array  $b  Button style values (typography, padding, textColor, background, border, boxShadow, iconGap, iconSize, transitionDuration).
	 */
	public static function add_css( $el, array $b ) {
		$border = is_array( $b['border'] ?? null ) ? $b['border'] : array();
		$bg     = is_array( $b['background'] ?? null ) ? $b['background'] : array();
		$color  = is_array( $b['textColor'] ?? null ) ? $b['textColor'] : array();
		$dur    = $b['transitionDuration'] ?? '';

		DynamicCSS::add(
			$el,
			DynamicCSS::from_responsive(
				array_merge(
					DynamicCSS::typography_map( $b['typography'] ?? array() ),
					DynamicCSS::spacing_map( 'padding', $b['padding'] ?? array() ),
					array( 'color' => $color['normal'] ?? '' ),
					DynamicCSS::background_map( $bg ),
					DynamicCSS::border_map( $border ),
					array(
						'box-shadow'          => DynamicCSS::box_shadow_value( $b['boxShadow'] ?? array() ),
						'gap'                 => $b['iconGap'] ?? array(),
						'transition-duration' => ( is_numeric( $dur ) && $dur >= 0 ) ? (int) round( $dur ) . 'ms' : '',
					)
				)
			)
		);
		DynamicCSS::add(
			$el . ':hover,' . $el . ':focus-visible',
			DynamicCSS::from_responsive(
				array_merge(
					array( 'color' => $color['hover'] ?? '' ),
					DynamicCSS::background_hover_map( $bg ),
					array( 'border-color' => $border['hoverColor'] ?? '' )
				)
			)
		);
		DynamicCSS::add(
			$el . ' .tb-button__icon',
			DynamicCSS::from_responsive( array( 'font-size' => $b['iconSize'] ?? array() ) )
		);
	}

	/**
	 * Button element markup: <a> with a URL, otherwise (or when $as_span) a non-interactive <span>.
	 *
	 * @param array $b       { text, url, opensInNewTab, nofollow, preset, icon, iconPosition }.
	 * @param bool  $as_span Force a <span> (e.g. inside an element that is already a link).
	 * @return string Escaped HTML, '' when there is neither text nor icon.
	 */
	public static function markup( array $b, $as_span = false ) {
		$text = wp_kses( $b['text'] ?? '', array( 'strong' => array(), 'em' => array() ) );
		$icon = Icons::svg( $b['icon'] ?? '' );
		$has  = '' !== trim( wp_strip_all_tags( $text ) );
		if ( ! $has && '' === $icon ) {
			return '';
		}

		$preset = in_array( $b['preset'] ?? '', self::PRESETS, true ) ? $b['preset'] : 'primary';
		$url    = (string) ( $b['url'] ?? '' );
		$attrs  = ' class="tb-button tb-button--' . esc_attr( $preset ) . '"';
		$tag    = 'span';

		if ( ! $as_span && '' !== $url ) {
			$tag    = 'a';
			$attrs .= ' href="' . esc_url( $url ) . '"';
			$rel    = array();
			if ( ! empty( $b['opensInNewTab'] ) ) {
				$attrs .= ' target="_blank"';
				$rel[]  = 'noopener';
			}
			if ( ! empty( $b['nofollow'] ) ) {
				$rel[] = 'nofollow';
			}
			if ( $rel ) {
				$attrs .= ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"';
			}
		}

		$icon_html = $icon ? '<span class="tb-button__icon">' . $icon . '</span>' : '';
		$before    = 'before' === ( $b['iconPosition'] ?? 'after' );
		$text_html = $has ? '<span class="tb-button__text">' . $text . '</span>' : '';

		return '<' . $tag . $attrs . '>'
			. ( $before ? $icon_html : '' ) . $text_html . ( $before ? '' : $icon_html )
			. '</' . $tag . '>';
	}
}
