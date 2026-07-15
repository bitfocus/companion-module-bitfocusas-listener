import { type CompanionStaticUpgradeResult, type CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig, ModuleSecrets } from './config.js'
import { normalizeModifiers } from './keys.js'

const MovePasswordToSecrets: CompanionStaticUpgradeScript<ModuleConfig, ModuleSecrets> = (_context, props) => {
	const result: CompanionStaticUpgradeResult<ModuleConfig, ModuleSecrets> = {
		updatedConfig: null,
		updatedSecrets: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	if (props.config) {
		const oldConfig = props.config as ModuleConfig & { password?: string }
		if (oldConfig.password) {
			const updatedSecrets: ModuleSecrets = props.secrets ?? { password: oldConfig.password }
			result.updatedConfig = oldConfig

			if (!updatedSecrets.password) {
				updatedSecrets.password = oldConfig.password
			}
			delete oldConfig.password

			result.updatedSecrets = updatedSecrets
		}
	}

	return result
}

const ConvertModifiersToArray: CompanionStaticUpgradeScript<ModuleConfig, ModuleSecrets> = (_context, props) => {
	const result: CompanionStaticUpgradeResult<ModuleConfig, ModuleSecrets> = {
		updatedConfig: null,
		updatedSecrets: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	const actionsWithModifiers = new Set(['key_combination', 'osx_key_press_process'])

	for (const action of props.actions) {
		if (!actionsWithModifiers.has(action.actionId)) continue
		if (typeof action.options.modifiers !== 'string') continue

		action.options.modifiers = normalizeModifiers(action.options.modifiers)
		result.updatedActions.push(action)
	}

	return result
}

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig, ModuleSecrets>[] = [
	MovePasswordToSecrets,
	ConvertModifiersToArray,
]
