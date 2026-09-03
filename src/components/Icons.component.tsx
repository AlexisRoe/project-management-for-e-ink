import type { JSX } from "react";

interface IconProps {
    label: string;
    size?: '24' | '40';
    variant: 'upload' | 'download' | 'plus' | 'close' | 'check' | 'trash' | 'edit' | 'eye' | 'search';
}

export function Icon({ size = '24', variant, label }: IconProps): JSX.Element {
    return <e-icon name={variant} size={size} label={label}></e-icon>
}