// Eski SQLite veri katmanı yerine PostgreSQL veri katmanı kullanılır.
// Mevcut import yollarını bozmamak için bu dosya uyumluluk köprüsü olarak bırakıldı.
export {
  hashPassword,
  verifyPassword,
  verifyUser,
  createUser,
  getUserById,
  userExists,
  listUsers,
  deleteUser,
  listProducts,
  createProduct,
  deleteProduct,
  createMessage,
  listMessages,
  createAppointment,
  listAppointments,
} from "./pg";

export type { PublicUser } from "./pg";
