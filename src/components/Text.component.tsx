import type { JSX, ReactElement } from "react";

import './Text.component.css';

interface TitleProps {
    /** Title label displayed to users */
    children: ReactElement | string;
    /** Defines the header size */
    size?: '1' | '2' | '3' | '4' | '5' | '6'
}

export function Title(props: TitleProps): JSX.Element {
    const size = props.size ?? '1';

    return <e-title level={size}>{props.children}</e-title>
}

interface TitleLabelProps {
    /** Label all in uppercase and styling */
    children: string;
    /** Icon on the left */
    iconLeft?: ReactElement
}

export function TitleLabel(props: TitleLabelProps): JSX.Element {

    if (props.iconLeft) {
        return <div className="title-label-container">
            {props.iconLeft}
            <e-text kind="label" as="span">
                {props.children.toUpperCase()}
            </e-text>
        </div>
    }

    return <e-text kind="label" as="span">
        {props.children.toUpperCase()}
    </e-text>
}

interface MonoProps {
    children: string;
}

export function Mono({ children }: MonoProps): JSX.Element {
    return <e-text kind="mono" as="span">{children}</e-text>
}