import { __, sprintf } from '@wordpress/i18n';
import Icon from '../shared/icons/Icon';

/**
 * Clamp to 0–5 in half steps. Mirrors tb_testimonial_rating() logic in render.php.
 *
 * @param {*} value Raw rating.
 * @return {number} Rating.
 */
export const clampRating = ( value ) => {
	const n = Number( value );
	return Number.isFinite( n ) ? Math.min( 5, Math.max( 0, Math.round( n * 2 ) / 2 ) ) : 0;
};

/**
 * Five stars, full / half / empty. Same markup as render.php.
 *
 * @param {Object} props
 * @param {number} props.rating
 * @return {Element} Rating element.
 */
export default function Stars( { rating } ) {
	const value = clampRating( rating );
	return (
		<div
			className="tb-testimonial__rating"
			role="img"
			aria-label={ sprintf(
				/* translators: %s: rating, e.g. 4.5. */
				__( 'Rated %s out of 5', 'tungool-builder' ),
				String( value )
			) }
		>
			{ [ 1, 2, 3, 4, 5 ].map( ( i ) => {
				let state = 'empty';
				if ( value >= i ) {
					state = 'full';
				} else if ( value >= i - 0.5 ) {
					state = 'half';
				}
				return (
					<span key={ i } className={ `tb-star tb-star--${ state }` }>
						<Icon name="star" />
						{ state !== 'empty' && (
							<span className="tb-star__fill">
								<Icon name="star" />
							</span>
						) }
					</span>
				);
			} ) }
		</div>
	);
}
