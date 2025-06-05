import { InstanceBase, runEntrypoint, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { WebSocket } from 'ws'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { createHash } from 'node:crypto'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	socket: WebSocket | null = null
	config!: ModuleConfig

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		// Initially, set status to Warning until authenticated.
		this.updateStatus(InstanceStatus.UnknownWarning)
		this.connectSocket()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
	}

	// Connect to the Bitfocus Listener WebSocket server.
	connectSocket(): void {
		const url = `ws://${this.config.host}:${this.config.port}/ws`
		this.log('debug', `Connecting to ${url}`)
		this.socket = new WebSocket(url)
		this.socket.onopen = () => {
			this.log('debug', 'Socket connected')
		}
		this.socket.onmessage = (event) => {
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let msg
			try {
				msg = JSON.parse(event.data)
			} catch (e) {
				this.log('error', 'Invalid JSON received')
				return
			}
			// When we receive an authChallenge, compute MD5(salt+password) and send auth.
			if (msg.type === 'authChallenge') {
				const salt = msg.salt
				const hash = this.computeMD5(salt + this.config.password)
				this.sendCommand({ type: 'auth', password: hash })
			} else if (msg.type === 'authResponse') {
				// Update status based on authentication outcome.
				if (msg.status === 'authenticated') {
					this.log('debug', 'Authentication successful')
					this.updateStatus(InstanceStatus.Ok)
					// send a subscribeSysInfo command to get system info.
					this.sendCommand({
						type: 'subscribeSysInfo',
					})
				} else {
					this.log('error', 'Authentication failed')
					this.updateStatus(InstanceStatus.BadConfig, 'Authentication failed')
				}
			} else {
				this.log('debug', `Received message: ${event.data}`)
			}
			// Optionally, handle other incoming messages.
		}
		this.socket.onerror = (err) => {
			this.log('error', `Socket error: ${err}`)
			this.updateStatus(InstanceStatus.UnknownError, 'Socket error')
		}
		this.socket.onclose = () => {
			this.log('debug', 'Socket closed')
			this.updateStatus(InstanceStatus.Disconnected, 'Socket closed')
		}
	}

	// Compute MD5 hash using Node's crypto module.
	computeMD5(s: string): string {
		return createHash('md5').update(s).digest('hex')
	}

	// Send a command via the WebSocket connection.
	sendCommand(cmd: any): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(cmd))
		} else {
			this.log('error', 'Socket not connected')
		}
	}

	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		if (this.socket) {
			this.socket.close()
			this.socket = null
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		// Reconnect socket when config is updated.
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
