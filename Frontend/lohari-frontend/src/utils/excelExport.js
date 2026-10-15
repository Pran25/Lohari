import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// ============================================
// COLORS
// ============================================
const COLORS = {
  PRIMARY: '0F172A',
  SECONDARY: '22D3EE',
  ACCENT: '6366F1',
  LIGHT_BG: 'F1F5F9',
  WHITE: 'FFFFFF',
  BORDER: 'CBD5E1',
  SUCCESS: '10B981',
  WARNING: 'F59E0B',
  DANGER: 'F43F5E',
  ZEBRA: 'F8FAFC',
}

// ============================================
// MAIN EXPORT (Orders etc.)
// ============================================
export const exportToExcel = async (data, filename, columns, options = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const {
    title = 'Report',
    subtitle = '',
    summaryFields = [],
    filters = {},
    sheetName = 'Data',
  } = options

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Lohari Fabrication'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet(sheetName, {
    properties: { defaultRowHeight: 22 },
  })

  const totalCols = columns.length

  // ROW 1: TITLE
  const titleRow = sheet.addRow([title])
  titleRow.height = 40
  sheet.mergeCells(`A${titleRow.number}:${getColLetter(totalCols)}${titleRow.number}`)

  const titleCell = titleRow.getCell(1)
  titleCell.font = {
    name: 'Calibri',
    size: 22,
    bold: true,
    color: { argb: COLORS.WHITE },
  }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.PRIMARY },
  }
  titleCell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  }

  // ROW 2: SUBTITLE
  const subRow = sheet.addRow([subtitle || 'Custom Metal Fabrication & Design'])
  subRow.height = 24
  sheet.mergeCells(`A${subRow.number}:${getColLetter(totalCols)}${subRow.number}`)

  const subCell = subRow.getCell(1)
  subCell.font = { size: 12, italic: true, color: { argb: '64748B' } }
  subCell.alignment = { vertical: 'middle', horizontal: 'center' }

  // ROW 3: DATE + RECORDS
  const now = new Date()
  const dateStr = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const metaRow = sheet.addRow([
    `Generated: ${dateStr}  |  Total Records: ${data.length}`,
  ])
  metaRow.height = 22
  sheet.mergeCells(`A${metaRow.number}:${getColLetter(totalCols)}${metaRow.number}`)

  const metaCell = metaRow.getCell(1)
  metaCell.font = { size: 11, color: { argb: '64748B' } }
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' }

  sheet.addRow([])

  // FILTERS
  const activeFilters = Object.entries(filters).filter(
    ([, v]) => v && v !== 'ALL' && v !== ''
  )

  if (activeFilters.length > 0) {
    const filterStr = activeFilters.map(([k, v]) => `${k}: ${v}`).join('   |   ')
    const filterRow = sheet.addRow([`Applied Filters  |  ${filterStr}`])
    filterRow.height = 22
    sheet.mergeCells(`A${filterRow.number}:${getColLetter(totalCols)}${filterRow.number}`)

    const fCell = filterRow.getCell(1)
    fCell.font = { bold: true, size: 10, color: { argb: COLORS.ACCENT } }
    fCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EEF2FF' },
    }
    fCell.alignment = { vertical: 'middle', horizontal: 'center' }
    fCell.border = allBorders()

    sheet.addRow([])
  }

  // SUMMARY
  if (summaryFields.length > 0) {
    const summTitleRow = sheet.addRow(['SUMMARY'])
    summTitleRow.height = 28
    sheet.mergeCells(`A${summTitleRow.number}:${getColLetter(totalCols)}${summTitleRow.number}`)

    const stc = summTitleRow.getCell(1)
    stc.font = { size: 14, bold: true, color: { argb: COLORS.WHITE } }
    stc.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.ACCENT },
    }
    stc.alignment = { vertical: 'middle', horizontal: 'center' }

    for (let i = 0; i < summaryFields.length; i += 2) {
      const field1 = summaryFields[i]
      const field2 = summaryFields[i + 1]

      const val1 = field1.calculate
        ? field1.calculate(data)
        : sumField(data, field1.key)
      const val2 = field2
        ? field2.calculate
          ? field2.calculate(data)
          : sumField(data, field2.key)
        : ''

      const row = sheet.addRow([
        field1.label,
        field1.format ? field1.format(val1) : String(val1),
        field2 ? field2.label : '',
        field2 ? (field2.format ? field2.format(val2) : String(val2)) : '',
      ])
      row.height = 24

      for (let c = 1; c <= 4; c++) {
        const cell = row.getCell(c)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLORS.LIGHT_BG },
        }
        cell.border = allBorders()
        cell.alignment = { vertical: 'middle', horizontal: 'center' }

        if (c === 1 || c === 3) {
          cell.font = { bold: true, size: 11, color: { argb: '475569' } }
        } else {
          cell.font = { bold: true, size: 12, color: { argb: COLORS.PRIMARY } }
        }
      }

      for (let c = 5; c <= totalCols; c++) {
        const cell = row.getCell(c)
        cell.border = allBorders()
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLORS.LIGHT_BG },
        }
      }
    }
    sheet.addRow([])
  }

  // DATA TITLE
  const dataTitleRow = sheet.addRow(['DETAILED DATA'])
  dataTitleRow.height = 26
  sheet.mergeCells(`A${dataTitleRow.number}:${getColLetter(totalCols)}${dataTitleRow.number}`)

  const dtc = dataTitleRow.getCell(1)
  dtc.font = { size: 13, bold: true, color: { argb: COLORS.PRIMARY } }
  dtc.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLORS.SECONDARY },
  }
  dtc.alignment = { vertical: 'middle', horizontal: 'center' }

  // HEADER ROW
  const headerRow = sheet.addRow(columns.map((c) => c.label))
  headerRow.height = 30

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.font = { bold: true, size: 11, color: { argb: COLORS.WHITE } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.PRIMARY },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = allBorders()
  })

  // DATA ROWS
  data.forEach((item, rowIdx) => {
    const values = columns.map((col) => {
      let v = col.key.includes('.')
        ? col.key.split('.').reduce((o, k) => o?.[k], item)
        : item[col.key]

      if (col.format) {
        v = col.format(v, item, rowIdx)
      } else {
        if (v === null || v === undefined) v = ''
        else if (typeof v === 'object') v = JSON.stringify(v)
        else v = String(v)
      }
      return v
    })

    const row = sheet.addRow(values)
    row.height = 24

    columns.forEach((col, idx) => {
      const cell = row.getCell(idx + 1)
      cell.font = { size: 11, color: { argb: COLORS.PRIMARY } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()

      if (rowIdx % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLORS.ZEBRA },
        }
      }
    })
  })

  // FOOTER
  sheet.addRow([])

  const footRow = sheet.addRow(['--- END OF REPORT ---'])
  footRow.height = 22
  sheet.mergeCells(`A${footRow.number}:${getColLetter(totalCols)}${footRow.number}`)

  const fc = footRow.getCell(1)
  fc.font = { italic: true, size: 10, color: { argb: '94A3B8' } }
  fc.alignment = { horizontal: 'center', vertical: 'middle' }

  const contactRow = sheet.addRow([
    'Lohari Fabrication  |  lohari.orders@gmail.com  |  +91 98765 43210',
  ])
  contactRow.height = 22
  sheet.mergeCells(`A${contactRow.number}:${getColLetter(totalCols)}${contactRow.number}`)

  const cc = contactRow.getCell(1)
  cc.font = { size: 10, color: { argb: '94A3B8' } }
  cc.alignment = { horizontal: 'center', vertical: 'middle' }

  // COLUMN WIDTHS
  columns.forEach((col, idx) => {
    let maxLen = col.label.length
    data.forEach((item) => {
      let v = col.key.includes('.')
        ? col.key.split('.').reduce((o, k) => o?.[k], item)
        : item[col.key]
      if (col.format) v = col.format(v, item)
      else v = v != null ? String(v) : ''
      maxLen = Math.max(maxLen, v.length)
    })
    sheet.getColumn(idx + 1).width = Math.min(Math.max(maxLen + 6, 14), 32)
  })

  // SAVE
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, filename)
}

// ============================================
// ANALYTICS — MULTI-SHEET EXPORT
// ============================================
export const exportAnalyticsToExcel = async (analyticsData, filename) => {
  const {
    summary = {},
    monthlyRevenue = [],
    ordersByStatus = [],
    topProducts = [],
    topCustomers = [],
  } = analyticsData

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Lohari Fabrication'
  workbook.created = new Date()

  const now = new Date()
  const dateStr = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // ═══════════════════════════════════════════
  // SHEET 1: SUMMARY
  // ═══════════════════════════════════════════
  const summarySheet = workbook.addWorksheet('Summary')

  const s1Title = summarySheet.addRow(['LOHARI FABRICATION'])
  s1Title.height = 36
  summarySheet.mergeCells(`A${s1Title.number}:B${s1Title.number}`)
  const s1tc = s1Title.getCell(1)
  s1tc.font = { size: 20, bold: true, color: { argb: COLORS.WHITE } }
  s1tc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
  s1tc.alignment = { vertical: 'middle', horizontal: 'center' }

  const s1Sub = summarySheet.addRow(['Analytics Report'])
  s1Sub.height = 24
  summarySheet.mergeCells(`A${s1Sub.number}:B${s1Sub.number}`)
  const s1sc = s1Sub.getCell(1)
  s1sc.font = { size: 13, italic: true, color: { argb: '64748B' } }
  s1sc.alignment = { vertical: 'middle', horizontal: 'center' }

  const s1Meta = summarySheet.addRow([`Generated: ${dateStr}`])
  s1Meta.height = 22
  summarySheet.mergeCells(`A${s1Meta.number}:B${s1Meta.number}`)
  const s1mc = s1Meta.getCell(1)
  s1mc.font = { size: 11, color: { argb: '64748B' } }
  s1mc.alignment = { vertical: 'middle', horizontal: 'center' }

  summarySheet.addRow([])

  const s1Hdr = summarySheet.addRow(['Metric', 'Value'])
  s1Hdr.height = 28
  s1Hdr.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: COLORS.WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = allBorders()
  })

  const summaryStats = [
    ['Total Orders', summary.totalOrders || 0],
    ['Total Customers', summary.totalCustomers || 0],
    ['Total Revenue', `Rs ${formatCurrency(summary.totalRevenue)}`],
    ['Pending Payments', `Rs ${formatCurrency(summary.pendingPayments)}`],
    ['Average Order Value', `Rs ${formatCurrency(summary.avgOrderValue)}`],
    ['Completed Orders', summary.completedOrders || 0],
    ['Active Orders', summary.activeOrders || 0],
    ['Cancelled Orders', summary.cancelledOrders || 0],
  ]

  summaryStats.forEach(([label, value], idx) => {
    const row = summarySheet.addRow([label, value])
    row.height = 24
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()
      cell.font = { size: 12, color: { argb: COLORS.PRIMARY } }
      if (idx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA } }
      }
    })
    row.getCell(1).font = { bold: true, size: 12, color: { argb: '475569' } }
    row.getCell(2).font = { bold: true, size: 13, color: { argb: COLORS.ACCENT } }
  })

  summarySheet.getColumn(1).width = 30
  summarySheet.getColumn(2).width = 30

  // ═══════════════════════════════════════════
  // SHEET 2: MONTHLY REVENUE
  // ═══════════════════════════════════════════
  const revSheet = workbook.addWorksheet('Monthly Revenue')
  addSheetHeader(revSheet, 'MONTHLY REVENUE', dateStr, 3)

  const revHdr = revSheet.addRow(['Month', 'Revenue (Rs)', 'Orders'])
  revHdr.height = 28
  revHdr.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: COLORS.WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = allBorders()
  })

  monthlyRevenue.forEach((r, idx) => {
    const row = revSheet.addRow([r.month, formatCurrency(r.revenue), r.orderCount || 0])
    row.height = 24
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()
      cell.font = { size: 11, color: { argb: COLORS.PRIMARY } }
      if (idx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA } }
      }
    })
    row.getCell(2).font = { bold: true, size: 11, color: { argb: COLORS.ACCENT } }
  })

  revSheet.getColumn(1).width = 22
  revSheet.getColumn(2).width = 22
  revSheet.getColumn(3).width = 18

  // ═══════════════════════════════════════════
  // SHEET 3: ORDERS BY STATUS
  // ═══════════════════════════════════════════
  const statusSheet = workbook.addWorksheet('Orders by Status')
  addSheetHeader(statusSheet, 'ORDERS BY STATUS', dateStr, 2)

  const stHdr = statusSheet.addRow(['Status', 'Count'])
  stHdr.height = 28
  stHdr.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: COLORS.WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = allBorders()
  })

  ordersByStatus.forEach((s, idx) => {
    const statusLabel = formatStatus(s.status)
    const row = statusSheet.addRow([statusLabel, s.count || 0])
    row.height = 24
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()
      cell.font = { size: 11, color: { argb: COLORS.PRIMARY } }
      if (idx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA } }
      }
    })
    row.getCell(2).font = { bold: true, size: 12, color: { argb: COLORS.ACCENT } }
  })

  statusSheet.getColumn(1).width = 25
  statusSheet.getColumn(2).width = 18

  // ═══════════════════════════════════════════
  // SHEET 4: TOP PRODUCTS
  // ═══════════════════════════════════════════
  const prodSheet = workbook.addWorksheet('Top Products')
  addSheetHeader(prodSheet, 'TOP PRODUCTS', dateStr, 4)

  const prHdr = prodSheet.addRow(['Rank', 'Product', 'Orders', 'Revenue (Rs)'])
  prHdr.height = 28
  prHdr.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: COLORS.WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = allBorders()
  })

  topProducts.forEach((p, idx) => {
    const row = prodSheet.addRow([
      idx + 1,
      p.productName || 'N/A',
      p.orderCount || 0,
      formatCurrency(p.totalRevenue),
    ])
    row.height = 24
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()
      cell.font = { size: 11, color: { argb: COLORS.PRIMARY } }
      if (idx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA } }
      }
    })
    row.getCell(1).font = { bold: true, size: 12, color: { argb: COLORS.ACCENT } }
    row.getCell(3).font = { bold: true, size: 11 }
    row.getCell(4).font = { bold: true, size: 11, color: { argb: COLORS.SUCCESS } }
  })

  prodSheet.getColumn(1).width = 10
  prodSheet.getColumn(2).width = 32
  prodSheet.getColumn(3).width = 15
  prodSheet.getColumn(4).width = 20

  // ═══════════════════════════════════════════
  // SHEET 5: TOP CUSTOMERS
  // ═══════════════════════════════════════════
  const custSheet = workbook.addWorksheet('Top Customers')
  addSheetHeader(custSheet, 'TOP CUSTOMERS', dateStr, 4)

  const cuHdr = custSheet.addRow(['Rank', 'Customer', 'Orders', 'Total Spent (Rs)'])
  cuHdr.height = 28
  cuHdr.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: COLORS.WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = allBorders()
  })

  topCustomers.forEach((c, idx) => {
    const row = custSheet.addRow([
      idx + 1,
      c.customerName || 'N/A',
      c.orderCount || 0,
      formatCurrency(c.totalSpent),
    ])
    row.height = 24
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = allBorders()
      cell.font = { size: 11, color: { argb: COLORS.PRIMARY } }
      if (idx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA } }
      }
    })
    row.getCell(1).font = { bold: true, size: 12, color: { argb: COLORS.ACCENT } }
    row.getCell(3).font = { bold: true, size: 11 }
    row.getCell(4).font = { bold: true, size: 11, color: { argb: COLORS.SUCCESS } }
  })

  custSheet.getColumn(1).width = 10
  custSheet.getColumn(2).width = 32
  custSheet.getColumn(3).width = 15
  custSheet.getColumn(4).width = 22

  // SAVE
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, filename)
}

// ============================================
// HELPER: Sheet Header
// ============================================
const addSheetHeader = (sheet, title, dateStr, totalCols) => {
  const titleRow = sheet.addRow([title])
  titleRow.height = 30
  sheet.mergeCells(`A${titleRow.number}:${getColLetter(totalCols)}${titleRow.number}`)
  const tc = titleRow.getCell(1)
  tc.font = { size: 16, bold: true, color: { argb: COLORS.WHITE } }
  tc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.PRIMARY } }
  tc.alignment = { vertical: 'middle', horizontal: 'center' }

  const subRow = sheet.addRow([`Generated: ${dateStr}`])
  subRow.height = 20
  sheet.mergeCells(`A${subRow.number}:${getColLetter(totalCols)}${subRow.number}`)
  const sc = subRow.getCell(1)
  sc.font = { size: 10, italic: true, color: { argb: '64748B' } }
  sc.alignment = { vertical: 'middle', horizontal: 'center' }

  sheet.addRow([])
}

// ============================================
// HELPERS
// ============================================
const getColLetter = (num) => {
  let letter = ''
  while (num > 0) {
    const mod = (num - 1) % 26
    letter = String.fromCharCode(65 + mod) + letter
    num = Math.floor((num - mod) / 26)
  }
  return letter
}

const allBorders = () => ({
  top: { style: 'thin', color: { argb: COLORS.BORDER } },
  left: { style: 'thin', color: { argb: COLORS.BORDER } },
  bottom: { style: 'thin', color: { argb: COLORS.BORDER } },
  right: { style: 'thin', color: { argb: COLORS.BORDER } },
})

const sumField = (data, key) => {
  return data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
}

// ============================================
// FORMATTERS
// ============================================
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export const formatCurrency = (v) => {
  if (v === null || v === undefined || v === '') return '0.00'
  return Number(v).toFixed(2)
}

export const formatStatus = (s) => {
  if (!s) return ''
  return s
    .replace(/_/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export const generateFilename = (prefix = 'Report') => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 5).replace(':', '-')
  return `Lohari-${prefix}-${date}-${time}.xlsx`
}