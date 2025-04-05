import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translations
const resources = {
  en: {
    translation: {
      home: "Home",
      login: "Login",
      register: "Register",
      logout: "Logout",
      hello: "Hello",
      docs: "Docs",
      notFound1: "Oops! Page not found.",
      notFound2: "The page you're looking for doesn't exist or has been moved.",
      goHome: "Go Home",
      username: "Username",
      password: "Password",
      endGame: "End of the game",
      thanks: "Thanks for playing",
      loading: "Loading",
      round: "Round",
      hints: "Hints used",
      hintPlaceholder: "Ask for a hint...",
      play: "Play",
    },
  },
  es: {
    translation: {
      home: "Inicio",
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
      hello: "Hola",
      docs: "Documentación",
      notFound1: "¡Vaya! Página no encontrada.",
      notFound2: "La página que buscas no existe o ha sido movida.",
      goHome: "Volver al inicio",
      username: "Usuario",
      password: "Contraseña",
      endGame: "Fin del juego",
      thanks: "¡Gracias por jugar",
      loading: "Cargando",
      round: "Ronda",
      hints: "Pistas usadas",
      hintPlaceholder: "Pregunta algo...",
      play: "Jugar",
    },
  },
};

i18n
  .use(LanguageDetector) // Detect user language automatically
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Default language
    interpolation: { escapeValue: false },
  });

// Log to check detected language
console.log("Detected Language:", i18n.language);
console.log("Resolved Language:", i18n.resolvedLanguage);

export default i18n;
