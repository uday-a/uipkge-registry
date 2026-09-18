import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

interface ChangedFile {
  status: string
  filePath: string
}

function getBaseRef(): string {
  if (process.env.GITHUB_BASE_REF) {
    try {
      execSync(`git rev-parse --verify origin/${process.env.GITHUB_BASE_REF}`, {
        stdio: 'ignore',
      })
      return `origin/${process.env.GITHUB_BASE_REF}`
    } catch {
      // Fallback below
    }
  }

  const candidates = ['origin/main', 'main', 'HEAD~1']
  for (const ref of candidates) {
    try {
      execSync(`git rev-parse --verify ${ref}`, { stdio: 'ignore' })
      return ref
    } catch {
      continue
    }
  }
  return 'HEAD'
}

function getChangedFiles(baseRef: string): ChangedFile[] {
  try {
    const diffCmd = `git diff --name-status ${baseRef}`
    const output = execSync(diffCmd, { encoding: 'utf-8' }).trim()

    if (!output) return []

    return output
      .split('\n')
      .map((line) => {
        const parts = line.split('\t')
        return {
          status: parts[0]?.trim() || '',
          filePath: parts[parts.length - 1]?.trim() || '',
        }
      })
      .filter((f) => f.filePath.length > 0)
  } catch (err) {
    console.error('Failed to get changed files from git:', err)
    return []
  }
}

function isBlockFile(f: string): boolean {
  return (
    f.includes('/blocks/') ||
    f.startsWith('packages/vue/blocks/') ||
    f.startsWith('packages/react/blocks/') ||
    (f.includes('/demos/') && !f.includes('/demos/charts/'))
  )
}

function isPrimitiveFile(f: string): boolean {
  return (
    f.startsWith('packages/vue/components/') ||
    f.startsWith('packages/react/components/') ||
    f.startsWith('packages/shared/styles/') ||
    f.startsWith('packages/shared/variants/') ||
    f.startsWith('packages/vue/bootstrap/') ||
    f.startsWith('packages/react/bootstrap/')
  )
}

function runScopeCheck() {
  console.log('🔍 [PR Scope Guard] Checking PR file change boundaries...')

  const baseRef = getBaseRef()
  console.log(`ℹ️ Comparing against base reference: ${baseRef}`)

  const changed = getChangedFiles(baseRef)
  if (changed.length === 0) {
    console.log('✅ No file changes detected compared to base reference.')
    process.exit(0)
  }

  console.log(`ℹ️ Total changed files: ${changed.length}`)

  const blockFiles = changed.filter((c) => isBlockFile(c.filePath))
  const primitiveFiles = changed.filter((c) => isPrimitiveFile(c.filePath))

  // Scenario 1: PR touches Blocks AND also touches existing primitives
  if (blockFiles.length > 0 && primitiveFiles.length > 0) {
    // Check if explicitly bypassed by maintainer override env
    if (process.env.ALLOW_CROSS_BOUNDARY_PR === 'true') {
      console.warn('⚠️ [PR Scope Guard Warning] Cross-boundary changes permitted via ALLOW_CROSS_BOUNDARY_PR=true.')
      return
    }

    console.error('\n' + '='.repeat(70))
    console.error('❌ [PR SCOPE VIOLATION] Unwanted Modification to Existing Primitives!')
    console.error('='.repeat(70))
    console.error('This PR touches blocks but ALSO modifies existing primitives or design tokens.')
    console.error('Block contributions must compose existing primitives raw and must NEVER mutate existing primitives.')
    console.error('\nOffending modified primitive/token files:')
    for (const f of primitiveFiles) {
      console.error(`  [${f.status}] ${f.filePath}`)
    }

    console.error('\nHow to fix this:')
    console.error('1. If these edits were accidental (e.g. formatter, auto-import), revert them:')
    console.error('   git checkout origin/main -- packages/vue/components/ packages/react/components/ packages/shared/')
    console.error('2. If you genuinely intended to modify or fix a primitive:')
    console.error('   Submit the primitive change in a dedicated PR titled `feat(ui): ...` or `fix(ui): ...`')
    console.error('   so that all 1,400+ primitive regression tests run independently.')
    console.error('='.repeat(70) + '\n')
    process.exit(1)
  }

  // Scenario 2: Naming collision check for newly added block folders
  const newBlocks = changed
    .filter((c) => c.status === 'A' && c.filePath.includes('/blocks/'))
    .map((c) => {
      const match = c.filePath.match(/blocks\/([^/]+)/)
      return match ? match[1] : null
    })
    .filter(Boolean) as string[]

  const uniqueNewBlocks = Array.from(new Set(newBlocks))
  for (const blockName of uniqueNewBlocks) {
    // Check kebab-case
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(blockName)) {
      console.error(
        `❌ [PR Scope Guard] Block folder name "${blockName}" must be lowercase kebab-case (e.g. cloud-backup-schedule).`,
      )
      process.exit(1)
    }

    // Check if primitive with same name exists
    const vueCompPath = path.join(process.cwd(), 'packages/vue/components', blockName)
    const reactCompPath = path.join(process.cwd(), 'packages/react/components', blockName)
    if (fs.existsSync(vueCompPath) || fs.existsSync(reactCompPath)) {
      console.error(
        `❌ [PR Scope Guard] Block name "${blockName}" collides with an existing primitive in components/${blockName}! Blocks must have unique, descriptive names.`,
      )
      process.exit(1)
    }
  }

  if (primitiveFiles.length > 0 && blockFiles.length === 0) {
    console.log(
      `ℹ️ [Primitive PR] PR modifies ${primitiveFiles.length} primitive file(s). Automated test suites will verify compatibility.`,
    )
  } else if (blockFiles.length > 0) {
    console.log(
      `✅ [Block PR] Scope is clean! PR touches ${blockFiles.length} block file(s) with zero regressions to existing primitives.`,
    )
  } else {
    console.log(`✅ Scope check passed for ${changed.length} file(s).`)
  }
}

runScopeCheck()
