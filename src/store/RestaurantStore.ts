import { create } from "zustand";

interface RestaurantState {
  id: number | null;
  name: string | null;
  logo_url: string | null;
  setRestaurant: (restaurant: {
    id: number;
    name: string;
    logo_url: string | null;
  }) => void;
  clearRestaurant: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  id: null,
  name: null,
  logo_url: null,
  setRestaurant: (restaurant) =>
    set({
      id: restaurant.id,
      name: restaurant.name,
      logo_url: restaurant.logo_url,
    }),
  clearRestaurant: () =>
    set({
      id: null,
      name: null,
      logo_url: null,
    }),
}));
