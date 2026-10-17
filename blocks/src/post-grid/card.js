import { __, _n, sprintf } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

export const PARTS = [ 'image', 'title', 'meta', 'excerpt', 'readMore' ];
const TITLE_TAGS = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ];
const PRESETS = [ 'primary', 'secondary', 'outline', 'text' ];

const stripTags = ( html = '' ) => {
	const doc = new window.DOMParser().parseFromString( html, 'text/html' );
	return ( doc.body.textContent || '' ).trim();
};

const trimWords = ( text, length ) => {
	const words = text.split( /\s+/ ).filter( Boolean );
	return words.length > length ? `${ words.slice( 0, length ).join( ' ' ) }…` : words.join( ' ' );
};

/**
 * Visible parts in display order. Mirrors PostGrid::parts().
 *
 * @param {Object} a Block attributes.
 * @return {string[]} Part keys.
 */
export function visibleParts( a ) {
	const order = [ ...new Set( [ ...( a.partsOrder || [] ).filter( ( p ) => PARTS.includes( p ) ), ...PARTS ] ) ];
	return order.filter( ( part ) => a[ `show${ part[ 0 ].toUpperCase() }${ part.slice( 1 ) }` ] );
}

/**
 * Editor card. Same markup as PostGrid::render_card() (links are inert in the editor).
 *
 * @param {Object} props
 * @param {Object} props.post       REST post with _embed.
 * @param {Object} props.attributes Block attributes.
 * @param {Array}  props.parts      visibleParts() result.
 */
export default function Card( { post, attributes: a, parts } ) {
	const title = stripTags( post.title?.rendered ) || __( '(no title)', 'tungool-builder' );
	const media = post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
	const imageUrl = media?.media_details?.sizes?.[ a.imageSize ]?.source_url || media?.source_url;
	const Tag = TITLE_TAGS.includes( a.titleTag ) ? a.titleTag : 'h3';
	const prevent = ( e ) => e.preventDefault();

	const render = ( part ) => {
		switch ( part ) {
			case 'image':
				return imageUrl ? (
					<a key={ part } className="tb-post-grid__media" href={ post.link } onClick={ prevent } tabIndex={ -1 } aria-hidden="true">
						<img className="tb-post-grid__img" src={ imageUrl } alt={ media?.alt_text || '' } />
					</a>
				) : null;
			case 'title':
				return (
					<Tag key={ part } className="tb-post-grid__title">
						<a href={ post.link } onClick={ prevent }>
							{ title }
						</a>
					</Tag>
				);
			case 'meta': {
				const items = [];
				if ( a.metaDate ) {
					items.push(
						<span key="date" className="tb-post-grid__meta-item tb-post-grid__date">
							<time dateTime={ post.date }>{ dateI18n( getSettings().formats.date, post.date ) }</time>
						</span>
					);
				}
				if ( a.metaAuthor && post._embedded?.author?.[ 0 ]?.name ) {
					items.push(
						<span key="author" className="tb-post-grid__meta-item tb-post-grid__author">
							{ post._embedded.author[ 0 ].name }
						</span>
					);
				}
				if ( a.metaTerms ) {
					const terms = ( post._embedded?.[ 'wp:term' ] || [] )
						.flat()
						.filter( ( t ) => t?.taxonomy === a.metaTaxonomy )
						.map( ( t ) => t.name );
					if ( terms.length ) {
						items.push(
							<span key="terms" className="tb-post-grid__meta-item tb-post-grid__terms">
								{ terms.join( ', ' ) }
							</span>
						);
					}
				}
				if ( a.metaComments ) {
					// The REST post object has no comment count; embedded replies are an editor-only approximation.
					const count = post._embedded?.replies?.[ 0 ]?.length || 0;
					items.push(
						<span key="comments" className="tb-post-grid__meta-item tb-post-grid__comments">
							{ sprintf(
								/* translators: %s: number of comments. */
								_n( '%s comment', '%s comments', count, 'tungool-builder' ),
								count
							) }
						</span>
					);
				}
				return items.length ? (
					<div key={ part } className="tb-post-grid__meta">
						{ items }
					</div>
				) : null;
			}
			case 'excerpt': {
				const text = trimWords( stripTags( post.excerpt?.rendered ), Math.min( 200, Math.max( 1, a.excerptLength || 20 ) ) );
				return text ? (
					<p key={ part } className="tb-post-grid__excerpt">
						{ text }
					</p>
				) : null;
			}
			case 'readMore':
				return (
					<div key={ part } className="tb-post-grid__more">
						<a
							className={ `tb-button tb-button--${ PRESETS.includes( a.readMorePreset ) ? a.readMorePreset : 'text' }` }
							href={ post.link }
							onClick={ prevent }
						>
							<span className="tb-button__text">{ a.readMoreText || __( 'Read more', 'tungool-builder' ) }</span>
						</a>
					</div>
				);
		}
		return null;
	};

	return <article className="tb-post-grid__card">{ parts.map( render ) }</article>;
}
