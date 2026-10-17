import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import iconListCSS from './styles';
import './edit.scss';

const ITEM = 'tungool-builder/icon-list-item';
const TEMPLATE = [
	[ ITEM, { text: __( 'List item', 'tungool-builder' ) } ],
	[ ITEM, { text: __( 'List item', 'tungool-builder' ) } ],
	[ ITEM, { text: __( 'List item', 'tungool-builder' ) } ],
];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, layout, iconAlign, divider } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [
			'tb-icon-list',
			`tb-icon-list--${ layout === 'inline' ? 'inline' : 'vertical' }`,
			`tb-icon-list--icon-${ [ 'start', 'center', 'end' ].includes( iconAlign ) ? iconAlign : 'center' }`,
			divider && 'tb-icon-list--divider',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ ITEM ],
		template: TEMPLATE,
		orientation: layout === 'inline' ? 'horizontal' : 'vertical',
	} );
	const css = iconListCSS( attributes );

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<ul { ...innerBlocksProps } />
		</>
	);
}
