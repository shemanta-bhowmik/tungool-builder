import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, Spinner, Notice } from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import './edit.scss';

export default function Edit({ attributes, setAttributes }) {

    const { postType, postToShow, displayImage, displayExcerpt } = attributes;

    const postTypes = useSelect( ( select ) => {
        return select( 'core' ).getPostTypes( { per_page: -1 } );
    } );

    const posts = useSelect( ( select ) => {
        return select( 'core' ).getEntityRecords( 'postType', postType, {
            per_page: postToShow,
            _embed: true
        } )
    }, [ postType, postToShow ] );

    const postTypeOptions = postTypes ?
        postTypes
            .filter( ( pt ) => pt.viewable && !['wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'media'].includes(pt.slug) )
            .map( ( pt ) => ( {
                label: pt.name,
                value: pt.slug
            } )
        ): [];
    
    return (
        <>
            <InspectorControls>
                <PanelBody title={__( 'Latest Posts Settings', 'tungool-builder' )}>
                    <SelectControl
                        label={__( 'Post Type', 'tungool-builder' )}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value) => setAttributes({ postType: value })}
                    />
                    <RangeControl
                        label={__( 'Number of Posts to Show', 'tungool-builder' )}
                        value={postToShow}
                        onChange={(value) => setAttributes({ postToShow: value })}
                        min={-1}
                        max={100}
                    />
                    <ToggleControl
                        label={__( 'Display Featured Image', 'tungool-builder' )}
                        checked={displayImage}
                        onChange={(value) => setAttributes({ displayImage: value })}
                    />
                    <ToggleControl
                        label={__( 'Display Excerpt', 'tungool-builder' )}
                        checked={displayExcerpt}
                        onChange={(value) => setAttributes({ displayExcerpt: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div
                {...useBlockProps()}
                className="tb-latest-posts"
            >
                {posts === undefined && <Spinner />}
                {posts && posts.length === 0 && <Notice status="error">{__( 'No posts found.', 'tungool-builder' )}</Notice>}
                {posts && posts.length > 0 && (
                    posts.map(( post) => {
                        return (
                            <div key={post.id} className="latest-post-item">
                                {displayImage && post._embedded?.['wp:featuredmedia']?.[0].source_url && (
                                    <div className="post-thumb">
                                        <img 
                                            src={post._embedded?.['wp:featuredmedia']?.[0].source_url} 
                                            alt={post.title.rendered}
                                            loading="lazy" 
                                        />
                                    </div>
                                )} 
                                <h2>{post.title.rendered}</h2>
                                {displayExcerpt && (
                                    <div 
                                        className="post-excerpt" 
                                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
                                    />
                                )}

                            </div>
                        )
                    })
                )}
            </div>
        </>
    );
}