/**
 * CSV Export Utility — Professional Reports
 */

// ============================================
// MAIN EXPORT FUNCTION
// ============================================
export const exportToCSV = (data, filename, columns, options = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const {
    title = '',
    subtitle = '',
    includeSummary = true,
    summaryFields = [],
    filters = {},
  } = options

  const lines = []

  // ============================================
  // COMPANY HEADER
  // ============================================
  if (title) {
    lines.push(`"${title}"`)
    lines.push('') // blank row
  }

  // ============================================
  // SUBTITLE / FILTER INFO
  // ============================================
  const now = new Date()
  const exportDate = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  lines.push(`"Generated on","${exportDate}"`)
  lines.push(`"Total Records","${data.length}"`)
  lines.push('')

  // ============================================
  // FILTER INFO (agar filters lage hain)
  // ============================================
  const activeFilters = Object.entries(filters).filter(
    ([, v]) => v && v !== 'ALL' && v !== ''
  )

  if (activeFilters.length > 0) {
    lines.push('"Applied Filters"')
    activeFilters.forEach(([key, value]) => {
      lines.push(`"${key}","${value}"`)
    })
    lines.push('')
  }

  // ============================================
  // SUMMARY SECTION
  // ============================================
  if (includeSummary && summaryFields.length > 0) {
    lines.push('"SUMMARY"')

    summaryFields.forEach((field) => {
      let value = 0

      if (typeof field.calculate === 'function') {
        value = field.calculate(data)
      } else if (field.key) {
        value = data.reduce((sum, item) => {
          const val = Number(item[field.key]) || 0
          return sum + val
        }, 0)
      }

      const formatted = field.format
        ? field.format(value)
        : formatNumber(value)

      lines.push(`"${field.label}","${formatted}"`)
    })

    lines.push('')
  }

  // ============================================
  // DATA HEADER
  // ============================================
  lines.push('"DETAILED DATA"')

  const headers = columns.map((col) => `"${col.label}"`).join(',')
  lines.push(headers)

  // ============================================
  // DATA ROWS
  // ============================================
  data.forEach((item, index) => {
    const row = columns
      .map((col) => {
        let value = ''

        // Support nested keys
        if (col.key.includes('.')) {
          value = col.key.split('.').reduce((obj, k) => obj?.[k], item)
        } else {
          value = item[col.key]
        }

        // Apply formatter
        if (col.format) {
          value = col.format(value, item, index)
        } else {
          // Default handling
          if (value === null || value === undefined) value = ''
          else if (typeof value === 'object') value = JSON.stringify(value)
          else value = String(value)
        }

        // Escape quotes
        value = String(value).replace(/"/g, '""')

        return `"${value}"`
      })
      .join(',')

    lines.push(row)
  })

  // ============================================
  // FOOTER
  // ============================================
  lines.push('')
  lines.push('"--- END OF REPORT ---"')
  lines.push('"Lohari Fabrication — Custom Metal Fabrication"')
  lines.push('"Contact: lohari.orders@gmail.com | +91 98765 43210"')

  // ============================================
  // BUILD CSV
  // ============================================
  const csv = lines.join('\n')

  // BOM for Excel UTF-8 (₹ symbol)
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })

  // ============================================
  // DOWNLOAD
  // ============================================
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================
// FORMAT HELPERS
// ============================================
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toFixed(2)
}

export const formatCurrency = (num) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toFixed(2)
}

export const formatStatus = (status) => {
  if (!status) return ''
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// ============================================
// GENERATE FILENAME
// ============================================
export const generateFilename = (prefix = 'Report') => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 5).replace(':', '-')
  return `Lohari-${prefix}-${date}-${time}.csv`
}