import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import Stars from './stars';
import testimonialCSS from './styles';
import './edit.scss';

export const LAYOUTS = [ 'card', 'centered', 'avatar-left', 'quote-icon' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, quote, name, role, avatar = {}, showRating, rating, quoteIcon } = attributes;
	const layout = LAYOUTS.includes( attributes.layout ) ? attributes.layout : 'card';

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-testimonial', `tb-testimonial--${ layout }`, uniqueId && `tb-block-${ uniqueId }` ]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = testimonialCSS( attributes );

	const avatarEl = (
		<MediaUploadCheck fallback={ avatar.url ? <img className="tb-testimonial__avatar" src={ avatar.url } alt={ avatar.alt || '' } /> : null }>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ avatar.id }
				onSelect={ ( media ) =>
					setAttributes( {
						avatar: { id: media.id, url: media.sizes?.thumbnail?.url || media.url, alt: media.alt || '' },
					} )
				}
				render={ ( { open } ) =>
					avatar.url ? (
						<img
							className="tb-testimonial__avatar"
							src={ avatar.url }
							alt={ avatar.alt || '' }
							onDoubleClick={ open }
						/>
					) : (
						<button
							type="button"
							className="tb-testimonial__avatar tb-testimonial__avatar--placeholder"
							onClick={ open }
							aria-label={ __( 'Select avatar', 'tungool-builder' ) }
						>
							<Icon name="user" />
						</button>
					)
				}
			/>
		</MediaUploadCheck>
	);

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<figure { ...blockProps }>
				{ layout === 'quote-icon' && quoteIcon && (
					<span className="tb-testimonial__icon" aria-hidden="true">
						<Icon name={ quoteIcon } />
					</span>
				) }
				{ layout === 'avatar-left' && avatarEl }
				{ showRating && <Stars rating={ rating } /> }
				<blockquote className="tb-testimonial__quote">
					<RichText
						tagName="p"
						value={ quote }
						onChange={ ( value ) => setAttributes( { quote: value } ) }
						placeholder={ __( 'Write the testimonial…', 'tungool-builder' ) }
						identifier="quote"
					/>
				</blockquote>
				<figcaption className="tb-testimonial__caption">
					{ layout !== 'avatar-left' && avatarEl }
					<span className="tb-testimonial__meta">
						<RichText
							tagName="cite"
							className="tb-testimonial__name"
							value={ name }
							onChange={ ( value ) => setAttributes( { name: value } ) }
							placeholder={ __( 'Name', 'tungool-builder' ) }
							allowedFormats={ [] }
							disableLineBreaks
							identifier="name"
						/>
						<RichText
							tagName="span"
							className="tb-testimonial__role"
							value={ role }
							onChange={ ( value ) => setAttributes( { role: value } ) }
							placeholder={ __( 'Role, Company', 'tungool-builder' ) }
							allowedFormats={ [ 'core/link' ] }
							disableLineBreaks
							identifier="role"
						/>
					</span>
				</figcaption>
			</figure>
		</>
	);
}
