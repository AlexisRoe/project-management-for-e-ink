import type { JSX } from "react";

interface IconProps {
    label: string;
    size?: '24';
    variant: 'upload' | 'download' | 'plus' | 'close' | 'check';
}

export function Icon({ size = '24', variant, label }: IconProps): JSX.Element {
    return <e-icon name={variant} size={size} label={label}></e-icon>
}