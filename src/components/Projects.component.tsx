import { useState, type JSX, type ReactElement } from 'react';

import './Projects.components.css';
import { Button, CancelButton, CreateButton } from './Button.component';
import { Input } from './Input.component';
import { ProgressBar } from './Progress.component';

interface ProjectGridProps {
    children: ReactElement | ReactElement[];
}

export function ProjectGrid(props: ProjectGridProps): JSX.Element {
    return <div className='project-grid'>{props.children}</div>
}

interface ProjectCardUpdateProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (label: string) => void;
}

function ProjectCardUpdate({ isVisible, onClose, onCreate }: ProjectCardUpdateProps): JSX.Element {
    const [value, setValue] = useState<string>('');

    if (isVisible === false) return <></>;

    const handleCreate = () => {
        onCreate(value);
        onClose();
    }

    const isCreateDisabled = value.trim().length === 0;

    return (
        <e-card
            className='project-cards'
            title="New Project"
            data-type='new-card'
        >
            <div className='project-cards-new-content'>
                <Input
                    label="Project name"
                    placeholder="Example"
                    onDebouncedChange={setValue}
                />
                <div className='project-cards-new-content-actions'>
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

interface ProjectCardProps {
    amountCompleted: number;
    amountTotal: number;
    // items: Items;
    // doneInPercent: number;
    // open: () => void;
    // delete: () => void;
    // update: () => void;
    title: string;
}

function ProjectCard(props: ProjectCardProps): JSX.Element {
    return (
        <e-card
            className='project-cards'
            title={props.title}
            eyebrow={`${props.amountCompleted} ITEMS`}
        >
            <ProgressBar value={30} />
        </e-card>
    );
}

ProjectCard.Update = ProjectCardUpdate;

export { ProjectCard };