/**
 * AI Content Generator (Simulated)
 * Generates high-quality, role-specific content without external API calls.
 */

const ROLE_TEMPLATES = {
    'software-engineer': {
        summaries: [], // Deprecated for summaries, used for fallback or reference
        bullets: [
            "Architected and deployed a scalable microservice architecture handling {metric} requests per day with 99.99% uptime.",
            "Refactored legacy codebases to improve query performance by {metric}, significantly reducing cloud infrastructure costs.",
            "Led a team of {number} engineers to launch a critical feature set, directly contributing to a {metric} increase in user engagement.",
            "Implemented automated CI/CD pipelines, reducing deployment time from {time1} to {time2} and improving developer velocity.",
            "Designed and built a real-time data ingestion pipeline capable of processing {metric} events per second."
        ]
    },
    'product-manager': {
        summaries: [],
        bullets: [
            "Defined and executed the product roadmap for a flagship product, resulting in a {metric} increase in market share.",
            "Conducted comprehensive user research and A/B testing to optimize onboarding flows, improving conversion rates by {metric}.",
            "Collaborated closely with engineering and design teams to deliver high-quality features on time and within budget.",
            "Analyzed key performance indicators (KPIs) to identify growth opportunities and drive data-informed product decisions.",
            "Launched a new tiered subscription model that increased Annual Recurring Revenue (ARR) by {metric}."
        ]
    },
    'data-scientist': {
        summaries: [],
        bullets: [
            "Developed and deployed a machine learning model to predict customer churn with {metric} accuracy, saving significant revenue.",
            "Analyzed terabytes of data to uncover hidden trends, leading to a strategic initiative that increased efficiency by {metric}.",
            "Built interactive dashboards that visualized real-time key metrics, enabling faster decision-making for executive stakeholders.",
            "Optimized data processing pipelines to reduce latency by {metric} and improve overall data quality.",
            "Collaborated with product teams to implement data-driven personalization features that enhanced user experience."
        ]
    },
    'marketing-manager': {
        summaries: [],
        bullets: [
            "Executed a comprehensive digital marketing campaign that generated {metric} qualified leads in Q3, exceeding targets.",
            "Managed a large-scale marketing budget, optimizing spend to achieve a {metric} reduction in cost per acquisition (CPA).",
            "Developed and implemented a cohesive content strategy that increased blog traffic by {metric} year-over-year.",
            "Led a rebranding initiative that significantly improved brand sentiment and increased social media engagement by {metric}.",
            "Analyzed campaign performance data to rigorously optimize targeting and messaging, improving click-through rates by {metric}."
        ]
    },
    'sales-representative': {
        summaries: [],
        bullets: [
            "Surpassed annual sales quota by {metric} through aggressive prospecting and strategic relationship building.",
            "Closed a record-breaking deal worth {amount}, significantly contributing to the company's annual revenue targets.",
            "Expanded key account portfolio by {metric} year-over-year by identifying upsell and cross-sell opportunities.",
            "Developed and executed a territory sales plan that resulted in a {metric} increase in new business acquisition.",
            "Collaborated with marketing and product teams to refine sales collateral, improved lead conversion rates by {metric}."
        ]
    },
    'human-resources': {
        summaries: [],
        bullets: [
            "Implemented a new employee onboarding program that improved new hire retention rates by {metric} within the first year.",
            "Led a company-wide culture initiative that resulted in a {metric} increase in employee engagement and satisfaction scores.",
            "Streamlined recruitment processes, reducing average time-to-fill by {metric} while improving candidate experience.",
            "Resolved complex employee relations issues, mitigating legal risk and maintaining a positive work environment.",
            "Designed and administered a comprehensive benefits package that reduced costs by {metric} while improving coverage."
        ]
    },
    'customer-support': {
        summaries: [],
        bullets: [
            "Resolved an average of {number} support tickets per week with a consistently high customer satisfaction rating (CSAT) of 4.8/5.",
            "Authored detailed help center articles that reduced incoming support volume by {metric}, empowering users to self-serve.",
            "Identified and reported a critical bug affecting {metric} of users, collaborating with engineering to expedite a fix.",
            "Reduced average resolution time by {metric} through the implementation of improved troubleshooting workflows.",
            "Mentored new team members, helping them achieve full productivity {time1} faster than the department average."
        ]
    },
    'ui-ux-designer': {
        summaries: [],
        bullets: [
            "Designed and prototyped high-fidelity interfaces for {product}, improving user task completion rate by {metric}.",
            "Conducted user interviews and usability testing to validate design decisions and identify pain points.",
            "Created a comprehensive design system in Figma, reducing design-to-development handoff time by {metric}.",
            "Collaborated with product managers to define user requirements and translate them into wireframes.",
            "Redesigned the onboarding flow, resulting in a {metric} increase in improved user retention."
        ]
    },
    'general': {
        summaries: [],
        bullets: [
            "Successfully executed key projects, delivering results {metric} ahead of schedule and under budget.",
            "Collaborated with cross-functional teams to streamline workflows and improve operational efficiency by {metric}.",
            "Managed multiple concurrent priorities while maintaining a high standard of quality and attention to detail.",
            "Implemented new processes that resulted in a {metric} increase in productivity and reduced error rates.",
            "Recognized for outstanding performance and contribution to team goals with the 'Employee of the Month' award."
        ]
    }
};

function normalizeKey(key) {
    if (!key) return 'general';
    const normalized = key.toLowerCase().replace(/\s+/g, '-');
    // Check if it exists as a key, or if it matches a known key
    if (ROLE_TEMPLATES[normalized]) return normalized;
    // Check partial
    const match = Object.keys(ROLE_TEMPLATES).find(k => k.includes(normalized) || normalized.includes(k));
    return match || 'general';
}

/**
 * Generate a professional summary using Randomized/Constructive Logic
 * Creates unique, substantial combinations (simulating LLM variety).
 * Structure: Identity -> Competency -> Impact -> Philosophy -> Closing
 */
export function generateSummary(roleKey, experienceYears = '3+', skills = [], roleTitle = '', experience = []) {
    const key = normalizeKey(roleKey);
    // Use raw title if available, otherwise default to category name
    const displayRole = roleTitle || key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const years = experienceYears.replace('+', '');

    // Helper
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Recent company context
    const recentCompany = experience.length > 0 && experience[0].company ? experience[0].company : null;

    // 1. IDENTITY SENTENCE (Who am I?)
    const openers = [
        `Results-oriented ${displayRole}`,
        `Highly motivated ${displayRole}`,
        `Strategic ${displayRole}`,
        `Innovative ${displayRole}`,
        `Dedicated ${displayRole}`,
        `Accomplished ${displayRole}`
    ];

    let connector = `with ${years}+ years of experience`;
    if (recentCompany) {
        connector = pick([
            `with ${years}+ years of experience, including a tenure at ${recentCompany}`,
            `bringing ${years}+ years of expertise, most recently at ${recentCompany}`,
            `with a proven track record at companies like ${recentCompany}`
        ]);
    }

    const contexts = [
        "driving impact in fast-paced environments.",
        "delivering solutions for complex business challenges.",
        "contributing to high-growth organizations.",
        "optimizing performance and operational efficiency."
    ];
    const s1 = `${pick(openers)} ${connector} ${pick(contexts)}`;

    // 2. COMPETENCY SENTENCE (What are my core hard skills?)
    let s2 = "Specializing in delivering high-quality work.";
    if (skills && skills.length > 0) {
        const top = skills.slice(0, 2).join(' and ');
        s2 = pick([
            `Specializing in ${top} to build robust solutions.`,
            `Expert in ${top} with a focus on scalability and best practices.`,
            `Proficient in harnessing ${top} to drive innovation.`,
            `Possessing deep technical expertise in ${top}.`
        ]);
    }

    // 3. IMPACT SENTENCE (What have I actually done? - Role Specific)
    let impactOptions = [
        "Proven track record of delivering high-quality solutions on time and under budget.",
        "Known for analyzing complex problems and implementing effective, long-term solutions.",
        "Skilled in collaborating with cross-functional teams to exceed organizational goals."
    ];

    if (key === 'software-engineer') {
        impactOptions = [
            "Proven track record of architecting scalable systems and optimizing application performance by 30%.",
            "Successfully led the end-to-end development of critical features that increased user engagement.",
            "Adept at modernizing legacy codebases, significantly reducing technical debt and improving maintainability.",
            "Demonstrated ability to deliver high-quality code in agile environments, consistently meeting sprint goals."
        ];
    } else if (key === 'product-manager') {
        impactOptions = [
            "Adept at bridging the engineering-business gap to deliver products that have generated significant revenue.",
            "Skilled in translating complex market research into actionable product strategies and executable roadmaps.",
            "Proven ability to launch successful products that achieve strong product-market fit and high user retention.",
            "Expert in prioritizing features based on data-driven insights to maximize ROI and customer satisfaction."
        ];
    } else if (key === 'marketing-manager') {
        impactOptions = [
            "Expert in executing integrated multi-channel campaigns that have increased brand awareness by over 40%.",
            "Skilled in analyzing market trends to develop data-driven content strategies that resonate with target audiences.",
            "Proven ability to drive lead generation and customer acquisition through innovative digital marketing initiatives.",
            "Experienced in managing substantial marketing budgets and optimizing ad spend to achieve maximum efficiency."
        ];
    } else if (key === 'ui-ux-designer') {
        impactOptions = [
            "Passionate about crafting intuitive, user-centric designs that drive engagement and improve customer satisfaction.",
            "Skilled in translating complex requirements into elegant, easy-to-use interfaces through rapid prototyping.",
            "Expert in conducting comprehensive user research to validate design decisions and unblock user pain points.",
            "Proven track record of delivering pixel-perfect designs that align seamlessly with brand identity and goals."
        ];
    } else if (key === 'sales-representative') {
        impactOptions = [
            "Demonstrated success in exceeding sales quotas and building lasting client relationships.",
            "Skilled in identifying new business opportunities and closing high-value deals.",
            "Expert in consultative selling and understanding customer pain points.",
            "Proven ability to manage the full sales cycle from prospecting to negotiation."
        ];
    } else if (key === 'human-resources') {
        impactOptions = [
            "Dedicated to fostering a positive company culture and improving employee retention.",
            "Skilled in talent acquisition, employee relations, and performance management.",
            "Proven ability to implement HR strategies that support organizational growth.",
            "Expert in resolving complex employee issues with empathy and professionalism."
        ];
    } else if (key === 'customer-support') {
        impactOptions = [
            "Committed to delivering exceptional customer experiences and resolving issues rapidly.",
            "Skilled in de-escalating conflicts and turning dissatisfied customers into advocates.",
            "Proven ability to manage high volumes of inquiries while maintaining quality.",
            "Expert in troubleshooting technical issues and documenting solutions for the team."
        ];
    }
    const s3 = pick(impactOptions);

    // 4. PHILOSOPHY SENTENCE (How do I work?)
    const s4 = pick([
        "Known for a collaborative work style and the ability to mentor junior team members.",
        "Recognized for strong problem-solving abilities and a proactive approach to challenges.",
        "Excellent communicator adept at translating technical concepts for non-technical stakeholders.",
        "Dedicated to writing clean, documentable code and fostering a culture of engineering excellence.",
        "Committed to staying ahead of industry trends and continuously adopting new best practices."
    ]);

    // 5. CLOSING SENTENCE (What do I want?)
    const s5 = pick([
        "Eager to leverage diverse background to contribute to the success of a forward-thinking team.",
        "Seeking to apply expertise in a challenging role that drives meaningful business impact.",
        "Passionately committed to driving operational excellence and continuous improvement in every project.",
        "Ready to bring technical leadership and innovation to a dynamic organization."
    ]);

    return `${s1} ${s2} ${s3} ${s4} ${s5}`;
}

/**
 * Generate a bullet point suggestion
 */
export function generateBulletPoint(roleKey, keyword = '') {
    const key = normalizeKey(roleKey);
    const templates = ROLE_TEMPLATES[key].bullets;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    return randomTemplate
        .replace('{metric}', '30%')
        .replace('{number}', '5')
        .replace('{time1}', '2 hours')
        .replace('{time2}', '15 minutes')
        .replace('{tech}', 'modern technologies')
        .replace('{tool}', 'advanced tools')
        .replace('{amount}', '$50k');
}
