import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	FocalPointPicker,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import ColorControl from '../ColorControl';
import GradientControl from '../GradientControl';
import './editor.scss';

/**
 * Value:
 * {
 *   color:    { normal, hover },
 *   gradient: { normal, hover },
 *   image:    { id, url },
 *   size: 'cover', position: { x: 0.5, y: 0.5 }, repeat: 'no-repeat', attachment: 'scroll',
 *   overlay:  { color, opacity: 0–100 },
 * }
 *
 * @param {Object}   props
 * @param {Object}   props.value
 * @param {Function} props.onChange Receives the full background object.
 */
export default function BackgroundControl( { value = {}, onChange } ) {
	const set = ( key ) => ( next ) => onChange( { ...value, [ key ]: next } );
	const image = value.image || {};
	const overlay = value.overlay || {};

	return (
		<div className="tb-background-control">
			<ColorControl
				label={ __( 'Background color', 'tungool-builder' ) }
				value={ value.color }
				onChange={ set( 'color' ) }
				hover
			/>

			<GradientControl
				label={ __( 'Background gradient', 'tungool-builder' ) }
				value={ value.gradient }
				onChange={ set( 'gradient' ) }
			/>

			<BaseControl label={ __( 'Background image', 'tungool-builder' ) } __nextHasNoMarginBottom>
				<MediaUploadCheck>
					<MediaUpload
						allowedTypes={ [ 'image' ] }
						value={ image.id }
						onSelect={ ( media ) => set( 'image' )( { id: media.id, url: media.url } ) }
						render={ ( { open } ) => (
							<div className="tb-background-control__image">
								{ image.url ? (
									<FocalPointPicker
										url={ image.url }
										value={ value.position || { x: 0.5, y: 0.5 } }
										onChange={ set( 'position' ) }
										__nextHasNoMarginBottom
									/>
								) : null }
								<Button variant="secondary" onClick={ open }>
									{ image.url
										? __( 'Replace image', 'tungool-builder' )
										: __( 'Select image', 'tungool-builder' ) }
								</Button>
								{ image.url && (
									<Button
										variant="tertiary"
										isDestructive
										onClick={ () => onChange( { ...value, image: {}, position: undefined } ) }
									>
										{ __( 'Remove', 'tungool-builder' ) }
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
			</BaseControl>

			{ image.url && (
				<>
					<SelectControl
						label={ __( 'Size', 'tungool-builder' ) }
						value={ value.size || '' }
						options={ [
							{ label: __( 'Default', 'tungool-builder' ), value: '' },
							{ label: __( 'Cover', 'tungool-builder' ), value: 'cover' },
							{ label: __( 'Contain', 'tungool-builder' ), value: 'contain' },
							{ label: __( 'Auto', 'tungool-builder' ), value: 'auto' },
						] }
						onChange={ set( 'size' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Repeat', 'tungool-builder' ) }
						value={ value.repeat || '' }
						options={ [
							{ label: __( 'Default', 'tungool-builder' ), value: '' },
							{ label: __( 'No repeat', 'tungool-builder' ), value: 'no-repeat' },
							{ label: __( 'Repeat', 'tungool-builder' ), value: 'repeat' },
							{ label: __( 'Repeat X', 'tungool-builder' ), value: 'repeat-x' },
							{ label: __( 'Repeat Y', 'tungool-builder' ), value: 'repeat-y' },
						] }
						onChange={ set( 'repeat' ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Attachment', 'tungool-builder' ) }
						value={ value.attachment || '' }
						options={ [
							{ label: __( 'Default', 'tungool-builder' ), value: '' },
							{ label: __( 'Scroll', 'tungool-builder' ), value: 'scroll' },
							{ label: __( 'Fixed', 'tungool-builder' ), value: 'fixed' },
						] }
						onChange={ set( 'attachment' ) }
						__nextHasNoMarginBottom
					/>
				</>
			) }

			<ColorControl
				label={ __( 'Overlay color', 'tungool-builder' ) }
				value={ { normal: overlay.color } }
				onChange={ ( next ) => set( 'overlay' )( { ...overlay, color: next.normal || '' } ) }
			/>
			{ overlay.color && (
				<RangeControl
					label={ __( 'Overlay opacity', 'tungool-builder' ) }
					value={ overlay.opacity ?? 50 }
					min={ 0 }
					max={ 100 }
					onChange={ ( next ) => set( 'overlay' )( { ...overlay, opacity: next ?? 50 } ) }
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				/>
			) }
		</div>
	);
}
