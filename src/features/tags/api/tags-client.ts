import type { TagFormValues } from "@/features/tags/schemas/tag-schema"
import type { TagsResponse } from "@/features/tags/types/types"

export async function fetchTags(): Promise<TagsResponse> {
  return request<TagsResponse>("/api/tags")
}

export async function createTag(values: TagFormValues) {
  return request<{ id: number }>("/api/tags", {
    method: "POST",
    body: JSON.stringify(values),
  })
}

export async function updateTag(values: TagFormValues & { id: number }) {
  return request<{ id: number }>("/api/tags", {
    method: "PATCH",
    body: JSON.stringify(values),
  })
}

export async function deleteTags(ids: number[]) {
  return request<{ count: number }>("/api/tags", {
    method: "DELETE",
    body: JSON.stringify(ids),
  })
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const payload = await response.json().catch(() => null) as { error?: string } | null

  if (!response.ok) {
    throw new Error(payload?.error ?? "Ocurrió un error inesperado.")
  }

  return payload as T
}
