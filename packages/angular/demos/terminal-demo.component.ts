import { Component, Input, signal } from '@angular/core'
import {
  UiTerminalComponent,
  type TerminalLine,
} from '../../../../../packages/registry-angular/components/terminal/terminal.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

const installLines: TerminalLine[] = [
  {
    command: 'npm create uipkge@latest my-app',
    output:
      'Setting up project...\nInstalling dependencies...\n\n  ✓ reka-ui\n  ✓ class-variance-authority\n  ✓ tailwind-merge\n\nDone in 12.4s.',
  },
  { command: 'cd my-app', output: undefined },
  { command: 'npm run dev', output: '  ➜  Local:   http://localhost:4321/\n  ➜  Network: use --host to expose' },
]

const buildLines: TerminalLine[] = [
  {
    command: 'npm run build',
    output:
      'vite v6.0.0 building for production...\n✓ 42 modules transformed.\n\ndist/index.html          0.46 kB\ndist/assets/index.css   12.34 kB\ndist/assets/index.js   142.88 kB\n\n✓ built in 1.2s',
  },
]

const errorLines: TerminalLine[] = [
  {
    command: 'npm run test',
    output:
      'FAIL  src/utils.test.ts\n  ● utils › should parse dates\n\n    Expected: "2024-01-15"\n    Received: "15/01/2024"\n\nTests: 1 failed, 23 passed, 24 total',
  },
]

const gitLines: TerminalLine[] = [
  {
    prompt: '➜  my-app git:(main)',
    command: 'git status',
    output: 'On branch main\nYour branch is up to date with origin/main.\n\nnothing to commit, working tree clean',
  },
  {
    prompt: '➜  my-app git:(main)',
    command: 'git log --oneline -5',
    output:
      'a1b2c3d feat: add dock component\ne4f5g6h fix: magnification edge case\ni7j8k9l refactor: extract variants\nm0n1o2p docs: update AGENTS.md\nq3r4s5t chore: bump dependencies',
  },
]

const serverLines: TerminalLine[] = [
  {
    type: 'output',
    output: '[vite] connecting...\n[vite] connected.\n\nServer started on port 3000\nPress Ctrl+C to stop',
  },
]

/** Angular demo for the terminal page. Mirrors demos/react/terminal.tsx story by story. */
@Component({
  selector: 'angular-terminal-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiTerminalComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Project setup') {
        <div class="max-w-2xl">
          <ui-terminal [lines]="installLines" title="uipkge-setup — zsh" />
        </div>
      }
      @case ('Theme variants') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ui-terminal [lines]="buildLines" title="build — zsh" />
          <ui-terminal [lines]="buildLines" title="build — zsh" theme="light" />
        </div>
      }
      @case ('Typing animation') {
        <div class="max-w-2xl">
          <ui-terminal [lines]="installLines" typing [typingSpeed]="400" title="install — zsh" />
        </div>
      }
      @case ('Custom shell prompt') {
        <div class="max-w-2xl">
          <ui-terminal [lines]="gitLines" promptChar=" " title="zsh — my-app" />
        </div>
      }
      @case ('Error output') {
        <div class="max-w-2xl">
          <ui-terminal [lines]="errorLines" title="npm test" />
        </div>
      }
      @case ('Log stream') {
        <div class="max-w-2xl">
          <ui-terminal [lines]="serverLines" title="server.log" maxHeight="160px" />
        </div>
      }
      @case ('Live log tail') {
        <div class="max-w-2xl space-y-3">
          <ui-terminal [lines]="dynamicLines()" maxHeight="220px" title="server — live" />
          <button ui-button size="sm" variant="outline" (click)="addLog()">Ping /health</button>
        </div>
      }
      @case ('In a docs card') {
        <div ui-card class="max-w-2xl">
          <div ui-card-header>
            <h3 ui-card-title>Quick start</h3>
            <p ui-card-description>Scaffold a new UIPKGE project in under a minute.</p>
          </div>
          <div ui-card-content>
            <ui-terminal [lines]="installLines" title="bash" />
          </div>
        </div>
      }
    }
  `,
})
export class AngularTerminalDemoComponent {
  @Input() story = 'Project setup'
  readonly installLines = installLines
  readonly buildLines = buildLines
  readonly errorLines = errorLines
  readonly gitLines = gitLines
  readonly serverLines = serverLines
  readonly dynamicLines = signal<TerminalLine[]>([{ command: 'node server.js', output: 'Listening on :3000' }])

  addLog(): void {
    this.dynamicLines.update((prev) => [
      ...prev,
      {
        command: 'curl localhost:3000/health',
        output: `{ "status": "ok", "uptime": ${Math.floor(Math.random() * 999)} }s`,
      },
    ])
  }
}
