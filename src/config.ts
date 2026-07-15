import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
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
	]
}
