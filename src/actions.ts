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
					default: '',
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
					default: '',
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
					default: '',
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
					default: '',
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
					default: '',
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
					tooltip:
						'The command string to execute. Quotes, environment variables, and JSON are supported automatically when Base64 mode is selected.',
				},
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Execution Mode / Encoding',
					tooltip:
						'Base64 encoding prevents syntax errors when commands contain double/single quotes, backslashes, or JSON payloads.',
					description:
						'Select CMD Base64 for Windows CMD commands (supports %USERPROFILE%, quotes, and redirects). Select PowerShell Base64 for PowerShell syntax ($env).',
					choices: [
						{ id: 'cmd_b64', label: 'CMD Base64 (Windows - Supports CMD syntax, %ENV%, quotes & redirects)' },
						{ id: 'powershell_b64', label: 'PowerShell Base64 (Windows - Supports PowerShell syntax, $env)' },
						{ id: 'bash_b64', label: 'Bash Base64 (macOS / Linux - Fixes all quotes & JSON)' },
						{ id: 'direct', label: 'Direct / Raw (No encoding)' },
					],
					default: 'cmd_b64',
				},
			],
			callback: async (event) => {
				const rawShell = (event.options.shell as string) || ''
				const shell = await self.parseVariablesInString(rawShell)

				let targetCommand = shell
				const mode = event.options.mode || 'cmd_b64'

				if (mode === 'cmd_b64') {
					const innerB64 = Buffer.from(shell, 'utf16le').toString('base64')
					const psScript = `$b=[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('${innerB64}')); cmd.exe /c $b`
					const fullB64 = Buffer.from(psScript, 'utf16le').toString('base64')
					targetCommand = `powershell -NoProfile -NonInteractive -EncodedCommand ${fullB64}`
				} else if (mode === 'powershell_b64') {
					const b64 = Buffer.from(shell, 'utf16le').toString('base64')
					targetCommand = `powershell -NoProfile -NonInteractive -EncodedCommand ${b64}`
				} else if (mode === 'bash_b64') {
					const b64 = Buffer.from(shell, 'utf-8').toString('base64')
					targetCommand = `echo "${b64}" | base64 -d | bash`
				}

				self.sendCommand({
					type: 'shellRun',
					shell: targetCommand,
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
