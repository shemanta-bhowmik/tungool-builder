import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette } from '@wordpress/components';
import './edit.scss';

export default function Edit({ attributes, setAttributes }) {

    const { title, subtitle, imageUrl, buttonText, backgroundColor, textColor } = attributes;

	const colors = [
		{ name: 'red', color: '#f00' },
		{ name: 'white', color: '#fff' },
		{ name: 'black', color: '#000' },
		{ name: 'blue', color: '#00f' },
	];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__( 'Card Settings', 'tungool-builder' )}>
                    <p>{__( 'Text Color', 'tungool-builder' )}</p>
                    <ColorPalette
                        colors={colors}
                        value={textColor}
                        onChange={(value) => setAttributes({ textColor: value })}
                    />
                    <p>{__( 'Background Color', 'tungool-builder' )}</p>
                    <ColorPalette
                        colors={colors}
                        value={backgroundColor}
                        onChange={(value) => setAttributes({ backgroundColor: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div
                {...useBlockProps()}
                className="card-block"
                style={{ backgroundColor: backgroundColor, color: textColor }}
            >
                <MediaUpload
                    onSelect={(value) => setAttributes({ imageUrl: value.url })}
                    allowedTypes={['image']}
                    render={({ open }) => (
                        <Button
                            variant="secondary"
                            onClick={open}
                        >
                            {imageUrl ? __('Change Image', 'tungool-builder') : __('Upload Image', 'tungool-builder')}
                        </Button>
                    )}
                />
                {imageUrl && <img src={imageUrl} alt={__('Card Image', 'tungool-builder')} className="card-image" />}
                <RichText
                    value={title}
                    onChange={value => setAttributes({ title: value })}
                    tagName="h2"
                />
                <RichText
                    value={subtitle}
                    onChange={value => setAttributes({ subtitle: value })}
                    tagName="p"
                />
                <div className="button-wrapper">
                    <RichText
                        tagName="a"
                        value={buttonText}
                        className="card-button"
                        onChange={(value) => setAttributes({ buttonText: value})}
                        placeholder={__('Read More', 'tungool-builder')}
                        allowFormats={['core/link']}
                    />
                </div>
            </div>
        </>
    );
}