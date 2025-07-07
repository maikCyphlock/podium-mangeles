"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Trash2, Pencil } from "lucide-react";
import { createClient } from '@/lib/supabaseClient';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { validateParticipant, GENDERS, BLOOD_TYPES } from '@/lib/participantValidation';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  bloodType: string;
  createdAt: string;
  deleted_at?: string | null;
  gender: string;
  birthDate: string;
  emergencyContact: string;
}

interface ParticipantsTableProps {
  participants: Participant[];
}

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(birthDate: string): number {
  const nacimiento = new Date(birthDate);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editing, setEditing] = useState<Participant | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Participant> | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Soft delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este participante?')) return;
    setLoadingId(id);
    const res = await fetch(`/admin/api/participants?id=${id}`, { method: 'DELETE' });
    setLoadingId(null);
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Error al eliminar participante');
    }
  };

  // Exportar a Excel (solo filtrados)
  const exportToExcel = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const data = filteredRows.map(row => {
      const p = row.original;
      return {
        Nombre: p.firstName,
        Apellido: p.lastName,
        Email: p.email,
        Ciudad: p.city,
        País: p.country,
        Teléfono: p.phone,
        Género: p.gender,
        "Tipo de Sangre": p.bloodType,
        "Fecha de Nacimiento": p.birthDate ? new Date(p.birthDate).toLocaleDateString() : '',
        "Fecha de Registro": new Date(p.createdAt).toLocaleString(),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");
    XLSX.writeFile(workbook, "participantes.xlsx");
  };

  // Al abrir modal de edición, inicializa el formulario y abre el dialog
  const openEdit = (p: Participant) => {
    setEditing(p);
    setEditForm({ ...p });
    setEditOpen(true);
    setEditError(null);
  };

  // Guardar cambios de edición
  const handleEditSave = async () => {
    setEditError(null);
    const validation = validateParticipant(editForm);
    if (validation) {
      setEditError(validation);
      return;
    }
    if (!editForm || !editForm.id) return;
    setLoadingId(editForm.id);
    try {
      const res = await fetch(`/admin/api/participants`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      setLoadingId(null);
      if (res.ok) {
        setEditing(null);
        setEditForm(null);
        setEditOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        setEditError(data.error || 'Error al guardar los cambios. Intenta de nuevo.');
      }
    } catch (e: any) {
      setLoadingId(null);
      setEditError('Error de red o inesperado. Intenta de nuevo.');
    }
  };

  const columns: ColumnDef<Participant>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-2 hover:bg-emerald-50"
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "city",
      header: "Ciudad",
    },
    {
      accessorKey: "country",
      header: "País",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "gender",
      header: "Género",
    },
    {
      accessorKey: "bloodType",
      header: "Tipo de Sangre",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Registro",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "birthDate",
      header: "Edad",
      cell: ({ row }) => {
        const birthDate = row.getValue("birthDate") as string;
        return birthDate ? calcularEdad(birthDate) + ' años' : '';
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => openEdit(row.original)} title="Editar">
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(row.original.id)} title="Eliminar" disabled={loadingId === row.original.id}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: participants,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      // Filtro global: busca en todas las columnas relevantes
      const search = filterValue.toLowerCase();
      return [
        row.original.firstName,
        row.original.lastName,
        row.original.email,
        row.original.city,
        row.original.country,
        row.original.phone,
        row.original.gender,
        row.original.bloodType,
        new Date(row.original.createdAt).toLocaleDateString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    },
  });

  // Modal de edición con shadcn Dialog
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar participantes..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            Exportar a Excel
          </Button>
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} participantes
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-emerald-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-emerald-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={open => { setEditOpen(open); if (!open) { setEditing(null); setEditForm(null); setEditError(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Participante</DialogTitle>
          </DialogHeader>
          {editing && editForm && (
            <form
              onSubmit={e => { e.preventDefault(); handleEditSave(); }}
              className="flex flex-col gap-3 mt-2"
            >
              {editError && <div className="text-red-600 text-sm mb-2 animate-fade-in">{editError}</div>}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Nombre</Label>
                  <Input value={editForm.firstName || ''} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <Label>Apellido</Label>
                  <Input value={editForm.lastName || ''} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} required />
                </div>
              </div>
              <Label>Email</Label>
              <Input type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
              <Label>Ciudad</Label>
              <Input value={editForm.city || ''} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} required />
              <Label>País</Label>
              <Input value={editForm.country || ''} onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))} required />
              <Label>Teléfono</Label>
              <Input value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} required />
              <Label>Género</Label>
              <select
                value={editForm.gender || ''}
                onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}
                required
                className="input"
              >
                <option value="">Selecciona</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <Label>Tipo de Sangre</Label>
              <select
                value={editForm.bloodType || ''}
                onChange={e => setEditForm(f => ({ ...f, bloodType: e.target.value }))}
                required
                className="input"
              >
                <option value="">Selecciona</option>
                {BLOOD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button" onClick={() => { setEditing(null); setEditForm(null); setEditOpen(false); setEditError(null); }}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={loadingId === editForm.id} className="bg-emerald-600 text-white">
                  {loadingId === editForm.id ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
