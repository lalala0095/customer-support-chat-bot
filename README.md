# CS Live Chat Bot

## Overview
This app mimics a Live Chat Agent that acts like a customer service for an E-commerce website.

## Workflow
1. The app pulls orders data stored in a MongoDB server.
2. The user can interact with the chat bot, like request cancellation, return and other inquiries that are within scope of the bot.
3. The bot creates customer support tickets for the issues that needs escalation.
4. The user's chat history is stored as context to MongoDB.