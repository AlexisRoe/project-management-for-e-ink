import { useState, type JSX, type ReactElement } from 'react';

import './Projects.components.css';
import { Button, CancelButton, CreateButton } from './Button.component';

interface ProjectGridProps {
    children: ReactElement | ReactElement[];
}

export function ProjectGrid(props: ProjectGridProps): JSX.Element {
    return <div className='project-grid'>{props.children}</div>
}

interface ProjectCardCreateProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (label: string) => void;
}

function ProjectCardCreate({ isVisible, onClose, onCreate }: ProjectCardCreateProps): JSX.Element {
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
                <e-input
                    label="Project name"
                    placeholder="Example"
                    hint=""
                    value={value}
                    type="text"
                    error=""
                    onInput={(e) => setValue(e.currentTarget.value)}
                ></e-input>
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
    total: number;
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
            eyebrow={`${props.total} ITEMS`}
        >
            <p>This is the card body. Add any content here.</p>
        </e-card>
    );
}

ProjectCard.Create = ProjectCardCreate;

export { ProjectCard };