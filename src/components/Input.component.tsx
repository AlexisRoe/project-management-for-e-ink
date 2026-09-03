import type { JSX } from 'react';

import { useDebouncedInput } from '../hooks/useDebouncedInput';

interface InputProps {
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: boolean | string;
    initialValue?: string;
    onDebouncedChange: (value: string) => void;
    debounceMs?: number;
}

export function Input(props: InputProps): JSX.Element {
    const [value, setValue] = useDebouncedInput(props.initialValue ?? '', props.onDebouncedChange, props.debounceMs ?? 300);

    return (
        <e-input
            label={props.label}
            placeholder={props.placeholder}
            hint={props.hint ?? ''}
            value={value}
            type="text"
            error={props.error ?? ''}
            onInput={(e) => setValue(e.currentTarget.value)}
        ></e-input>
    );
}
