import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({ margin: 50 });
const stream = fs.createWriteStream('test-resume.pdf');
doc.pipe(stream);

const resumeText = `RAHUL SHARMA

rahul.sharma@example.com | +91 98765 43210
linkedin.com/in/rahulsharma | github.com/rahulsharma | rahulsharma.dev
Hyderabad, Telangana, India

PROFESSIONAL SUMMARY

Results-driven Full Stack Developer with hands-on experience in engineering scalable web applications using the MERN Stack. Proven track record in designing robust RESTful APIs, optimizing front-end performance, and integrating GenAI models. Skilled in database design, authentication workflows, and agile collaboration, passionate about building intuitive user-centric applications.

TECHNICAL SKILLS

Programming Languages: JavaScript (ES6+), Python, Java
Frontend: React.js, HTML5, CSS3, Tailwind CSS, Bootstrap, Redux Toolkit
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, MySQL, PostgreSQL
Tools & Technologies: Git, GitHub, VS Code, Postman, JWT, Docker, AWS (S3, EC2)

EXPERIENCE

Web Development Intern
TechSolutions Corp | May 2025 - Present
- Engineered and maintained responsive web applications, improving mobile responsiveness and cross-browser compatibility by 25%.
- Collaborated with cross-functional teams of design and product members to implement interactive dashboard features using React.js.
- Optimized database query performance in MongoDB, reducing page load times by 15% and enhancing user experience.
- Participated in agile ceremonies, daily standups, code reviews, and debugging sessions to maintain clean and documented codebases.

PROJECTS

Resume Analyzer & Generator
Tech Stack: React.js, Node.js, Express.js, MongoDB, Gemini API, Tailwind CSS
- Developed an AI-powered platform that extracts PDF resume text, evaluates ATS compatibility scores, and suggests keyword optimizations.
- Implemented custom multi-template exports allowing recruiters and candidates to generate styled PDF resumes in real-time.
- Integrated Google Gemini API to analyze candidate profiles against target job descriptions and output missing core competencies.

EcoLife AI
Tech Stack: React.js, Node.js, Express.js, MongoDB, Tailwind CSS
- Created a responsive sustainability application with AI-driven carbon footprint recommendations and lifestyle habit tracking.
- Designed secure user authentication workflows using JWT and cookies, protecting sensitive candidate profiles.
- Developed backend API endpoints to log and query user sustainability metrics, ensuring rapid data retrieval.

EDUCATION

Bachelor of Technology (Computer Science and Engineering)
National Institute of Technology | 2023 - 2027 | CGPA: 8.5/10

CERTIFICATIONS
- Full Stack Web Development (Udemy)
- Data Structures & Algorithms (Coursera)
- Advanced JavaScript Certification (HackerRank)

ACHIEVEMENTS
- Built and deployed 10+ full-stack web applications to cloud hosting platforms.
- Solved 500+ algorithmic problems on LeetCode and GeeksforGeeks.
- Active open-source contributor, fixing bugs in popular React library ecosystems.

POSITIONS OF RESPONSIBILITY
Technical Team Member - Computer Science Society
- Organized university-wide technical hackathons and code jams for over 300+ students.
- Assisted in mentoring 50+ junior members in Web Development foundations and Git workflow.

LANGUAGES
- English (Professional Working)
- Hindi (Native)
- Telugu (Conversational)`;

doc.font('Helvetica').fontSize(11).text(resumeText, { lineGap: 2 });
doc.end();

stream.on('finish', () => {
  console.log('PDF created: test-resume.pdf');
});
