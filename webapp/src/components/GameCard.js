// src/components/GameCard.js
import PropTypes from "prop-types"
import { Card, CardContent, Typography, Box } from "@mui/material"
import { useNavigate } from "react-router"

/**
 * GameCard component for displaying game mode options
 * @param {Object} props - Component props
 * @param {string} props.image - URL of the card image
 * @param {string} props.description - Description text for the card
 * @param {string} props.link - Navigation link when card is clicked
 * @param {string} [props.title = "game"] - Optional title for the card
 * @param {string} [props.alt="Game image"] - Alt text for the image
 * @param {string} [props.testId="card"] - Data-testid for testing
 */
const GameCard = ({ image, description, link, title = "game", alt = "Game image", testId = "card"}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(link)
  }

  return (
    <Card
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      tabIndex={0}
      data-testid={`game-mode-${testId}`}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%", // 16:9 aspect ratio
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={alt}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
        {/* Gradient overlay for fade effect */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          backgroundColor: "white",
          padding: 3,
        }}
      >
        {title && (
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {title}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Add PropTypes for type checking
GameCard.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string,
  alt: PropTypes.string,
  testId: PropTypes.string,
}

export default GameCard
