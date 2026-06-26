import React, { useState } from 'react'
import '../style/home.scss'
import { generateInterviewReport } from '../services/interview.api'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleGenerateReport = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const jobDescription = document.getElementById('jobDescription').value
      const selfDescription = document.getElementById('selfDescription').value
      const resumeFile = selectedFile || document.getElementById('resume').files[0]

      if (!jobDescription.trim()) {
        throw new Error('Please enter a job description')
      }
      if (!resumeFile) {
        throw new Error('Please upload a resume')
      }
      if (!selfDescription.trim()) {
        throw new Error('Please enter your self description')
      }

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobdescription', jobDescription)
      formData.append('selfdescription', selfDescription)

      const response = await generateInterviewReport(formData)
      console.log('Interview report generated:', response)
      
      if (response && response.interviewreport && response.interviewreport._id) {
        navigate(`/interview/${response.interviewreport._id}`)
      } else {
        alert('Interview report generated successfully!')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='home'>
        <div className="header">
            <h1>Preparation Engine</h1>
            <p>Input the target role and your professional context. Our AI will synthesize a comprehensive interview strategy, technical gap analysis, and behavioral talking points.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="interview-group">
            <div className='left'>
                <div className="section-header">
                    <span className="icon">📋</span>
                    <h2>Target Role Description</h2>
                </div>
                <p className="section-desc">Paste the full job description. We'll analyze it for core competencies, unstated requirements, and potential interview focus areas.</p>
                <textarea name="JobDescription" placeholder='E.g. We are looking for a Senior Product Manager to lead our core platform team...' id="jobDescription"></textarea>
            </div>

            <div className="right">
                <div className="right-section">
                    <div className="section-header">
                        <span className="icon">📄</span>
                        <h2>Resume Profile</h2>
                    </div>
                    <p className="section-desc">Upload your current resume to contextualize your experience against the role requirements.</p>
                    <div className="upload-area">
                        {selectedFile ? (
                            <>
                                <div className="upload-icon" style={{ color: '#10b981' }}>✓</div>
                                <p style={{ fontWeight: 'bold' }}>{selectedFile.name}</p>
                                <small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
                                <label htmlFor="resume" className="file-label">Change File</label>
                            </>
                        ) : (
                            <>
                                <div className="upload-icon">☁️</div>
                                <p>Drag & Drop Resume</p>
                                <small>PDF, DOC, DOCX up to 5MB</small>
                                <label htmlFor="resume" className="file-label">Or Choose File</label>
                            </>
                        )}
                        <input hidden type="file" name='resume' id="resume" accept='.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' onChange={handleFileChange}/>
                    </div>
                </div>

                <div className="right-section">
                    <div className="section-header">
                        <span className="icon">🎯</span>
                        <h2>Context & Goals</h2>
                    </div>
                    <p className="section-desc">Any specific concerns? (e.g. transitioning industries, gap in employment, salary negotiation).</p>
                    <textarea name="selfDescription" id="selfDescription" placeholder='I am transitioning from B2B to B2C and need to highlight relevant transferable skills...'></textarea>
                </div>
            </div>
        </div>

        <div className="button-container">
            <button className='button' onClick={handleGenerateReport} disabled={loading}>
              {loading ? '⏳ Generating...' : '⚡ Generate Interview Report'}
            </button>
        </div>
    </main>
  )
}

export default Home
