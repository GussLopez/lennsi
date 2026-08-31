"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useStore } from "zustand"
import type { StoreApi } from "zustand/vanilla"

import {
  createRestaurantStore,
  type Restaurant,
  type RestaurantStore,
} from "./restaurant-store"

const RestaurantStoreContext = createContext<StoreApi<RestaurantStore> | null>(
  null,
)

export function RestaurantStoreProvider({
  children,
  restaurant,
}: {
  children: ReactNode
  restaurant: Restaurant
}) {
  const [store] = useState(() => createRestaurantStore(restaurant))

  return (
    <RestaurantStoreContext.Provider value={store}>
      {children}
    </RestaurantStoreContext.Provider>
  )
}

export function useRestaurantStore<T>(
  selector: (state: RestaurantStore) => T,
) {
  const store = useContext(RestaurantStoreContext)

  if (!store) {
    throw new Error(
      "useRestaurantStore debe usarse dentro de RestaurantStoreProvider.",
    )
  }

  return useStore(store, selector)
}
