import { useState, type JSX, type ReactNode } from 'react';

import { Button, CancelButton, CreateButton, DeleteButton, EditButton, OpenButton } from './Button.component';
import { Icon } from './Icons.component';
import { Input } from './Input.component';
import { ProgressBar, ProgressBarLegend } from './Progress.component';

import './Projects.component.css';

interface ProjectGridProps {
    children: ReactNode;
}

export function ProjectGrid(props: ProjectGridProps): JSX.Element {
    return <div className='project-grid'>{props.children}</div>
}

interface ProjectCardUpdateProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (label: string) => void;
    title?: string
    initialValue?: string;
    eyebrow?: string;
}

function ProjectCardUpdate({ eyebrow, initialValue = '', isVisible, onClose, onCreate, title = 'New Project' }: ProjectCardUpdateProps): JSX.Element {
    const [value, setValue] = useState<string>(initialValue);

    if (isVisible === false) return <></>;

    const handleCreate = () => {
        onCreate(value);
        onClose();
    }

    const isCreateDisabled = value.trim().length === 0;

    return (
        <e-card
            className='project-cards'
            title={title}
            eyebrow={eyebrow ?? ''}
            data-type='new-card'
        >
            <div className='project-cards-content'>
                <div className='project-cards-body'>
                    <Input
                        label="Project name"
                        placeholder="Example"
                        onDebouncedChange={setValue}
                        initialValue={initialValue}
                    />
                </div>
                <div className='project-cards-actions'>
                    <CreateButton onClick={handleCreate} disabled={isCreateDisabled} />
                    <CancelButton onClick={onClose} />
                </div>
            </div>
        </e-card>
    );
}

interface Items {
    todo: number;
    inProgress: number;
    testing: number;
    done: number
}

interface ItemActions {
    update: (title: string) => void;
    delete: () => void;
    open: () => void;
}

interface ProjectCardProps {
    title: string;
    items: Items;
    actions: ItemActions
}

function sum(input: number[]): number {
    return input.reduce((prev, cur) => prev + cur, 0);
}

function ProjectCard(props: ProjectCardProps): JSX.Element {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

    const total = sum(Object.values(props.items));
    const done = props.items.done;
    const doneInPercent = total === 0 ? 0 : (done * 100) / total;

    if (isEditing) {
        return (
            <ProjectCardUpdate
                isVisible
                title={props.title}
                initialValue={props.title}
                onClose={() => setIsEditing(false)}
                onCreate={(title) => props.actions.update(title)}
            />
        );
    }

    return (
        <e-card
            className='project-cards'
            title={props.title}
            eyebrow={`${total} ITEMS`}
        >
            <div className='project-cards-content'>
                <div className='project-cars-progress project-cards-body'>
                    <ProgressBar value={doneInPercent} />
                    <ProgressBarLegend doneInPercent={doneInPercent} label='done' amounts={props.items} />
                </div>
                {isConfirmingDelete ? (
                    <div className='project-cards-delete-confirm'>
                        <div className='project-cards-delete-confirm-text'>Delete this project?</div>
                        <div className='project-cards-actions-left'>
                            <Button onClick={() => { props.actions.delete(); setIsConfirmingDelete(false); }}>
                                <Icon variant='trash' label='confirm delete' />
                            </Button>
                            <Button variant='secondary' onClick={() => setIsConfirmingDelete(false)}>
                                <Icon variant='close' label='cancel delete' />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='project-cards-actions'>
                        <div className='project-cards-actions-left'>
                            <OpenButton onClick={props.actions.open} />
                            <EditButton onClick={() => setIsEditing(true)} />
                        </div>
                        <DeleteButton onClick={() => setIsConfirmingDelete(true)} />
                    </div>
                )}
            </div>
        </e-card>
    );
}

ProjectCard.Update = ProjectCardUpdate;

export { ProjectCard };