# Companion Module for Bitfocus Listener

This module integrates [Bitfocus Companion](https://bitfocus.io/companion) with the [Bitfocus Listener](https://bitfocus.io) application, allowing you to control your computer through Companion.

## Overview

Bitfocus Listener is a free application available on the Bitfocus website that enables remote control of your computer. This Companion module connects to the Listener application via WebSocket and allows you to trigger various computer control actions from your Companion interface.

## Features

With this module, you can control your computer in the following ways:

### Keyboard Control
- Simulate key presses, key down, and key up events
- Execute key combinations (e.g., Alt+Tab, Ctrl+C)
- Type text strings
- Send special key commands to specific applications (macOS only)

### Mouse Control
- Set the mouse cursor position
- Get the current mouse position
- Perform mouse clicks (left/right, single/double)

### System Control
- Run shell commands
- Open files
- Execute AppleScript commands (macOS only)
- Subscribe to system events and information

## Configuration

To use this module, you need to:

1. Download and install the [Bitfocus Listener](https://bitfocus.io) application on the computer you want to control
2. Configure the module with:
   - **Target IP**: The IP address of the computer running Listener
   - **Target Port**: The port Listener is using (default: 12001)
   - **Password**: The authentication password set in Listener

## Use Cases

This module is particularly useful for:

- Controlling presentation software during live events
- Automating repetitive tasks on your computer
- Integrating computer actions into your Companion workflows
- Triggering application-specific functions from your Stream Deck or other Companion control surfaces

## Support

For issues and feature requests related to this module, please visit:
[https://github.com/bitfocus/companion-module-bitfocusas-listener/issues](https://github.com/bitfocus/companion-module-bitfocusas-listener/issues)
