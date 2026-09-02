import z from "zod";
import { OnboardingSchema } from "../schemas/onboarding-schema";

export type RestaurantForm = {
  id?: number
  name: string;
  description: string;
  logo_url: string | null;
  isActive: boolean;
};

export type OnboardingValues = z.infer<typeof OnboardingSchema>