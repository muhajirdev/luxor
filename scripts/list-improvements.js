#!/usr/bin/env node

/**
 * CLI tool to list future improvements ranked by priority and status
 * Usage: node scripts/list-improvements.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }
const STATUS_ORDER = { 'Not Started': 0, Planned: 1, 'In Progress': 2, Completed: 3 }

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  let title = ''
  let priority = ''
  let status = ''

  for (const line of lines) {
    // Extract title from first h1
    if (!title && line.startsWith('# ')) {
      title = line.replace('# ', '').trim()
    }

    // Extract priority
    if (line.includes('**Priority:**')) {
      const match = line.match(/\*\*Priority:\*\*\s*(High|Medium|Low)/i)
      if (match) priority = match[1]
    }

    // Extract status
    if (line.includes('**Status:**')) {
      const match = line.match(/\*\*Status:\*\*\s*(.+?)$/i)
      if (match) {
        status = match[1].trim()
        // Normalize common statuses
        if (status.toLowerCase().includes('not started')) status = 'Not Started'
        else if (status.toLowerCase().includes('planned')) status = 'Planned'
        else if (status.toLowerCase().includes('in progress')) status = 'In Progress'
        else if (status.toLowerCase().includes('completed')) status = 'Completed'
      }
    }

    // Stop parsing after we have all fields
    if (title && priority && status) break
  }

  return { title, priority, status, filePath }
}

function scanDirectory(dirPath) {
  const results = []
  const items = fs.readdirSync(dirPath)

  for (const item of items) {
    const fullPath = path.join(dirPath, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...scanDirectory(fullPath))
    } else if (item.endsWith('.md') && item !== 'README.md') {
      results.push(parseMarkdownFile(fullPath))
    }
  }

  return results
}

function formatTable(items) {
  // Sort by priority first, then by status
  items.sort((a, b) => {
    const priorityDiff = (PRIORITY_ORDER[a.priority] || 999) - (PRIORITY_ORDER[b.priority] || 999)
    if (priorityDiff !== 0) return priorityDiff
    return (STATUS_ORDER[a.status] || 999) - (STATUS_ORDER[b.status] || 999)
  })

  // Calculate column widths
  const titleWidth = Math.max(30, ...items.map(i => i.title.length))
  const priorityWidth = Math.max(10, ...items.map(i => i.priority.length))
  const statusWidth = Math.max(15, ...items.map(i => Math.min(i.status.length, 20)))

  // Build table
  const separator = `├${'─'.repeat(titleWidth + 2)}┼${'─'.repeat(priorityWidth + 2)}┼${'─'.repeat(statusWidth + 2)}┤`
  const topBorder = `┌${'─'.repeat(titleWidth + 2)}┬${'─'.repeat(priorityWidth + 2)}┬${'─'.repeat(statusWidth + 2)}┐`
  const bottomBorder = `└${'─'.repeat(titleWidth + 2)}┴${'─'.repeat(priorityWidth + 2)}┴${'─'.repeat(statusWidth + 2)}┘`

  const header = `│ ${'Feature'.padEnd(titleWidth)} │ ${'Priority'.padEnd(priorityWidth)} │ ${'Status'.padEnd(statusWidth)} │`

  const rows = items.map(item => {
    const priorityColor = item.priority === 'High' ? '\x1b[31m' : // Red
                         item.priority === 'Medium' ? '\x1b[33m' : // Yellow
                         '\x1b[32m' // Green
    const resetColor = '\x1b[0m'
    const truncatedStatus = item.status.length > 20 ? item.status.substring(0, 17) + '...' : item.status

    return `│ ${item.title.padEnd(titleWidth)} │ ${priorityColor}${item.priority.padEnd(priorityWidth)}${resetColor} │ ${truncatedStatus.padEnd(statusWidth)} │`
  })

  return [topBorder, header, separator, ...rows, bottomBorder].join('\n')
}

function main() {
  const improvementsDir = path.join(__dirname, '..', 'docs', 'future-improvements')

  if (!fs.existsSync(improvementsDir)) {
    console.error('Error: docs/future-improvements/ directory not found')
    process.exit(1)
  }

  console.log('\n📋 Future Improvements\n')

  const items = scanDirectory(improvementsDir)

  if (items.length === 0) {
    console.log('No improvements found.')
    return
  }

  // Filter out incomplete items
  const validItems = items.filter(item => item.title && item.priority)

  if (validItems.length === 0) {
    console.log('No valid improvements found with priority/status.')
    return
  }

  console.log(formatTable(validItems))
  console.log(`\nTotal: ${validItems.length} improvements\n`)

  // Summary by priority
  const byPriority = { High: 0, Medium: 0, Low: 0 }
  validItems.forEach(item => {
    if (byPriority[item.priority] !== undefined) {
      byPriority[item.priority]++
    }
  })

  console.log('Summary by Priority:')
  console.log(`  🔴 High: ${byPriority.High}`)
  console.log(`  🟡 Medium: ${byPriority.Medium}`)
  console.log(`  🟢 Low: ${byPriority.Low}`)
  console.log()
}

main()
