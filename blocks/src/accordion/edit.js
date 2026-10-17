import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import accordionCSS from './styles';
import './edit.scss';

const ITEM = 'tungool-builder/accordion-item';
const TEMPLATE = [
	[ ITEM, { title: __( 'Accordion item 1', 'tungool-builder' ) } ],
	[ ITEM, { title: __( 'Accordion item 2', 'tungool-builder' ) } ],
];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-accordion', uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, { allowedBlocks: [ ITEM ], template: TEMPLATE } );
	const css = accordionCSS( attributes );

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...innerBlocksProps } />
		</>
	);
}
