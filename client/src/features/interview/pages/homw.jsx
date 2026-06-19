import React from 'react'

const homw = () => {
  return (
    <main className='home'>
<div className='left'><textarea name="JobDiscription" placeholder='Enter Job description here ...' id="jobDescription"></textarea></div>
    <div className="right">
        <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>
            <input type="file" name='resume' id="resume " accept='.pdf'/>
        </div>
        <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea name="selfDescription" id="selfDescription" placeholder='Describe yourself in few sentence...'></textarea>
            <button className='generate-btn'>Generate Interview Report</button>
        </div>
    </div>
    </main>
  )
}

export default homw
