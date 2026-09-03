import type { JSX } from 'react/jsx-runtime';

import './Progress.component.css';

interface ProgressBarProps {
    value: number;
    steps?: number;
    label?: string;

}

export function ProgressBar(props: ProgressBarProps): JSX.Element {
    return <e-progress
        className='progressbar'
        value={`${props.value}`}
        max="100"
        variant="linear"
        steps={props.steps ? `${props.steps}` : ''}
        label={props.label ?? ''}
    ></e-progress>
}