import { useDragLayer } from 'react-dnd'
import { Card } from './Card'
import { Column } from './Column'
import { useAppState } from './state/AppStateContext'
import { CustomDragLayerContainer, DragPreviewWrapper } from './styles'

export const CustomDragLayer = (): React.ReactElement | null => {
  const { draggedItem } = useAppState()
  const { currentOffset } = useDragLayer(monitor => ({
    currentOffset: monitor.getSourceClientOffset()
  }))

  return draggedItem && currentOffset
    ? (
      <CustomDragLayerContainer>
        <DragPreviewWrapper position={currentOffset}>
          {
            draggedItem.type === 'COLUMN'
              ? (
                <Column id={draggedItem.id} text={draggedItem.text} isPreview />
                )
              : (
                <Card columnId={draggedItem.columnId} id={draggedItem.id} text={draggedItem.text} isPreview />
                )
          }
        </DragPreviewWrapper>
      </CustomDragLayerContainer>
      )
    : null
}
