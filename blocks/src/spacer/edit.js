import { __, sprintf } from '@wordpress/i18n';
import { useState, useRef, useLayoutEffect } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ResizableBox } from '@wordpress/components';
import { ResponsiveControl } from '../shared/controls';
import { UnitControl } from '../shared/controls/compat';
import { useUniqueId, useDeviceType } from '../shared/hooks';
import { inheritedValue } from '../shared/utils';
import spacerCSS from './styles';
import './edit.scss';

const UNITS = [ 'px', 'em', 'rem', 'vh' ].map( ( u ) => ( { value: u, label: u } ) );
const FALLBACK = '50px';
const DEVICE_LABELS = {
	desktop: __( 'Desktop', 'tungool-builder' ),
	tablet: __( 'Tablet', 'tungool-builder' ),
	mobile: __( 'Mobile', 'tungool-builder' ),
};

export default function Edit( { attributes, setAttributes, clientId, isSelected } ) {
	const { uniqueId, height = {} } = attributes;
	const [ device ] = useDeviceType();
	const probe = useRef();
	const [ boxHeight, setBoxHeight ] = useState( 50 );
	const [ liveHeight, setLiveHeight ] = useState( null );

	useUniqueId( { attributes, setAttributes, clientId } );

	// Value shown for the current preview device (tablet/mobile inherit upwards).
	const current = inheritedValue( height, device ) || FALLBACK;

	// Resolve any unit (em, rem, vh, preset vars) to px for the ResizableBox.
	useLayoutEffect( () => {
		if ( probe.current ) {
			setBoxHeight( probe.current.offsetHeight );
		}
	}, [ current ] );

	const blockProps = useBlockProps( {
		className: [ 'tb-spacer', 'tb-spacer--editor', uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
		'aria-hidden': 'true',
	} );
	const css = spacerCSS( attributes );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Spacer', 'tungool-builder' ) }>
					<ResponsiveControl
						label={ __( 'Height', 'tungool-builder' ) }
						value={ height }
						onChange={ ( next ) => setAttributes( { height: next } ) }
					>
						{ ( { value: v, onChange: c } ) => (
							<UnitControl
								value={ v ?? '' }
								min={ 0 }
								units={ UNITS }
								placeholder={ current }
								onChange={ ( next ) => c( next ?? '' ) }
								__next40pxDefaultSize
							/>
						) }
					</ResponsiveControl>
				</PanelBody>
			</InspectorControls>
			{ css && <style>{ css }</style> }
			<div { ...blockProps }>
				<div ref={ probe } style={ { position: 'absolute', visibility: 'hidden', height: current, width: 0 } } />
				<ResizableBox
					className="tb-spacer__box"
					size={ { width: '100%', height: boxHeight } }
					minHeight={ 1 }
					enable={ { bottom: true } }
					showHandle={ isSelected }
					onResize={ ( event, direction, elt ) => setLiveHeight( elt.offsetHeight ) }
					onResizeStop={ ( event, direction, elt ) => {
						const px = Math.max( 1, Math.round( elt.offsetHeight ) );
						setLiveHeight( null );
						setBoxHeight( px );
						setAttributes( { height: { ...height, [ device ]: `${ px }px` } } );
					} }
				>
					<span className="tb-spacer__label">
						{ sprintf(
							/* translators: 1: device name, 2: height value. */
							__( '%1$s: %2$s', 'tungool-builder' ),
							DEVICE_LABELS[ device ],
							liveHeight !== null ? `${ liveHeight }px` : current
						) }
					</span>
				</ResizableBox>
			</div>
		</>
	);
}
