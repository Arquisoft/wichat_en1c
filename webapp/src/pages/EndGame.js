// src/pages/EndGame.js
import { useEffect, useRef, useContext } from "react"
import { Container, Typography, Button, Box, Paper, Grid } from "@mui/material"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { GameContext } from "../GameContext"
import { CheckCircle as CorrectIcon, Cancel as IncorrectIcon } from "@mui/icons-material"

const EndGame = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const buttonRef = useRef(null) // Create a reference to the button

  let AIResultText = null;

  const { setGameEnded, correctAnswers, incorrectAnswers, AIcorrect, resetGameStats } = useContext(GameContext)

  const handleReturnHome = (e) => {
    e.preventDefault()
    navigate("/")
  }

  const getColor = (correctAnswers, AIcorrect) => {
    if (correctAnswers > AIcorrect) {
      return "success.main";
    } else if (correctAnswers < AIcorrect) {
      return "error.main";
    } else {
      return "text.secondary";
    }
  };

  const translateAIResults = () => {
    if (AIcorrect > -1) {
      if (correctAnswers > AIcorrect) {
        AIResultText = t("youWonAI", { AIcorrect: AIcorrect });
      } else if (correctAnswers < AIcorrect) {
        AIResultText = t("youLostAI", { AIcorrect: AIcorrect });
      } else {
        AIResultText = t("tiedWithAI", { AIcorrect: AIcorrect });
      }
    }
  }

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus() // Focus on the button when the component mounts
    }

    translateAIResults()

    return () => {
      setGameEnded(false) // Reset gameEnded when leaving the page
      resetGameStats() // Reset game statistics when leaving the page
    }
  }, [])

  useEffect(() => {
    translateAIResults()
  }, [i18n.resolvedLanguage])

  const totalAnswers = correctAnswers + incorrectAnswers
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  if (AIcorrect > -1) {
    if (correctAnswers > AIcorrect) {
      AIResultText = t("youWonAI", { AIcorrect: AIcorrect });
    } else if (correctAnswers < AIcorrect) {
      AIResultText = t("youLostAI", { AIcorrect: AIcorrect });
    } else {
      AIResultText = t("tiedWithAI", { AIcorrect: AIcorrect });
    }
  }

  return (
    <Container component="main" maxWidth="md" sx={{ textAlign: "center", mt: 20 }}>
      <Typography data-testid="end-text" variant="h4" gutterBottom>
        🎉 {t("endGame")} 🎉
      </Typography>
      <Typography data-testid="thanks-text" variant="h6" sx={{ mb: 3 }}>
        {t("thanks")}!
      </Typography>

      {/* Results summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 400, mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t("gameResults")}
            </Typography>
            {AIResultText && (
              <Typography data-testid="ai-result" variant="body2" color={getColor(correctAnswers, AIcorrect)} sx={{ mb: 1 }}>
                {AIResultText}
              </Typography>
            )}
          </Grid>

          {/* Correct answers */}
          <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <CorrectIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body1" data-testid="correct-answers">
              {t("correct")}:
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "left" }}>
            <Typography variant="body1" fontWeight="bold">
              {correctAnswers}
            </Typography>
          </Grid>

          {/* Incorrect answers */}
          <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <IncorrectIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body1" data-testid="incorrect-answers">
              {t("incorrect")}:
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "left" }}>
            <Typography variant="body1" fontWeight="bold">
              {incorrectAnswers}
            </Typography>
          </Grid>

          {/* Accuracy */}
          <Grid item xs={12}>
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid #eee" }}>
              <Typography variant="body1" data-testid="accuracy">
                {t("accuracy")}: <strong>{accuracy}%</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <form onSubmit={handleReturnHome}>
        <Button data-testid="home-button" ref={buttonRef} type="submit" variant="contained" color="primary">
          {t("goHome")}
        </Button>
      </form>
    </Container>
  )
}

export default EndGame
