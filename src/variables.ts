import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export const VariableIds = {
	MouseX: 'mouse_x',
	MouseY: 'mouse_y',
	Cpu: 'cpu',
	MaxCpu: 'max_cpu',
	Mem: 'mem',
	MaxMem: 'max_mem',
	MemPercent: 'mem_percent',
	Processes: 'processes',
} as const

export interface ListenerState {
	mouseX: number | null
	mouseY: number | null
	cpu: number | null
	maxCpu: number | null
	mem: number | null
	maxMem: number | null
	memPercent: number | null
	processes: number | null
}

export function createEmptyState(): ListenerState {
	return {
		mouseX: null,
		mouseY: null,
		cpu: null,
		maxCpu: null,
		mem: null,
		maxMem: null,
		memPercent: null,
		processes: null,
	}
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const definitions: CompanionVariableDefinition[] = [
		{ variableId: VariableIds.MouseX, name: 'Mouse X' },
		{ variableId: VariableIds.MouseY, name: 'Mouse Y' },
		{ variableId: VariableIds.Cpu, name: 'CPU Usage %' },
		{ variableId: VariableIds.MaxCpu, name: 'Max Core CPU Usage %' },
		{ variableId: VariableIds.Mem, name: 'Memory Used (bytes)' },
		{ variableId: VariableIds.MaxMem, name: 'Memory Total (bytes)' },
		{ variableId: VariableIds.MemPercent, name: 'Memory Used %' },
		{ variableId: VariableIds.Processes, name: 'Process Count' },
	]

	self.setVariableDefinitions(definitions)
	self.setVariableValues(stateToVariableValues(self.state))
}

export function stateToVariableValues(state: ListenerState): CompanionVariableValues {
	return {
		[VariableIds.MouseX]: formatNumber(state.mouseX),
		[VariableIds.MouseY]: formatNumber(state.mouseY),
		[VariableIds.Cpu]: formatNumber(state.cpu, 1),
		[VariableIds.MaxCpu]: formatNumber(state.maxCpu, 1),
		[VariableIds.Mem]: formatNumber(state.mem, 0),
		[VariableIds.MaxMem]: formatNumber(state.maxMem, 0),
		[VariableIds.MemPercent]: formatNumber(state.memPercent, 1),
		[VariableIds.Processes]: formatNumber(state.processes, 0),
	}
}

export function applyMousePosition(state: ListenerState, x: unknown, y: unknown): boolean {
	const nextX = toNumber(x)
	const nextY = toNumber(y)
	if (nextX === null || nextY === null) return false
	if (state.mouseX === nextX && state.mouseY === nextY) return false
	state.mouseX = nextX
	state.mouseY = nextY
	return true
}

export function applySysInfo(
	state: ListenerState,
	msg: { cpu?: unknown; maxCPU?: unknown; mem?: unknown; maxMem?: unknown; processes?: unknown },
): boolean {
	const cpu = toNumber(msg.cpu)
	const maxCpu = toNumber(msg.maxCPU)
	const mem = toNumber(msg.mem)
	const maxMem = toNumber(msg.maxMem)
	const processes = toNumber(msg.processes)

	const memPercent = mem !== null && maxMem !== null && maxMem > 0 ? (mem / maxMem) * 100 : null

	const unchanged =
		state.cpu === cpu &&
		state.maxCpu === maxCpu &&
		state.mem === mem &&
		state.maxMem === maxMem &&
		state.memPercent === memPercent &&
		state.processes === processes

	if (unchanged) return false

	state.cpu = cpu
	state.maxCpu = maxCpu
	state.mem = mem
	state.maxMem = maxMem
	state.memPercent = memPercent
	state.processes = processes
	return true
}

function toNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value)
		if (Number.isFinite(parsed)) return parsed
	}
	return null
}

function formatNumber(value: number | null, digits?: number): string {
	if (value === null) return ''
	if (digits === undefined) return String(value)
	return value.toFixed(digits)
}
