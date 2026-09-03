import { useEffect, useRef, type JSX } from 'react';

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
            default-value={value}
            type="text"
            error={props.error ?? ''}
            onInput={(e) => setValue(e.currentTarget.value)}
        ></e-input>
    );
}

interface TextareaProps {
    placeholder?: string;
    error?: boolean | string;
    initialValue?: string;
    onDebouncedChange: (value: string) => void;
    debounceMs?: number;
}

export function Textarea(props: TextareaProps): JSX.Element {
    const [value, setValue] = useDebouncedInput(props.initialValue ?? '', props.onDebouncedChange, props.debounceMs ?? 300);

    return (
        <e-textarea
            placeholder={props.placeholder}
            value={value}
            error={props.error ?? ''}
            onInput={(e) => setValue(e.currentTarget.value)}
        ></e-textarea>
    );
}

interface SegmentedOption {
    value: string;
    label: string;
}

interface SegmentedProps {
    options: SegmentedOption[];
    value: string;
    onChange: (value: string) => void;
}

export function Segmented(props: SegmentedProps): JSX.Element {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleChange = (event: Event) => {
            const detail = (event as CustomEvent<{ value: string }>).detail;
            props.onChange(detail.value);
        };

        el.addEventListener('e-change', handleChange);
        return () => el.removeEventListener('e-change', handleChange);
    }, [props.onChange]);

    return (
        <e-segmented ref={ref} value={props.value}>
            {props.options.map((option) => (
                <e-segment key={option.value} value={option.value} label={option.label}></e-segment>
            ))}
        </e-segmented>
    );
}
