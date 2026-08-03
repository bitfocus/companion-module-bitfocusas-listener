import type { DropdownChoice } from '@companion-module/base'

export const KEY_DISPLAY_NAMES: Record<string, string> = {
	up: '↑ Up Arrow',
	down: '↓ Down Arrow',
	left: '← Left Arrow',
	right: '→ Right Arrow',
	home: 'Home',
	end: 'End',
	pageup: 'Page Up',
	pagedown: 'Page Down',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	insert: 'Insert',
	esc: 'Escape',
	enter: 'Enter',
	space: 'Space',
	print: 'Print Screen',
	scroll: 'Scroll Lock',
	pause: 'Pause',
	break: 'Break',
	play: 'Play',
	stop: 'Stop',
	next: 'Next Track',
	previous: 'Previous Track',
	volumeup: 'Volume Up',
	volumedown: 'Volume Down',
	mute: 'Mute',
	ctrl: 'Ctrl',
	alt: 'Alt / Option',
	shift: 'Shift',
	command: 'Cmd (Mac)',
	win: 'Windows',
}

export const KEY_CATEGORIES: Record<string, string[]> = {
	Navigation: [
		'up',
		'down',
		'left',
		'right',
		'home',
		'end',
		'pageup',
		'pagedown',
		'tab',
		'backspace',
		'delete',
		'insert',
	],
	Function: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
	Media: ['play', 'pause', 'stop', 'next', 'previous', 'volumeup', 'volumedown', 'mute'],
	System: ['esc', 'enter', 'space', 'print', 'scroll', 'break'],
	Modifiers: ['ctrl', 'alt', 'shift', 'command', 'win'],
	Numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	Letters: [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
	],
	Symbols: [
		'!',
		'@',
		'#',
		'$',
		'%',
		'^',
		'&',
		'*',
		'(',
		')',
		'-',
		'_',
		'=',
		'+',
		'[',
		']',
		'{',
		'}',
		'\\',
		'|',
		';',
		':',
		"'",
		'"',
		',',
		'.',
		'/',
		'?',
		'<',
		'>',
		'`',
		'~',
	],
}

/** Short label suitable for a Stream Deck button face. */
export function keyButtonText(key: string): string {
	const short: Record<string, string> = {
		up: 'Up',
		down: 'Down',
		left: 'Left',
		right: 'Right',
		home: 'Home',
		end: 'End',
		pageup: 'PgUp',
		pagedown: 'PgDn',
		tab: 'Tab',
		backspace: 'Bksp',
		delete: 'Del',
		insert: 'Ins',
		esc: 'Esc',
		enter: 'Enter',
		space: 'Space',
		print: 'PrtSc',
		scroll: 'ScrLk',
		pause: 'Pause',
		break: 'Break',
		play: 'Play',
		stop: 'Stop',
		next: 'Next',
		previous: 'Prev',
		volumeup: 'Vol\n+',
		volumedown: 'Vol\n-',
		mute: 'Mute',
		ctrl: 'Ctrl',
		alt: 'Alt',
		shift: 'Shift',
		command: 'Cmd',
		win: 'Win',
	}
	if (short[key]) return short[key]
	if (/^[a-z]$/.test(key)) return key.toUpperCase()
	return KEY_DISPLAY_NAMES[key] ?? key
}

function keyLabel(category: string, key: string): string {
	const display = KEY_DISPLAY_NAMES[key] ?? key
	return `${category}: ${display}`
}

function buildKeyChoices(): DropdownChoice[] {
	const choices: DropdownChoice[] = []
	const seen = new Set<string>()

	for (const [category, keys] of Object.entries(KEY_CATEGORIES)) {
		for (const key of keys) {
			if (seen.has(key)) continue
			seen.add(key)
			choices.push({ id: key, label: keyLabel(category, key) })
		}
	}

	return choices
}

export const KEY_CHOICES: DropdownChoice[] = buildKeyChoices()

export const MODIFIER_CHOICES: DropdownChoice[] = [
	{ id: 'ctrl', label: 'Ctrl' },
	{ id: 'alt', label: 'Alt / Option' },
	{ id: 'shift', label: 'Shift' },
	{ id: 'command', label: 'Cmd / Command (Mac)' },
	{ id: 'win', label: 'Windows' },
]

export const DEFAULT_KEY = 'a'
export const DEFAULT_COMBINATION_KEY = 'tab'
export const DEFAULT_MODIFIERS = ['alt']

/** Normalize modifier option values from legacy comma-separated strings or arrays. */
export function normalizeModifiers(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((v) => String(v).trim()).filter(Boolean)
	}
	if (typeof value === 'string') {
		return value
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
	}
	return []
}
