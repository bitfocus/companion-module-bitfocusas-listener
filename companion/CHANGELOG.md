# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [1.1.0] - 2026-08-03

### Added

- Variables and feedbacks for mouse position and system info (CPU, memory, process count)
- Config options to subscribe to system info (default on) and mouse position (default off)
- Adjust Mouse Position action for relative cursor movement
- Searchable key / modifier dropdowns (with custom values allowed)
- Presets for common keys across Navigation, Function, Media, System, and more
- Support for hostnames (not only IP addresses) in Target Host
- Companion variable substitution in text-input actions (key string, shell, AppleScript, open file, process name)
- Multiline input for the macOS AppleScript action (real multi-statement scripts with newlines)
- Full module help text (`HELP.md`)

### Changed

- Password is stored as a module secret instead of plain connection config
- Subscribe / Unsubscribe actions replaced by connection config checkboxes
- macOS-specific action names standardized (e.g. macOS Key Press Process, macOS AppleScript)
- Dependency and tooling updates (Yarn 4, module base, TypeScript tooling)

### Fixed

- Crash when closing a WebSocket that was still connecting
- Socket handling when connection config is updated (reconnect and re-apply subscriptions)
- Disconnect logging no longer spams empty socket error messages
- TypeScript / lint cleanups
