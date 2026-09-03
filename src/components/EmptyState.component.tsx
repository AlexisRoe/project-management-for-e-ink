import type { JSX } from 'react';

import { Icon } from './Icons.component';

import './EmptyState.component.css';

interface EmptyStateProps {
    icon: 'upload' | 'download' | 'plus' | 'close' | 'check' | 'trash' | 'edit' | 'eye' | 'search';
    label?: string;
}

export function EmptyState(props: EmptyStateProps): JSX.Element {
    return (
        <div className='empty-state'>
            <Icon variant={props.icon} label={props.label ?? 'empty'} size="40" />
            <h1>Oops nothing here</h1>
        </div>
    );
}
