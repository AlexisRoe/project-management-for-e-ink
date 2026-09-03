import type { JSX } from "react";

interface IconProps {
    label?: string;
    size?: '16' | '24' | '40';
    variant: 'chevL' | 'upload' | 'download' | 'plus' | 'close' | 'check' | 'trash' | 'edit' | 'eye' | 'search';
    onClick?: () => void;
}

export function Icon({ size = '24', variant, label = '', onClick }: IconProps): JSX.Element {
    return <e-icon
        name={variant}
        size={size}
        label={label}
        onClick={onClick}
    ></e-icon>
}