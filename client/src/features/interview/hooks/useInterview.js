import { useContext, useState, useCallback } from 'react'
import axios from 'axios'
import { InterviewContext } from '../interview.context.jsx'

const API_URL = 'http://localhost:3000/api/interview'

export const useInterview = () => {
  const { report, setReport, loading, setLoading, reports, setReports } = useContext(InterviewContext)
  const [error, setError] = useState('')

  const getReportById = useCallback(async (interviewId) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${API_URL}/${interviewId}`, {
        withCredentials: true,
      })
      setReport(response.data.data || response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch interview report'
      setError(errorMsg)
      console.error('Error fetching report:', err)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setReport])

  const getResumePdf = useCallback(async (interviewId) => {
    try {
      const response = await axios.get(`${API_URL}/${interviewId}/resume`, {
        withCredentials: true,
        responseType: 'blob',
      })

      // Explicitly construct the Blob with 'application/pdf' MIME type
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `resume-${interviewId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading resume:', err)
      setError('Failed to download resume')
    }
  }, [])

  return {
    report,
    setReport,
    loading,
    error,
    getReportById,
    getResumePdf,
  }
}
