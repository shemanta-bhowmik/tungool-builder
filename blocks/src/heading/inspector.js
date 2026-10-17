import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { TypographyControl, ColorControl, SpacingControl } from '../shared/controls';

const LEVELS = [ 1, 2, 3, 4, 5, 6 ];

export default function Inspector( { attributes, setAttributes } ) {
	const { level, align, typography, padding, margin, hoverColor } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'tungool-builder' ) }>
					<SelectControl
						label={ __( 'Heading Level', 'tungool-builder' ) }
						value={ String( level ) }
						options={ LEVELS.map( ( n ) => ( {
							/* translators: %d: heading level number. */
							label: sprintf( __( 'Heading %d', 'tungool-builder' ), n ),
							value: String( n ),
						} ) ) }
						onChange={ ( value ) => setAttributes( { level: Number( value ) } ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody title={ __( 'Alignment Settings', 'tungool-builder' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Text Alignment', 'tungool-builder' ) }
						value={ align }
						options={ [
							{ label: __( 'Left', 'tungool-builder' ), value: 'left' },
							{ label: __( 'Center', 'tungool-builder' ), value: 'center' },
							{ label: __( 'Right', 'tungool-builder' ), value: 'right' },
						] }
						onChange={ ( value ) => setAttributes( { align: value } ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title={ __( 'Typography', 'tungool-builder' ) } initialOpen={ false }>
					<TypographyControl
						value={ typography }
						onChange={ ( value ) => setAttributes( { typography: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Hover Color', 'tungool-builder' ) } initialOpen={ false }>
					<ColorControl
						label={ __( 'Text color on hover', 'tungool-builder' ) }
						value={ { normal: hoverColor } }
						onChange={ ( value ) => setAttributes( { hoverColor: value.normal || '' } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Spacing', 'tungool-builder' ) } initialOpen={ false }>
					<SpacingControl
						type="padding"
						value={ padding }
						onChange={ ( value ) => setAttributes( { padding: value } ) }
					/>
					<SpacingControl
						type="margin"
						value={ margin }
						onChange={ ( value ) => setAttributes( { margin: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
