import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "../../services/userService";

const UsersPage = () => {
  // Lista real de usuarios obtenida desde el backend
  const [users, setUsers] = useState<User[]>([]);

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  // Estado para controlar carga de datos
  const [loading, setLoading] = useState(true);

  // Indica si estamos editando un usuario existente
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Muestra u oculta el formulario
  const [showForm, setShowForm] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "usuario",
    status: "activo",
  });

  // Carga inicial de usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calcula iniciales a partir del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Convierte rol técnico a etiqueta visual
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "mesero":
        return "Mesero";
      case "cocina":
        return "Cocina";
      default:
        return "Usuario";
    }
  };

  // Colores visuales por rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/10 text-primary";
      case "mesero":
        return "bg-warning/10 text-warning";
      case "cocina":
        return "bg-info/10 text-info";
      default:
        return "bg-muted text-foreground";
    }
  };

  // Colores visuales por estado
  const getStatusColor = (status: string) => {
    return status === "activo"
      ? "bg-success/10 text-success"
      : "bg-destructive/10 text-destructive";
  };

  // Formatea fecha para mostrarla bonita
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-DO");
  };

  // Maneja cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Limpia formulario y sale del modo edición
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "usuario",
      status: "activo",
    });
    setEditingUserId(null);
    setShowForm(false);
  };

  // Prepara formulario para editar
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setShowForm(true);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      role: user.role,
      status: user.status,
    });
  };

  // Envía formulario para crear o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      if (editingUserId) {
        // En edición no enviamos password porque ese endpoint no la actualiza
        await updateUser(editingUserId, {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          role: formData.role,
          status: formData.status,
        });
      } else {
        // En creación sí enviamos password
        await createUser(formData);
      }

      await fetchUsers();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar usuario");
    }
  };

  // Elimina usuario con confirmación
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await deleteUser(id);
      await fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar usuario");
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios del sistema
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Lista de Usuarios</h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Agregar Usuario
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {!editingUserId && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="mesero">Mesero</option>
                <option value="cocina">Cocina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                {editingUserId ? "Actualizar Usuario" : "Guardar Usuario"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-input px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="border-t overflow-x-auto">
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Cargando usuarios...
            </div>
          ) : (
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
                  <tr key={u.id} className="border-t">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {getInitials(u.name)}
                        </div>
                        {u.name}
                      </div>
                    </td>

                    <td className="py-3 px-2 text-muted-foreground">
                      {u.email}
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          u.role
                        )}`}
                      >
                        {getRoleLabel(u.role)}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          u.status
                        )}`}
                      >
                        {u.status === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-muted-foreground">
                      {formatDate(u.created_at)}
                    </td>

                    <td className="py-3 px-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-xs border border-success text-success px-3 py-1 rounded-md hover:bg-success hover:text-success-foreground transition"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-xs border border-destructive text-destructive px-3 py-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;