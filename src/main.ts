import { InstanceBase, runEntrypoint, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { WebSocket } from 'ws'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import {
	UpdateVariableDefinitions,
	applyMousePosition,
	applySysInfo,
	createEmptyState,
	stateToVariableValues,
	type ListenerState,
} from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { createHash } from 'node:crypto'

export class ModuleInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
	socket: WebSocket | null = null
	config!: ModuleConfig
	secrets!: ModuleSecrets
	state: ListenerState = createEmptyState()
	reconnectTimer: NodeJS.Timeout | null = null
	reconnectAttempts = 0
	reconnectDelay = 500 // Start with 500ms
	maxReconnectDelay = 10000 // Cap at 10 seconds
	reconnectIncrementMs = 500 // Increment by 500ms
	absoluteMaxReconnectDelay = 15000 // Absolute max of 15 seconds

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()

		// Initially, set status to Warning until authenticated.
		this.updateStatus(InstanceStatus.UnknownWarning)
		this.connectSocket()
	}

	// Connect to the Bitfocus Listener WebSocket server.
	connectSocket(): void {
		// Clear any existing reconnect timer
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		const url = `ws://${this.config.host}:${this.config.port}/ws`
		this.log('debug', `Connecting to ${url}`)
		this.socket = new WebSocket(url)
		this.socket.onopen = () => {
			this.log('debug', 'Socket connected')
			// Reset reconnection attempts on successful connection
			this.reconnectAttempts = 0
			this.reconnectDelay = 500
		}
		this.socket.onmessage = (event) => {
			let msg: Record<string, unknown>
			try {
				msg = JSON.parse(event.data as string) as Record<string, unknown>
			} catch (_e) {
				this.log('error', 'Invalid JSON received')
				return
			}
			this.handleMessage(msg)
		}
		this.socket.onerror = (err) => {
			this.log('error', `Socket error: ${JSON.stringify(err)}`)
			this.updateStatus(InstanceStatus.UnknownError, 'Socket error')
		}
		this.socket.onclose = () => {
			this.log('debug', 'Socket closed')
			this.updateStatus(InstanceStatus.Disconnected, 'Socket closed')
			// Attempt to reconnect with backoff strategy
			this.scheduleReconnect()
		}
	}

	handleMessage(msg: Record<string, unknown>): void {
		switch (msg.type) {
			case 'authChallenge': {
				const salt = String(msg.salt ?? '')
				const hash = this.computeMD5(salt + this.secrets.password)
				this.sendCommand({ type: 'auth', password: hash })
				return
			}
			case 'authResponse': {
				if (msg.status === 'authenticated') {
					this.log('debug', 'Authentication successful')
					this.updateStatus(InstanceStatus.Ok)
					this.applyConfiguredSubscriptions()
				} else {
					this.log('error', 'Authentication failed')
					this.updateStatus(InstanceStatus.BadConfig, 'Authentication failed')
				}
				return
			}
			case 'mousePositionUpdate':
			case 'mousePositionGetResponse': {
				if (applyMousePosition(this.state, msg.x, msg.y)) {
					this.setVariableValues(stateToVariableValues(this.state))
					this.checkFeedbacks('mouse_x_above', 'mouse_y_above')
				}
				return
			}
			case 'sysInfoUpdate': {
				if (applySysInfo(this.state, msg)) {
					this.setVariableValues(stateToVariableValues(this.state))
					this.checkFeedbacks('cpu_above', 'mem_percent_above', 'processes_above')
				}
				return
			}
			default:
				this.log('debug', `Received message: ${JSON.stringify(msg)}`)
		}
	}

	// Compute MD5 hash using Node's crypto module.
	computeMD5(s: string): string {
		return createHash('md5').update(s).digest('hex')
	}

	// Send a command via the WebSocket connection.
	sendCommand(cmd: Record<string, unknown>): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(cmd))
		} else {
			this.log('error', 'Socket not connected')
		}
	}

	applyConfiguredSubscriptions(): void {
		if (this.config.subscribeSysInfo) {
			this.sendCommand({ type: 'subscribeSysInfo' })
		}
		if (this.config.subscribeMousePosition) {
			this.sendCommand({ type: 'subscribeMousePosition' })
		}
	}

	// Schedule a reconnection attempt with backoff
	scheduleReconnect(): void {
		// Don't schedule a reconnect if we're being destroyed
		if (!this.socket) return

		// Calculate the next reconnect delay with backoff
		this.reconnectAttempts++

		// Calculate delay: 500ms, 1000ms, 1500ms, etc. up to maxReconnectDelay
		this.reconnectDelay = Math.min(this.reconnectIncrementMs * this.reconnectAttempts, this.maxReconnectDelay)

		// Ensure we never exceed the absolute maximum delay
		const actualDelay = Math.min(this.reconnectDelay, this.absoluteMaxReconnectDelay)

		this.log('debug', `Scheduling reconnect attempt ${this.reconnectAttempts} in ${actualDelay}ms`)

		// Schedule the reconnection
		this.reconnectTimer = setTimeout(() => {
			this.log('debug', `Attempting to reconnect (attempt ${this.reconnectAttempts})`)
			this.connectSocket()
		}, actualDelay)
	}

	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		// Clear any reconnect timer
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		if (this.socket) {
			this.socket.close()
			this.socket = null
		}
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		// Clear any reconnect timer
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		// Reset reconnection state
		this.reconnectAttempts = 0
		this.reconnectDelay = 500

		// Reconnect socket when config is updated
		if (this.socket) {
			this.socket.close()
			this.socket = null
		}
		this.connectSocket()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
