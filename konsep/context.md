# Project Context: Terminal Induk Parepare Information System

## Overview
This project is a web-based Information System for Bus Departures and Arrivals at Terminal Induk Parepare. The goal is to digitize the currently manual recording system (paper-based and physical information boards) into a modern, real-time, and centralized web platform.

## Key Constraints
- **Platform**: Web-only (No standalone mobile apps like Flutter/Android). Drivers will access the system via mobile web browsers.
- **Tech Stack**: Laravel (Backend/API), React (Frontend), Tailwind CSS (Styling), MySQL (Database), Laravel Reverb (WebSockets for real-time tracking), Leaflet.js (Map visualization).
- **No Paid APIs**: Everything must rely on open-source/free-tier tools (e.g., OpenStreetMap instead of Google Maps, HTML5 Geolocation API, self-hosted Reverb).

## User Roles (Actors)
1. **Admin**: Back-office manager. Manages master data (Bus, Routes, Schedules), manually updates bus statuses if needed, and generates PDF reports.
2. **Supir (Driver)**: Field operator. Logs into the web app on their phone, selects their schedule, and clicks "Mulai Perjalanan" (Start Journey) which triggers background HTML5 Geolocation tracking to send coordinates to the server.
3. **Penumpang (Passenger)**: Public user (no login required). Browses schedules, searches for routes, and views the real-time location of buses on a map.