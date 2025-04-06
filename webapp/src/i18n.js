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
      statsFor: "Stats of {{username}}",
      timePlayed: "Time played",
      total: "Total",
      perGame: "Per game",
      maximum: "Maximum",
      minimum: "Minimum",
      average: "Average",
      perQuestion: "Per question",
      questions: "Questions",
      correct: "Correct",
      incorrect: "Incorrect",
      accuracy: "Accuracy",
      games: "Games",
      noStatsAvailable: "No statistics available for this user.",
      statsNotFound: "No statistics found for user: {{username}}",
      statsLoadError: "Error loading statistics: {{message}}",
      connectionError: "Server connection error.",
      time: {
        hoursShort: "h",
        minutesShort: "m",
        secondsShort: "s",
      },
      noStatsYet: "Play some games to see your statistics here!",
      stats: "Stats",
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
      statsFor: "Estadísticas de {{username}}",
      timePlayed: "Tiempo jugado",
      total: "Total",
      perGame: "Por partida",
      maximum: "Máximo",
      minimum: "Mínimo",
      average: "Media",
      perQuestion: "Por pregunta",
      questions: "Preguntas",
      correct: "Correctas",
      incorrect: "Incorrectas",
      accuracy: "Tasa de acierto",
      games: "Partidas",
      noStatsAvailable: "No hay estadísticas disponibles para este usuario.",
      time: {
        hoursShort: "h",
        minutesShort: "m",
        secondsShort: "s",
      },
      noStatsYet: "¡Juega algunas partidas para ver tus estadísticas aquí!",
      stats: "Estadísticas",
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
