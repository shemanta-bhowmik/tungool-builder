import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import dividerCSS from './styles';
import './edit.scss';

export const LINE_STYLES = [ 'solid', 'dashed', 'dotted', 'double', 'zigzag', 'wave', 'slashes' ];
export const POSITIONS = [ 'left', 'center', 'right' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, lineStyle, elementType, elementPosition, text, icon } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const style = LINE_STYLES.includes( lineStyle ) ? lineStyle : 'solid';
	const blockProps = useBlockProps( {
		className: [ 'tb-divider', `tb-divider--${ style }`, uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
	} );
	const css = dividerCSS( attributes );
	const hasElement = elementType === 'text' || elementType === 'icon';
	const position = POSITIONS.includes( elementPosition ) ? elementPosition : 'center';

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ hasElement ? (
					<div className={ `tb-divider__box tb-divider__inner tb-divider__inner--${ position }` } role="separator">
						<span className="tb-divider__line" />
						<span className="tb-divider__element">
							{ elementType === 'icon' ? (
								<Icon name={ icon } />
							) : (
								<RichText
									tagName="span"
									className="tb-divider__text"
									value={ text }
									onChange={ ( value ) => setAttributes( { text: value } ) }
									placeholder={ __( 'Add text…', 'tungool-builder' ) }
									allowedFormats={ [ 'core/bold', 'core/italic' ] }
									withoutInteractiveFormatting
									disableLineBreaks
								/>
							) }
						</span>
						<span className="tb-divider__line" />
					</div>
				) : (
					<hr className="tb-divider__box tb-divider__line" />
				) }
			</div>
		</>
	);
}
