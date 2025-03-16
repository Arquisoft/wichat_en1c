// src/pages/Game.js
import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, LinearProgress, TextField, IconButton, Tooltip } from "@mui/material";
import { AccessTime, HelpOutline, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { Typewriter } from "react-simple-typewriter";
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

// Mock game data (to simulate a backend response)
const mockGameData = {
  question: "Who is the musician born on 1979-01-01T00:00:00Z in the image?",
  image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Killa_Kela.jpg",
  options: ["Phil Shoenfelt", "Killa Kella", "Kevin Rowland", "Cristopher Guest"],
  answer: "Killa Kella",
  hints: [
    "The musician is known for beatboxing.",
    "He has performed with Gorillaz and Pharrell Williams.",
    "His stage name starts with 'K.'",
  ],
  gameSettings: {
    rounds: 3,
    timePerQuestion: 20,
    maxHints: 3
  },
};

// Main game component
const Game = () => {
  const [timeLeft, setTimeLeft] = useState(mockGameData.gameSettings.timePerQuestion);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintMessage, setHintMessage] = useState(""); // What the user writes in the hint input
  const [receivedHint, setReceivedHint] = useState(""); // The hint message that is returned
  const [hintCooldown, setHintCooldown] = useState(false);

  const [gameSettings, setGameSettings] = useState({ rounds: 3, timePerQuestion: 20, maxHints: 3 }); // Default, will be fetched
  const [questionData, setQuestionData] = useState(null); // Store question data

  const correctAudio = new Audio("/correct.mp3");
  const wrongAudio = new Audio("/wrong.mp3");
  const navigate = useNavigate();
  
  // Fetch game configuration on component mount
  useEffect(() => {
    const fetchGameConfig = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/game/config`);
        setGameSettings({
          rounds: response.data.rounds,
          timePerQuestion: response.data.time,
          maxHints: response.data.hints
        });
        setTimeLeft(response.data.time); // Set initial time from config
      } catch (error) {
        console.error("Error fetching game configuration:", error);
      }
    };
    fetchGameConfig();
  }, []);

  // Fetch question data at the start of each round
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/game/question`);
        setQuestionData(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [currentRound]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      // Cleanup to avoid memory leaks
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isPaused) {
      wrongAudio.play();
      setIsPaused(true);
      handleRoundEnd(false);
    }
  }, [timeLeft, isPaused]);

  // Format date inside the question string (e.g., converts "1979-01-01T00:00:00Z" to "January 1, 1979")
  const formatQuestionWithDate = (question) => {
    const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    const match = question.match(dateRegex);
    if (match) {
      const formattedDate = new Date(match[0]).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return question.replace(match[0], formattedDate);
    }
    return question;
  };

  const handleOptionClick = async (option) => {
    if (isPaused) return;
    setSelectedOption(option);
    setIsPaused(true);
    try {
      const response = await axios.post(`${apiEndpoint}/game/answer`, { selectedAnswer: option });
      const isCorrect = response.data.isCorrect;
      isCorrect ? correctAudio.play() : wrongAudio.play();
      handleRoundEnd(isCorrect);
    } catch (error) {
      console.error("Error checking answer:", error);
      setIsPaused(false);
    }
  };

  const handleRoundEnd = (isCorrect) => {
    setTimeout(() => {
      if (currentRound >= gameSettings.rounds) {
        setGameEnded(true);
      } else {
        setCurrentRound((prev) => prev + 1);
        setSelectedOption(null);
        setTimeLeft(gameSettings.timePerQuestion);
        setHintCooldown(0);
        setHintsUsed(0);
        setHintMessage(""); // Reset input field
        setReceivedHint(""); // Reset hint message
        setIsPaused(false);
      }
    }, 1000);
  };

  const handleReturnHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  // Hint request logic
  const handleHintRequest = () => {
    if (hintsUsed < gameSettings.maxHints && !hintCooldown) {
      setReceivedHint("");  
      setHintMessage(""); 
      setHintCooldown(true);
      const randomHint = mockGameData.hints[Math.floor(Math.random() * mockGameData.hints.length)];
      setReceivedHint(randomHint); // Store the received hint
      setTimeout(() => setHintCooldown(false), 3000);
      setHintsUsed(hintsUsed + 1);
    }
  };

  if (gameEnded) {
    return (
      <Container component="main" maxWidth="md" sx={{ textAlign: "center", mt: 20 }}>
        <Typography variant="h4" gutterBottom>
          🎉 End of the Game 🎉
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Thanks for playing!
        </Typography>
        <form onSubmit={handleReturnHome}>
          <Button type="submit" variant="contained" color="primary">
            Go Home
          </Button>
        </form>
      </Container>
    );
  }

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        display: "grid", // Use grid layout
        gridTemplateColumns: "3fr 1fr", // Column layout for the game
        gap: 2, // Space between the columns
        mt: 4, // Margin top
        alignItems: "start", // Align content to the start of the container
      }}
    >
      {/* Left side: Question, progress bar, image, and options */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Stack elements vertically
          gap: 2, // Space between elements
          alignItems: "center", // Center align the elements horizontally
        }}
      >
        {/* Progress bar & Round info */}
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={1}>
          <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
            <AccessTime color="action" />
            <LinearProgress
              data-testid="time-progress-bar"
              variant="determinate"
              value={(timeLeft / gameSettings.timePerQuestion) * 100}
              sx={{
                flexGrow: 1, // Allow the progress bar to grow
                height: 10, // Set the height of the progress bar
                borderRadius: "5px", // Rounded corners for the progress bar
                "& .MuiLinearProgress-bar": {
                  backgroundColor: timeLeft > 5 ? "#4caf50" : "#f44336", // Change color based on time
                  transition: "width 0.5s ease", // Smooth transition for the progress bar
                },
              }}
            />
          </Box>
  
          <Typography variant="h6" sx={{ marginLeft: 2 }} data-testid="round-info">
            Round: {currentRound} / {gameSettings.rounds}
          </Typography>
        </Box>
  
        {/* Display the question */}
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", alignSelf: "center" }} data-testid="question">
          {formatQuestionWithDate(questionData?.question)}
        </Typography>
  
        {/* Display the image */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <img
            data-testid="question-image"
            src={questionData?.image}
            alt="Question Image"
            style={{
                maxWidth: "300px", // Set max width of the image
                maxHeight: "300px", // Set max height of the image
                height: "auto", // Let the height adjust proportionally
                width: "auto", // Let the width adjust proportionally
                borderRadius: "10px", // Rounded corners for the image
                objectFit: "contain", // Ensure the image scales correctly within the container
            }}
          />
        </Box>
  
        {/* Render answer options */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} width="100%">
          {questionData?.options?.map((option, index) => (
            <Button
              data-testid={`option-${index}`}
              key={option}
              variant="contained"
              color={
                selectedOption === option
                  ? option === mockGameData.answer
                    ? "success"
                    : "error"
                  : selectedOption && selectedOption !== option
                  ? "secondary"
                  : "primary"
              }
              disabled={isPaused && selectedOption !== option}
              onClick={() => handleOptionClick(option)}
              sx={{
                padding: 2, 
                fontSize: "1.2rem", 
                borderRadius: 2, // Rounded corners for the button
                position: "relative", // Relative positioning for the button
                transition: "0.3s ease", // Smooth transition on hover
                "&::before": {
                  content: `"${String.fromCharCode(65 + index)}"`, // Display option label (A, B, C, etc.)
                  position: "absolute", // Position label absolute
                  top: 5, // Space from the top of the button
                  left: 5, // Space from the left of the button
                  fontWeight: "bold", // Bold font for the label
                  color: "#fff", // White text color
                  background: "#333", // Dark background for the label
                  padding: "2px 6px", // Padding for the label
                  borderRadius: "5px", // Rounded corners for the label
                  fontSize: "0.8rem", // Font size for the label
                },
                "&:hover": {
                  transform: "scale(1.05)", // Slightly scale the button on hover
                  opacity: 0.9, // Reduce opacity on hover
                },
              }}
            >
              {option}
            </Button>
          ))}
        </Box>
      </Box>
  
      {/* Right side: Hint section (now properly aligned) */}
      <Box
        sx={{
            display: "flex", 
            flexDirection: "column", // Stack elements vertically
            gap: 1, // Space between elements
            alignItems: "center", // Center align the elements horizontally
            justifySelf: "start", // Align the box to the start
            backgroundColor: "#f5f5f5", // Light gray background for the hint section
            padding: "10px", // Padding for the hint box
            borderRadius: "8px", // Rounded corners for the hint box
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)", // Shadow for the hint box
            marginLeft: 3, // Left margin with question box
        }}
      >
        <Tooltip title="Hints remaining">
          <Box display="flex" alignItems="start" gap={1}>
            <HelpOutline color="primary" />
            <Typography variant="body1" data-testid="hints-used">
              Hints used: {hintsUsed}/{mockGameData.gameSettings.maxHints}
            </Typography>
          </Box>
        </Tooltip>
  
        {/* Hint input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleHintRequest();
          }}
          style={{ width: "100%", display: "flex", gap: 1 }}
        >
          <TextField
            data-testid="hint-input"
            variant="outlined"
            size="small"
            placeholder="Ask for a hint..."
            disabled={hintsUsed >= mockGameData.gameSettings.maxHints || hintCooldown || isPaused}
            value={hintMessage}
            onChange={(e) => setHintMessage(e.target.value)}
            sx={{ flexGrow: 1, marginRight: 2 }}
          />
          <IconButton
            data-testid="hint-button"
            type="submit"
            disabled={hintCooldown || hintsUsed >= mockGameData.gameSettings.maxHints || isPaused}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            <ArrowForward />
          </IconButton>
        </form>
  
        {/* Show hint message with Typewriter effect */}
        {receivedHint && (
        <Typography
            variant="body1"
            sx={{
                mt: 1,
                textAlign: "center",
                fontStyle: "italic",
                opacity: 0,
                animation: "fadeIn 0.5s forwards",
                "@keyframes fadeIn": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
        >
            <Typewriter
                key={receivedHint} // Force tywriter to reset
                words={[receivedHint]}
                cursor
                cursorStyle="_"
                typeSpeed={50} 
                deleteSpeed={20} // In case we need to use it
            />
        </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Game;