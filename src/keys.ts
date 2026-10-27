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
	capslock: 'Caps Lock',
	menu: 'Menu / Context',
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
	num_lock: 'Num Lock',
	'num.': 'Numpad .',
	'num+': 'Numpad +',
	'num-': 'Numpad -',
	'num*': 'Numpad *',
	'num/': 'Numpad /',
	...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`num${i}`, `Numpad ${i}`])),
}

/** Keys Listener can only send on Windows; its macOS key table has no code for them. */
export const WINDOWS_ONLY_KEYS = new Set([
	'f16',
	'f17',
	'f18',
	'f19',
	'f20',
	'f21',
	'f22',
	'f23',
	'f24',
	'menu',
	'num0',
	'num1',
	'num2',
	'num3',
	'num4',
	'num5',
	'num6',
	'num7',
	'num8',
	'num9',
	'num.',
	'num+',
	'num-',
	'num*',
	'num/',
	'num_lock',
])

/** Full name for dropdowns and preset names, flagged when the key only works on Windows. */
export function keyDisplayName(key: string): string {
	const display = KEY_DISPLAY_NAMES[key] ?? key
	return WINDOWS_ONLY_KEYS.has(key) ? `${display} (Windows only)` : display
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
	Function: Array.from({ length: 24 }, (_, i) => `f${i + 1}`),
	Media: ['play', 'pause', 'stop', 'next', 'previous', 'volumeup', 'volumedown', 'mute'],
	System: ['esc', 'enter', 'space', 'capslock', 'menu', 'print', 'scroll', 'break'],
	Modifiers: ['ctrl', 'alt', 'shift', 'command', 'win'],
	Numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	Numpad: [
		'num0',
		'num1',
		'num2',
		'num3',
		'num4',
		'num5',
		'num6',
		'num7',
		'num8',
		'num9',
		'num.',
		'num+',
		'num-',
		'num*',
		'num/',
		'num_lock',
	],
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
		capslock: 'Caps',
		menu: 'Menu',
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
		num_lock: 'Num\nLock',
	}
	if (short[key]) return short[key]
	if (/^[a-z]$/.test(key)) return key.toUpperCase()
	if (/^f\d+$/.test(key)) return key.toUpperCase()
	if (key.startsWith('num')) return `Num\n${key.slice(3)}`
	return KEY_DISPLAY_NAMES[key] ?? key
}

function keyLabel(category: string, key: string): string {
	return `${category}: ${keyDisplayName(key)}`
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
