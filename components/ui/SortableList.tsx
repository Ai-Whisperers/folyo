'use client'

import { useState, ReactNode } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface SortableItemProps {
  id: string
  children: ReactNode
  handle?: boolean
}

export function SortableItem({ id, children, handle = true }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? 'shadow-lg ring-2 ring-teal-500' : ''}
      `}
    >
      {handle && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Bars3Icon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
      {!handle && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          {children}
        </div>
      )}
      {handle && children}
    </div>
  )
}

interface SortableListProps<T extends { id: string }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  renderOverlay?: (item: T) => ReactNode
  handle?: boolean
  className?: string
  itemClassName?: string
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  renderOverlay,
  handle = true,
  className = '',
  itemClassName = ''
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Require 8px movement before drag starts
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order property on each item
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          order: index
        }))
        onReorder(reorderedItems)
      }
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeItem = activeId ? items.find(item => item.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <div key={item.id} className={itemClassName}>
              <SortableItem id={item.id} handle={handle}>
                {renderItem(item, index)}
              </SortableItem>
            </div>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem && renderOverlay ? (
          <div className="bg-white rounded-lg shadow-2xl ring-2 ring-teal-500 p-4">
            {renderOverlay(activeItem)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// Helper to ensure items have unique IDs
export function ensureIds<T extends { id?: string }>(items: T[]): (T & { id: string })[] {
  return items.map((item, index) => ({
    ...item,
    id: item.id || `item-${index}-${Date.now()}`
  }))
}

export default SortableList
