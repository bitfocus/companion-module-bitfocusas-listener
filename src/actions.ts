import type { ModuleInstance } from './main.js'
import {
	DEFAULT_COMBINATION_KEY,
	DEFAULT_KEY,
	DEFAULT_MODIFIERS,
	KEY_CHOICES,
	MODIFIER_CHOICES,
	normalizeModifiers,
} from './keys.js'

const KEY_DROPDOWN = {
	type: 'dropdown' as const,
	choices: KEY_CHOICES,
	allowCustom: true,
	minChoicesForSearch: 0,
}

const MODIFIER_DROPDOWN = {
	type: 'multidropdown' as const,
	id: 'modifiers',
	label: 'Modifiers',
	choices: MODIFIER_CHOICES,
	default: DEFAULT_MODIFIERS,
	minChoicesForSearch: 0,
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		// Key Press
		key_press: {
			name: 'Key Press',
			options: [
				{
					...KEY_DROPDOWN,
					id: 'key',
					label: 'Key to Press',
					default: DEFAULT_KEY,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'keyPress',
					key: event.options.key,
				})
			},
		},
		// Key Down
		key_down: {
			name: 'Key Down',
			options: [
				{
					...KEY_DROPDOWN,
					id: 'key',
					label: 'Key to Press Down',
					default: DEFAULT_KEY,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'keyDown',
					key: event.options.key,
				})
			},
		},
		// Key Up
		key_up: {
			name: 'Key Up',
			options: [
				{
					...KEY_DROPDOWN,
					id: 'key',
					label: 'Key to Release',
					default: DEFAULT_KEY,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'keyUp',
					key: event.options.key,
				})
			},
		},
		// Key Combination Press
		key_combination: {
			name: 'Key Combination Press',
			options: [
				{
					...KEY_DROPDOWN,
					id: 'key',
					label: 'Key',
					default: DEFAULT_COMBINATION_KEY,
				},
				MODIFIER_DROPDOWN,
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'keyCombinationPress',
					key: event.options.key,
					modifiers: normalizeModifiers(event.options.modifiers),
				})
			},
		},
		// macOS - Key Press Process (macOS only)
		osx_key_press_process: {
			name: 'macOS - Key Press Process (macOS only)',
			options: [
				{
					...KEY_DROPDOWN,
					id: 'key',
					label: 'Key',
					default: DEFAULT_COMBINATION_KEY,
				},
				MODIFIER_DROPDOWN,
				{
					type: 'textinput',
					id: 'processName',
					label: 'Process Name',
					default: '',
					useVariables: true,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'osxKeyPressProcess',
					key: event.options.key,
					modifiers: normalizeModifiers(event.options.modifiers),
					processName: event.options.processName,
				})
			},
		},
		// macOS - AppleScript (macOS only)
		osx_applescript: {
			name: 'macOS - AppleScript (macOS only)',
			options: [
				{
					type: 'textinput',
					id: 'script',
					label: 'AppleScript',
					default: 'tell application "Finder" to activate',
					useVariables: true,
					multiline: true,
					tooltip: 'Full AppleScript. Separate statements with new lines.',
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'osxAppleScript',
					msg: event.options.script,
				})
			},
		},
		// Key String
		key_string: {
			name: 'Key String',
			options: [
				{
					type: 'textinput',
					id: 'msg',
					label: 'String to Type',
					default: '',
					useVariables: true,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'keyString',
					msg: event.options.msg,
				})
			},
		},
		// Shell Run
		shell_command: {
			name: 'Shell Command',
			options: [
				{
					type: 'textinput',
					id: 'shell',
					label: 'Shell Command',
					default: 'dir',
					useVariables: true,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'shellRun',
					shell: event.options.shell,
				})
			},
		},
		// File Open
		open_file: {
			name: 'Open File',
			options: [
				{
					type: 'textinput',
					id: 'path',
					label: 'File Path',
					default: '',
					useVariables: true,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'fileOpen',
					path: event.options.path,
				})
			},
		},
		// Set Mouse Position
		set_mouse_position: {
			name: 'Set Mouse Position',
			options: [
				{
					type: 'number',
					id: 'x',
					label: 'X Position',
					default: 500,
					min: 0,
					max: 100000,
				},
				{
					type: 'number',
					id: 'y',
					label: 'Y Position',
					default: 500,
					min: 0,
					max: 100000,
				},
			],
			callback: async (event) => {
				self.setMousePosition(Number(event.options.x), Number(event.options.y))
			},
		},
		// Adjust Mouse Position (relative offset)
		adjust_mouse_position: {
			name: 'Adjust Mouse Position',
			options: [
				{
					type: 'number',
					id: 'x',
					label: 'X Offset',
					default: 0,
					min: -100000,
					max: 100000,
					tooltip: 'Positive moves right, negative moves left',
				},
				{
					type: 'number',
					id: 'y',
					label: 'Y Offset',
					default: 0,
					min: -100000,
					max: 100000,
					tooltip: 'Positive moves down, negative moves up',
				},
			],
			callback: async (event) => {
				self.adjustMousePosition(Number(event.options.x), Number(event.options.y))
			},
		},
		// Get Mouse Position
		get_mouse_position: {
			name: 'Get Mouse Position',
			options: [],
			callback: async (_event) => {
				self.sendCommand({
					type: 'mousePositionGet',
				})
			},
		},
		// Mouse Click
		mouse_click: {
			name: 'Mouse Click',
			options: [
				{
					type: 'dropdown',
					id: 'button',
					label: 'Button',
					choices: [
						{ id: 'left', label: 'Left' },
						{ id: 'right', label: 'Right' },
					],
					default: 'left',
				},
				{
					type: 'dropdown',
					id: 'double',
					label: 'Double Click',
					choices: [
						{ id: 'false', label: 'No' },
						{ id: 'true', label: 'Yes' },
					],
					default: 'false',
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'mouseClick',
					button: event.options.button,
					double: event.options.double,
				})
			},
		},
	})
}
