import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Inspector from './inspector';
import headingCSS from './styles';
import './edit.scss';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { content, level, align, uniqueId } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [
			'tb-heading',
			`tb-heading-${ level }`,
			`tb-heading-align-${ align }`,
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = headingCSS( attributes );

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ align }
					onChange={ ( value ) => setAttributes( { align: value || 'left' } ) }
				/>
			</BlockControls>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<RichText
				{ ...blockProps }
				tagName={ `h${ level }` }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Write heading…', 'tungool-builder' ) }
			/>
		</>
	);
}
