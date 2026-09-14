"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice, plans, priceNote, type PlanId } from "../data/plans";

export default function PlanInterest({ planId }: { planId: PlanId }) {
  const plan = plans.find((item) => item.id === planId);
  if (!plan) return null;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={`h-12 w-full cursor-pointer rounded-xl font-semibold ${plan.featured ? "bg-primary hover:bg-dark-primary" : "bg-charcoal text-white hover:bg-charcoal/90"}`}
          />
        }
      >
        Me interesa {plan.name}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Plan {plan.name}</DialogTitle>
          <DialogDescription>
            La contratación en línea estará disponible próximamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-charcoal">
            {formatPrice(plan.price)}{" "}
            <span className="text-sm font-normal">MXN / mes por sucursal</span>
          </p>
          <p className="text-sm text-muted-foreground">{priceNote}</p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button className="cursor-pointer" />}>
            Cerrar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
