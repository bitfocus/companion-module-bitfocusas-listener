import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		// Key Press
		key_press: {
			name: 'Key Press',
			options: [
				{
					type: 'textinput',
					id: 'key',
					label: 'Key to Press',
					default: 'a',
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
					type: 'textinput',
					id: 'key',
					label: 'Key to Press Down',
					default: 'a',
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
					type: 'textinput',
					id: 'key',
					label: 'Key to Release',
					default: 'a',
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
					type: 'textinput',
					id: 'key',
					label: 'Key',
					default: 'tab',
				},
				{
					type: 'textinput',
					id: 'modifiers',
					label: 'Modifiers (comma separated)',
					default: 'alt',
				},
			],
			callback: async (event) => {
				const mods = (event.options.modifiers as string).split(',').map((s: string) => s.trim())
				self.sendCommand({
					type: 'keyCombinationPress',
					key: event.options.key,
					modifiers: mods,
				})
			},
		},
		// OSX Key Press Process (OSX only)
		osx_key_press_process: {
			name: 'OSX Key Press Process (OSX only)',
			options: [
				{
					type: 'textinput',
					id: 'key',
					label: 'Key',
					default: 'tab',
				},
				{
					type: 'textinput',
					id: 'modifiers',
					label: 'Modifiers (comma separated)',
					default: 'alt',
				},
				{
					type: 'textinput',
					id: 'processName',
					label: 'Process Name',
					default: 'Microsoft PowerPoint',
				},
			],
			callback: async (event) => {
				const modarr: string = event.options.modifiers as string
				const mods = modarr.split(',').map((s: string) => s.trim())
				self.sendCommand({
					type: 'osxKeyPressProcess',
					key: event.options.key,
					modifiers: mods,
					processName: event.options.processName,
				})
			},
		},
		// OSX AppleScript (OSX only)
		osx_applescript: {
			name: 'OSX AppleScript (OSX only)',
			options: [
				{
					type: 'textinput',
					id: 'script',
					label: 'AppleScript Command',
					default: 'tell application "Finder" to activate',
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
					default: 'Hello, world!',
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
					default: 'C:/path/to/file.pdf',
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
					max: 2000,
				},
				{
					type: 'number',
					id: 'y',
					label: 'Y Position',
					default: 500,
					min: 0,
					max: 2000,
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'mousePositionSet',
					x: (event.options.x as number).toString(),
					y: (event.options.y as number).toString(),
				})
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
		// Subscribe (with input for subscription type)
		subscribe: {
			name: 'Subscribe',
			options: [
				{
					type: 'textinput',
					id: 'subType',
					label: 'Subscription Type (e.g., mousePosition or sysInfo)',
					default: 'mousePosition',
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'subscribe',
					name: event.options.subType,
				})
			},
		},
		// Unsubscribe (with input for subscription type)
		unsubscribe: {
			name: 'Unsubscribe',
			options: [
				{
					type: 'textinput',
					id: 'subType',
					label: 'Subscription Type (e.g., mousePosition or sysInfo)',
					default: 'mousePosition',
				},
			],
			callback: async (event) => {
				self.sendCommand({
					type: 'unsubscribe',
					name: event.options.subType,
				})
			},
		},
	})
}
