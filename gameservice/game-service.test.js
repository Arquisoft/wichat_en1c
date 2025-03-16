const express = require('express');
const request = require('supertest');

const gameService = require('./game-service');

test('should return game configuration values', async() =>{
    const response = await request(gameService).get('/game/config');

    expect(response.status).toBe(200);
    expect(response.body.time).toBe(1);
    expect(response.body.rounds).toBe(3);
});

test('should return a valid question', async() =>{
    const response = await request(gameService).get('/game/question');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body.question).toBeTruthy();
});

test('should return 400 if an answer is not sent', async() =>{
    const response = await request(gameService).post('/game/answer').send({});

    expect(response.status).toBe(400);
});

test('should return valid answer data if an answer is sent', async() =>{
    const response = await request(gameService).post('/game/answer').send({selectedAnswer: 'answer'});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('correctAnswer');
    expect(response.body).toHaveProperty('isCorrect');
    expect(response.body.correctAnswer).toBeTruthy();
    expect(response.body.isCorrect).toBe(false);
});