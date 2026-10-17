import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Spinner, Notice } from '@wordpress/components';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import postGridCSS from './styles';
import Card, { visibleParts } from './card';
import { classNames } from './classes';
import './edit.scss';

// REST orderby values; comment_count and rand have no REST equivalent and preview as date.
const REST_ORDERBY = { date: 'date', modified: 'modified', title: 'title', menu_order: 'menu_order' };

export default function Edit( props ) {
	const { attributes: a, setAttributes, clientId } = props;
	useUniqueId( { attributes: a, setAttributes, clientId } );

	const posts = useSelect(
		( select ) => {
			const core = select( coreStore );
			const editor = select( 'core/editor' );
			const tax = a.taxonomy ? core.getTaxonomy( a.taxonomy ) : null;
			const id = editor?.getCurrentPostId?.();
			const perPage = Math.min( 50, Math.max( 1, a.perPage || 6 ) );

			let include = [ ...( a.includePosts || [] ) ];
			const exclude = [ ...( a.excludePosts || [] ) ];
			if ( a.excludeCurrent && id && Number.isInteger( id ) ) {
				exclude.push( id );
			}
			const query = {
				per_page: perPage,
				offset: Math.max( 0, a.offset || 0 ),
				order: a.order === 'asc' ? 'asc' : 'desc',
				orderby: REST_ORDERBY[ a.orderBy ] || 'date',
				status: 'publish',
				_embed: 'wp:featuredmedia,author,wp:term,replies',
			};
			if ( a.postType === 'post' && a.sticky === 'exclude' ) {
				query.sticky = false;
			}
			if ( a.postType === 'post' && a.sticky === 'only' ) {
				query.sticky = true;
			}
			if ( a.authors?.length ) {
				query.author = a.authors;
			}
			if ( tax?.rest_base && a.terms?.length ) {
				query[ tax.rest_base ] = a.terms;
			}
			// Same subtraction as PostGrid::query_args().
			if ( include.length ) {
				include = include.filter( ( pid ) => ! exclude.includes( pid ) );
				query.include = include.length ? include : [ 0 ];
			} else if ( exclude.length ) {
				query.exclude = exclude;
			}
			return core.getEntityRecords( 'postType', a.postType || 'post', query );
		},
		[
			a.postType,
			a.taxonomy,
			a.terms,
			a.includePosts,
			a.excludePosts,
			a.authors,
			a.order,
			a.orderBy,
			a.offset,
			a.perPage,
			a.excludeCurrent,
			a.sticky,
		]
	);

	const blockProps = useBlockProps( { className: classNames( a ) } );
	const css = postGridCSS( a );
	const parts = visibleParts( a );

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ posts === null || posts === undefined ? (
					<Spinner />
				) : posts.length === 0 ? (
					<Notice status="info" isDismissible={ false }>
						{ __( 'No posts match this query.', 'tungool-builder' ) }
					</Notice>
				) : (
					<div className="tb-post-grid__items">
						{ posts.map( ( post ) => (
							<Card key={ post.id } post={ post } attributes={ a } parts={ parts } />
						) ) }
					</div>
				) }
				{ a.pagination === 'numbers' && (
					<nav className="tb-post-grid__pagination" aria-hidden="true">
						<span className="page-numbers current">1</span>
						<span className="page-numbers">2</span>
						<span className="page-numbers">3</span>
					</nav>
				) }
				{ a.pagination === 'loadMore' && (
					<div className="tb-post-grid__loadmore">
						<span className="tb-button tb-button--outline">{ a.loadMoreText || __( 'Load more', 'tungool-builder' ) }</span>
					</div>
				) }
			</div>
		</>
	);
}
