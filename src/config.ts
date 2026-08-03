import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
	subscribeSysInfo: boolean
	subscribeMousePosition: boolean
}

export interface ModuleSecrets {
	password: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target Host',
			width: 8,
			regex: Regex.HOSTNAME,
			default: '127.0.0.1',
			tooltip: 'IP address or hostname of the computer running Bitfocus Listener',
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 12001,
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password',
			width: 12,
		},
		{
			type: 'checkbox',
			id: 'subscribeSysInfo',
			label: 'Subscribe to System Info',
			width: 6,
			default: true,
			tooltip: 'Receive CPU, memory, and process updates (~5 seconds) for variables and feedbacks',
		},
		{
			type: 'checkbox',
			id: 'subscribeMousePosition',
			label: 'Subscribe to Mouse Position',
			width: 6,
			default: false,
			tooltip: 'Receive mouse position updates (~1 second) for variables and feedbacks',
		},
	]
}
