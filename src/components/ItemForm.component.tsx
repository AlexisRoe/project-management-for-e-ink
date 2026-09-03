import { useEffect, useState, type JSX } from 'react';

import { Input, Segmented, Textarea } from './Input.component';
import type { ColumnStatus } from '../db/types';

import './ItemForm.component.css';

const COLUMN_OPTIONS: { value: ColumnStatus; label: string }[] = [
    { value: 'todo', label: 'To do' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'testing', label: 'Testing' },
    { value: 'done', label: 'Done' },
];

export interface ItemFormValue {
    title: string;
    description: string;
    column: ColumnStatus;
}

interface ItemFormProps {
    initialTitle?: string;
    initialDescription?: string;
    initialColumn?: ColumnStatus;
    onChange: (value: ItemFormValue) => void;
}

export function ItemForm(props: ItemFormProps): JSX.Element {
    const [title, setTitle] = useState(props.initialTitle ?? '');
    const [description, setDescription] = useState(props.initialDescription ?? '');
    const [column, setColumn] = useState<ColumnStatus>(props.initialColumn ?? 'todo');

    useEffect(() => {
        props.onChange({ title, description, column });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        props.onChange({ title: value, description, column });
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        props.onChange({ title, description: value, column });
    };

    const handleColumnChange = (value: string) => {
        const nextColumn = value as ColumnStatus;
        setColumn(nextColumn);
        props.onChange({ title, description, column: nextColumn });
    };

    return (
        <div className="item-form">
            <Input
                label="Title"
                placeholder="Item title"
                initialValue={title}
                onDebouncedChange={handleTitleChange}
                debounceMs={0}
            />
            <div className="item-form-field">
                <e-text className="item-form-label" kind="label" as="span">DESCRIPTION</e-text>
                <Textarea
                    placeholder="Describe this item…"
                    initialValue={description}
                    onDebouncedChange={handleDescriptionChange}
                    debounceMs={0}
                />
            </div>
            <div className="item-form-field">
                <e-text className="item-form-label" kind="label" as="span">COLUMN</e-text>
                <Segmented options={COLUMN_OPTIONS} value={column} onChange={handleColumnChange} />
            </div>
        </div>
    );
}
