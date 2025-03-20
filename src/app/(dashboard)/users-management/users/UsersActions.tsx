"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createUser } from "@/services/userService";
import { fetchRoleData } from "@/services/fetchRoleData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UsersActionsProps {
  onRefresh: () => void;
  showActiveUsers: boolean;
  setShowActiveUsers: (showActive: boolean) => void;
}

export function UsersActions({
  onRefresh,
  showActiveUsers,
  setShowActiveUsers,
}: UsersActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string; status: number }[]>([]); // Asegúrate de que el tipo incluya `status`
  const [fullName, setFullName] = useState("");
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);

  // Fetch roles data when the component mounts
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoleData();
        if (rolesData) {
          // Filtrar roles con status = 1
          const activeRoles = rolesData.filter((role) => role.status === 1);
          setRoles(activeRoles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error al cargar los roles. Por favor, inténtalo de nuevo.");
      }
    };

    loadRoles();
  }, []);

  // Función para crear un usuario
  const handleCreateUser = async (userData: {
    full_name: string;
    ci: string;
    password: string;
    rol_id: number;
    rol_name: string;
    status: number;
  }) => {
    try {
      const newUser = await createUser(userData);

      if (newUser) {
        toast.success(`Usuario "${newUser.full_name}" creado exitosamente.`);
        onRefresh(); // Actualizar la tabla
        setIsDialogOpen(false); // Cerrar el diálogo después de crear el usuario
        setFullName(""); // Limpiar el campo del nombre
        setCi(""); // Limpiar el campo del CI
        setPassword(""); // Limpiar el campo de la contraseña
        setRoleId(null); // Limpiar el campo del rol
      } else {
        throw new Error("No se pudo crear el usuario.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !ci.trim() || !password.trim() || !roleId) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    const role = roles.find((r) => r.id === roleId);

    if (!role) {
      toast.error("Rol no válido.");
      return;
    }

    await handleCreateUser({
      full_name: fullName,
      ci,
      password,
      rol_id: roleId,
      rol_name: role.name,
      status: 1, // Enviar el valor 1 directamente
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => setShowActiveUsers(!showActiveUsers)}
          className={showActiveUsers ? "bg-blue-500 text-white hover:bg-blue-500/80  " : "bg-violet-500 text-white hover:bg-violet-500/80 "}
        >
          {showActiveUsers ? "Ver Inactivos" : "Ver Activos"}
        </Button>
        <ReusableDialog
          title="Crear Usuario"
          description="Aquí podrás crear un usuario."
          trigger={
            <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <CirclePlus />
              <span>Crear Usuario</span>
            </Button>
          }
          onSubmit={handleSubmit}
          submitButtonText="Crear Usuario"
          onOpenChange={setIsDialogOpen}
          isOpen={isDialogOpen}
        >
          {/* Formulario para crear un usuario */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                placeholder="Ingresa el nombre completo"
                className="col-span-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ci" className="text-right">
                CI
              </Label>
              <Input
                id="ci"
                placeholder="Ingresa el CI"
                className="col-span-3"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa la contraseña"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <Select onValueChange={(value) => setRoleId(Number(value))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ReusableDialog>
      </div>
    </>
  );
}