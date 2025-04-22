// src/pages/Home.js
import { useState, useRef, useEffect } from "react"
import { Container, Button, Grid, Typography } from "@mui/material"
import { PlayArrow } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import GameCard from "../components/GameCard"

const Home = () => {
  const buttonRef = useRef(null)
  const { t } = useTranslation()
  const [showCards, setShowCards] = useState(false)

  // Game mode data
  const gameModes = [
    {
      title: t("normalGame"),
      image: "/normal.svg",
      description: t("normalGameDescription"),
      link: "/game",
      alt: t("normalGameAlt"),
      testId: "normal",
    },
    {
      title: t("playerVsAI"),
      image: "/pVai.svg",
      description: t("playerVsAIDescription"),
      link: "/game-ai",
      alt: t("playerVsAIAlt"),
      testId: "ai",
    },
    {
      title: t("customGame"),
      image: "/custom.svg",
      description: t("customGameDescription"),
      link: "/custom",
      alt: t("customGameAlt"),
      testId: "custom",
    },
  ]

  useEffect(() => {
    if (buttonRef.current && !showCards) {
      buttonRef.current.focus() // Focus on the button when the component mounts
    }
  }, [showCards])

  const handlePlayClick = (e) => {
    e.preventDefault()
    setShowCards(true)
  }

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        marginTop: 3,
        textAlign: "center",
        alignItems: "center",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="wait">
        {!showCards ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              transition: { duration: 0.5 },
            }}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <motion.img
              data-testid="wichat-title"
              src="/WIChatTitle.svg"
              alt="WIChatTitle"
              style={{
                width: "150%",
                maxWidth: "800px",
                height: "auto",
                marginBottom: "2rem",
              }}
            />

            <form onSubmit={handlePlayClick}>
              <Button
                data-testid="play-button"
                ref={buttonRef}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  marginTop: 1,
                  paddingX: 4,
                  paddingY: 1.5,
                  fontSize: "1.2rem",
                }}
                startIcon={<PlayArrow />}
              >
                {t("play", "Play")}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="game-modes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: "medium" }} data-testid="select-mode">
                {t("selectGameMode")}
              </Typography>
            </motion.div>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              {gameModes.map((mode, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} data-testid={`game-mode-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.2,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <GameCard
                      image={mode.image}
                      title={mode.title}
                      description={mode.description}
                      link={mode.link}
                      alt={mode.alt}
                      testId={mode.testId}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default Home
