import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import { BUTTON_PRESETS } from '../shared/utils/button';
import Inspector from './inspector';
import pricingCSS from './styles';
import './edit.scss';


export default function Edit( props ) {
	const { attributes: a, setAttributes, clientId } = props;
	const features = Array.isArray( a.features ) ? a.features : [];

	useUniqueId( { attributes: a, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-pricing', a.featured && 'tb-pricing--featured', a.uniqueId && `tb-block-${ a.uniqueId }` ]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = pricingCSS( a );
	const text = ( key, tagName, className, placeholder ) => (
		<RichText
			tagName={ tagName }
			className={ className }
			value={ a[ key ] }
			onChange={ ( value ) => setAttributes( { [ key ]: value } ) }
			placeholder={ placeholder }
			allowedFormats={ [ 'core/bold', 'core/italic' ] }
			identifier={ key }
		/>
	);
	const setFeature = ( i, value ) =>
		setAttributes( { features: features.map( ( f, j ) => ( j === i ? { ...f, text: value } : f ) ) } );
	const button = a.button || {};
	const buttonIcon = button.icon ? (
		<span className="tb-button__icon">
			<Icon name={ button.icon } />
		</span>
	) : null;
	const currency = a.currency ? <span className="tb-pricing__currency">{ a.currency }</span> : null;

	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ a.badge && (
					<span className={ `tb-pricing__badge tb-pricing__badge--${ a.badgeStyle === 'ribbon' ? 'ribbon' : 'badge' }` }>
						{ a.badge }
					</span>
				) }
				<div className="tb-pricing__header">
					{ text( 'title', 'h3', 'tb-pricing__title', __( 'Plan name', 'tungool-builder' ) ) }
					{ text( 'subtitle', 'p', 'tb-pricing__subtitle', __( 'Short description', 'tungool-builder' ) ) }
				</div>
				<div className="tb-pricing__price">
					{ a.originalPrice && <del className="tb-pricing__original">{ a.originalPrice }</del> }
					<span className="tb-pricing__amount-wrap">
						{ a.currencyPosition !== 'after' && currency }
						<span className="tb-pricing__amount">{ a.amount }</span>
						{ a.priceDecimals && <span className="tb-pricing__decimals">{ a.priceDecimals }</span> }
						{ a.currencyPosition === 'after' && currency }
					</span>
					{ a.period && <span className="tb-pricing__period">{ a.period }</span> }
				</div>
				{ features.length > 0 && (
					<ul className="tb-pricing__features">
						{ features.map( ( f, i ) => (
							<li
								key={ i }
								className={ `tb-pricing__feature tb-pricing__feature--${ f.included ? 'included' : 'excluded' }` }
							>
								<span className="tb-pricing__feature-icon">
									<Icon name={ f.included ? a.includedIcon : a.excludedIcon } />
								</span>
								<RichText
									tagName="span"
									className="tb-pricing__feature-text"
									value={ f.text }
									onChange={ ( value ) => setFeature( i, value ) }
									placeholder={ __( 'Feature', 'tungool-builder' ) }
									allowedFormats={ [ 'core/bold', 'core/italic' ] }
								/>
								{ f.tooltip && (
									<span className="tb-pricing__tip">
										<Icon name="info" />
										<span className="tb-pricing__tip-text">{ f.tooltip }</span>
									</span>
								) }
							</li>
						) ) }
					</ul>
				) }
				<div className="tb-pricing__action tb-button-wrap">
					<span className={ `tb-button tb-button--${ BUTTON_PRESETS.includes( button.preset ) ? button.preset : 'primary' }` }>
						{ button.iconPosition === 'before' && buttonIcon }
						<RichText
							tagName="span"
							className="tb-button__text"
							value={ button.text || '' }
							onChange={ ( value ) => setAttributes( { button: { ...button, text: value } } ) }
							placeholder={ __( 'Button text…', 'tungool-builder' ) }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
							withoutInteractiveFormatting
							disableLineBreaks
							identifier="buttonText"
						/>
						{ button.iconPosition !== 'before' && buttonIcon }
					</span>
				</div>
				{ text( 'footnote', 'p', 'tb-pricing__footnote', __( 'Footnote (optional)', 'tungool-builder' ) ) }
			</div>
		</>
	);
}
