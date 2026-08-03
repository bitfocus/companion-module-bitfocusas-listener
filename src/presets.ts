import {
	combineRgb,
	type CompanionButtonPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { KEY_CATEGORIES, KEY_DISPLAY_NAMES, keyButtonText } from './keys.js'
import { VariableIds } from './variables.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const RED = combineRgb(200, 0, 0)
const ORANGE = combineRgb(200, 100, 0)

function presetIdForKey(key: string): string {
	const safe = encodeURIComponent(key).replace(/%/g, '_')
	return `key_press_${safe}`
}

function keyPressPreset(category: string, key: string): CompanionButtonPresetDefinition {
	const display = KEY_DISPLAY_NAMES[key] ?? key
	return {
		type: 'button',
		category,
		name: `Key Press: ${display}`,
		style: {
			text: keyButtonText(key),
			size: 'auto',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'key_press',
						options: { key },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
}

function statusPreset(
	name: string,
	text: string,
	feedback?: CompanionButtonPresetDefinition['feedbacks'][number],
): CompanionButtonPresetDefinition {
	return {
		type: 'button',
		category: 'Status',
		name,
		style: {
			text,
			size: 12,
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: feedback ? [feedback] : [],
	}
}

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}
	const seen = new Set<string>()
	const v = (id: string): string => `$(${self.label}:${id})`

	for (const [category, keys] of Object.entries(KEY_CATEGORIES)) {
		for (const key of keys) {
			if (seen.has(key)) continue
			seen.add(key)
			presets[presetIdForKey(key)] = keyPressPreset(category, key)
		}
	}

	presets['status_cpu'] = statusPreset('CPU Usage', `CPU\n${v(VariableIds.Cpu)}%`, {
		feedbackId: 'cpu_above',
		options: { threshold: 80 },
		style: { bgcolor: RED, color: WHITE },
	})
	presets['status_max_cpu'] = statusPreset('Max Core CPU', `Max CPU\n${v(VariableIds.MaxCpu)}%`)
	presets['status_mem_percent'] = statusPreset('Memory %', `Mem\n${v(VariableIds.MemPercent)}%`, {
		feedbackId: 'mem_percent_above',
		options: { threshold: 80 },
		style: { bgcolor: ORANGE, color: WHITE },
	})
	presets['status_processes'] = statusPreset('Process Count', `Processes\n${v(VariableIds.Processes)}`)
	presets['status_mouse'] = statusPreset('Mouse Position', `Mouse\n${v(VariableIds.MouseX)}, ${v(VariableIds.MouseY)}`)

	presets['mouse_click_left'] = {
		type: 'button',
		category: 'Mouse',
		name: 'Left Click',
		style: {
			text: 'Left\nClick',
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'mouse_click',
						options: { button: 'left', double: 'false' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['mouse_click_right'] = {
		type: 'button',
		category: 'Mouse',
		name: 'Right Click',
		style: {
			text: 'Right\nClick',
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'mouse_click',
						options: { button: 'right', double: 'false' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['mouse_get_position'] = {
		type: 'button',
		category: 'Mouse',
		name: 'Get Mouse Position',
		style: {
			text: `Get Mouse\n${v(VariableIds.MouseX)}, ${v(VariableIds.MouseY)}`,
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'get_mouse_position',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	const nudge = (id: string, name: string, text: string, x: number, y: number): void => {
		presets[id] = {
			type: 'button',
			category: 'Mouse',
			name,
			style: {
				text,
				size: '14',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: 'adjust_mouse_position',
							options: { x, y },
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}
	nudge('mouse_nudge_up', 'Nudge Up', 'Nudge Mouse\nUp', 0, -10)
	nudge('mouse_nudge_down', 'Nudge Down', 'Nudge Mouse\nDown', 0, 10)
	nudge('mouse_nudge_left', 'Nudge Left', 'Nudge Mouse\nLeft', -10, 0)
	nudge('mouse_nudge_right', 'Nudge Right', 'Nudge Mouse\nRight', 10, 0)

	self.setPresetDefinitions(presets)
}
