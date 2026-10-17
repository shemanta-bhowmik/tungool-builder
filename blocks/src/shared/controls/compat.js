/**
 * Components that are still __experimental in WP 6.5 but stable later.
 * Missing named exports from the wp.components global resolve to undefined.
 */
import * as components from '@wordpress/components';
import * as blockEditor from '@wordpress/block-editor';

export const BoxControl = components.BoxControl || components.__experimentalBoxControl;
export const UnitControl = components.UnitControl || components.__experimentalUnitControl;
export const NumberControl = components.NumberControl || components.__experimentalNumberControl;
export const BorderControl = components.BorderControl || components.__experimentalBorderControl;
export const ToggleGroupControl =
	components.ToggleGroupControl || components.__experimentalToggleGroupControl;
export const ToggleGroupControlOption =
	components.ToggleGroupControlOption || components.__experimentalToggleGroupControlOption;

export const LinkControl = blockEditor.LinkControl || blockEditor.__experimentalLinkControl;
