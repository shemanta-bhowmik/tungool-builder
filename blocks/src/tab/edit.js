import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { IconPicker } from '../shared/controls';
import { useUniqueId } from '../shared/hooks';
import './edit.scss';

const TEMPLATE = [ [ 'core/paragraph', { placeholder: __( 'Tab content…', 'tungool-builder' ) } ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { uniqueId, icon } = attributes;

	useUniqueId( { attributes, setAttributes, clientId } );

	const blockProps = useBlockProps( {
		className: [ 'tb-tab', uniqueId && `tb-block-${ uniqueId }` ].filter( Boolean ).join( ' ' ),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, { template: TEMPLATE, templateLock: false } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tab', 'tungool-builder' ) }>
					<IconPicker label={ __( 'Title icon', 'tungool-builder' ) } value={ icon } onChange={ ( next ) => setAttributes( { icon: next } ) } />
					<p className="components-base-control__help">
						{ __( 'Edit the title in the tab list. Set an HTML anchor (Advanced) to link to this tab.', 'tungool-builder' ) }
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
