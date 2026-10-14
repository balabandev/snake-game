import { CONFIG } from './config.js';

export function loadHighScore() {
    try {
        const value = Number.parseInt(localStorage.getItem(CONFIG.HIGH_SCORE_KEY));
        return Number.idFinite(value) && value >= 0 ? value : 0;
    } catch {
        return 0;
    }
}

export function saveHighScore(score) {
    try {
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY, String(score));
    } catch {
        // Ignore errors when saving to localStorage
    }
}