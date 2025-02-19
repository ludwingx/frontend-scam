import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Business, columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getData(): Promise<Business[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Mil Sabores",
    },
    {
      id: "2",
      name: "Tortas Express",
    },
    // ...
  ];
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      {/* Header */}
      <div className="Container_Header flex flex-col gap-2 pl-10">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Negocios
        </h2>
        <Breadcrumb  ></Breadcrumb>
      </div>
      {/* texto a la izquierda y boton a la derecha */}
      <div className="flex items-center justify-between">
        <small className="text-sm font-medium leading-none pl-10 pt-4 ">
          Aquí podrás gestionar los negocios.
        </small>
        <div className="pr-4 pt-4">
          <Dialog>
            <DialogTrigger className="bg-primary text-white flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/90 size-xl ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-plus"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span>Crear Negocio</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* //contenedor del contenido */}

      <div
        id="container"
        className="flex flex-col gap-4 pl-4 pr-4 pt-4 pb-4 md:pl-8 "
      >
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
