import type { JSX } from 'react';

import { Icon } from './Icons.component';

import './EmptyState.component.css';

interface EmptyStateProps {
    icon: 'upload' | 'download' | 'plus' | 'close' | 'check' | 'trash' | 'edit' | 'eye' | 'search' | 'moon' | 'refresh';
    label?: string;
    message?: string;
}

export function EmptyState(props: EmptyStateProps): JSX.Element {
    return (
        <div className='empty-state'>
            <Icon variant={props.icon} label={props.label ?? 'empty'} size="40" />
            <h1>{props.message ?? 'Oops nothing here'}</h1>
        </div>
    );
}
