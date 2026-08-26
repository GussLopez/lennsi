import { GripVertical, Trash2 } from "lucide-react"
import type { ActionItem, ActionType } from "../types/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { typeDetails } from "../data"

type ActionEditorProps = {
  item: ActionItem
  canManage: boolean
  urlError?: string
  onUpdate: (clientId: string, patch: Partial<ActionItem>) => void
  onDelete: () => void
}


export default function ActionEditor({
  item,
  canManage,
  urlError,
  onUpdate,
  onDelete,
}: ActionEditorProps) {
  const selectedType =
    typeDetails.find((detail) => detail.value === item.type) ?? typeDetails[0]
  const Icon = selectedType.icon
  const isWhatsApp = item.type === "whatsapp"

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:px-5 rounded-lg border border-input shadow-xs bg-background">
      <GripVertical className="mt-2 hidden size-4 text-muted-foreground sm:block cursor-grab" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4" />
          </span>
          <Select<ActionType>
            value={item.type}
            items={typeDetails}
            disabled={!canManage}
            onValueChange={(value) =>
              onUpdate(item.clientId, { type: value as ActionType })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {typeDetails.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
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
            <Label htmlFor={`url-${item.clientId}`}>
              {isWhatsApp ? "Número o enlace de WhatsApp" : "URL"}
            </Label>
            <Input
              id={`url-${item.clientId}`}
              type={isWhatsApp ? "tel" : "url"}
              required
              placeholder={isWhatsApp ? "+529981234567" : "https://..."}
              value={item.url}
              disabled={!canManage}
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? `url-error-${item.clientId}` : undefined}
              onChange={(event) =>
                onUpdate(item.clientId, { url: event.target.value })
              }
            />
            {urlError && (
              <p
                id={`url-error-${item.clientId}`}
                className="text-xs text-destructive"
              >
                {urlError}
              </p>
            )}
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
