// src/pages/CustomGame.js
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Slider,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
  Grid,
  Chip,
} from "@mui/material"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import {
  AccessTime as TimeIcon,
  SportsEsports as GamesIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  HelpOutline as HintIcon,
  SmartToy as AIIcon,
  Category as CategoryIcon,
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import axios from "axios"

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000"

// Mock categories data with IDs to maintain consistency across languages
const mockCategories = {
  en: [
    { id: "history", name: "history" },
    { id: "science", name: "science" },
    { id: "geography", name: "geography" },
    { id: "sports", name: "sports" },
    { id: "entertainment", name: "entertainment" },
    { id: "music", name: "music" },
    { id: "technology", name: "technology" },
  ],
  es: [
    { id: "history", name: "historia" },
    { id: "science", name: "ciencia" },
    { id: "geography", name: "geografía" },
    { id: "sports", name: "deportes" },
    { id: "entertainment", name: "entretenimiento" },
    { id: "music", name: "música" },
    { id: "technology", name: "tecnología" },
  ],
}

// Helper function to translate category by ID
const translateCategoryById = (id, language) => {
  const category = mockCategories[language].find((cat) => cat.id === id)
  return category ? category.name : id
}

const CustomGame = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const currentLanguage = i18n.resolvedLanguage || "en" // For testing

  // Game settings state
  const [rounds, setRounds] = useState(10)
  const [timePerQuestion, setTimePerQuestion] = useState(20)
  const [hints, setHints] = useState(3)
  const [infiniteRounds, setInfiniteRounds] = useState(false)
  const [isAIGame, setIsAIGame] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Categories state - store category IDs for selected categories
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  // Initialize categories from mock data
  useEffect(() => {
    // Get all category IDs
    const allCategoryIds = mockCategories.en.map((cat) => cat.id)

    // Filter out the selected ones to get available ones
    const availableCategoryIds = allCategoryIds.filter((id) => !selectedCategoryIds.includes(id))

    // Map IDs to current language categories
    const availableCategoriesInCurrentLanguage = availableCategoryIds.map((id) => {
      const category = mockCategories[currentLanguage].find((cat) => cat.id === id)
      return category || { id, name: id }
    })

    setAvailableCategories(availableCategoriesInCurrentLanguage)
  }, [currentLanguage, selectedCategoryIds])

  // Handle rounds input change
  const handleRoundsChange = (event) => {
    const value = Number.parseInt(event.target.value)
    if (!isNaN(value)) {
      setRounds(Math.min(Math.max(value, 1), 50)) // Clamp between 1 and 50
    } else {
      setRounds("")
    }
  }

  // Handle time per question input change
  const handleTimeChange = (event) => {
    const value = Number.parseInt(event.target.value)
    if (!isNaN(value)) {
      setTimePerQuestion(Math.min(Math.max(value, 10), 60)) // Clamp between 10 and 60
    } else {
      setTimePerQuestion("")
    }
  }

  // Handle hints input change
  const handleHintsChange = (event) => {
    const value = Number.parseInt(event.target.value)
    if (!isNaN(value)) {
      setHints(Math.min(Math.max(value, 0), 5)) // Clamp between 0 and 5
    } else {
      setHints("")
    }
  }

  // Handle time slider change
  const handleTimeSliderChange = (event, newValue) => {
    setTimePerQuestion(newValue)
  }

  // Handle rounds slider change
  const handleRoundsSliderChange = (event, newValue) => {
    setRounds(newValue)
  }

  // Handle hints slider change
  const handleHintsSliderChange = (event, newValue) => {
    setHints(newValue)
  }

  // Handle infinite rounds toggle
  const handleInfiniteRoundsChange = (event) => {
    setInfiniteRounds(event.target.checked)
  }

  // Handle AI game toggle
  const handleAIGameChange = (event) => {
    setIsAIGame(event.target.checked)
  }

  // Add a category to selected list
  const handleAddCategory = (category) => {
    setSelectedCategoryIds([...selectedCategoryIds, category.id])
  }

  // Remove a category from selected list
  const handleRemoveCategory = (categoryId) => {
    setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId))
  }

  // Clear all selected categories
  const handleClearCategories = () => {
    setSelectedCategoryIds([])
  }

  // Select all available categories
  const handleSelectAllCategories = () => {
    const allIds = [...selectedCategoryIds, ...availableCategories.map((cat) => cat.id)]
    setSelectedCategoryIds(allIds)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
/*
    try {
      // Send custom game settings to the API
      await axios.post(`${apiEndpoint}/game/custom`, {
        rounds: infiniteRounds ? -1 : rounds, // -1 indicates infinite rounds
        timePerQuestion: timePerQuestion,
        hints: hints,
        isAIGame: isAIGame,
        categories: selectedCategoryIds.length > 0 ? selectedCategoryIds : [], // Empty array means all categories
      })
*/
      // Navigate to the game page
      navigate(isAIGame ? "/game-ai" : "/game")
    /*} catch (error) {
      console.error("Error starting custom game:", error)
      setError(error.response?.data?.message || "Failed to start custom game")
    } finally {
      setIsSubmitting(false)
    }
      */
  }

  // Get selected categories in current language for display
  const getSelectedCategoriesForDisplay = () => {
    return selectedCategoryIds.map((id) => {
      const category = mockCategories[currentLanguage].find((cat) => cat.id === id)
      return category || { id, name: id }
    })
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}
          data-testid="custom-game-title"
        >
          <SettingsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          {t("customGame")}
        </Typography>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "visible",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Left column - Game settings */}
                <Grid item xs={12} md={6}>
                  {/* Rounds configuration */}
                  <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <GamesIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" data-testid="rounds-title">
                        {t("rounds")}
                      </Typography>
                      <Tooltip title={t("roundsInfo")}>
                        <InfoIcon sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.5), fontSize: "1rem" }} />
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={infiniteRounds}
                            onChange={handleInfiniteRoundsChange}
                            color="primary"
                            data-testid="infinite-rounds-switch"
                          />
                        }
                        label={t("infiniteRounds")}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        opacity: infiniteRounds ? 0.5 : 1,
                        pointerEvents: infiniteRounds ? "none" : "auto",
                      }}
                    >
                      <TextField
                        value={rounds}
                        onChange={handleRoundsChange}
                        type="number"
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 1, max: 50, "data-testid": "rounds-input" }}
                        sx={{ width: "80px" }}
                        disabled={infiniteRounds}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Slider
                          value={rounds}
                          onChange={handleRoundsSliderChange}
                          min={1}
                          max={50}
                          step={1}
                          marks={[
                            { value: 1, label: "1" },
                            { value: 25, label: "25" },
                            { value: 50, label: "50" },
                          ]}
                          disabled={infiniteRounds}
                          data-testid="rounds-slider"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Time per question configuration */}
                  <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" data-testid="time-title">
                        {t("timePerQuestion")}
                      </Typography>
                      <Tooltip title={t("timeInfo")}>
                        <InfoIcon sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.5), fontSize: "1rem" }} />
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        value={timePerQuestion}
                        onChange={handleTimeChange}
                        type="number"
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">s</InputAdornment>,
                          inputProps: { min: 10, max: 60, "data-testid": "time-input" },
                        }}
                        sx={{ width: "100px" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Slider
                          value={timePerQuestion}
                          onChange={handleTimeSliderChange}
                          min={10}
                          max={60}
                          step={5}
                          marks={[
                            { value: 10, label: "10s" },
                            { value: 30, label: "30s" },
                            { value: 60, label: "60s" },
                          ]}
                          data-testid="time-slider"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Hints configuration */}
                  <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <HintIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" data-testid="hints-title">
                        {t("hintsCustom")}
                      </Typography>
                      <Tooltip title={t("hintsInfo")}>
                        <InfoIcon sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.5), fontSize: "1rem" }} />
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        value={hints}
                        onChange={handleHintsChange}
                        type="number"
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 5, "data-testid": "hints-input" }}
                        sx={{ width: "80px" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Slider
                          value={hints}
                          onChange={handleHintsSliderChange}
                          min={0}
                          max={5}
                          step={1}
                          marks={[
                            { value: 0, label: "0" },
                            { value: 3, label: "3" },
                            { value: 5, label: "5" },
                          ]}
                          data-testid="hints-slider"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* AI Game toggle */}
                  <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AIIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" data-testid="ai-game-title">
                        {t("aiGame")}
                      </Typography>
                      <Tooltip title={t("aiGameInfo")}>
                        <InfoIcon sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.5), fontSize: "1rem" }} />
                      </Tooltip>
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={isAIGame}
                          onChange={handleAIGameChange}
                          color="primary"
                          inputProps={{ 'data-testid': 'ai-game-switch' }}
                        />
                      }
                      label={t("enableAIGame")}
                    />
                  </Box>
                </Grid>

                {/* Right column - Categories */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CategoryIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" data-testid="categories-title">
                        {t("categories")}
                      </Typography>
                      <Tooltip title={t("categoriesInfo")}>
                        <InfoIcon sx={{ ml: 1, color: alpha(theme.palette.text.primary, 0.5), fontSize: "1rem" }} />
                      </Tooltip>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t("categoriesDescription")}
                    </Typography>

                    <Grid container spacing={2}>
                      {/* Available categories */}
                      <Grid item xs={12} sm={5}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t("availableCategories")}
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            height: 300,
                            overflow: "auto",
                            p: 1,
                            bgcolor: alpha(theme.palette.background.paper, 0.7),
                          }}
                        >
                          <List dense component="div" role="list" data-testid="available-categories">
                            {availableCategories.length === 0 ? (
                              <ListItem>
                                <ListItemText primary={t("noAvailableCategories")} />
                              </ListItem>
                            ) : (
                              availableCategories.map((category) => (
                                <ListItem
                                  key={category.id}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      aria-label="add"
                                      onClick={() => handleAddCategory(category)}
                                      data-testid={`add-category-${category.id}`}
                                    >
                                      <ArrowRightIcon />
                                    </IconButton>
                                  }
                                >
                                  <ListItemText primary={category.name} />
                                </ListItem>
                              ))
                            )}
                          </List>
                        </Paper>
                        <Button
                          size="small"
                          onClick={handleSelectAllCategories}
                          disabled={availableCategories.length === 0}
                          sx={{ mt: 1 }}
                          data-testid="select-all-button"
                        >
                          {t("selectAll")}
                        </Button>
                      </Grid>

                      {/* Transfer buttons */}
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <Divider orientation="vertical" flexItem sx={{ height: 100, visibility: "hidden" }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: "center" }}>
                            {selectedCategoryIds.length === 0 ? t("allCategoriesActive") : t("customSelection")}
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ height: 100, visibility: "hidden" }} />
                        </Box>
                      </Grid>

                      {/* Selected categories */}
                      <Grid item xs={12} sm={5}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t("selectedCategories")}
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            height: 300,
                            overflow: "auto",
                            p: 1,
                            bgcolor: alpha(theme.palette.background.paper, 0.7),
                          }}
                        >
                          <List dense component="div" role="list" data-testid="selected-categories">
                            {selectedCategoryIds.length === 0 ? (
                              <ListItem>
                                <ListItemText primary={t("noSelectedCategories")} />
                              </ListItem>
                            ) : (
                              getSelectedCategoriesForDisplay().map((category) => (
                                <ListItem
                                  key={category.id}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      aria-label="remove"
                                      onClick={() => handleRemoveCategory(category.id)}
                                      data-testid={`remove-category-${category.id}`}
                                    >
                                      <ArrowLeftIcon />
                                    </IconButton>
                                  }
                                >
                                  <ListItemText primary={category.name} />
                                </ListItem>
                              ))
                            )}
                          </List>
                        </Paper>
                        <Button
                          size="small"
                          onClick={handleClearCategories}
                          disabled={selectedCategoryIds.length === 0}
                          startIcon={<DeleteIcon />}
                          sx={{ mt: 1 }}
                          data-testid="clear-selection-button"
                        >
                          {t("clearSelection")}
                        </Button>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {t("activeCategories")}:
                      </Typography>
                      {selectedCategoryIds.length === 0 ? (
                        <Chip
                          label={t("allCategories")}
                          size="small"
                          color="primary"
                          variant="outlined"
                          data-testid="all-categories-chip"
                        />
                      ) : (
                        getSelectedCategoriesForDisplay().map((category) => (
                          <Chip
                            key={category.id}
                            label={category.name}
                            size="small"
                            onDelete={() => handleRemoveCategory(category.id)}
                            data-testid={`category-chip-${category.id}`}
                          />
                        ))
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2 }} data-testid="error-message">
                  {error}
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<PlayIcon />}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  data-testid="start-game-button"
                >
                  {isSubmitting ? t("starting") : t("startGame")}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="outlined" onClick={() => navigate("/")} sx={{ borderRadius: 2 }} data-testid="back-button">
            {t("goHome")}
          </Button>
        </Box>
      </motion.div>
    </Container>
  )
}

export default CustomGame
