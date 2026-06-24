// RPG Portfolio Data - Azzah Zayn H.
const PORTFOLIO_DATA = {
  player: {
    name: "Azzah Zayn H.",
    title: "AI & Computer Science Engineer",
    level: 4, // Final Year Student
    hp: 100,
    maxHp: 100,
    xp: 942, // CGPA 9.42!
    maxXp: 1000,
    avatar: "mage", // Default avatar class
    classInfo: {
      mage: {
        className: "Code Wizard",
        description: "Manipulates arrays and weaves neural networks to solve complex algorithmic puzzles."
      },
      knight: {
        className: "Cyber Knight",
        description: "Wields security tools and guards networks against malicious exploits and vulnerabilities."
      },
      rogue: {
        className: "Agile Developer",
        description: "Moves swiftly through codebases, building user interfaces and port scanners in the shadows."
      }
    },
    stats: {
      strength: 80,       // Represents Frontend / UI Engineering (Flutter/HTML/CSS)
      agility: 55,        // Represents Backend / Tooling (FastAPI/SQL/Git/Port Scanners)
      intelligence: 94,   // Represents Artificial Intelligence & ML (TensorFlow/Keras/Sci-Kit)
      defense: 88,        // Represents Cybersecurity / Penetration Testing (Kali Linux/Nmap/Metasploit)
      luck: 90            // Represents Hackathons / Problem Solving (Smart India Hackathon)
    },
    equipment: {
      weapon: {
        name: "VS Code & Python Compiler",
        desc: "Deals +50 Coding Damage. Essential for compiling neural networks and debugging scripts.",
        rarity: "Epic"
      },
      shield: {
        name: "FastAPI Shield",
        desc: "Increases defense against server crashes. Handles requests with high concurrency.",
        rarity: "Rare"
      },
      armor: {
        name: "Kali Linux Cloak",
        desc: "Blocks incoming network exploits. Grants stealth and vulnerability detection.",
        rarity: "Legendary"
      },
      accessory: {
        name: "Gemini API Pendant",
        desc: "Provides AI insight. Boosts intelligence stat by +15. Resolves open questions.",
        rarity: "Mythic"
      }
    }
  },

  about: {
    summary: "I am a final-year engineering student majoring in Computer Science and Engineering with Artificial Intelligence at Mar Baselios College of Engineering and Technology. I specialize in developing AI/ML systems, conducting security analyses, and building high-performance web and mobile applications.",
    education: [
      {
        institution: "Mar Baselios College of Engineering and Technology (Autonomous)",
        degree: "B.Tech in Computer Science and Engineering (Artificial Intelligence)",
        period: "Sept 2023 - Present",
        details: "Current CGPA: 9.44/10. Focus on Deep Learning, Cybersecurity, Algorithms, and Software Systems."
      },
      {
        institution: "Sree Narayana Public School (CBSE)",
        degree: "12th Grade (Senior Secondary)",
        period: "Completed 2023",
        details: "Percentage: 85.6%."
      },
      {
        institution: "Christ Nagar Higher Secondary School (ICSE)",
        degree: "10th Grade (Secondary School)",
        period: "Completed 2021",
        details: "Percentage: 94.6%."
      }
    ]
  },

  quests: [
    {
      title: "Quest: Flutter Development Internship",
      company: "ICT Academy",
      period: "June 2024 - July 2024",
      status: "COMPLETED",
      xpReward: 150,
      objectives: [
        "Developed a mobile application in Flutter to calculate and classify Body Mass Index (BMI).",
        "Designed clean, responsive Flutter UI layouts for mobile devices.",
        "Implemented conditional classification logic for Underweight, Normal, Overweight, and Obese categories."
      ]
    },
    {
      title: "Quest: Cybersecurity Internship",
      company: "ICT Academy",
      period: "Dec 2024 - Jan 2025",
      status: "COMPLETED",
      xpReward: 200,
      objectives: [
        "Conducted penetration testing and vulnerability assessments on Kioptrix Level 1 vulnerable machine.",
        "Used network utility tools (Nmap, Metasploit) to discover open ports and exploit weaknesses.",
        "Worked in Kali Linux security environments to identify, analyze, and document potential system vulnerabilities."
      ]
    },
    {
      title: "Quest: Smart India Hackathon 2024",
      company: "SIH Prelims Level",
      period: "2024",
      status: "COMPLETED",
      xpReward: 250,
      objectives: [
        "Qualified the Prelims Level of the national-level Smart India Hackathon.",
        "Designed and prototyped an AI-driven Crop Disease Prediction and Management System.",
        "Engineered machine learning and image processing pipelines to diagnose plant conditions."
      ]
    }
  ],

  projects: [
    {
      id: "proj_security",
      title: "CWE AI/ML Repository Security Analyzer",
      category: "Cybersecurity & AI",
      desc: "Conducted a large-scale security analysis on 2,439 GitHub repositories. Built an automated pipeline using Semgrep and Bandit to identify vulnerabilities, mapping them to CWE (Common Weakness Enumeration) schemas. Integrated Google Gemini API to analyze reports and generate human-readable remediation checklists.",
      tech: ["Python", "Semgrep", "Bandit", "Gemini API", "CWE Docs"],
      rarity: "Legendary Chest",
      questLink: "https://github.com/azzahzayn/CWE-Analysis.git"
    },
    {
      id: "proj_tumor",
      title: "Deep Learning Brain Tumor Detection",
      category: "Artificial Intelligence",
      desc: "Developed a convolutional neural network (CNN) system to detect brain tumors from medical scans. Applied transfer learning with VGG19 and ResNet50. Implemented Grad-CAM (Gradient-weighted Class Activation Mapping) to visualize and overlay heatmap highlights on tumor-affected areas. Built a Tkinter desktop GUI for clinic demonstrations.",
      tech: ["TensorFlow", "Keras", "Grad-CAM", "ResNet50", "Tkinter"],
      rarity: "Epic Chest",
      questLink: "https://github.com/"
    },
    {
      id: "proj_grocery",
      title: "AI Sustainable Grocery Assistant",
      category: "AI & Sustainability",
      desc: "Proposed and prototyped an intelligent recommendation system that scores grocery items based on ecological impacts (carbon footprint, water usage, ethical sourcing). Utilized Google Gemini API to extract and parse nutritional and manufacturing data, prompting eco-friendly consumer habits.",
      tech: ["Python", "Gemini API", "FastAPI", "Pandas", "Scikit-learn"],
      rarity: "Epic Chest",
      questLink: "https://github.com/"
    },
    {
      id: "proj_navigation",
      title: "A-Star College Navigation App",
      category: "Software Engineering",
      desc: "Created a campus navigation prototype to help students and staff find classrooms, laboratories, and offices. Managed map nodes and room indexes in an SQL database. Designed pixel-perfect interactive floor maps using Figma and attempted A-star pathfinding logic for optimal route calculations.",
      tech: ["Java", "SQL Database", "Figma", "A-Star Algorithm", "Android Studio"],
      rarity: "Rare Chest",
      questLink: "https://github.com/"
    },
    {
      id: "proj_password",
      title: "Password Strength & HIBP Breach Checker",
      category: "Cybersecurity",
      desc: "Developed a Python cryptographic assessment utility checking passwords against complex entropy regex patterns. Integrated the 'Have I Been Pwned' API via k-anonymity protocol (sending only first 5 chars of SHA-1 hash) to safely check entries against 10 billion leaked credentials without revealing plaintext data.",
      tech: ["Python", "HIBP API", "Cryptography", "Regex", "Sockets"],
      rarity: "Rare Chest",
      questLink: "https://github.com/azzahzayn/password_strength_plus_breach_checker.git"
    },
    {
      id: "proj_scanner",
      title: "Multi-threaded Open Port Scanner",
      category: "Networking / Security",
      desc: "Built a concurrent network utility in Python that scans hosts for open TCP ports and fingerprint services. Implemented Python's threading library for high-speed scanning and utilized socket connections for full TCP handshakes. Maps scans against 17 common ports to identify running services, logging detailed persistent audit trails.",
      tech: ["Python", "Sockets", "Threading Library", "Network Security"],
      rarity: "Common Chest",
      questLink: "https://github.com/azzahzayn/open_port_scanner.git"
    }
  ],

  skills: {
    languages: [
      { name: "Python", value: 95 },
      { name: "Java", value: 70 },
      { name: "C", value: 85 },
      { name: "SQL", value: 90 }
    ],
    web: [
      { name: "HTML5 / CSS3", value: 88 },
      { name: "JavaScript (ES6)", value: 85 },
      { name: "REST APIs", value: 90 },
      { name: "FastAPI", value: 82 }
    ],
    ai_ml: [
      { name: "TensorFlow / Keras", value: 90 },
      { name: "Scikit-Learn", value: 88 },
      { name: "NumPy / Pandas", value: 92 },
      { name: "Computer Vision / Image Processing", value: 85 }
    ],
    cybersecurity: [
      { name: "Penetration Testing", value: 80 },
      { name: "Vulnerability Assessment", value: 82 },
      { name: "Nmap & Metasploit", value: 85 },
      { name: "Kali Linux / Security OS", value: 88 }
    ],
    tools: [
      { name: "Git & GitHub", value: 90 },
      { name: "VS Code", value: 95 },
      { name: "Figma (UI/UX Design)", value: 80 },
      { name: "PostgreSQL / MySQL", value: 82 },
      { name: "SQLAlchemy / Pydantic", value: 85 }
    ]
  },

  contact: {
    phone: "+91 8590997938",
    email: "azzahzaynh.b23cs2124@mbcet.ac.in",
    linkedin: "https://www.linkedin.com/in/azzah-zayn-557623307/",
    github: "https://github.com/azzahzayn" // Fallback github link
  }
};
