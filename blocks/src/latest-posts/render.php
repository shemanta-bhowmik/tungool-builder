<?php

    $postType = sanitize_text_field( $attributes['postType'] ?? 'post' );
    $postToShow = intval( $attributes['postToShow'] ?? 5 );
    $displayImage = rest_sanitize_boolean( $attributes['displayImage'] ?? true, FILTER_VALIDATE_BOOLEAN );
    $displayExcerpt = rest_sanitize_boolean( $attributes['displayExcerpt'] ?? true, FILTER_VALIDATE_BOOLEAN );

    $posts = new WP_Query( array(
        'post_type' => $postType,
        'posts_per_page' => $postToShow,
        'orderby' => 'date',
        'post_status' => 'publish',
        'order' => 'DESC',
    ) );

?>

<div <?php echo get_block_wrapper_attributes(['class' => 'tb-latest-posts']); ?> class="tb-latest-posts">
    <?php if ( $posts->have_posts() ) : ?>
        <?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
            <div class="latest-post-item">
                <?php if ( $displayImage && has_post_thumbnail() ) : ?>
                    <div class="post-thumb">
                        <?php the_post_thumbnail(); ?>
                    </div>
                <?php endif; ?>

                <a href="<?php the_permalink(); ?>">
                    <h3 class="post-title"><?php the_title(); ?></h3>
                </a>

                <?php if ( $displayExcerpt ) : ?>
                    <div class="post-excerpt">
                        <?php the_excerpt(); ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
</div>
    <?php else : ?>
        <p><?php esc_html_e( 'No posts found.', 'tungool-builder' ); ?></p>
    <?php endif;