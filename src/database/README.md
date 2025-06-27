
# SoulSync Database Documentation

This directory contains SQL schemas and example queries for the SoulSync application database.

## Overview

The database consists of 9 primary tables that store user data in a relational structure:

1. **users** - Core user information and authentication data
2. **moods** - User's daily mood recordings
3. **journals** - Journal entries created by users
4. **journal_tags** - Tags associated with journal entries
5. **habits** - User-defined habits they want to track
6. **habit_entries** - Daily completion status for each habit
7. **mindfulness_sessions** - Records of completed mindfulness exercises
8. **quiz_results** - Results from mental health assessments
9. **user_settings** - User preferences and settings

## Entity Relationships

- Each user has many mood entries, journal entries, habits, and mindfulness sessions
- Each journal entry can have multiple tags
- Each habit has multiple daily entries tracking completion status
- Quiz results are stored as JSON to accommodate the variable structure

## Implementation Notes

To implement this database in a production environment:

1. Choose an appropriate database system (MySQL, PostgreSQL, etc.)
2. Run the schema.sql script to create the tables
3. Set up proper indexes for frequent queries
4. Implement proper authentication and authorization
5. Replace the localStorage logic in the application with API calls to interact with this database

## Migration from localStorage

To migrate existing data from localStorage to this database:

1. For each user, create an entry in the users table
2. Extract mood data from localStorage and insert into the moods table
3. Extract journal entries and insert into the journals table
4. Extract habit data and separate into the habits and habit_entries tables
5. Extract mindfulness sessions data and insert into the mindfulness_sessions table

## Example Usage

The schema file includes example queries showing how to retrieve the data needed for the various insights and reports in the application.
