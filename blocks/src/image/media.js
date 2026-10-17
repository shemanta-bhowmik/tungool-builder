/**
 * Best URL/dimensions for a size slug, falling back to the full image.
 *
 * @param {Object} media    Media object (REST or media modal shape).
 * @param {string} sizeSlug Size slug.
 * @return {Object} { url, width, height }
 */
export function sizeData( media, sizeSlug ) {
	const sizes = media?.media_details?.sizes || media?.sizes || {};
	const size = sizes[ sizeSlug ] || sizes.full;
	if ( size ) {
		return {
			url: size.source_url || size.url,
			width: Number( size.width ) || 0,
			height: Number( size.height ) || 0,
		};
	}
	return {
		url: media?.source_url || media?.url || '',
		width: Number( media?.media_details?.width || media?.width ) || 0,
		height: Number( media?.media_details?.height || media?.height ) || 0,
	};
}
