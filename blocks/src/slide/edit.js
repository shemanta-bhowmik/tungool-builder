import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useUniqueId } from '../shared/hooks';
import { ResponsiveControl, SpacingControl, BackgroundControl } from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';
import slideCSS from './styles';
import './edit.scss';

const TEMPLATE = [
	[ 'tungool-builder/heading', { content: __( 'Slide title', 'tungool-builder' ), level: 2 } ],
	[ 'core/paragraph', { placeholder: __( 'Add slide content…', 'tungool-builder' ) } ],
];

export const ALIGNS = [ 'top', 'center', 'bottom' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, verticalAlign, background = {} } = attributes;
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );

	useUniqueId( { attributes, setAttributes, clientId } );

	const hasInnerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ) > 0,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: [
			'tb-slide',
			`tb-slide--${ ALIGNS.includes( verticalAlign ) ? verticalAlign : 'center' }`,
			background?.overlay?.color && 'tb-slide--overlay',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tb-slide__inner' },
		{
			template: TEMPLATE,
			renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		}
	);
	const css = slideCSS( attributes );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slide', 'tungool-builder' ) }>
					<ResponsiveControl
						label={ __( 'Minimum height', 'tungool-builder' ) }
						value={ attributes.minHeight }
						onChange={ set( 'minHeight' ) }
					>
						{ ( { value, onChange } ) => (
							<UnitControl
								value={ value ?? '' }
								min={ 0 }
								units={ [ 'px', 'vh', 'em', 'rem' ].map( ( u ) => ( { value: u, label: u } ) ) }
								onChange={ ( next ) => onChange( next ?? '' ) }
								__next40pxDefaultSize
							/>
						) }
					</ResponsiveControl>
					<SelectControl
						label={ __( 'Content position', 'tungool-builder' ) }
						value={ verticalAlign }
						options={ [
							{ label: __( 'Top', 'tungool-builder' ), value: 'top' },
							{ label: __( 'Center', 'tungool-builder' ), value: 'center' },
							{ label: __( 'Bottom', 'tungool-builder' ), value: 'bottom' },
						] }
						onChange={ set( 'verticalAlign' ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title={ __( 'Background', 'tungool-builder' ) } initialOpen={ false }>
					<BackgroundControl value={ background } onChange={ set( 'background' ) } />
				</PanelBody>
				<PanelBody title={ __( 'Spacing', 'tungool-builder' ) } initialOpen={ false }>
					<SpacingControl type="padding" value={ attributes.padding } onChange={ set( 'padding' ) } />
				</PanelBody>
			</InspectorControls>
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
