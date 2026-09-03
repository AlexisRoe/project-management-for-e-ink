import type { JSX, ReactElement } from "react";
import { Icon } from "./Icons.component";

import './Button.component.css';

interface ButtonProps {
    children: ReactElement | string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export function Button({ className, variant = 'primary', children, onClick, disabled = false }: ButtonProps): JSX.Element {
    return (
        <e-button className={className} variant={variant} onClick={onClick} disabled={disabled}>
            {children}
        </e-button>
    );
}

interface CancelButtonProps {
    onClick: () => void;
}

export function CancelButton({ onClick }: CancelButtonProps): JSX.Element {
    return <Button variant="secondary" onClick={onClick}>
        <Icon variant='close' label="close" />
    </Button>
}

interface CreateButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export function CreateButton({ onClick, disabled }: CreateButtonProps): JSX.Element {
    return <Button className={disabled ? 'create-button-disabled' : undefined} onClick={onClick} disabled={disabled}>
        <>
            <Icon variant='check' label="Create" />
            <span> Create</span>
        </>
    </Button>
}