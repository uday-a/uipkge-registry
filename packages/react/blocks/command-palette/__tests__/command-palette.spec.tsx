import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { CommandPalette } from '../CommandPalette'

describe('CommandPalette', () => {
  it('renders without crashing', () => {
    const { container } = render(<CommandPalette />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders the trigger button', () => {
    const { container } = render(<CommandPalette />)
    const trigger = container.querySelector('button[aria-label="Open command palette"]')
    expect(trigger).toBeTruthy()
  })

  it('opens the dialog when trigger is clicked', () => {
    const { container } = render(<CommandPalette />)
    const trigger = container.querySelector('button[aria-label="Open command palette"]')
    expect(trigger).toBeTruthy()
    fireEvent.click(trigger!)
    // CommandDialog renders into a portal on document.body
    const input = document.body.querySelector('input')
    expect(input).toBeTruthy()
  })

  it('renders command items from default groups', () => {
    render(<CommandPalette />)
    const trigger = document.body.querySelector('button[aria-label="Open command palette"]')
    expect(trigger).toBeTruthy()
    fireEvent.click(trigger!)
    // Default groups include Dashboard, Inbox, Kanban, Team, Profile, Settings
    expect(document.body.textContent).toContain('Dashboard')
    expect(document.body.textContent).toContain('Settings')
  })

  it('does not render trigger when showTrigger is false', () => {
    const { container } = render(<CommandPalette showTrigger={false} />)
    const trigger = container.querySelector('button[aria-label="Open command palette"]')
    expect(trigger).toBeNull()
  })
})
