import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useUniqueId } from '../shared/hooks';
import Icon from '../shared/icons/Icon';
import Inspector from './inspector';
import counterCSS from './styles';
import { formatNumber } from './format';
import './edit.scss';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { uniqueId, end, decimals, thousandsSeparator, decimalSeparator, prefix, suffix, title, titlePosition, icon } =
		attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const position = titlePosition === 'above' ? 'above' : 'below';
	const blockProps = useBlockProps( {
		className: [ 'tb-counter', `tb-counter--title-${ position }`, uniqueId && `tb-block-${ uniqueId }` ]
			.filter( Boolean )
			.join( ' ' ),
	} );
	const css = counterCSS( attributes );

	const titleEl = (
		<RichText
			tagName="div"
			className="tb-counter__title"
			value={ title }
			onChange={ ( value ) => setAttributes( { title: value } ) }
			placeholder={ __( 'Add title…', 'tungool-builder' ) }
			allowedFormats={ [ 'core/bold', 'core/italic' ] }
			identifier="title"
		/>
	);

	// The editor shows the final value; the count-up runs on the frontend only.
	return (
		<>
			<Inspector { ...props } />
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				{ icon && (
					<div className="tb-counter__icon">
						<Icon name={ icon } />
					</div>
				) }
				{ position === 'above' && titleEl }
				<div className="tb-counter__number">
					{ prefix && <span className="tb-counter__prefix">{ prefix }</span> }
					<span className="tb-counter__value">
						{ formatNumber( end, decimals, thousandsSeparator, decimalSeparator ) }
					</span>
					{ suffix && <span className="tb-counter__suffix">{ suffix }</span> }
				</div>
				{ position === 'below' && titleEl }
			</div>
		</>
	);
}
