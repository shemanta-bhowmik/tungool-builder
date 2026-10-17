import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import './edit.scss';

export default function Edit({ attributes, setAttributes }) {

    const { content, level, align } = attributes;
    const tagName = `h${level}`;
    // const blockProps = useBlockProps();

    return (
        // <div {...useBlockProps()}>
        //     <InspectorControls>
        //         <PanelBody title={__('Heading Settings', 'tungool-builder')}>
        //             <SelectControl>
        //                 label={__('Heading Level', 'tungool-builder')}
        //                 value={attributes.headingLevel}
        //                 options={[
        //                     { label: __('Heading 1', 'tungool-builder'), value: 'h1' },
        //                     { label: __('Heading 2', 'tungool-builder'), value: 'h2' },
        //                     { label: __('Heading 3', 'tungool-builder'), value: 'h3' },
        //                     { label: __('Heading 4', 'tungool-builder'), value: 'h4' },
        //                     { label: __('Heading 5', 'tungool-builder'), value: 'h5' },
        //                     { label: __('Heading 6', 'tungool-builder'), value: 'h6' }
        //                 ]}
        //             </SelectControl>
        //         </PanelBody>
        //     </InspectorControls>
        //     <RichText>
        //         { ...useBlockProps }
        //         tagName={attributes.headingLevel}
        //         value={attributes.content}
        //         onChange={(content) => setAttributes({ content: value })}
        //     </RichText>
        // </div>
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={align}
                    onChange={(value) => setAttributes({align: value})}
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Heading Settings', 'tungool-builder')}>
                    <SelectControl
                        label={__('Heading Level', 'tungool-builder')}
                        value={level}
                        options={[
                            { label: __('Heading 1', 'tungool-builder'), value: '1' },
                            { label: __('Heading 2', 'tungool-builder'), value: '2' },
                            { label: __('Heading 3', 'tungool-builder'), value: '3' },
                            { label: __('Heading 4', 'tungool-builder'), value: '4' },
                            { label: __('Heading 5', 'tungool-builder'), value: '5' },
                            { label: __('Heading 6', 'tungool-builder'), value: '6' }
                        ]}
                         onChange={(value) => setAttributes({ level: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Alignment Settings', 'tungool-builder')}>
                    <SelectControl
                        label={__('Text Alignment', 'tungool-builder')}
                        value={align}
                        options={[
                            { label: __('Left', 'tungool-builder'), value: 'left' },
                            { label: __('Center', 'tungool-builder'), value: 'center' },
                            { label: __('Right', 'tungool-builder'), value: 'right' }
                        ]}
                        onChange={(value) => setAttributes({ align: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <RichText
                {...useBlockProps()}
                value={content}
                onChange={(value) => setAttributes({ content: value })}
                tagName={tagName}
            />
        </>
    );
}