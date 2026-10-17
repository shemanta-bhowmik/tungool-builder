<?php

$content = sanitize_text_field( $attributes['content'] ?? '' );
$lavel = sanitize_text_field( $attributes['level'] ?? '2' );
$align = sanitize_text_field( $attributes['align'] ?? 'left' );

$tagname = 'h' . $lavel;

echo sprintf(
    '<%1$s class="tb-heading tb-heading-%2$s tb-heading-align-%3$s">%4$s</%1$s>',
    esc_html( $tagname ),
    esc_html( $lavel ),
    esc_html( $align ),
    esc_html( $content )
);