import library from '../../../../assets/icons/icons.json';

export { library };

/**
 * Renders an icon from assets/icons/icons.json. Same markup as \SB\TungoolBuilder\Helpers\Icons::svg().
 *
 * @param {Object} props
 * @param {string} props.name      Icon key.
 * @param {string} [props.className]
 * @return {Element|null} SVG or null for unknown names.
 */
export default function Icon( { name, className = 'tb-icon' } ) {
	const icon = library[ name ];
	if ( ! icon ) {
		return null;
	}
	return (
		<svg
			className={ className }
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden="true"
			focusable="false"
		>
			<path fill="currentColor" d={ icon.path } />
		</svg>
	);
}
