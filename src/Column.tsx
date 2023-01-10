import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { throttle } from 'throttle-debounce-ts'
import { AddNewItem } from './AddNewItem'
import { Card } from './Card'
import { addTask, moveList, moveTask, setDraggedItem } from './state/actions'
import { useAppState } from './state/AppStateContext'
import { ColumnContainer, ColumnTitle } from './styles'
import { isHidden } from './utils/isHiden'
import { useItemDrag } from './utils/useItemDrag'

interface ColumnProps {
  text: string
  id: string
  isPreview?: boolean
}

export const Column = ({ text, id, isPreview }: ColumnProps): React.ReactElement => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState()
  const tasks = getTasksByListId(id)
  const ref = useRef<HTMLDivElement>(null)
  const { drag } = useItemDrag({ type: 'COLUMN', id, text })
  const [, drop] = useDrop({
    accept: ['COLUMN', 'CARD'],
    hover: throttle(200, () => {
      if (!draggedItem) {
        return
      }
      if (draggedItem.type === 'COLUMN') {
        if (draggedItem.id === id) {
          return
        }
        dispatch(moveList(draggedItem.id, id))
      } else {
        if (draggedItem.columnId === id) {
          return
        } if (tasks.length) {
          return
        }
        dispatch(moveTask(draggedItem.id, null, draggedItem.columnId, id))
        dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
      }
    })
  })

  drag(drop(ref))

  return (
    <ColumnContainer
      ref={ref}
      isPreview={isPreview}
      isHidden={isHidden(draggedItem, 'COLUMN', id, isPreview)}
    >
      <ColumnTitle>{text}</ColumnTitle>
      {
      tasks.map(task => (
        <Card text={task.text} key={task.id} id={task.id} columnId={id} />
      ))
    }
      <AddNewItem toggleButtonText='+ Add another Card' onAdd={taskText => dispatch(addTask(taskText, id))} dark />
    </ColumnContainer>
  )
}
