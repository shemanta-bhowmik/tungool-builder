import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import sliderCSS from './styles';
import './edit.scss';

const ALLOWED = [ 'tungool-builder/slide' ];
const TEMPLATE = [ [ 'tungool-builder/slide' ], [ 'tungool-builder/slide' ] ];
const POSITIONS = [ 'inside', 'outside', 'bottom' ];
const DOT_STYLES = [ 'dot', 'line', 'square' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, effect, showArrows, showDots, arrowPosition, dotStyle, prevIcon, nextIcon } = attributes;
	const [ active, setActive ] = useState( 0 );

	useUniqueId( { attributes, setAttributes, clientId } );

	const { slideIds, selectedSlide } = useSelect(
		( select ) => {
			const store = select( blockEditorStore );
			const ids = store.getBlockOrder( clientId );
			const selected = store.getSelectedBlockClientId();
			let owner = -1;
			if ( selected ) {
				const chain = [ selected, ...store.getBlockParents( selected ) ];
				owner = ids.findIndex( ( id ) => chain.includes( id ) );
			}
			return { slideIds: ids, selectedSlide: owner };
		},
		[ clientId ]
	);
	const { insertBlock } = useDispatch( blockEditorStore );
	const count = slideIds.length;
	const current = Math.min( active, Math.max( 0, count - 1 ) );

	// Follow the selection: selecting a block inside slide N shows slide N.
	useEffect( () => {
		if ( selectedSlide >= 0 ) {
			setActive( selectedSlide );
		}
	}, [ selectedSlide ] );

	const go = ( i ) => setActive( ( ( i % count ) + count ) % count );
	const addSlide = () => {
		insertBlock( createBlock( 'tungool-builder/slide' ), count, clientId );
		setActive( count );
	};

	const position = POSITIONS.includes( arrowPosition ) ? arrowPosition : 'inside';
	const blockProps = useBlockProps( {
		className: [
			'tb-slider',
			'is-editor',
			`tb-slider--${ effect === 'fade' ? 'fade' : 'slide' }`,
			showArrows && `tb-slider--arrows-${ position }`,
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tb-slider__track' },
		{ allowedBlocks: ALLOWED, template: TEMPLATE, orientation: 'horizontal', renderAppender: false }
	);

	// Editor shows one slide at a time; the others stay in the list view.
	const activeId = slideIds[ current ];
	const visibility = activeId
		? `#block-${ clientId } > .tb-slider__viewport > .tb-slider__track > [data-block]:not([data-block="${ activeId }"]){display:none}`
		: '';
	const css = sliderCSS( attributes ) + visibility;

	const arrow = ( dir ) => (
		<button
			type="button"
			className={ `tb-slider__arrow tb-slider__arrow--${ dir }` }
			aria-label={ dir === 'prev' ? __( 'Previous slide', 'tungool-builder' ) : __( 'Next slide', 'tungool-builder' ) }
			onClick={ () => go( current + ( dir === 'prev' ? -1 : 1 ) ) }
		>
			<Icon name={ dir === 'prev' ? prevIcon : nextIcon } />
		</button>
	);

	return (
		<>
			<Inspector { ...props } slideIds={ slideIds } active={ current } onSelectSlide={ go } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<div className="tb-slider-editor-bar">
					<Button size="small" icon="arrow-left-alt2" label={ __( 'Previous slide', 'tungool-builder' ) } onClick={ () => go( current - 1 ) } disabled={ count < 2 } />
					<span className="tb-slider-editor-bar__count">
						{ sprintf(
							/* translators: 1: current slide, 2: total slides. */
							__( 'Slide %1$d of %2$d', 'tungool-builder' ),
							count ? current + 1 : 0,
							count
						) }
					</span>
					<Button size="small" icon="arrow-right-alt2" label={ __( 'Next slide', 'tungool-builder' ) } onClick={ () => go( current + 1 ) } disabled={ count < 2 } />
					<span className="tb-slider-editor-bar__list">
						{ slideIds.map( ( id, i ) => (
							<Button key={ id } size="small" isPressed={ i === current } onClick={ () => go( i ) }>
								{ i + 1 }
							</Button>
						) ) }
					</span>
					<Button size="small" variant="secondary" icon="plus" onClick={ addSlide }>
						{ __( 'Add slide', 'tungool-builder' ) }
					</Button>
				</div>
				<div className="tb-slider__viewport">
					<div { ...innerBlocksProps } />
					{ showArrows && position !== 'bottom' && arrow( 'prev' ) }
					{ showArrows && position !== 'bottom' && arrow( 'next' ) }
				</div>
				{ ( showDots || ( showArrows && position === 'bottom' ) ) && (
					<div className="tb-slider__nav">
						{ showArrows && position === 'bottom' && arrow( 'prev' ) }
						{ showDots && (
							<div className={ `tb-slider__dots tb-slider__dots--${ DOT_STYLES.includes( dotStyle ) ? dotStyle : 'dot' }` }>
								{ slideIds.map( ( id, i ) => (
									<button
										key={ id }
										type="button"
										className="tb-slider__dot"
										aria-current={ i === current ? 'true' : undefined }
										aria-label={ sprintf(
											/* translators: %d: slide number. */
											__( 'Go to slide %d', 'tungool-builder' ),
											i + 1
										) }
										onClick={ () => go( i ) }
									/>
								) ) }
							</div>
						) }
						{ showArrows && position === 'bottom' && arrow( 'next' ) }
					</div>
				) }
			</div>
		</>
	);
}
