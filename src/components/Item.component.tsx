import type { JSX } from 'react'

import { DeleteButton, DetailButton, MoveButton } from './Button.component'

import './Item.component.css'

interface ItemActions {
    delete: () => void;
    move: () => void;
    openDetail: () => void;
}

interface ItemProps {
    title: string;
    description: string;
    actions: ItemActions;
    isMoving?: boolean;
}

export function Item({ title, description, actions, isMoving = false }: ItemProps): JSX.Element {
    return (
        <e-card className={isMoving ? 'item-card item-card-moving' : 'item-card'} title={title}>
            <div className='item-card-content'>
                <div className='item-card-body'>{description}</div>
                <div className='item-card-actions'>
                    <DetailButton onClick={actions.openDetail} />
                    <div className='item-card-actions-left'>
                        <MoveButton onClick={actions.move} isActive={isMoving} />
                        <DeleteButton onClick={actions.delete} />
                    </div>
                </div>
            </div>
        </e-card>
    );
}
