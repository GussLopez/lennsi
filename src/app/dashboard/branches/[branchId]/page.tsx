import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACTIVE_RESTAURANT_COOKIE } from "@/features/dashboard/constants";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, Edit, ExternalLink, UtensilsCrossed } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { typesList } from "@/features/branches/data";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ branchId: string }>
}

export default async function ViewBranchPage({
  params
}: PageProps) {
  const { branchId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login');

  const cookieStore = await cookies();
  const requestedRestaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value)

  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const membership = memberships?.find(
    item => item.restaurant_id === requestedRestaurantId
  ) ?? memberships?.[0];

  if (
    !membership ||
    !["owner", "admin", "manager"].includes(membership.role)
  ) redirect("/dashboard/branches")

  const { data: branch } = await supabase
    .from("branches")
    .select(`
      *,
      touchpoints (
        id,
        name,
        type,
        is_active,
        tags (
          id,
          label,
          is_active
        )
      )
    `)
    .eq("id", Number(branchId))
    .eq("restaurant_id", membership.restaurant_id)
    .maybeSingle();

  if (!branch) notFound();

  const menuPublicUrl = branch.menu_url
    ? supabase.storage
      .from("menus")
      .getPublicUrl(branch.menu_url).data.publicUrl
    : null

  const date = new Date(branch.created_at);
  return (
    <div className="w-full max-w-5xl flex flex-col gap-5 mx-auto px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/dashboard/branches">
                <ArrowLeft />
                <span className="sr-only">Volver atrás</span>
              </Link>
            }
          />
          <div>
            <p className="text-xl font-semibold tracking-tight">
              Detalles de la Sucursal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {menuPublicUrl && (
            <Button
              variant={'outline'}
              nativeButton={false}
              render={
                <a
                  href={menuPublicUrl}
                  target="_blank"
                >
                  <ExternalLink />
                  Ver Menú
                </a>
              }
            />
          )}
          <Button>
            <Edit />
            Editar sucursal
          </Button>
        </div>
      </div>

      <section className="p-4 border border-input shadow-xs rounded-xl bg-white">
        <h1 className="text-2xl font-semibold">{branch.name}</h1>
        <div className="mt-5">
          <div className="grid grid-cols-4 gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Télefono</span>
              <p className="font-medium">{branch.phone}</p>
            </div>
            <div className="flex flex-col gap-2 col-span-3">
              <span className="text-xs font-medium text-muted-foreground">Dirección</span>
              <p className="font-medium">{branch.address}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Estado</span>
              <Badge
                className={cn(branch.is_active ? 'bg-green-600/10 text-emerald-600' : 'bg-red-600/10 text-red-600')}
              >
                {branch.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Zona Horaria</span>
              <p className="font-medium">{branch.timezone}</p>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <span className="text-xs font-medium text-muted-foreground">Creado el</span>
              <p className="font-medium">{date.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <h2 className="text-lg font-semibold">Puntos de acceso</h2>
        <Accordion
          className='w-full space-y-2 overflow-visible border-0 mt-4'
        >
          {branch.touchpoints.map((touchpoint) => {
            const type = typesList.find(t => t.value === touchpoint.type)
            return (
              <AccordionItem
                key={touchpoint.id}
                value={touchpoint.id}
                className='border shadow-xs rounded-lg data-open:shadow-md bg-white'
              >
                <AccordionPrimitive.Header className='flex'>
                  <AccordionPrimitive.Trigger
                    className='px-5 py-2.5 flex flex-1 items-center justify-between gap-4 rounded-lg text-left font-medium'
                  >
                    {touchpoint.name}
                    <ChevronLeft className="size-4.5 shrink-0 in-data-open:-rotate-90 transition-transform duration-200 text-muted-foreground" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className='px-4'>
                  <Separator className='w-full' />
                  <div className="grid grid-cols-2 gap-5 mt-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Tipo:</span>
                      <div className="mt-3">
                        {type ? (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex justify-center items-center rounded-lg shadow-sm">
                              <img
                                src={type.icon}
                                alt={`Icono de ${type.name}`}
                                className="size-8"
                              />
                            </div>
                            <p className="text-xl font-medium">{type.name}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex justify-center items-center rounded-lg shadow-sm">
                              <UtensilsCrossed />
                            </div>
                            <p className="text-xl font-medium">Otro</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Tags enlazados:</span>
                      <div className="mt-3 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tag</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {touchpoint.tags.map((tag) => (
                              <TableRow
                                key={tag.id}
                              >
                                <TableCell>{tag.label}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={cn(tag.is_active ? 'bg-green-600/10 text-emerald-600' : 'bg-red-600/10 text-red-600')}
                                  >
                                    {tag.is_active ? 'Activo' : 'Inactivo'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </section>
    </div>
  )
}
