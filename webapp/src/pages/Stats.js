// src/pages/Stats.js
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Box,
} from '@mui/material';
import { SessionContext } from '../SessionContext';
import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Stats = () => {
    const { username } = useContext(SessionContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        // Fetches the user's statistics when the component mounts or the username changes
        const fetchStats = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await axios.get(`${apiEndpoint}/users/${username}/games`);
                setStats(response.stats);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                // Set loading to false after the fetch is complete
                setLoading(false);
            }
        };

        fetchStats();
    }, [username]); // Re-run the effect if username changes

    // Function to format time in a readable format
    const formatTime = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));

        const formattedHours = hours > 0 ? `${hours}${t('time.hoursShort')} ` : '';
        const formattedMinutes = minutes >= 0 ? `${minutes}${t('time.minutesShort')} ` : '';
        const formattedSeconds = seconds >= 0 ? `${seconds}${t('time.secondsShort')}` : '';

        return `${formattedHours}${formattedMinutes}${formattedSeconds}`.trim() || `0${t('time.secondsShort')}`;
    };

    if (loading) {
        return (
            <Container
                component="main"
                maxWidth="md"
                sx={{ textAlign: "center", mt: 20 }}
            >
                <CircularProgress data-testid="loading-indicator" />
                <Typography data-testid="loading-stats" variant="h6" sx={{ mt: 2 }}>
                    {t("loading")}...
                </Typography>
            </Container>
        );
    }

    // Render the statistics view
    return (
        <Container maxWidth="md" sx={{ mt: 4 }} data-testid="stats-container">
            <Typography variant="h4" gutterBottom data-testid="stats-title">{t('statsFor', { username })}</Typography>

            {stats ? (
                <Box data-testid="stats-data">
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom data-testid="time-played-title">{t('timePlayed')}</Typography>
                            <Typography variant="body1" data-testid="total-time">
                                {t('total')}: {formatTime(stats.time.total)}
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2">{t('perGame')}:</Typography>
                                    <Typography variant="body2" data-testid="min-game-time">{t('minimum')}: {formatTime(stats.time.game.min)}</Typography>
                                    <Typography variant="body2" data-testid="max-game-time">{t('maximum')}: {formatTime(stats.time.game.max)}</Typography>
                                    <Typography variant="body2" data-testid="avg-game-time">{t('average')}: {formatTime(stats.time.game.avg)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2">{t('perQuestion')}:</Typography>
                                    <Typography variant="body2" data-testid="min-question-time">{t('minimum')}: {formatTime(stats.time.question.min)}</Typography>
                                    <Typography variant="body2" data-testid="max-question-time">{t('maximum')}: {formatTime(stats.time.question.max)}</Typography>
                                    <Typography variant="body2" data-testid="avg-question-time">{t('average')}: {formatTime(stats.time.question.avg)}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom data-testid="questions-title">{t('questions')}</Typography>
                            <Typography variant="body1" data-testid="correct-questions">{t('correct')}: {stats.question.passed}</Typography>
                            <Typography variant="body1" data-testid="incorrect-questions">{t('incorrect')}: {stats.question.failed}</Typography>
                            <Typography variant="body1" data-testid="total-questions">{t('total')}: {stats.question.total}</Typography>
                            {stats.question.total > 0 && (
                                <Typography variant="body2" data-testid="accuracy">
                                    {t('accuracy')}: {((stats.question.passed / stats.question.total) * 100).toFixed(2)}%
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom data-testid="games-title">{t('games')}</Typography>
                            <Typography variant="body1" data-testid="total-games">{t('total')}: {stats.game.total}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Box data-testid="no-stats" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" gutterBottom>{t('noStatsAvailable')}</Typography>
                    <Typography variant="body2">{t('noStatsYet')}</Typography>
                </Box>
            )}
        </Container>
    );
};

export default Stats;