// DIFFERENTIATED RESUME PERSONAS FOR TEMPLATE PREVIEWS
// GOAL: High realism, dense content (80-90% fill), industry-specific focus

export const resumePersonas = {
  // Persona 1: Senior Software Engineer - "The Tech Heavyweight"
  // Focus: Technical depth, scalability, systems architecture
  techEngineer: {
    header: {
      name: "Alex Rodriguez",
      title: "Senior Full Stack Engineer",
      email: "alex.rodriguez@email.com",
      phone: "+1 (415) 555-0123",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexrodriguez"
    },
    summary: "Senior Full Stack Engineer with 7+ years of experience architecting scalable distributed systems for extensive user bases. Specialized in React, Node.js, and cloud infrastructure. Proven track record of improving system performance by 40%+ and leading engineering teams of 10+ developers to deliver critical product features on time.",
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Google",
        start: "2021",
        end: "Present",
        location: "Mountain View, CA",
        points: [
          "Architected and deployed a new microservices-based payments platform using Go and gRPC, handling $50M+ in daily transaction volume with 99.999% availability.",
          "Led a cross-functional team of 12 engineers to migrate legacy monolithic architecture to Kubernetes, reducing deployment time from 2 hours to 15 minutes and improving developer velocity by 300%.",
          "Optimized core search indexing algorithms, resulting in a 40% reduction in latency and saving $2.4M annually in cloud infrastructure costs through improved resource efficiency.",
          "Mentored 5 junior developers to promotion, conducting weekly code reviews and architectural planning sessions to ensure code quality and system scalability.",
          "Implemented comprehensive automated testing pipeline (unit, integration, e2e) achieving 95% code coverage and preventing 3 critical production incidents."
        ]
      },
      {
        role: "Software Engineer II",
        company: "Uber",
        start: "2018",
        end: "2021",
        location: "San Francisco, CA",
        points: [
          "Developed real-time driver dispatching system using Node.js and WebSocket, supporting 100k+ concurrent connections with sub-100ms latency.",
          "Designed and implemented specific privacy features compliant with GDPR/CCPA, ensuring data protection for over 50 million global users.",
          "Built internal developer tools that automated environment provisioning, reducing onboarding time for new engineers from 3 days to 4 hours.",
          "Collaborated with Product Managers and Data Scientists to implement A/B testing framework that increased driver engagement by 15%."
        ]
      },
      {
        role: "Full Stack Developer",
        company: "Stripe",
        start: "2016",
        end: "2018",
        location: "Seattle, WA",
        points: [
          "Built responsive customer-facing dashboard using React and Redux, improving load times by 60% and increasing customer retention by 12%.",
          "Integrated multiple third-party payment gateways, expanding market reach to 5 new countries in APAC region.",
          "Participated in on-call rotation, resolving production incidents and improving system monitoring with Prometheus and Grafana dashboards."
        ]
      }
    ],
    education: [
      {
        degree: "M.S. in Computer Science",
        institution: "Stanford University",
        year: "2016",
        location: "Stanford, CA"
      },
      {
        degree: "B.S. in Software Engineering",
        institution: "University of Washington",
        year: "2014",
        location: "Seattle, WA"
      }
    ],
    skills: [
      { category: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "Go", "Python", "Java", "SQL"] },
      { category: "Frontend", items: ["React", "Next.js", "Redux", "Tailwind CSS", "Webpack", "Jest"] },
      { category: "Backend", items: ["Node.js", "Express", "gRPC", "GraphQL", "PostgreSQL", "Redis"] },
      { category: "DevOps", items: ["Docker", "Kubernetes", "AWS (EC2, S3, RDS)", "CI/CD", "Terraform"] }
    ],
    projects: [
      {
        name: "Open Source Contributor - React",
        description: "Contributed core performance optimizations to React fiber reconciler.",
        year: "2022"
      },
      {
        name: "Distributed Task Scheduler",
        description: "Built high-throughput distributed task scheduler handling 1M+ jobs/hour."
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect - Professional",
      "Certified Kubernetes Administrator (CKA)"
    ]
  },

  // Persona 2: Marketing Manager - "The Growth Strategist"
  // Focus: Metrics, ROI, campaigns, leadership
  marketingPro: {
    header: {
      name: "Sarah Kim",
      title: "Senior Digital Marketing Manager",
      email: "sarah.kim@email.com",
      phone: "+1 (212) 555-0789",
      location: "New York, NY",
      linkedin: "linkedin.com/in/sarahkim"
    },
    summary: "Data-driven Marketing Manager with 8+ years of experience driving user acquisition and revenue growth for global tech brands. Expert in multi-channel strategy, brand development, and performance marketing. Successfully managed $5M+ annual ad budgets and led teams of 10+ marketers to exceed KPIs by 150%.",
    experience: [
      {
        role: "Senior Growth Marketing Manager",
        company: "Airbnb",
        start: "2021",
        end: "Present",
        location: "San Francisco, CA",
        points: [
          "Developed and executed comprehensive global marketing strategy that increased annual booking revenue by 25% ($50M+) in underperforming markets.",
          "Managed $5M annual performance marketing budget across Google Ads, Facebook, and TikTok, optimizing CAC by 35% through rigorous A/B testing and audience segmentation.",
          "Led a diverse team of 10 marketers and content creators, fostering a culture of experimentation that resulted in 4 viral campaigns reaching 10M+ organic impressions.",
          "Partnered with Product and Engineering teams to implement product-led growth initiatives, improving user activation rates by 40% through personalized onboarding flows.",
          "Established comprehensive analytics dashboard using Tableau and Mixpanel to track full-funnel metrics, enabling real-time budget allocation adjustments."
        ]
      },
      {
        role: "Digital Marketing Manager",
        company: "Spotify",
        start: "2018",
        end: "2021",
        location: "New York, NY",
        points: [
          "Spearheaded the 'Wrapped' year-end campaign strategy for North America, driving 15M social shares and a 20% spike in Q4 active users.",
          "Optimized email marketing automation sequences for 50M+ subscribers, improving open rates by 15% and click-through rates by 22%.",
          "Collaborated with influencer agencies to launch a creator partnership program that generated 500k new premium subscriptions in 6 months.",
          "Conducted market research and competitive analysis to identify emerging trends, influencing the 2020 product roadmap for podcast features."
        ]
      },
      {
        role: "Social Media Specialist",
        company: "VaynerMedia",
        start: "2015",
        end: "2018",
        location: "New York, NY",
        points: [
          "Managed social media presence for Fortune 500 clients, growing aggregate community size from 100k to 2M+ followers across platforms.",
          "Executed real-time content strategy during Super Bowl LI, earning 'Best Social Campaign' award and generating 50M organic impressions."
        ]
      }
    ],
    education: [
      {
        degree: "MBA in Marketing & Strategy",
        institution: "NYU Stern School of Business",
        year: "2018"
      },
      {
        degree: "B.A. in Communications",
        institution: "University of Southern California",
        year: "2014"
      }
    ],
    skills: [
      { category: "Digital Marketing", items: ["SEO/SEM", "Content Strategy", "Email Marketing", "Social Media", "PPC"] },
      { category: "Analytics & Tools", items: ["Google Analytics 4", "Tableau", "Mixpanel", "HubSpot", "Salesforce"] },
      { category: "Strategy", items: ["Brand Development", "Go-to-Market", "Budget Management", "Team Leadership"] }
    ],
    projects: [
      {
        name: "Global Rebranding Initiative",
        description: "Led digital rollout of major rebrand across 15 international markets."
      }
    ],
    certifications: [
      "Google Ads Professional Certification",
      "HubSpot Content Marketing Certified",
      "Facebook Blueprint Certified"
    ]
  },

  // Persona 3: Data Scientist - "The Insight Generator"
  // Focus: ML models, big data, business impact
  dataScientist: {
    header: {
      name: "Dr. Michael Chen",
      title: "Lead Data Scientist",
      email: "michael.chen@email.com",
      phone: "+1 (617) 555-8901",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/michaelchenphd"
    },
    summary: "Lead Data Scientist with a Ph.D. in Computational Statistics and 6 years of industry experience deploying machine learning models at scale. Passionate about turning complex datasets into actionable business insights. Proven expertise in NLP, recommendation systems, and predictive analytics that drove $10M+ in revenue impact.",
    experience: [
      {
        role: "Lead Data Scientist",
        company: "Netflix",
        start: "2021",
        end: "Present",
        location: "Los Gatos, CA",
        points: [
          "Designed and deployed deep learning-based content recommendation engine serving 200M+ users, improving average watch time by 12% globally.",
          "Built automated content valuation models using NLP and computer vision to predict show success probabilities, influencing $500M in content acquisition budgets.",
          "Led a team of 6 data scientists and engineers to build an internal A/B testing platform that accelerated experiment velocity from 5 to 50 experiments per week.",
          "Presented technical research at NeurIPS and ICML conferences, establishing the company as a leader in applied causal inference.",
          "Collaborated with engineering to optimize model inference latency, reducing cloud compute costs by 25% while maintaining model accuracy."
        ]
      },
      {
        role: "Senior Data Scientist",
        company: "Uber",
        start: "2018",
        end: "2021",
        location: "San Francisco, CA",
        points: [
          "Developed dynamic pricing algorithms using reinforcement learning that optimized driver positioning and reduced wait times by 18% in high-density markets.",
          "Created fraud detection models enabling real-time identification of fraudulent transactions, saving the company $15M annually in chargebacks.",
          "Engineered extensive feature pipelines using Spark and Hive to process petabyte-scale geospatial data for rider demand forecasting.",
          "Mentored junior data scientists and established best practices for code reproducibility and model versioning."
        ]
      },
      {
        role: "Data Analyst",
        company: "Capital One",
        start: "2016",
        end: "2018",
        location: "McLean, VA",
        points: [
          "Built credit risk scoring models using logistic regression and random forests, improving loan approval accuracy by 15%.",
          "Designed interactive dashboards in Tableau for executive leadership to monitor key portfolio risk metrics in real-time."
        ]
      }
    ],
    education: [
      {
        degree: "Ph.D. in Computational Statistics",
        institution: "Massachusetts Institute of Technology (MIT)",
        year: "2016"
      },
      {
        degree: "B.S. in Mathematics",
        institution: "University of Chicago",
        year: "2012"
      }
    ],
    skills: [
      { category: "Machine Learning", items: ["TensorFlow", "PyTorch", "Scikit-learn", "XGBoost", "NLP", "Computer Vision"] },
      { category: "Programming", items: ["Python", "R", "SQL", "Scala", "C++"] },
      { category: "Big Data", items: ["Spark", "Hadoop", "Hive", "Databricks", "Kafka"] },
      { category: "Deployment", items: ["Docker", "Kubernetes", "AWS SageMaker", "MLflow"] }
    ],
    publications: [
      "Efficient Causal Inference in Large-Scale Networks (NeurIPS 2020)",
      "Deep Learning for Temporal User Behavior Modeling (KDD 2019)"
    ],
    certifications: [
      "AWS Certified Machine Learning - Specialty",
      "Deep Learning Specialization (Coursera)"
    ]
  },

  // Persona 4: Product Designer - "The User Advocate"
  // Focus: User empathy, design systems, visual polish
  productDesigner: {
    header: {
      name: "Emma Wilson",
      title: "Senior Product Designer",
      email: "emma.wilson@email.com",
      phone: "+1 (512) 555-4567",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/emmawilson",
      portfolio: "emmawilson.design"
    },
    summary: "Senior Product Designer with 7 years of experience crafting intuitive digital experiences for SaaS and consumer products. Expert in design systems, user research, and high-fidelity prototyping. Passionate about solving complex user problems with elegant, simple solutions. Successfully led end-to-end redesigns for high-growth startups.",
    experience: [
      {
        role: "Senior Product Designer",
        company: "Figma",
        start: "2021",
        end: "Present",
        location: "San Francisco, CA (Remote)",
        points: [
          "Led the end-to-end redesign of the core collaboration features, resulting in a 35% increase in multi-user editing sessions within the first quarter.",
          "Spearheaded the creation and maintenance of 'FigJam' design system components, ensuring consistency across web and mobile platforms for 50+ designers.",
          "Conducted 50+ user research interviews and usability testing sessions to validate new features, reducing post-launch support tickets by 40%.",
          "Mentored 3 junior designers and facilitated weekly design critiques to elevate the team's visual execution and problem-solving standards.",
          "Collaborated closely with engineering to implement a token-based design system that reduced design-to-code handoff time by 50%."
        ]
      },
      {
        role: "Product Designer",
        company: "Dropbox",
        start: "2018",
        end: "2021",
        location: "Austin, TX",
        points: [
          "Designed and launched the new 'Dropbox Spaces' organization features, directly contributing to a 10% increase in team-plan upgrades.",
          "Facilitated design sprints with cross-functional partners to solve complex file navigation issues, simplifying the core user journey.",
          "Created high-fidelity interactive prototypes in Principle and Framer that helped secure executive buy-in for experimental features.",
          "Established accessibility standards (WCAG 2.1) for the design team, ensuring all new features were inclusive by default."
        ]
      },
      {
        role: "UI/UX Designer",
        company: "Frog Design",
        start: "2016",
        end: "2018",
        location: "Austin, TX",
        points: [
          "Delivered comprehensive UX strategies and UI designs for Fortune 500 clients in healthcare and finance sectors.",
          "Conducted extensive field research to map user journeys for a major hospital system app, improving patient check-in efficiency by 20%."
        ]
      }
    ],
    education: [
      {
        degree: "B.F.A. in Interaction Design",
        institution: "Rhode Island School of Design (RISD)",
        year: "2016"
      }
    ],
    skills: [
      { category: "Design", items: ["Figma", "Sketch", "Adobe XD", "Prototyping", "Wireframing", "Visual Design"] },
      { category: "Research", items: ["User Testing", "User Interviews", "Persona Development", "Journey Mapping"] },
      { category: "Technical", items: ["HTML/CSS", "Basic Javascript", "Webflow", "Design Systems"] },
      { category: "Tools", items: ["Jira", "Notion", "Principle", "Framer"] }
    ],
    projects: [
      {
        name: "EcoTrack Mobile App",
        description: "Personal project focused on carbon footprint tracking, featured on App Store."
      }
    ],
    awards: [
      "Red Dot Design Award 2020",
      "Webby Award Honoree 2019"
    ]
  },

  // Persona 5: Project Manager - "The Delivery Expert"
  // Focus: Budget, timeline, stakeholders, certifications
  projectManager: {
    header: {
      name: "James Thompson",
      title: "Senior Technical Project Manager",
      email: "james.thompson@email.com",
      phone: "+1 (206) 555-1212",
      location: "Seattle, WA",
      linkedin: "linkedin.com/in/jamesthompsonpm"
    },
    summary: "PMP-certified Senior Project Manager with 10+ years of experience leading complex enterprise software implementations. Expert in Agile/Scrum methodologies and risk management. Proven ability to manage multi-million dollar budgets and coordinate cross-functional global teams of 50+ members to deliver projects on time and under budget.",
    experience: [
      {
        role: "Senior Technical Project Manager",
        company: "Microsoft",
        start: "2019",
        end: "Present",
        location: "Redmond, WA",
        points: [
          "Managed end-to-end delivery of 3 major Azure cloud infrastructure releases with a combined budget of $15M, ensuring 100% on-time launch.",
          "Led a cross-functional team of 40+ engineers, designers, and QA testers across 3 time zones, facilitating daily standups and sprint planning.",
          "Implemented comprehensive risk management framework that identified mitigation strategies for 20+ critical dependencies, preventing potential 2-month delays.",
          "Served as primary liaison for C-level stakeholders, providing weekly status reports and steering committee updates on project health and KPIs.",
          "Optimized Agile processes by introducing automated Jira workflows, increasing team velocity by 25% and reducing administrative overhead."
        ]
      },
      {
        role: "Project Manager",
        company: "Oracle",
        start: "2015",
        end: "2019",
        location: "Seattle, WA",
        points: [
          "Coordinated the successful migration of 50+ enterprise clients to Oracle Cloud, handling complex data compliance requirements and zero-downtime cutovers.",
          "Managed 8 concurrent software implementation projects with a total portfolio value of $8M, consistently achieving client satisfaction scores above 4.8/5.",
          "Negotiated contracts with external vendors and partners, achieving cost savings of 15% ($200k) annually.",
          "Mentored 3 junior project managers on PMP methodologies and stakeholder communication best practices."
        ]
      },
      {
        role: "Implementation Consultant",
        company: "Cerner Corporation",
        start: "2013",
        end: "2015",
        location: "Kansas City, MO",
        points: [
          "Led onsite implementation of EHR software for 5 major hospital systems, ensuring regulatory compliance and successful workflow adoption.",
          "Conducted user training sessions for over 500 clinical staff members, facilitating smooth transition to new digital systems."
        ]
      }
    ],
    education: [
      {
        degree: "Master of Business Administration (MBA)",
        institution: "University of Washington",
        year: "2015"
      },
      {
        degree: "B.S. in Information Systems",
        institution: "University of Kansas",
        year: "2013"
      }
    ],
    skills: [
      { category: "Methodologies", items: ["Agile", "Scrum", "Waterfall", "Kanban", "SAFe", "Six Sigma"] },
      { category: "Tools", items: ["Jira", "Asana", "MS Project", "Confluence", "Tableau", "Smartsheet"] },
      { category: "Leadership", items: ["Stakeholder Management", "Risk Management", "Budgeting", "Vendor Management"] }
    ],
    certifications: [
      "Project Management Professional (PMP)",
      "Certified ScrumMaster (CSM)",
      "SAFe 5 Agilist Certification"
    ]
  },

  // Persona 6: Fresher/Entry Level - "The High-Potential Grad"
  // Focus: Education, projects, internships, potential
  fresher: {
    header: {
      name: "Priya Patel",
      title: "Computer Science Graduate",
      email: "priya.patel@email.com",
      phone: "+1 (312) 555-3456",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/priyapatelcs",
      portfolio: "github.com/priyapatel"
    },
    summary: "Motivated Computer Science graduate (3.8/4.0 GPA) with strong foundation in full-stack development and machine learning. Completed two high-impact internships at major tech companies. Passionate about building scalable web applications and solving complex algorithmic challenges. Eager to contribute to innovative software engineering teams.",
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "University of Illinois Urbana-Champaign",
        year: "2024",
        location: "Champaign, IL",
        details: [
          "GPA: 3.8/4.0 (Dean's List all semesters)",
          "Coursework: Data Structures, Algorithms, Distributed Systems, Database Systems, Artificial Intelligence"
        ]
      }
    ],
    experience: [
      {
        role: "Software Engineering Intern",
        company: "Salesforce",
        start: "May 2023",
        end: "Aug 2023",
        location: "San Francisco, CA",
        points: [
          "Developed a new feature for the Service Cloud platform using React and Java, allowing support agents to visualize customer ticket history.",
          "Optimized database queries for the internal reporting tool, reducing report generation time by 40%.",
          "Participated in daily standups, code reviews, and pair programming sessions within an Agile team environment.",
          "Presented final project to VP of Engineering, receiving recognition for technical depth and clear communication."
        ]
      },
      {
        role: "Research Assistant",
        company: "UIUC Data Analytics Lab",
        start: "Jan 2023",
        end: "May 2023",
        location: "Champaign, IL",
        points: [
          "Assisted in research on natural language processing for sentiment analysis of social media data using Python and NLTK.",
          "Processed and cleaned a dataset of 1M+ tweets, creating visualizations to identify trending topics during major events.",
          "Co-authored a poster presentation for the undergraduate research symposium."
        ]
      }
    ],
    projects: [
      {
        name: "CampusConnect",
        description: "Full-stack mobile app connecting students for study groups. Built with React Native and Firebase.",
        link: "github.com/priya/campusconnect"
      },
      {
        name: "AI Stock Predictor",
        description: "Machine learning model predicting stock trends with 65% accuracy using LSTM networks and Python.",
        link: "github.com/priya/stock-predictor"
      }
    ],
    skills: [
      { category: "Languages", items: ["Java", "Python", "JavaScript", "C++", "SQL"] },
      { category: "Web Technologies", items: ["React", "Node.js", "HTML5", "CSS3", "REST APIs"] },
      { category: "Tools", items: ["Git", "VS Code", "Jira", "Linux", "Docker"] }
    ],
    certifications: [
      "AWS Certified Cloud Practitioner",
      "Meta Front-End Developer Professional Certificate"
    ],
    awards: [
      "1st Place, UIUC Hackathon 2023",
      "Engineering Merit Scholarship"
    ]
  }
};

// Default export for backwards compatibility
export default resumePersonas.techEngineer;
