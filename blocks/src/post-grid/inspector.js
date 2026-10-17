import { __ } from '@wordpress/i18n';
import { InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	FormTokenField,
	Button,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ResponsiveControl,
	SpacingControl,
	TypographyControl,
	ColorControl,
	BorderControl,
	BoxShadowControl,
} from '../shared/controls';
import { UnitControl, NumberControl } from '../shared/controls/compat';
import { PARTS } from './card';

const opt = ( label, value ) => ( { label, value } );
const EXCLUDED_TYPES = [ 'attachment', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'wp_font_family', 'wp_font_face' ];
const UNITS = [ 'px', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) );

const parseIds = ( value ) =>
	[ ...new Set( String( value ).split( /[\s,]+/ ).map( ( v ) => parseInt( v, 10 ) ).filter( ( n ) => n > 0 ) ) ];

const partLabels = () => ( {
	image: __( 'Featured image', 'tungool-builder' ),
	title: __( 'Title', 'tungool-builder' ),
	meta: __( 'Meta', 'tungool-builder' ),
	excerpt: __( 'Excerpt', 'tungool-builder' ),
	readMore: __( 'Read more button', 'tungool-builder' ),
} );

const showKey = ( part ) => `show${ part[ 0 ].toUpperCase() }${ part.slice( 1 ) }`;

export default function Inspector( { attributes: a, setAttributes } ) {
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const labels = partLabels();

	const { postTypes, taxonomies, terms, authors, imageSizes } = useSelect(
		( select ) => {
			const core = select( coreStore );
			return {
				postTypes: core.getPostTypes( { per_page: -1 } ),
				taxonomies: core.getTaxonomies( { type: a.postType, per_page: -1 } ),
				terms: a.taxonomy ? core.getEntityRecords( 'taxonomy', a.taxonomy, { per_page: 100, hide_empty: false } ) : [],
				authors: core.getUsers( { who: 'authors', per_page: 100 } ),
				imageSizes: select( blockEditorStore ).getSettings()?.imageSizes || [],
			};
		},
		[ a.postType, a.taxonomy ]
	);

	const typeOptions = ( postTypes || [] )
		.filter( ( t ) => t.viewable && ! EXCLUDED_TYPES.includes( t.slug ) )
		.map( ( t ) => opt( t.name, t.slug ) );
	const taxOptions = ( taxonomies || [] ).filter( ( t ) => t.visibility?.publicly_queryable !== false );
	const termName = ( id ) => ( terms || [] ).find( ( t ) => t.id === id )?.name;
	const authorName = ( id ) => ( authors || [] ).find( ( u ) => u.id === id )?.name;

	const order = [ ...new Set( [ ...( a.partsOrder || [] ).filter( ( p ) => PARTS.includes( p ) ), ...PARTS ] ) ];
	const movePart = ( i, dir ) => {
		const next = [ ...order ];
		[ next[ i ], next[ i + dir ] ] = [ next[ i + dir ], next[ i ] ];
		setAttributes( { partsOrder: next } );
	};
	const typo = ( title, typoKey, colorKey, hover = false ) => (
		<PanelBody title={ title } initialOpen={ false }>
			<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ a[ colorKey ] } onChange={ set( colorKey ) } hover={ hover } />
			<TypographyControl value={ a[ typoKey ] } onChange={ set( typoKey ) } />
		</PanelBody>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Query', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Post type', 'tungool-builder' ) }
						value={ a.postType }
						options={ typeOptions.length ? typeOptions : [ opt( __( 'Posts', 'tungool-builder' ), 'post' ) ] }
						onChange={ ( postType ) => setAttributes( { postType, taxonomy: '', terms: [], includePosts: [], excludePosts: [] } ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Filter by taxonomy', 'tungool-builder' ) }
						value={ a.taxonomy }
						options={ [ opt( __( 'None', 'tungool-builder' ), '' ), ...taxOptions.map( ( t ) => opt( t.name, t.slug ) ) ] }
						onChange={ ( taxonomy ) => setAttributes( { taxonomy, terms: [] } ) }
						__nextHasNoMarginBottom
					/>
					{ a.taxonomy && (
						<FormTokenField
							label={ __( 'Terms', 'tungool-builder' ) }
							value={ ( a.terms || [] ).map( ( id ) => termName( id ) || String( id ) ) }
							suggestions={ ( terms || [] ).map( ( t ) => t.name ) }
							onChange={ ( tokens ) =>
								setAttributes( {
									terms: tokens
										.map( ( tok ) => ( terms || [] ).find( ( t ) => t.name === tok )?.id ?? parseInt( tok, 10 ) )
										.filter( ( n ) => n > 0 ),
								} )
							}
							__experimentalExpandOnFocus
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
					<FormTokenField
						label={ __( 'Authors', 'tungool-builder' ) }
						value={ ( a.authors || [] ).map( ( id ) => authorName( id ) || String( id ) ) }
						suggestions={ ( authors || [] ).map( ( u ) => u.name ) }
						onChange={ ( tokens ) =>
							setAttributes( {
								authors: tokens
									.map( ( tok ) => ( authors || [] ).find( ( u ) => u.name === tok )?.id ?? parseInt( tok, 10 ) )
									.filter( ( n ) => n > 0 ),
							} )
						}
						__experimentalExpandOnFocus
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Include only these post IDs', 'tungool-builder' ) }
						help={ __( 'Comma-separated, e.g. 12, 45. Leave empty for all.', 'tungool-builder' ) }
						value={ ( a.includePosts || [] ).join( ', ' ) }
						onChange={ ( v ) => setAttributes( { includePosts: parseIds( v ) } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Exclude post IDs', 'tungool-builder' ) }
						value={ ( a.excludePosts || [] ).join( ', ' ) }
						onChange={ ( v ) => setAttributes( { excludePosts: parseIds( v ) } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __( 'Exclude the current post', 'tungool-builder' ) }
						checked={ a.excludeCurrent }
						onChange={ set( 'excludeCurrent' ) }
						__nextHasNoMarginBottom
					/>
					{ a.postType === 'post' && (
						<SelectControl
							label={ __( 'Sticky posts', 'tungool-builder' ) }
							value={ a.sticky }
							options={ [
								opt( __( 'Treat like other posts', 'tungool-builder' ), 'ignore' ),
								opt( __( 'Exclude sticky posts', 'tungool-builder' ), 'exclude' ),
								opt( __( 'Only sticky posts', 'tungool-builder' ), 'only' ),
							] }
							onChange={ set( 'sticky' ) }
							__nextHasNoMarginBottom
						/>
					) }
					<SelectControl
						label={ __( 'Order by', 'tungool-builder' ) }
						value={ a.orderBy }
						options={ [
							opt( __( 'Publish date', 'tungool-builder' ), 'date' ),
							opt( __( 'Last modified', 'tungool-builder' ), 'modified' ),
							opt( __( 'Title', 'tungool-builder' ), 'title' ),
							opt( __( 'Menu order', 'tungool-builder' ), 'menu_order' ),
							opt( __( 'Comment count', 'tungool-builder' ), 'comment_count' ),
							opt( __( 'Random', 'tungool-builder' ), 'rand' ),
						] }
						help={
							[ 'comment_count', 'rand' ].includes( a.orderBy )
								? __( 'The editor preview orders by date; the frontend uses this setting.', 'tungool-builder' )
								: undefined
						}
						onChange={ set( 'orderBy' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Order', 'tungool-builder' ) }
						value={ a.order }
						options={ [ opt( __( 'Descending', 'tungool-builder' ), 'desc' ), opt( __( 'Ascending', 'tungool-builder' ), 'asc' ) ] }
						onChange={ set( 'order' ) }
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Number of posts', 'tungool-builder' ) }
						value={ a.perPage }
						min={ 1 }
						max={ 50 }
						onChange={ ( v ) => setAttributes( { perPage: v ?? 6 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Offset (skip first N posts)', 'tungool-builder' ) }
						value={ a.offset }
						min={ 0 }
						max={ 50 }
						onChange={ ( v ) => setAttributes( { offset: v ?? 0 } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Layout', 'tungool-builder' ) }
						value={ a.layout }
						options={ [ opt( __( 'Grid', 'tungool-builder' ), 'grid' ), opt( __( 'List', 'tungool-builder' ), 'list' ) ] }
						onChange={ set( 'layout' ) }
						__nextHasNoMarginBottom
					/>
					{ a.layout !== 'list' && (
						<ResponsiveControl label={ __( 'Columns', 'tungool-builder' ) } value={ a.columns } onChange={ set( 'columns' ) }>
							{ ( { value: v, onChange: c } ) => (
								<NumberControl
									value={ v ?? '' }
									min={ 1 }
									max={ 6 }
									onChange={ ( next ) => c( next === undefined || next === '' ? '' : String( next ) ) }
									__next40pxDefaultSize
								/>
							) }
						</ResponsiveControl>
					) }
					<ResponsiveControl label={ __( 'Gap', 'tungool-builder' ) } value={ a.gap } onChange={ set( 'gap' ) }>
						{ ( { value: v, onChange: c } ) => (
							<UnitControl value={ v ?? '' } min={ 0 } units={ UNITS } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
						) }
					</ResponsiveControl>
					<ToggleControl
						label={ __( 'Equal height cards', 'tungool-builder' ) }
						checked={ a.equalHeight }
						onChange={ set( 'equalHeight' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={ __( 'Card parts', 'tungool-builder' ) } initialOpen={ false }>
					{ order.map( ( part, i ) => (
						<Flex key={ part } className="tb-post-grid-part-row">
							<FlexBlock>
								<ToggleControl
									label={ labels[ part ] }
									checked={ !! a[ showKey( part ) ] }
									onChange={ set( showKey( part ) ) }
									__nextHasNoMarginBottom
								/>
							</FlexBlock>
							<FlexItem>
								<Button size="small" icon="arrow-up-alt2" label={ __( 'Move up', 'tungool-builder' ) } disabled={ i === 0 } onClick={ () => movePart( i, -1 ) } />
								<Button
									size="small"
									icon="arrow-down-alt2"
									label={ __( 'Move down', 'tungool-builder' ) }
									disabled={ i === order.length - 1 }
									onClick={ () => movePart( i, 1 ) }
								/>
							</FlexItem>
						</Flex>
					) ) }
				</PanelBody>

				{ a.showImage && (
					<PanelBody title={ __( 'Image', 'tungool-builder' ) } initialOpen={ false }>
						<SelectControl
							label={ __( 'Image size', 'tungool-builder' ) }
							value={ a.imageSize }
							options={ imageSizes.map( ( s ) => opt( s.name, s.slug ) ) }
							onChange={ set( 'imageSize' ) }
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={ __( 'Aspect ratio', 'tungool-builder' ) }
							value={ a.imageRatio }
							options={ [
								opt( __( 'Original', 'tungool-builder' ), '' ),
								opt( '16:9', '16/9' ),
								opt( '4:3', '4/3' ),
								opt( '3:2', '3/2' ),
								opt( __( 'Square', 'tungool-builder' ), '1' ),
								opt( '3:4', '3/4' ),
								opt( '2:3', '2/3' ),
							] }
							onChange={ set( 'imageRatio' ) }
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={ __( 'Lazy load', 'tungool-builder' ) }
							help={ __( 'Turn off when the grid is at the top of the page.', 'tungool-builder' ) }
							checked={ a.lazyLoad }
							onChange={ set( 'lazyLoad' ) }
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				) }
				{ a.showTitle && (
					<PanelBody title={ __( 'Title', 'tungool-builder' ) } initialOpen={ false }>
						<SelectControl
							label={ __( 'HTML tag', 'tungool-builder' ) }
							value={ a.titleTag }
							options={ [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ].map( ( t ) => opt( t.toUpperCase(), t ) ) }
							onChange={ set( 'titleTag' ) }
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				) }
				{ a.showMeta && (
					<PanelBody title={ __( 'Meta', 'tungool-builder' ) } initialOpen={ false }>
						<ToggleControl label={ __( 'Date', 'tungool-builder' ) } checked={ a.metaDate } onChange={ set( 'metaDate' ) } __nextHasNoMarginBottom />
						<ToggleControl label={ __( 'Author', 'tungool-builder' ) } checked={ a.metaAuthor } onChange={ set( 'metaAuthor' ) } __nextHasNoMarginBottom />
						<ToggleControl label={ __( 'Terms', 'tungool-builder' ) } checked={ a.metaTerms } onChange={ set( 'metaTerms' ) } __nextHasNoMarginBottom />
						{ a.metaTerms && (
							<SelectControl
								label={ __( 'Terms from', 'tungool-builder' ) }
								value={ a.metaTaxonomy }
								options={ taxOptions.map( ( t ) => opt( t.name, t.slug ) ) }
								onChange={ set( 'metaTaxonomy' ) }
								__nextHasNoMarginBottom
							/>
						) }
						<ToggleControl label={ __( 'Comment count', 'tungool-builder' ) } checked={ a.metaComments } onChange={ set( 'metaComments' ) } __nextHasNoMarginBottom />
					</PanelBody>
				) }
				{ a.showExcerpt && (
					<PanelBody title={ __( 'Excerpt', 'tungool-builder' ) } initialOpen={ false }>
						<RangeControl
							label={ __( 'Length (words)', 'tungool-builder' ) }
							value={ a.excerptLength }
							min={ 5 }
							max={ 100 }
							onChange={ ( v ) => setAttributes( { excerptLength: v ?? 20 } ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</PanelBody>
				) }
				{ a.showReadMore && (
					<PanelBody title={ __( 'Read more', 'tungool-builder' ) } initialOpen={ false }>
						<TextControl
							label={ __( 'Text', 'tungool-builder' ) }
							placeholder={ __( 'Read more', 'tungool-builder' ) }
							value={ a.readMoreText }
							onChange={ set( 'readMoreText' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<SelectControl
							label={ __( 'Style preset', 'tungool-builder' ) }
							value={ a.readMorePreset }
							options={ [
								opt( __( 'Text link', 'tungool-builder' ), 'text' ),
								opt( __( 'Primary', 'tungool-builder' ), 'primary' ),
								opt( __( 'Secondary', 'tungool-builder' ), 'secondary' ),
								opt( __( 'Outline', 'tungool-builder' ), 'outline' ),
							] }
							onChange={ set( 'readMorePreset' ) }
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				) }

				<PanelBody title={ __( 'Pagination', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Pagination', 'tungool-builder' ) }
						value={ a.pagination }
						options={ [
							opt( __( 'None', 'tungool-builder' ), 'none' ),
							opt( __( 'Page numbers', 'tungool-builder' ), 'numbers' ),
							opt( __( 'Load more button', 'tungool-builder' ), 'loadMore' ),
						] }
						onChange={ set( 'pagination' ) }
						__nextHasNoMarginBottom
					/>
					{ a.pagination === 'loadMore' && (
						<TextControl
							label={ __( 'Button text', 'tungool-builder' ) }
							placeholder={ __( 'Load more', 'tungool-builder' ) }
							value={ a.loadMoreText }
							onChange={ set( 'loadMoreText' ) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={ __( 'Card', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Hover effect', 'tungool-builder' ) }
						value={ a.hoverEffect }
						options={ [
							opt( __( 'None', 'tungool-builder' ), 'none' ),
							opt( __( 'Lift', 'tungool-builder' ), 'lift' ),
							opt( __( 'Zoom image', 'tungool-builder' ), 'zoom' ),
						] }
						onChange={ set( 'hoverEffect' ) }
						__nextHasNoMarginBottom
					/>
					<ColorControl label={ __( 'Background', 'tungool-builder' ) } value={ a.cardBackground } onChange={ set( 'cardBackground' ) } hover />
					<SpacingControl type="padding" value={ a.cardPadding } onChange={ set( 'cardPadding' ) } />
					<BorderControl value={ a.cardBorder } onChange={ set( 'cardBorder' ) } hover />
				</PanelBody>
				<PanelBody title={ __( 'Card shadow', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ a.cardShadow } onChange={ set( 'cardShadow' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Card shadow on hover', 'tungool-builder' ) } initialOpen={ false }>
					<BoxShadowControl value={ a.cardHoverShadow } onChange={ set( 'cardHoverShadow' ) } />
				</PanelBody>
				{ a.showImage && (
					<PanelBody title={ __( 'Image', 'tungool-builder' ) } initialOpen={ false }>
						<ResponsiveControl label={ __( 'Border radius', 'tungool-builder' ) } value={ a.imageRadius } onChange={ set( 'imageRadius' ) }>
							{ ( { value: v, onChange: c } ) => (
								<UnitControl value={ v ?? '' } min={ 0 } units={ [ ...UNITS, { value: '%', label: '%' } ] } onChange={ ( next ) => c( next ?? '' ) } __next40pxDefaultSize />
							) }
						</ResponsiveControl>
					</PanelBody>
				) }
				{ a.showTitle && typo( __( 'Title', 'tungool-builder' ), 'titleTypography', 'titleColor', true ) }
				{ a.showMeta && typo( __( 'Meta', 'tungool-builder' ), 'metaTypography', 'metaColor' ) }
				{ a.showExcerpt && typo( __( 'Excerpt', 'tungool-builder' ), 'excerptTypography', 'excerptColor' ) }
				{ a.showReadMore && (
					<PanelBody title={ __( 'Read more', 'tungool-builder' ) } initialOpen={ false }>
						<ColorControl label={ __( 'Color', 'tungool-builder' ) } value={ a.readMoreColor } onChange={ set( 'readMoreColor' ) } hover />
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
}
