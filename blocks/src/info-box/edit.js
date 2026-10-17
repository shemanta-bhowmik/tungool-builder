import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import { BUTTON_PRESETS } from '../shared/utils/button';
import Inspector, { TITLE_TAGS } from './inspector';
import infoBoxCSS from './styles';
import './edit.scss';

const SHAPES = [ 'none', 'circle', 'square', 'rounded' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, mediaType, icon, image = {}, number, title, description, showButton, button = {}, linkUrl } = attributes;
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );
	const TitleTag = TITLE_TAGS.includes( attributes.titleTag ) ? attributes.titleTag : 'h3';
	const shape = SHAPES.includes( attributes.mediaShape ) ? attributes.mediaShape : 'none';

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [
			'tb-info-box',
			`tb-info-box--media-${ mediaType }`,
			attributes.background?.overlay?.color && 'tb-info-box--overlay',
			linkUrl && 'tb-info-box--linked',
			uniqueId && `tb-block-${ uniqueId }`,
		]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = infoBoxCSS( attributes );

	let media = null;
	if ( mediaType === 'icon' && icon ) {
		media = <Icon name={ icon } />;
	} else if ( mediaType === 'image' && image.url ) {
		media = <img src={ image.url } alt={ image.alt || '' } />;
	} else if ( mediaType === 'number' && number ) {
		media = <span className="tb-info-box__number">{ number }</span>;
	}

	const buttonIcon = button.icon ? (
		<span className="tb-button__icon">
			<Icon name={ button.icon } />
		</span>
	) : null;

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ media && (
					<div className="tb-info-box__media">
						<div className={ `tb-info-box__media-inner tb-info-box__media-inner--${ shape }` }>{ media }</div>
					</div>
				) }
				<div className="tb-info-box__content">
					<RichText
						tagName={ TitleTag }
						className="tb-info-box__title"
						value={ title }
						onChange={ set( 'title' ) }
						placeholder={ __( 'Title', 'tungool-builder' ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						identifier="title"
					/>
					<RichText
						tagName="p"
						className="tb-info-box__desc"
						value={ description }
						onChange={ set( 'description' ) }
						placeholder={ __( 'Description…', 'tungool-builder' ) }
						identifier="description"
					/>
					{ showButton && (
						<div className="tb-info-box__button tb-button-wrap">
							<span className={ `tb-button tb-button--${ BUTTON_PRESETS.includes( button.preset ) ? button.preset : 'primary' }` }>
								{ button.iconPosition === 'before' && buttonIcon }
								<RichText
									tagName="span"
									className="tb-button__text"
									value={ button.text || '' }
									onChange={ ( text ) => setAttributes( { button: { ...button, text } } ) }
									placeholder={ __( 'Button text…', 'tungool-builder' ) }
									allowedFormats={ [ 'core/bold', 'core/italic' ] }
									withoutInteractiveFormatting
									disableLineBreaks
									identifier="buttonText"
								/>
								{ button.iconPosition !== 'before' && buttonIcon }
							</span>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
