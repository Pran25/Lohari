import { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'

function InvoiceButton({ orderId, orderNumber }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setDownloading(true)
      console.log(`📄 Downloading invoice for order ${orderId}`)

      const token = localStorage.getItem('accessToken')
      
      const response = await fetch(
        `http://localhost:8081/api/invoices/${orderId}/download`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download invoice')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderNumber || orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Invoice downloaded!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download invoice')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="btn-secondary flex items-center gap-2 w-full text-center justify-center"
    >
      <FiDownload />
      {downloading ? 'Downloading...' : 'Download Invoice'}
    </button>
  )
}

export default InvoiceButton