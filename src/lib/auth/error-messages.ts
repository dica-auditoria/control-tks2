/** Mensajes de error de Auth en español (cliente y server action). */
export function mapAuthError(message: string | undefined): string {
  if (!message) return "No se pudo iniciar sesión.";
  const m = message.toLowerCase();
  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid_credentials")
  ) {
    return "Correo o contraseña incorrectos.";
  }
  if (m.includes("email not confirmed")) {
    return "Debes confirmar tu correo antes de entrar. Revisa tu bandeja.";
  }
  if (m.includes("too many requests")) {
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  }
  return message;
}
