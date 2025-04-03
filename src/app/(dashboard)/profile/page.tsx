// app/profile/page.tsx
'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchProfileData, updateUser } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ReusableDialog";

export default function ProfilePage() { // Exportación por defecto
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData();
        if (data) {
          setProfileData(data);
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleEditProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileData) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      ...profileData,
      full_name: formData.get("full_name") as string,
      ci: formData.get("ci") as string,
    };

    try {
      const updatedUser = await updateUser(updatedData);
      console.log("Perfil actualizado:", updatedUser);
      setProfileData(updatedUser);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 ">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Mi Perfil
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Avatar */}
        <div className="flex flex-col items-center lg:w-1/3 bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <Skeleton className="size-40 rounded-full mb-4" />
          ) : (
            <Avatar className="size-40 border-4 border-white shadow-lg mb-4">
              <AvatarImage
                src="https://placehold.co/150"
                alt="Avatar"
              />
              <AvatarFallback>
                {profileData?.full_name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {profileData?.full_name}
              </h1>
              <p className="text-sm text-gray-600">{profileData?.rol_name}</p>
            </>
          )}
          {isLoading ? (
            <Skeleton className="mt-4 h-10 w-32 rounded-lg" />
          ) : (
            <ReusableDialog
              title="Editar Perfil"
              description="Actualiza la información de tu perfil."
              trigger={
                <Button className="mt-4 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 transition-colors duration-200">
                  Editar Perfil
                </Button>
              }
              onSubmit={handleEditProfileSubmit}
              submitButtonText="Guardar Cambios"
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              {/* Formulario de edición */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  <Input
                    type="text"
                    name="full_name"
                    defaultValue={profileData?.full_name || ""}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cédula de Identidad
                  </label>
                  <Input
                    type="text"
                    name="ci"
                    defaultValue={profileData?.ci || ""}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <Input
                    type="text"
                    defaultValue={profileData?.rol_name || ""}
                    className="mt-1"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <Input
                    type="text"
                    defaultValue={
                      profileData?.status === 1 ? "Activo" : "Inactivo"
                    }
                    className="mt-1"
                    disabled
                  />
                </div>
              </div>
            </ReusableDialog>
          )}
        </div>

        {/* Right Column: Profile Information */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Información del Perfil
          </h2>
          <div className="space-y-6">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData?.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cédula de Identidad
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData?.ci}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData?.rol_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData?.status === 1 ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}