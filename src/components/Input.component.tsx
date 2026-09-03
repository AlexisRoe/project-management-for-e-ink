import { forwardRef, useEffect, useRef, type JSX } from 'react';
import type { ESegmented } from '@marcomattes/epaper-components';

import { useDebouncedInput } from '../hooks/use-debounced.hook';

import './Input.component.css';

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

interface FileInputProps {
    accept?: string;
    onFileSelected: (file: File) => void;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) props.onFileSelected(file);
        e.target.value = '';
    };

    return (
        <input
            ref={ref}
            type="file"
            accept={props.accept}
            style={{ display: 'none' }}
            onChange={handleChange}
        />
    );
});

interface TextareaProps {
    label?: string;
    placeholder?: string;
    error?: boolean | string;
    initialValue?: string;
    onDebouncedChange: (value: string) => void;
    debounceMs?: number;
}

export function Textarea(props: TextareaProps): JSX.Element {
    const [value, setValue] = useDebouncedInput(props.initialValue ?? '', props.onDebouncedChange, props.debounceMs ?? 300);

    return (
        <div className="field-group">
            {props.label && <e-text className="field-label" kind="label" as="span">{props.label}</e-text>}
            <e-textarea
                placeholder={props.placeholder}
                value={value}
                error={props.error ?? ''}
                onInput={(e) => setValue(e.currentTarget.value)}
            ></e-textarea>
        </div>
    );
}

interface SegmentedOption {
    value: string;
    label: string;
}

interface SegmentedProps {
    label?: string;
    options: SegmentedOption[];
    value: string;
    onChange: (value: string) => void;
}

export function Segmented(props: SegmentedProps): JSX.Element {
    const ref = useRef<ESegmented>(null);

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
        <div className="field-group">
            {props.label && <e-text className="field-label" kind="label" as="span">{props.label}</e-text>}
            <e-segmented ref={ref} value={props.value}>
                {props.options.map((option) => (
                    <e-segment key={option.value} value={option.value} label={option.label}></e-segment>
                ))}
            </e-segmented>
        </div>
    );
}
