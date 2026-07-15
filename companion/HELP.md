## Bitfocus Listener

Control a remote Mac or Windows computer from Companion / Buttons using [Bitfocus Listener](https://support.bitfocus.io/hc/en-us/sections/35268661854610-Bitfocus-Listener).

Listener is a small app that runs on the machine you want to control. This module connects to it over WebSocket and can send key presses, mouse actions, shell commands, and more.

Download Listener from [https://user.bitfocus.io/download](https://user.bitfocus.io/download).

### Getting started

1. Install and launch **Bitfocus Listener** on the computer you want to control.
2. In Listener, confirm:
   - **Bind Interface** — leave as `0.0.0.0` to accept connections from any network interface, or pick a specific interface.
   - **Server Port** — default is `12001`.
   - **Password** — use **Show** or **Copy** to read the generated password.
3. In Companion / Buttons, add a **Bitfocus Listener** connection and set:
   - **Target Host** — IP address or hostname of the computer running Listener
   - **Target Port** — same port as Listener (default `12001`)
   - **Password** — the password shown in Listener
4. Click **Save**. When authentication succeeds, the connection status should show OK / connected.

If authentication fails, double-check the password and regenerate it in Listener if needed (**Generate New**).

Official setup guide: [Bitfocus Listener Quick Start](https://support.bitfocus.io/hc/en-us/articles/35257549885458-Bitfocus-Listener-Quick-Start).

### Listener security settings

Configure these in the Listener app on the target computer. They apply to every remote client, including this connection.

**Edit Allowed Remote Actions**

Enable or disable entire command types (key press, shell, mouse, AppleScript, etc.).  
Turn off anything you do not need — especially **Run Shell Command** and **macOS AppleScript**.

**Edit Key Access Control**

- **Full Access** — all keys are allowed (default)
- **Restricted** — only selected key categories or individual keys can be pressed

If an action is blocked in Listener, the button press will not take effect even when Companion is connected.

**Activity Log**

Shows recent connections and actions. Useful when debugging why a command was ignored or blocked.

### Platform notes

- **macOS** — Listener needs Accessibility (and related) permission for keyboard / mouse automation. Approve Bitfocus Listener in **System Settings → Privacy & Security** if prompted.
- **Windows** — shell commands run via `cmd /C`.
- **macOS-only actions** — **OSX Key Press Process** and **OSX AppleScript** only work when Listener is running on macOS.

### Key names and modifiers

Keyboard actions use searchable dropdowns for keys and modifiers. Prefer selecting from the list — that uses the exact strings Listener expects and avoids typos.

Key categories include Navigation, Function, Media, System, Modifiers, Numbers, Letters, and Symbols. You can also enter a custom value if needed.

**Modifiers** (for Key Combination / OSX Key Press Process):

- `alt` — Alt / Option
- `ctrl` — Ctrl
- `shift` — Shift
- `command` / `cmd` — Cmd (macOS); on Windows some setups respond to `cmd` for the Windows key
- `win` — Windows key

Examples:

- Key Combination: key `c`, modifiers `ctrl` → Ctrl+C
- Key Combination: key `tab`, modifiers `alt` → Alt+Tab
- Key Combination: key `s`, modifiers `command` → Cmd+S on macOS

### Actions

**Keyboard**

- **Key Press** — tap a single key
- **Key Down** — press and hold a key
- **Key Up** — release a held key
- **Key Combination Press** — press a key with one or more modifiers
- **Key String** — type a text string into the focused field / application (Companion variables supported)
- **Volume Up / Down / Mute** — media volume keys (same as Key Press with `volumeup` / `volumedown` / `mute`)
- **OSX Key Press Process** _(macOS only)_ — activate an application by name, then send a key (with optional modifiers). Process name examples: `Finder`, `Google Chrome`, `Microsoft PowerPoint`
- **OSX AppleScript** _(macOS only)_ — run an AppleScript snippet on the Listener machine (Companion variables supported)

**Mouse**

- **Set Mouse Position** — move the cursor to screen coordinates `X` / `Y` (origin is typically top-left of the primary display)
- **Get Mouse Position** — request the current cursor position from Listener
- **Mouse Click** — left or right click; optional double-click

**System**

- **Shell Command** — run a shell command on the Listener machine (`sh -c` on macOS/Linux, `cmd /C` on Windows; Companion variables supported)
- **Open File** — open a file, folder, or URL with the OS default handler (`open` / `xdg-open` / Windows FileProtocolHandler; Companion variables supported)

**Subscriptions**

- **Subscribe** — start receiving updates from Listener. Supported types:
  - `mousePosition` — cursor position updates (~1 second)
  - `sysInfo` — CPU / memory / process count updates (~5 seconds)
- **Unsubscribe** — stop a subscription (`mousePosition` or `sysInfo`)

The connection automatically subscribes to `sysInfo` after a successful login. Feedbacks and variables from those updates are not exposed in this module yet.

### Tips

- Prefer discrete key actions over Shell / AppleScript when possible — they are easier to audit and safer to leave enabled in Listener.
- Keep Shell and AppleScript disabled in Listener unless you specifically need them.
- If keys work locally but not from Companion, check **Key Access Control** and **Allowed Remote Actions** in Listener.
- Use a static IP, DHCP reservation, or stable hostname on the Listener machine so the Target Host does not change.
- Regenerating the Listener password immediately disconnects clients that still use the old password.

### Support

- Listener help: [Bitfocus Listener](https://support.bitfocus.io/hc/en-us/sections/35268661854610-Bitfocus-Listener)
- Module issues: [GitHub Issues](https://github.com/bitfocus/companion-module-bitfocusas-listener/issues)
