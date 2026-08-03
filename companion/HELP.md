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
   - **Subscribe to System Info** — on by default; updates CPU / memory / process variables (~5s)
   - **Subscribe to Mouse Position** — off by default; enable for continuous mouse X/Y updates (~1s)
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

- **macOS**
  — Listener needs Accessibility (and related) permission for keyboard / mouse automation. Approve Bitfocus Listener in **System Settings → Privacy & Security → Accessibility** if prompted.
  — **macOS Key Press Process** and **macOS AppleScript** only work when Listener is running on macOS.
- **Windows**
  — shell commands run via `cmd /C`.

### Key names and modifiers

Keyboard actions use searchable dropdowns for keys and modifiers. Prefer selecting from the list — that uses the exact strings Listener expects and avoids typos.

Key categories include Navigation, Function, Media, System, Modifiers, Numbers, Letters, and Symbols. You can also enter a custom value if needed.

**Modifiers** (for Key Combination / macOS Key Press Process):

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
- **macOS Key Press Process** _(macOS only)_ — activate an application by name, then send a key (with optional modifiers). Process name examples: `Finder`, `Google Chrome`, `Microsoft PowerPoint`
- **macOS AppleScript** _(macOS only)_ — run an AppleScript snippet on the Listener machine (Companion variables supported). Use a multiline script with one statement per line, e.g.:

  ```applescript
  display dialog "Hello World"
  display alert "Hello World"
  ```

  Putting two statements on one line without a newline is invalid AppleScript and will fail.

**Mouse**

- **Set Mouse Position** — move the cursor to screen coordinates `X` / `Y` (origin is typically top-left of the primary display)
- **Adjust Mouse Position** — move the cursor by a relative `X` / `Y` offset from its current position (positive X = right, positive Y = down). If the current position is unknown, the module fetches it first.
- **Get Mouse Position** — request the current cursor position from Listener
- **Mouse Click** — left or right click; optional double-click

**System**

- **Shell Command** — run a shell command on the Listener machine (`sh -c` on macOS/Linux, `cmd /C` on Windows; Companion variables supported)
- **Open File** — open a file, folder, or URL with the OS default handler (`open` / `xdg-open` / Windows FileProtocolHandler; Companion variables supported)

### Variables

Values update when Listener sends data. Configuration settings control these updates:

- **Subscribe to System Info** (default on) — CPU / memory / process variables every ~5 seconds
- **Subscribe to Mouse Position** (default off) — mouse X/Y every ~1 second

**Get Mouse Position** still requests a one-shot update even when the mouse subscription is disabled.

Use variables in button text, other actions, or expressions as `$(bitfocusas-listener:mouse_x)` (label depends on your connection name).

| Variable      | Source                               | Description                      |
| ------------- | ------------------------------------ | -------------------------------- |
| `mouse_x`     | Mouse subscribe / Get Mouse Position | Cursor X                         |
| `mouse_y`     | Mouse subscribe / Get Mouse Position | Cursor Y                         |
| `cpu`         | System info subscribe                | Overall CPU usage %              |
| `max_cpu`     | System info subscribe                | Highest sampled core CPU usage % |
| `mem`         | System info subscribe                | Used memory in bytes             |
| `max_mem`     | System info subscribe                | Total memory in bytes            |
| `mem_percent` | System info subscribe                | Used memory as a percentage      |
| `processes`   | System info subscribe                | Number of running processes      |

### Feedbacks / conditions

Boolean feedbacks compare the latest Listener values to a threshold (shown under Feedbacks / usable as button conditions):

- **CPU Above Threshold**
- **Memory % Above Threshold**
- **Process Count Above Threshold**
- **Mouse X Above Threshold**
- **Mouse Y Above Threshold**

### Tips

- Prefer discrete key actions over Shell / AppleScript when possible — they are easier to audit and safer to leave enabled in Listener.
- Keep Shell and AppleScript disabled in Listener unless you specifically need them.
- If keys work locally but not from Companion, check **Key Access Control** and **Allowed Remote Actions** in Listener.
- Use a static IP, DHCP reservation, or stable hostname on the Listener machine so the Target Host does not change.
- Regenerating the Listener password immediately disconnects clients that still use the old password.

### Support

- Listener help: [Bitfocus Listener](https://support.bitfocus.io/hc/en-us/sections/35268661854610-Bitfocus-Listener)
- Module issues: [GitHub Issues](https://github.com/bitfocus/companion-module-bitfocusas-listener/issues)
