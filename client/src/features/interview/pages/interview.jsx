import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    { id: 'resume', label: 'Optimized Resume', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention || item.intension}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const MOCK_REPORT = {
    matchScore: 85,
    technicalQuestions: [
        {
            question: "Explain the virtual DOM and how React updates the UI.",
            intention: "To assess understanding of React's core rendering mechanics and performance optimization strategy.",
            answer: "React creates a lightweight in-memory representation of the real DOM called the Virtual DOM. When state changes, a new virtual DOM tree is created. React then compares (diffs) this new tree with the previous one. Finally, it computes the minimal set of changes (reconciliation) and updates only those specific parts in the real DOM, minimizing expensive layout repaints."
        },
        {
            question: "What is the difference between Redux Thunk and Redux Saga?",
            intention: "To test knowledge of advanced state management and asynchronous side-effects handling.",
            answer: "Redux Thunk is a middleware that allows you to write action creators that return a function instead of an action, simple to use for basic async logic. Redux Saga uses ES6 Generators to write asynchronous code that looks synchronous, making complex async flows (like cancellation or race conditions) easier to read, test, and manage."
        },
        {
            question: "What are React Server Components (RSC) and how do they differ from SSR?",
            intention: "To evaluate knowledge of modern React capabilities and performance rendering paradigms.",
            answer: "React Server Components run exclusively on the server and have zero impact on the bundle size. Their dependencies are not included in the client bundle. SSR (Server-Side Rendering) is a method to pre-render HTML on the server for hydration on the client. RSCs can be combined with SSR to generate static/dynamic server-rendered HTML while shipping minimal JS."
        }
    ],
    behavioralQuestions: [
        {
            question: "Describe a time when you had to resolve a conflict within a development team.",
            intention: "To evaluate leadership, communication, collaboration, and conflict resolution skills.",
            answer: "In a previous project, we had a disagreement between frontend and backend developers regarding API design. I organized a brief meeting where both sides presented their constraints. We focused on the user experience and decided to use a middle-tier BFF (Backend-for-Frontend) pattern, satisfying the backend's clean architecture and frontend's data requirements."
        },
        {
            question: "Tell me about a time you had to learn a new technology quickly to solve a critical problem.",
            intention: "To assess adaptability, learning agility, and problem-solving initiative under pressure.",
            answer: "When our real-time notification engine started dropping events, we decided to pivot to RabbitMQ. I had 3 days to learn its routing exchanges, queue bindings, and acknowledgment patterns. I read the documentation, built a small prototype, and successfully migrated the message broker, resolving the throughput bottleneck."
        }
    ],
    preparationPlan: [
        {
            day: 1,
            focus: "React Fundamentals & Advanced Hooks",
            tasks: [
                "Review custom hooks lifecycle and closures",
                "Practice optimization with useMemo, useCallback, and React.memo",
                "Build a small demo using Context API with React Reducer pattern"
            ]
        },
        {
            day: 2,
            focus: "System Design & State Management",
            tasks: [
                "Study state management options (Redux Toolkit, Zustand, Recoil)",
                "Understand server-side rendering (SSR) vs static site generation (SSG) in Next.js",
                "Design a scalable API schema for a real-time messaging application"
            ]
        },
        {
            day: 3,
            focus: "Mock Interviews & Soft Skills",
            tasks: [
                "Practice explaining architectural decisions out loud",
                "Conduct mock interviews focusing on STAR method for behavioral questions",
                "Review resume bullet points and match with target job descriptions"
            ]
        }
    ],
    skillGaps: [
        { skill: "System Design", severity: "high" },
        { skill: "GraphQL", severity: "mid" },
        { skill: "TypeScript", severity: "low" }
    ],
    optimizedResume: `# RAHUL SHARMA\n\nrahul.sharma@example.com | +91 98765 43210\nlinkedin.com/in/rahulsharma | github.com/rahulsharma | rahulsharma.dev\nHyderabad, Telangana, India\n\n---\n\n## PROFESSIONAL SUMMARY\n\nResults-driven Full Stack Developer with hands-on experience in engineering scalable web applications using the MERN Stack. Proven track record in designing robust RESTful APIs, optimizing front-end performance, and integrating GenAI models. Skilled in database design, authentication workflows, and agile collaboration, passionate about building intuitive user-centric applications.\n\n---\n\n## TECHNICAL SKILLS\n\n### Programming Languages\n\nJavaScript (ES6+), Python, Java\n\n### Frontend\n\nReact.js, HTML5, CSS3, Tailwind CSS, Bootstrap, Redux Toolkit\n\n### Backend\n\nNode.js, Express.js, REST APIs\n\n### Databases\n\nMongoDB, MySQL, PostgreSQL\n\n### Tools & Technologies\n\nGit, GitHub, VS Code, Postman, JWT (JSON Web Tokens), Docker, AWS (S3, EC2)\n\n---\n\n## EXPERIENCE\n\n### Web Development Intern\n\n**TechSolutions Corp** | May 2025 – Present\n\n* Engineered and maintained responsive web applications, improving mobile responsiveness and cross-browser compatibility by 25%.\n* Collaborated with cross-functional teams of design and product members to implement interactive dashboard features using React.js.\n* Optimized database query performance in MongoDB, reducing page load times by 15% and enhancing user experience.\n* Participated in agile ceremonies, daily standups, code reviews, and debugging sessions to maintain clean and documented codebases.\n\n---\n\n## PROJECTS\n\n### Resume Analyzer & Generator\n\n**Tech Stack:** React.js, Node.js, Express.js, MongoDB, Gemini API, Tailwind CSS\n\n* Developed an AI-powered platform that extracts PDF resume text, evaluates ATS compatibility scores, and suggests keyword optimizations.\n* Implemented custom multi-template exports allowing recruiters and candidates to generate styled PDF resumes in real-time.\n* Integrated Google Gemini API to analyze candidate profiles against target job descriptions and output missing core competencies.\n\n### EcoLife AI\n\n**Tech Stack:** React.js, Node.js, Express.js, MongoDB, Tailwind CSS\n\n* Created a responsive sustainability application with AI-driven carbon footprint recommendations and lifestyle habit tracking.\n* Designed secure user authentication workflows using JWT and cookies, protecting sensitive candidate profiles.\n* Developed backend API endpoints to log and query user sustainability metrics, ensuring rapid data retrieval.\n\n---\n\n## EDUCATION\n\n### Bachelor of Technology (Computer Science and Engineering)\n\nNational Institute of Technology\n\n2023 – 2027\n\nCGPA: 8.5/10\n\n---\n\n## CERTIFICATIONS\n\n* Full Stack Web Development (Udemy)\n* Data Structures & Algorithms (Coursera)\n* Advanced JavaScript Certification (HackerRank)\n\n---\n\n## ACHIEVEMENTS\n\n* Built and deployed 10+ full-stack web applications to cloud hosting platforms.\n* Solved 500+ algorithmic problems on LeetCode and GeeksforGeeks.\n* Active open-source contributor, fixing bugs in popular React library ecosystems.\n\n---\n\n## POSITIONS OF RESPONSIBILITY\n\n### Technical Team Member\n\nComputer Science Society\n\n* Organized university-wide technical hackathons and code jams for over 300+ students.\n* Assisted in mentoring 50+ junior members in Web Development foundations and Git workflow.\n\n---\n\n## LANGUAGES\n\n* English (Professional Working)\n* Hindi (Native)\n* Telugu (Conversational)`
}

// ── Resume Preview Component ──────────────────────────────────────────────────
const ResumePreview = ({ markdownText }) => {
    const [copied, setCopied] = useState(false);

    if (!markdownText) {
        return (
            <div className="resume-preview-empty" style={{ textAlign: 'center', padding: '40px', color: '#8a8897' }}>
                <p>No optimized resume content available. Generate a plan first.</p>
            </div>
        );
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = markdownText.split('\n');
    
    return (
        <div className="resume-preview-wrapper">
            <div className="resume-preview-actions">
                <button className="secondary-button" onClick={copyToClipboard}>
                    {copied ? '✓ Copied!' : '📋 Copy Markdown'}
                </button>
            </div>
            
            <div className="resume-sheet">
                {lines.map((line, index) => {
                    const trimmed = line.trim();
                    if (trimmed === '---') {
                        return <hr key={index} className="resume-divider" />;
                    }
                    if (line.startsWith('# ')) {
                        return <h1 key={index} className="resume-name">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={index} className="resume-section-heading">{line.replace('## ', '').toUpperCase()}</h2>;
                    }
                    if (line.startsWith('### ')) {
                        return <h3 key={index} className="resume-subheading">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                        const cleaned = line.substring(2)
                            .replace(/\*\*([^*]+)\*\*/g, '$1')
                            .replace(/\*([^*]+)\*/g, '$1');
                        return (
                            <div key={index} className="resume-list-item">
                                <span className="resume-bullet">•</span>
                                <p className="resume-body">{cleaned}</p>
                            </div>
                        );
                    }
                    if (trimmed === '') {
                        return <div key={index} className="resume-space" />;
                    }
                    
                    const cleanedLine = line
                        .replace(/\*\*([^*]+)\*\*/g, '$1')
                        .replace(/\*([^*]+)\*/g, '$1')
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                    
                    const isContact = cleanedLine.includes('|') || cleanedLine.includes('@example.com') || cleanedLine.includes('📧') || cleanedLine.includes('📱') || cleanedLine.includes('🔗');
                    return (
                        <p 
                            key={index} 
                            className={`resume-body ${isContact ? 'resume-contact-info' : ''}`}
                        >
                            {cleanedLine}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, setReport, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId === 'xyz' || interviewId === 'demo') {
            setReport(MOCK_REPORT)
        } else if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId, getReportById, setReport ])

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
                <div style={{ marginTop: '24px' }}>
                    <button 
                        className="button primary-button"
                        onClick={() => setReport(MOCK_REPORT)}
                    >
                        Load Demo Plan
                    </button>
                </div>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'


    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'resume' && (
                        <section>
                            <div className='content-header'>
                                <h2>Optimized Resume Preview</h2>
                                <span className='content-header__count'>Calibri / Arial Sans</span>
                            </div>
                            <ResumePreview markdownText={report.optimizedResume || report.resume} />
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Job Title */}
                    {report.title && (
                        <div className='sidebar-title'>
                            <p className='sidebar-title__label'>Role</p>
                            <p className='sidebar-title__value'>{report.title}</p>
                        </div>
                    )}

                    {report.title && <div className='sidebar-divider' />}

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>
                            {report.matchScore >= 80 ? 'Strong match for this role' :
                             report.matchScore >= 60 ? 'Good match with some gaps' :
                             'Room for improvement'}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps && report.skillGaps.map((gap, i) => gap && (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity || 'low'}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview

