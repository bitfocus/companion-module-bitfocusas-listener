import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (_context, props) {
		const updatedActions = []

		for (const action of props.actions) {
			if (action.actionId === 'shell_command') {
				if (action.options.mode === undefined) {
					action.options.mode = 'cmd_b64'
					updatedActions.push(action)
				}
			}
		}

		return {
			updatedConfig: null,
			updatedActions,
			updatedFeedbacks: [],
		}
	},
]
