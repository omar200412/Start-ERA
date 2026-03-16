"use client";

import { useThemeAuth } from "../context/ThemeAuthContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useThemeAuth();

  return (
    <div className="toggle-container">
      <div className="toggle-wrap">
        <input
          type="checkbox"
          className="toggle-input"
          id="theme-toggle"
          checked={darkMode}
          onChange={toggleTheme}
        />
        <label className="toggle-track" htmlFor="theme-toggle">
          {/* Animated scan line across the track */}
          <div className="track-lines">
            <div className="track-line" />
          </div>

          {/* The sliding thumb */}
          <div className="toggle-thumb">
            <div className="thumb-core" />
            <div className="thumb-inner" />
            <div className="thumb-scan" />
            <div className="thumb-particles">
              <div className="thumb-particle" />
              <div className="thumb-particle" />
              <div className="thumb-particle" />
              <div className="thumb-particle" />
              <div className="thumb-particle" />
            </div>
          </div>

          {/* OFF / ON labels */}
          <div className="toggle-data">
            <span className="data-text off">off</span>
            <span className="data-text on">on</span>
          </div>

          {/* Status dot */}
          <div className="status-indicator off" />
          <div className="status-indicator on" />

          {/* Spinning energy rings around the thumb */}
          <div className="energy-rings">
            <div className="energy-ring" />
            <div className="energy-ring" />
            <div className="energy-ring" />
          </div>

          {/* Decorative connector lines below the track */}
          <div className="interface-lines">
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
            <div className="interface-line" />
          </div>

          {/* Glass reflection overlay */}
          <div className="toggle-reflection" />

          {/* Ambient glow behind the track */}
          <div className="holo-glow" />
        </label>
      </div>
    </div>
  );
}