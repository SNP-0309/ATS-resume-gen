import { useContext, useState, useCallback } from 'react'
import axios from 'axios'
import { InterviewContext } from '../interview.context.jsx'

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/interview`

// Helper: returns axios config with Bearer token attached
const authConfig = (extra = {}) => {
  const token = localStorage.getItem('token')
  return {
    ...extra,
    headers: {
      ...(extra.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  }
}

export const useInterview = () => {
  const { report, setReport, loading, setLoading, reports, setReports } = useContext(InterviewContext)
  const [error, setError] = useState('')

  const getReportById = useCallback(async (interviewId) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${BASE_URL}/${interviewId}`, authConfig())
      setReport(response.data.data || response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch interview report'
      setError(errorMsg)
      console.error('Error fetching report:', err)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setReport])

  const getAllReports = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(`${BASE_URL}/`, authConfig())
      setReports(response.data.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch interview reports'
      setError(errorMsg)
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setReports])

  const getResumePdf = useCallback(async (interviewId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${interviewId}/resume`,
        authConfig({ responseType: 'blob' })
      )

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
    reports,
    getReportById,
    getAllReports,
    getResumePdf,
  }
}
