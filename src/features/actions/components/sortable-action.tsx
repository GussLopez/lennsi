'use client'

import React from "react";
import { ActionItem } from "../types/types";
import { Reorder, useDragControls } from "motion/react";

export default function SortableAction({
  item, 
  children
}: {
  item: ActionItem,
  children: (startDragging: (event: React.PointerEvent) => void) => React.ReactNode
}) {
  const dragControls = useDragControls();
  return (
  <Reorder.Item
    as="div"
    value={item}
    dragListener={false}
    dragControls={dragControls}
    transition={{
      type: "spring",
      stiffness: 350,
      damping: 30
    }}
    whileDrag={{ scale: 1.03 }}
  >
    {children((event) => dragControls.start(event))}
  </Reorder.Item>
  )  
}
