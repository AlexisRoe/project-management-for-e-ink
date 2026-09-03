import type { JSX } from 'react/jsx-runtime';

import './Progress.component.css';
import { Mono } from './Text.component';
import type { ReactElement } from 'react';

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

interface ProgressOverviewProps {
    total: number;
    done: number;
}

export function ProgressOverview({ total, done }: ProgressOverviewProps): JSX.Element {
    const doneInPercent = total !== 0 ? done * 100 / total : 0;

    return (
        <div className='progress-overview'>
            <Mono>{`${done}/${total} DONE`}</Mono>
            <Mono>{`●`}</Mono>
            <Mono>{`${doneInPercent}%`}</Mono>
        </div>
    );
}

interface ProgressContainerProps {
    children: ReactElement | ReactElement[];
}

export function ProgressContainer({ children }: ProgressContainerProps): JSX.Element {
    return <div className='progress-container'>{children}</div>
}