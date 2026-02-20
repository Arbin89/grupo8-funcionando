import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type User = {
  initials: string;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  status: string;
  statusColor: string;
  date: string;
};

const users: User[] = [
  { initials: "JG", name: "Juan García", email: "juan.garcia@example.com", role: "Administrador", roleColor: "bg-primary/10 text-primary", status: "Activo", statusColor: "bg-success/10 text-success", date: "14/1/2025" },
  { initials: "ML", name: "María López", email: "maria.lopez@example.com", role: "Usuario", roleColor: "bg-info/10 text-info", status: "Activo", statusColor: "bg-success/10 text-success", date: "31/1/2025" },
  { initials: "CR", name: "Carlos Rodríguez", email: "carlos.r@example.com", role: "Personal", roleColor: "bg-warning/10 text-warning", status: "Activo", statusColor: "bg-success/10 text-success", date: "4/2/2025" },
  { initials: "AM", name: "Ana Martínez", email: "ana.martinez@example.com", role: "Usuario", roleColor: "bg-info/10 text-info", status: "Inactivo", statusColor: "bg-destructive/10 text-destructive", date: "19/1/2025" },
  { initials: "PF", name: "Pablo Fernández", email: "pablo.f@example.com", role: "Personal", roleColor: "bg-warning/10 text-warning", status: "Activo", statusColor: "bg-success/10 text-success", date: "9/2/2025" },
];

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Administra los usuarios del sistema</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Lista de Usuarios</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Agregar Usuario
          </button>
        </div>
        <div className="border-t">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-2">Usuario</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Rol</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2">Fecha de Registro</th>
                <th className="py-3 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {u.initials}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.roleColor}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.statusColor}`}>{u.status}</span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{u.date}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <button className="text-xs border border-success text-success px-3 py-1 rounded-md hover:bg-success hover:text-success-foreground transition">Editar</button>
                    <button className="text-xs border border-destructive text-destructive px-3 py-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
