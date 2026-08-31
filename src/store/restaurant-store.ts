import { createStore } from "zustand/vanilla"

export type Restaurant = {
  id: number
  name: string
  logoUrl: string | null
}

export type RestaurantStore = {
  id: number | null
  name: string | null
  logoUrl: string | null
  setRestaurant: (restaurant: Restaurant) => void
  clearRestaurant: () => void
}

export function createRestaurantStore(initialRestaurant: Restaurant) {
  return createStore<RestaurantStore>()((set) => ({
    ...initialRestaurant,
    setRestaurant: (restaurant) => set(restaurant),
    clearRestaurant: () => set({ id: null, name: null, logoUrl: null }),
  }))
}
