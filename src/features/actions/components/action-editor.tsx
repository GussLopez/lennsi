import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react"
import { ActionItem, ActionType } from "../types/types"
import { typeDetails } from "./actions-module"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ActionEditorProps = {
  item: ActionItem
  index: number
  itemCount: number
  canManage: boolean
  onUpdate: (clientId: string, patch: Partial<ActionItem>) => void
  onMove: (index: number, direction: -1 | 1) => void
  onDelete: () => void
}


export default function ActionEditor({
  item,
  index,
  itemCount,
  canManage,
  onUpdate,
  onMove,
  onDelete,
}: ActionEditorProps) {
  const Icon = typeDetails[item.type].icon

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:px-5 rounded-lg border border-input shadow-xs bg-background">
      <GripVertical className="mt-2 hidden size-4 text-muted-foreground sm:block cursor-grab" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4" />
          </span>
          <Select
            value={item.type}
            disabled={!canManage}
            onValueChange={(value) =>
              onUpdate(item.clientId, { type: value as ActionType })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {Object.entries(typeDetails).map(([value, detail]) => (
                <SelectItem key={value} value={value}>
                  {detail.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Switch
            checked={item.isEnabled}
            disabled={!canManage}
            aria-label={`Activar ${item.label}`}
            onCheckedChange={(isEnabled) =>
              onUpdate(item.clientId, { isEnabled })
            }
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`label-${item.clientId}`}>Label</Label>
            <Input
              id={`label-${item.clientId}`}
              value={item.label}
              maxLength={80}
              disabled={!canManage}
              onChange={(event) =>
                onUpdate(item.clientId, { label: event.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`url-${item.clientId}`}>URL</Label>
            <Input
              id={`url-${item.clientId}`}
              type="url"
              placeholder="https://..."
              value={item.url}
              disabled={!canManage}
              onChange={(event) =>
                onUpdate(item.clientId, { url: event.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-1 sm:flex-col">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!canManage}
          onClick={onDelete}
          aria-label="Eliminar acción"
          className="text-destructive hover:text-destructive hover:bg-red-50"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}