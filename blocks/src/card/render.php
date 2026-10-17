<?php

$title              = sanitize_text_field( $attributes['title'] ?? '' );
$subtitle           = sanitize_text_field( $attributes['subtitle'] ?? '' );
$imageUrl           = sanitize_url( $attributes['imageUrl'] ?? '' );
$buttonText         = sanitize_post( $attributes['buttonText'] ?? '' );
$backgroundColor    = sanitize_text_field( $attributes['backgroundColor'] ?? '' );
$textColor          = sanitize_text_field( $attributes['textColor'] ?? '' );

?>

<div class="card-block">
    <img src="<?php echo esc_url( $imageUrl ); ?>" alt="<?php echo esc_attr( $title ); ?>" class="card-image" />
    <h2><?php echo esc_html( $title ); ?></h2>
    <p><?php echo esc_html( $subtitle ); ?></p>
    <div class="button-wrapper">
        <?php echo wp_kses_post( $buttonText ); ?>
    </div>
</div>

<style>
    .card-block {
        background-color: <?php echo esc_attr( $backgroundColor ); ?>;
        color: <?php echo esc_attr( $textColor ); ?>;
    }
</style>