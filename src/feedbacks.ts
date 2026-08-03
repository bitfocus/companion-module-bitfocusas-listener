import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

function thresholdOptions(label: string, defaultValue: number) {
	return [
		{
			type: 'number' as const,
			id: 'threshold',
			label,
			default: defaultValue,
			min: 0,
			max: 100,
		},
	]
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		cpu_above: {
			type: 'boolean',
			name: 'CPU Above Threshold',
			description: 'True when Listener CPU usage % is above the threshold',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: thresholdOptions('CPU %', 80),
			callback: (feedback) => {
				const threshold = Number(feedback.options.threshold)
				return self.state.cpu !== null && self.state.cpu > threshold
			},
		},
		mem_percent_above: {
			type: 'boolean',
			name: 'Memory % Above Threshold',
			description: 'True when used memory percentage is above the threshold',
			defaultStyle: {
				bgcolor: combineRgb(200, 100, 0),
				color: combineRgb(255, 255, 255),
			},
			options: thresholdOptions('Memory %', 80),
			callback: (feedback) => {
				const threshold = Number(feedback.options.threshold)
				return self.state.memPercent !== null && self.state.memPercent > threshold
			},
		},
		processes_above: {
			type: 'boolean',
			name: 'Process Count Above Threshold',
			description: 'True when the Listener process count is above the threshold',
			defaultStyle: {
				bgcolor: combineRgb(0, 100, 200),
				color: combineRgb(255, 255, 255),
			},
			options: thresholdOptions('Processes', 200),
			callback: (feedback) => {
				const threshold = Number(feedback.options.threshold)
				return self.state.processes !== null && self.state.processes > threshold
			},
		},
		mouse_x_above: {
			type: 'boolean',
			name: 'Mouse X Above Threshold',
			description: 'True when mouse X is above the threshold (from Get Mouse Position or subscription)',
			defaultStyle: {
				bgcolor: combineRgb(0, 150, 0),
				color: combineRgb(255, 255, 255),
			},
			options: thresholdOptions('X', 500),
			callback: (feedback) => {
				const threshold = Number(feedback.options.threshold)
				return self.state.mouseX !== null && self.state.mouseX > threshold
			},
		},
		mouse_y_above: {
			type: 'boolean',
			name: 'Mouse Y Above Threshold',
			description: 'True when mouse Y is above the threshold (from Get Mouse Position or subscription)',
			defaultStyle: {
				bgcolor: combineRgb(0, 150, 0),
				color: combineRgb(255, 255, 255),
			},
			options: thresholdOptions('Y', 500),
			callback: (feedback) => {
				const threshold = Number(feedback.options.threshold)
				return self.state.mouseY !== null && self.state.mouseY > threshold
			},
		},
	})
}
