import { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"
import { Typography, Container, Card, CardContent, Grid, CircularProgress, Box, useTheme, alpha } from "@mui/material"
import {
  AccessTime as TimeIcon,
  QuestionMark as QuestionIcon,
  SportsEsports as GamesIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
} from "@mui/icons-material"
import { SessionContext } from "../SessionContext"
import axios from "axios"
import { useNavigate } from "react-router";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000"

const Stats = () => {
  const { username } = useContext(SessionContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate();

  useEffect(() => {
    // Fetches the user's statistics when the component mounts or the username changes
    const fetchStats = async () => {
      setLoading(true) // Set loading to true before fetching
      try {
        const response = await axios.get(`${apiEndpoint}/stats/users/${username}`)
        setStats(response.data.stats)
      } catch (err) {
        console.error("Error fetching stats:", err)
        navigate("/")
      } finally {
        // Set loading to false after the fetch is complete
        setLoading(false)
      }
    }

    fetchStats()
  }, [username]) // Re-run the effect if username changes

  // Function to format time in a readable format
  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))

    const formattedHours = hours > 0 ? `${hours}${t("time.hoursShort")} ` : ""
    const formattedMinutes = minutes > 0 ? `${minutes}${t("time.minutesShort")} ` : ""
    const formattedSeconds = seconds > 0 ? `${seconds}${t("time.secondsShort")}` : `${1}${t("time.secondsShort")}`

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`.trim()
  }

  // Calculate accuracy percentage safely
  const calculateAccuracy = (passed, total) => {
    if (total <= 0) return 0
    return ((passed / total) * 100).toFixed(2)
  }
 
  // Calculate bar width as percentage of maximum value with a minimum visible width
  const calculateBarWidth = (value, maxValue) => {
    if (maxValue <= 0) return 20 // Minimum width for visibility

    // For zero values, show a small bar (20% width)
    if (value <= 0) return 20

    if(value >= maxValue) return 100;

    // For non-zero values, calculate percentage but ensure minimum visibility
    const percentage = (value / maxValue) * 100
    return Math.max(percentage, 20) // Ensure at least 20% width for visibility
  }

    
  if (loading) {
    return (
      <Container
        component="main"
        maxWidth="md"
        sx={{
          textAlign: "center",
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress
          data-testid="loading-indicator"
          size={60}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography
          data-testid="loading-stats"
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: "medium",
            color: theme.palette.text.secondary,
          }}
        >
          {t("loading")}...
        </Typography>
      </Container>
    )
  }

  // Render the statistics view
  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }} data-testid="stats-container">
      <Typography
        variant="h4"
        gutterBottom
        data-testid="stats-title"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
        }}
      >
        {t("statsFor", { username })}
      </Typography>

      {stats.game.total > 0 ? (
        <Box data-testid="stats-data">
          <Grid container spacing={3}>
            {/* Left Column - Summary Cards */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Time Played Card */}
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <TimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                        {t("timePlayed")}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("total")}
                    </Typography>
                    <Typography variant="h5" data-testid="total-time" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {formatTime(stats.time.total)}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Questions Card */}
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <QuestionIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                        {t("questions")}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("total")}
                    </Typography>
                    <Typography variant="h5" data-testid="total-questions" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {stats.question.total}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Games Card */}
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <GamesIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                        {t("games")}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("total")}
                    </Typography>
                    <Typography variant="h5" data-testid="total-games" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {stats.game.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Middle Column - Time Stats */}
            <Grid item xs={12} md={4.5}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <TimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" data-testid="time-played-title">
                      {t("timePlayed")}
                    </Typography>
                  </Box>

                  {/* Per Game Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <GamesIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      {t("perGame")}:
                    </Typography>

                    {/* Minimum */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("minimum")}:
                        </Typography>
                        <Typography variant="body2" data-testid="min-game-time" fontWeight="medium">
                          {formatTime(stats.time.game.min)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${calculateBarWidth(stats.time.game.min, stats.time.game.max)}%`,
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Maximum */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("maximum")}:
                        </Typography>
                        <Typography variant="body2" data-testid="max-game-time" fontWeight="medium">
                          {formatTime(stats.time.game.max)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Average */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("average")}:
                        </Typography>
                        <Typography variant="body2" data-testid="avg-game-time" fontWeight="medium">
                          {formatTime(stats.time.game.avg)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${calculateBarWidth(stats.time.game.avg, stats.time.game.max)}%`,
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Per Question Section */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <QuestionIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      {t("perQuestion")}:
                    </Typography>

                    {/* Minimum */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("minimum")}:
                        </Typography>
                        <Typography variant="body2" data-testid="min-question-time" fontWeight="medium">
                          {formatTime(stats.time.question.min)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${calculateBarWidth(stats.time.question.min, stats.time.question.max)}%`,
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Maximum */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("maximum")}:
                        </Typography>
                        <Typography variant="body2" data-testid="max-question-time" fontWeight="medium">
                          {formatTime(stats.time.question.max)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Average */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t("average")}:
                        </Typography>
                        <Typography variant="body2" data-testid="avg-question-time" fontWeight="medium">
                          {formatTime(stats.time.question.avg)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${calculateBarWidth(stats.time.question.avg, stats.time.question.max)}%`,
                            height: "100%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Questions Stats */}
            <Grid item xs={12} md={4.5}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <QuestionIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                    <Typography variant="h6" data-testid="questions-title">
                      {t("questions")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {/* Correct */}
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.success.light, 0.15),
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <CorrectIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="body1" data-testid="correct-questions">
                        {t("correct")}: {stats.question.passed}
                      </Typography>
                    </Box>

                    {/* Incorrect */}
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.error.light, 0.15),
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <IncorrectIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                      <Typography variant="body1" data-testid="incorrect-questions">
                        {t("incorrect")}: {stats.question.failed}
                      </Typography>
                    </Box>

                    {/* Total */}
                    <Box
                      sx={{
                        p: 2,
                        mb: 4,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.light, 0.15),
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <QuestionIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                      <Typography variant="body1" data-testid="questions">
                        {t("total")}: {stats.question.total}
                      </Typography>
                    </Box>

                    {stats.question.total > 0 && (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box sx={{ position: "relative", display: "inline-flex" }}>
                          <CircularProgress
                            variant="determinate"
                            value={100}
                            size={120}
                            thickness={4}
                            sx={{ color: alpha(theme.palette.success.main, 0.2) }}
                          />
                          <CircularProgress
                            variant="determinate"
                            value={calculateAccuracy(stats.question.passed, stats.question.total)}
                            size={120}
                            thickness={4}
                            sx={{
                              color: theme.palette.success.main,
                              position: "absolute",
                              left: 0,
                            }}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: "absolute",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="h5" component="div" fontWeight="bold">
                              {calculateAccuracy(stats.question.passed, stats.question.total)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" data-testid="accuracy" sx={{ mt: 1 }}>
                          {t("accuracy")}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          data-testid="no-stats"
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 5,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            boxShadow: 2,
          }}
        >
          <QuestionIcon
            sx={{
              fontSize: 60,
              color: alpha(theme.palette.text.secondary, 0.5),
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {t("noStatsAvailable")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              maxWidth: 400,
            }}
          >
            {t("noStatsYet")}
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default Stats
