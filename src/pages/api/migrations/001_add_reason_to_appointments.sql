-- Migration: Add reason column to Appointments table
-- This column stores the reason/motive for the appointment

ALTER TABLE Appointments ADD COLUMN reason TEXT NOT NULL DEFAULT '';
