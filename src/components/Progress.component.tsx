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

interface ProgressBarLegendProps {
    amounts: {
        todo: number;
        inProgress: number;
        testing: number;
        done: number;
    };
    doneInPercent: number;
    label: string;
}

export function ProgressBarLegend(props: ProgressBarLegendProps): JSX.Element {
    return (
        <div className='progress-bar-legend-container'>
            <div className='progress-bar-legend-item-container'>
                <div className='progress-bar-legend-item-todo'>{props.amounts.todo}</div>
                <div className='progress-bar-legend-item-inprogress'>{props.amounts.inProgress}</div>
                <div className='progress-bar-legend-item-testing'>{props.amounts.testing}</div>
                <div className='progress-bar-legend-item-done'>{props.amounts.done}</div>
            </div>
            <div className='progress-bar-legend-done-container'>
                <div>{`${props.doneInPercent}% ${props.label}`}</div>
            </div>
        </div>
    );
}