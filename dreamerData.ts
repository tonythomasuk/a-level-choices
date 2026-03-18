import { DreamerWorld } from './types';

export const DREAMER_DATA: DreamerWorld[] = [
  {
    "id": "digital-frontier",
    "world_name": "The Digital Frontier",
    "description": "Architect the virtual worlds and AI of tomorrow.",
    "courses": [
      {
        "title": "Computer Science & AI",
        "careers": [
          { "name": "AI Researcher", "description": "Conducts cutting-edge research to develop new AI algorithms and models." },
          { "name": "Machine Learning Engineer", "description": "Designs and implements machine learning systems and applications." },
          { "name": "Robotics Software Lead", "description": "Oversees the development of software that controls robotic systems." }
        ],
        "gcse": { "mandatory": ["Maths (Grade 7+)", "English"], "helpful": ["Computer Science", "Physics"] },
        "a_level": { "mandatory": ["Maths"], "helpful": ["Further Maths", "Computer Science"] }
      },
      {
        "title": "Cybersecurity & Networks",
        "careers": [
          { "name": "Ethical Hacker", "description": "Tests security systems by attempting to breach them to identify vulnerabilities." },
          { "name": "Security Architect", "description": "Designs and builds robust security infrastructures for organizations." },
          { "name": "Network Defense Specialist", "description": "Monitors and protects computer networks from cyber threats." }
        ],
        "gcse": { "mandatory": ["Maths", "English"], "helpful": ["Computer Science"] },
        "a_level": { "mandatory": ["Maths or Computer Science"], "helpful": ["Physics", "Further Maths"] }
      },
      {
        "title": "Data Science & Analytics",
        "careers": [
          { "name": "Data Scientist", "description": "Analyzes complex data sets to extract insights and inform business decisions." },
          { "name": "Business Intelligence Lead", "description": "Manages the collection and analysis of business data to drive strategy." },
          { "name": "Big Data Architect", "description": "Designs and manages large-scale data storage and processing systems." }
        ],
        "gcse": { "mandatory": ["Maths (7+)", "English"], "helpful": ["Statistics"] },
        "a_level": { "mandatory": ["Maths"], "helpful": ["Further Maths", "Computer Science"] }
      },
      {
        "title": "Software Engineering",
        "careers": [
          { "name": "Full Stack Developer", "description": "Develops both client-side and server-side software for web applications." },
          { "name": "Systems Architect", "description": "Designs the high-level structure of complex software and hardware systems." },
          { "name": "Mobile App Innovator", "description": "Creates and develops innovative mobile applications for various platforms." }
        ],
        "gcse": { "mandatory": ["Maths", "English"], "helpful": ["Computer Science"] },
        "a_level": { "mandatory": ["Maths or Computer Science"], "helpful": ["Physics"] }
      }
    ]
  },
  {
    "id": "inner-universe",
    "world_name": "The Inner Universe",
    "description": "Unlock the mysteries of the human brain and behavior.",
    "courses": [
      {
        "title": "Neuroscience & Psychology",
        "careers": [
          { "name": "Clinical Psychologist", "description": "Diagnoses and treats mental, emotional, and behavioral disorders." },
          { "name": "Neuroscientist", "description": "Studies the structure and function of the nervous system and brain." },
          { "name": "Behavioral Analyst", "description": "Analyzes human behavior to develop interventions and treatment plans." }
        ],
        "gcse": { "mandatory": ["Combined Science", "Maths"], "helpful": ["Psychology"] },
        "a_level": { "mandatory": ["Biology or Psychology"], "helpful": ["Chemistry", "Maths"] }
      },
      {
        "title": "Cognitive Science",
        "careers": [
          { "name": "UX Researcher", "description": "Conducts studies to understand user needs and improve product experiences." },
          { "name": "Human Factors Engineer", "description": "Designs systems and products that optimize human performance and safety." },
          { "name": "AI Interaction Designer", "description": "Designs the interfaces and interactions between humans and AI systems." }
        ],
        "gcse": { "mandatory": ["Maths", "Science"], "helpful": ["Computer Science"] },
        "a_level": { "mandatory": ["Maths or Biology"], "helpful": ["Psychology", "Computer Science"] }
      },
      {
        "title": "Educational Psychology",
        "careers": [
          { "name": "Educational Psychologist", "description": "Supports the learning and emotional needs of children and young people." },
          { "name": "Learning Strategist", "description": "Develops and implements effective learning strategies and programs." },
          { "name": "Special Needs Consultant", "description": "Provides expert advice and support for individuals with special needs." }
        ],
        "gcse": { "mandatory": ["English", "Maths"], "helpful": ["Psychology"] },
        "a_level": { "mandatory": ["Psychology"], "helpful": ["Sociology", "English Lit"] }
      },
      {
        "title": "Criminology & Forensic Psychology",
        "careers": [
          { "name": "Forensic Psychologist", "description": "Applies psychological principles to legal and criminal investigations." },
          { "name": "Criminal Profiler", "description": "Analyzes criminal behavior to help identify and apprehend suspects." },
          { "name": "Rehabilitation Officer", "description": "Supports the rehabilitation and reintegration of offenders into society." }
        ],
        "gcse": { "mandatory": ["English", "Science"], "helpful": ["Sociology"] },
        "a_level": { "mandatory": ["Psychology or Sociology"], "helpful": ["Law", "History"] }
      }
    ]
  },
  {
    "id": "physical-world",
    "world_name": "The Physical World",
    "description": "Master the laws of nature to build the future.",
    "courses": [
      {
        "title": "Aerospace Engineering",
        "careers": [
          { "name": "Satellite Designer", "description": "Designs and develops satellites for communication, research, and navigation." },
          { "name": "Flight Systems Engineer", "description": "Develops and tests the systems that control aircraft and spacecraft." },
          { "name": "Space Mission Planner", "description": "Plans and coordinates the complex logistics of space exploration missions." }
        ],
        "gcse": { "mandatory": ["Maths", "Physics"], "helpful": ["Design Technology"] },
        "a_level": { "mandatory": ["Maths", "Physics"], "helpful": ["Further Maths"] }
      },
      {
        "title": "Robotics & Mechatronics",
        "careers": [
          { "name": "Robotics Specialist", "description": "Designs, builds, and maintains robotic systems for various industries." },
          { "name": "Automation Engineer", "description": "Develops and implements automated systems to improve efficiency and productivity." },
          { "name": "Control Systems Designer", "description": "Designs systems that manage and regulate the behavior of other systems." }
        ],
        "gcse": { "mandatory": ["Maths", "Physics"], "helpful": ["Computer Science"] },
        "a_level": { "mandatory": ["Maths", "Physics"], "helpful": ["Computer Science", "Further Maths"] }
      },
      {
        "title": "Civil & Structural Engineering",
        "careers": [
          { "name": "Structural Engineer", "description": "Designs and analyzes the structural integrity of buildings and infrastructure." },
          { "name": "Smart City Architect", "description": "Designs and implements technology-driven solutions for urban environments." },
          { "name": "Infrastructure Lead", "description": "Manages the planning and development of large-scale infrastructure projects." }
        ],
        "gcse": { "mandatory": ["Maths", "Physics"], "helpful": ["Geography"] },
        "a_level": { "mandatory": ["Maths", "Physics"], "helpful": ["Further Maths", "Geography"] }
      },
      {
        "title": "Theoretical Physics",
        "careers": [
          { "name": "Quantum Researcher", "description": "Conducts research into quantum mechanics and its potential applications." },
          { "name": "Astrophysicist", "description": "Studies the physical properties and behavior of celestial objects and the universe." },
          { "name": "Mathematical Modeller", "description": "Uses mathematical equations to simulate and analyze complex real-world systems." }
        ],
        "gcse": { "mandatory": ["Maths (8+)", "Physics"], "helpful": ["Astronomy"] },
        "a_level": { "mandatory": ["Maths", "Physics"], "helpful": ["Further Maths"] }
      },
      {
        "title": "Renewable Energy Engineering",
        "careers": [
          { "name": "Wind Turbine Designer", "description": "Designs and develops efficient wind turbines for renewable energy production." },
          { "name": "Solar Grid Architect", "description": "Designs and manages large-scale solar energy systems and power grids." },
          { "name": "Energy Consultant", "description": "Provides expert advice on energy efficiency and sustainable energy solutions." }
        ],
        "gcse": { "mandatory": ["Maths", "Science"], "helpful": ["Geography"] },
        "a_level": { "mandatory": ["Maths", "Physics or Chemistry"], "helpful": ["Geography"] }
      }
    ]
  },
  {
    "id": "human-story",
    "world_name": "The Human Story",
    "description": "Investigate our past to shape future justice.",
    "courses": [
      {
        "title": "Law & International Relations",
        "careers": [
          { "name": "Human Rights Lawyer", "description": "Advocates for and protects the fundamental rights of individuals and groups." },
          { "name": "Diplomat", "description": "Represents their country's interests and manages international relations." },
          { "name": "Intelligence Analyst", "description": "Collects and analyzes information to support national security and defense." }
        ],
        "gcse": { "mandatory": ["English Language", "History"], "helpful": ["Languages"] },
        "a_level": { "mandatory": ["History or English Lit"], "helpful": ["Politics", "Law"] }
      },
      {
        "title": "Archaeology & Anthropology",
        "careers": [
          { "name": "Heritage Manager", "description": "Manages and preserves historical sites, monuments, and cultural artifacts." },
          { "name": "Forensic Anthropologist", "description": "Analyzes human remains to help identify victims and determine cause of death." },
          { "name": "Museum Curator", "description": "Manages and organizes museum collections and exhibitions." }
        ],
        "gcse": { "mandatory": ["History", "English"], "helpful": ["Geography"] },
        "a_level": { "mandatory": ["History or Geography"], "helpful": ["Biology", "Classical Civilisation"] }
      },
      {
        "title": "History & Politics",
        "careers": [
          { "name": "Political Strategist", "description": "Develops and implements strategies for political campaigns and organizations." },
          { "name": "Journalist", "description": "Researches, writes, and reports on news and current events for various media." },
          { "name": "Public Policy Lead", "description": "Develops and advocates for policies that address social and economic issues." }
        ],
        "gcse": { "mandatory": ["History", "English"], "helpful": ["Modern Languages"] },
        "a_level": { "mandatory": ["History"], "helpful": ["Politics", "English Lit"] }
      },
      {
        "title": "Criminology & Law",
        "careers": [
          { "name": "Barrister", "description": "Represents clients in court and provides expert legal advice." },
          { "name": "Police Lead", "description": "Manages and coordinates police operations and law enforcement activities." },
          { "name": "Justice Reformer", "description": "Advocates for and implements changes to improve the justice system." }
        ],
        "gcse": { "mandatory": ["English", "History"], "helpful": ["Sociology"] },
        "a_level": { "mandatory": ["English Lit or History"], "helpful": ["Law", "Sociology"] }
      }
    ]
  },
  {
    "id": "green-guardian",
    "world_name": "The Green Guardian",
    "description": "Fight for the planet through science and sustainability.",
    "courses": [
      {
        "title": "Environmental Science",
        "careers": [
          { "name": "Sustainability Consultant", "description": "Advises organizations on how to operate in an environmentally sustainable way." },
          { "name": "Climate Scientist", "description": "Studies the Earth's climate and the impacts of climate change." },
          { "name": "Environmental Auditor", "description": "Assesses organizations' compliance with environmental regulations and standards." }
        ],
        "gcse": { "mandatory": ["Combined Science", "Geography"], "helpful": ["Biology"] },
        "a_level": { "mandatory": ["Biology or Geography"], "helpful": ["Chemistry"] }
      },
      {
        "title": "Marine Biology",
        "careers": [
          { "name": "Marine Biologist", "description": "Studies the biology and ecology of marine organisms and environments." },
          { "name": "Ocean Conservationist", "description": "Advocates for and implements strategies to protect the world's oceans." },
          { "name": "Aquatic Researcher", "description": "Conducts research into aquatic ecosystems and the organisms that inhabit them." }
        ],
        "gcse": { "mandatory": ["Biology", "Chemistry"], "helpful": ["Geography"] },
        "a_level": { "mandatory": ["Biology", "Chemistry"], "helpful": ["Maths", "Geography"] }
      },
      {
        "title": "Ecology & Conservation",
        "careers": [
          { "name": "Wildlife Biologist", "description": "Studies the biology and behavior of wild animals and their habitats." },
          { "name": "Conservation Officer", "description": "Protects and manages natural resources and wildlife populations." },
          { "name": "Ecological Consultant", "description": "Provides expert advice on ecological issues and environmental impact assessments." }
        ],
        "gcse": { "mandatory": ["Biology", "Maths"], "helpful": ["Geography"] },
        "a_level": { "mandatory": ["Biology"], "helpful": ["Geography", "Chemistry"] }
      },
      {
        "title": "Sustainable Development",
        "careers": [
          { "name": "Urban Planner", "description": "Designs and manages the development of urban areas and communities." },
          { "name": "NGO Program Lead", "description": "Manages and coordinates programs for non-governmental organizations." },
          { "name": "CSR Manager", "description": "Manages organizations' corporate social responsibility programs and initiatives." }
        ],
        "gcse": { "mandatory": ["Geography", "English"], "helpful": ["Business"] },
        "a_level": { "mandatory": ["Geography or Economics"], "helpful": ["Sociology", "Politics"] }
      }
    ]
  },
  {
    "id": "creative-engine",
    "world_name": "The Creative Engine",
    "description": "Turn imagination into reality through digital media.",
    "courses": [
      {
        "title": "Digital Media & Animation",
        "careers": [
          { "name": "VFX Artist", "description": "Creates visual effects for film, television, and other digital media." },
          { "name": "UX Designer", "description": "Designs the user interface and experience for digital products and services." },
          { "name": "Character Animator", "description": "Creates the movement and performance of digital characters for animation." }
        ],
        "gcse": { "mandatory": ["Art or Graphics", "English"], "helpful": ["Media Studies"] },
        "a_level": { "mandatory": ["Art or Media"], "helpful": ["Photography"] }
      },
      {
        "title": "Architecture",
        "careers": [
          { "name": "Architect", "description": "Designs and oversees the construction of buildings and other structures." },
          { "name": "Urban Designer", "description": "Designs the layout and appearance of urban areas and public spaces." },
          { "name": "BIM Coordinator", "description": "Manages the use of Building Information Modeling (BIM) in construction projects." }
        ],
        "gcse": { "mandatory": ["Maths", "Art"], "helpful": ["Physics"] },
        "a_level": { "mandatory": ["Art or Graphics"], "helpful": ["Maths", "Physics"] }
      },
      {
        "title": "Graphic Design",
        "careers": [
          { "name": "Brand Identity Designer", "description": "Creates the visual identity and branding for organizations and products." },
          { "name": "Art Director", "description": "Oversees the visual style and artistic direction of creative projects." },
          { "name": "UI Specialist", "description": "Designs the user interface for digital products and services." }
        ],
        "gcse": { "mandatory": ["Art", "English"], "helpful": ["ICT"] },
        "a_level": { "mandatory": ["Art or Graphics"], "helpful": ["Media Studies"] }
      },
      {
        "title": "Film & Television Production",
        "careers": [
          { "name": "Director", "description": "Oversees the creative and artistic direction of film and television productions." },
          { "name": "Cinematographer", "description": "Manages the camera and lighting for film and television productions." },
          { "name": "Post-Production Lead", "description": "Oversees the editing and final production of film and television projects." }
        ],
        "gcse": { "mandatory": ["English", "Media"], "helpful": ["Drama"] },
        "a_level": { "mandatory": ["Media Studies or English Lit"], "helpful": ["Drama", "Photography"] }
      }
    ]
  },
  {
    "id": "life-lab",
    "world_name": "The Life Lab",
    "description": "Discover cures and treat patients at the cutting edge.",
    "courses": [
      {
        "title": "Medicine",
        "careers": [
          { "name": "Surgeon", "description": "Performs medical operations to treat injuries, diseases, and deformities." },
          { "name": "GP", "description": "Provides primary medical care and manages the health of patients." },
          { "name": "Medical Researcher", "description": "Conducts research to develop new medical treatments and technologies." }
        ],
        "gcse": { "mandatory": ["Triple Science (7+)", "Maths"], "helpful": ["English"] },
        "a_level": { "mandatory": ["Chemistry", "Biology"], "helpful": ["Maths", "Physics"] }
      },
      {
        "title": "Biomedical Science",
        "careers": [
          { "name": "Geneticist", "description": "Studies genes and heredity to understand and treat genetic disorders." },
          { "name": "Biomedical Researcher", "description": "Conducts research into the biological processes that underlie human health and disease." },
          { "name": "Laboratory Lead", "description": "Manages and coordinates the operations of a medical or scientific laboratory." }
        ],
        "gcse": { "mandatory": ["Combined Science", "Maths"], "helpful": ["ICT"] },
        "a_level": { "mandatory": ["Biology", "Chemistry"], "helpful": ["Maths"] }
      },
      {
        "title": "Pharmacy & Pharmacology",
        "careers": [
          { "name": "Pharmacologist", "description": "Studies the effects of drugs on biological systems and develops new medications." },
          { "name": "Clinical Pharmacist", "description": "Provides expert advice on the use of medications in a clinical setting." },
          { "name": "Drug Developer", "description": "Manages the development and testing of new pharmaceutical products." }
        ],
        "gcse": { "mandatory": ["Chemistry", "Maths"], "helpful": ["Biology"] },
        "a_level": { "mandatory": ["Chemistry"], "helpful": ["Biology", "Maths"] }
      },
      {
        "title": "Biochemistry",
        "careers": [
          { "name": "Molecular Biologist", "description": "Studies the molecular basis of biological processes and systems." },
          { "name": "Toxicologist", "description": "Studies the effects of toxic substances on biological systems and environments." },
          { "name": "Forensic Scientist", "description": "Applies scientific principles to criminal investigations and legal proceedings." }
        ],
        "gcse": { "mandatory": ["Chemistry", "Biology"], "helpful": ["Maths"] },
        "a_level": { "mandatory": ["Chemistry", "Biology or Maths"], "helpful": ["Physics"] }
      }
    ]
  },
  {
    "id": "value-exchange",
    "world_name": "The Value Exchange",
    "description": "Navigate global markets and lead businesses.",
    "courses": [
      {
        "title": "Economics & Finance",
        "careers": [
          { "name": "Investment Banker", "description": "Manages financial transactions and provides expert advice on investments." },
          { "name": "FinTech Product Manager", "description": "Manages the development and launch of financial technology products." },
          { "name": "Economic Analyst", "description": "Analyzes economic data to identify trends and inform policy and strategy." }
        ],
        "gcse": { "mandatory": ["Maths (7+)", "English"], "helpful": ["Business"] },
        "a_level": { "mandatory": ["Maths"], "helpful": ["Economics", "Further Maths"] }
      },
      {
        "title": "Accounting & Actuarial Science",
        "careers": [
          { "name": "Actuary", "description": "Uses mathematical and statistical methods to assess and manage financial risk." },
          { "name": "Chartered Accountant", "description": "Provides expert financial advice and manages organizations' accounts." },
          { "name": "Risk Analyst", "description": "Identifies and assesses potential risks to organizations' operations and finances." }
        ],
        "gcse": { "mandatory": ["Maths", "English"], "helpful": ["Business"] },
        "a_level": { "mandatory": ["Maths"], "helpful": ["Business Studies", "Economics"] }
      },
      {
        "title": "Business Management",
        "careers": [
          { "name": "CEO", "description": "Oversees the overall management and strategic direction of an organization." },
          { "name": "Operations Lead", "description": "Manages and coordinates the daily operations of an organization." },
          { "name": "Management Consultant", "description": "Provides expert advice to organizations on how to improve their performance." }
        ],
        "gcse": { "mandatory": ["English", "Maths"], "helpful": ["Business"] },
        "a_level": { "mandatory": ["Business or Economics"], "helpful": ["Maths", "Psychology"] }
      },
      {
        "title": "Marketing & Consumer Behavior",
        "careers": [
          { "name": "Marketing Director", "description": "Oversees the marketing and promotional activities of an organization." },
          { "name": "Brand Strategist", "description": "Develops and implements strategies to build and manage brand identity." },
          { "name": "Market Researcher", "description": "Conducts research to understand consumer behavior and market trends." }
        ],
        "gcse": { "mandatory": ["English", "Maths"], "helpful": ["Media"] },
        "a_level": { "mandatory": ["Business or Media"], "helpful": ["Psychology", "Sociology"] }
      }
    ]
  },
  {
    "id": "power-grid",
    "world_name": "The Power Grid",
    "description": "Influence society through politics and philosophy.",
    "courses": [
      {
        "title": "Philosophy, Politics & Economics",
        "careers": [
          { "name": "NGO Leader", "description": "Oversees the management and strategic direction of a non-governmental organization." },
          { "name": "Journalist", "description": "Researches, writes, and reports on news and current events for various media." },
          { "name": "Policy Advisor", "description": "Provides expert advice on policy issues to government and other organizations." }
        ],
        "gcse": { "mandatory": ["English", "Maths"], "helpful": ["Religious Studies"] },
        "a_level": { "mandatory": ["History or Politics"], "helpful": ["Philosophy", "Maths"] }
      },
      {
        "title": "Sociology & Social Policy",
        "careers": [
          { "name": "Social Researcher", "description": "Conducts research into social issues and trends to inform policy and practice." },
          { "name": "Community Lead", "description": "Manages and coordinates community-based programs and initiatives." },
          { "name": "Public Relations Officer", "description": "Manages the public image and communications of an organization." }
        ],
        "gcse": { "mandatory": ["English", "History"], "helpful": ["Sociology"] },
        "a_level": { "mandatory": ["Sociology or Psychology"], "helpful": ["History", "English Lit"] }
      },
      {
        "title": "International Relations",
        "careers": [
          { "name": "Diplomat", "description": "Represents their country's interests and manages international relations." },
          { "name": "Global Security Analyst", "description": "Analyzes global security threats and develops strategies to address them." },
          { "name": "Foreign Correspondent", "description": "Reports on news and current events from foreign countries for media organizations." }
        ],
        "gcse": { "mandatory": ["History", "Languages"], "helpful": ["English"] },
        "a_level": { "mandatory": ["History or Politics"], "helpful": ["Modern Languages"] }
      },
      {
        "title": "Philosophy",
        "careers": [
          { "name": "Ethicist", "description": "Studies ethical issues and provides expert advice on moral dilemmas." },
          { "name": "Legal Researcher", "description": "Conducts research into legal issues and provides support for legal proceedings." },
          { "name": "Academic", "description": "Conducts research and teaches in a university or other academic institution." }
        ],
        "gcse": { "mandatory": ["English", "Religious Studies"], "helpful": ["History"] },
        "a_level": { "mandatory": ["Philosophy or Religious Studies"], "helpful": ["English Lit", "History"] }
      }
    ]
  },
  {
    "id": "global-bridge",
    "world_name": "The Global Bridge",
    "description": "Connect the world through languages and culture.",
    "courses": [
      {
        "title": "Modern Languages & Business",
        "careers": [
          { "name": "International Lead", "description": "Manages and coordinates an organization's international operations and relations." },
          { "name": "Intelligence Officer", "description": "Collects and analyzes information to support national security and defense." },
          { "name": "Global Trade Lead", "description": "Manages and coordinates an organization's international trade activities." }
        ],
        "gcse": { "mandatory": ["A Language", "English"], "helpful": ["Business"] },
        "a_level": { "mandatory": ["At least one MFL"], "helpful": ["Business", "History"] }
      },
      {
        "title": "Linguistics",
        "careers": [
          { "name": "Computational Linguist", "description": "Develops computer systems that can understand and process human language." },
          { "name": "Speech Therapist", "description": "Diagnoses and treats communication and swallowing disorders." },
          { "name": "Translator", "description": "Converts written text from one language to another." }
        ],
        "gcse": { "mandatory": ["English", "A Language"], "helpful": ["Maths"] },
        "a_level": { "mandatory": ["English Lit or a Language"], "helpful": ["Psychology", "Maths"] }
      },
      {
        "title": "Translation & Interpreting",
        "careers": [
          { "name": "Conference Interpreter", "description": "Provides real-time interpretation for international conferences and meetings." },
          { "name": "Localization Specialist", "description": "Adapts products and services for different languages and cultures." },
          { "name": "Subtitler", "description": "Creates subtitles for film, television, and other digital media." }
        ],
        "gcse": { "mandatory": ["Two Languages", "English"], "helpful": ["ICT"] },
        "a_level": { "mandatory": ["Two MFLs"], "helpful": ["English Lit"] }
      },
      {
        "title": "Area Studies (e.g., East Asian Studies)",
        "careers": [
          { "name": "Cultural Consultant", "description": "Provides expert advice on cultural issues and cross-cultural communication." },
          { "name": "Foreign Service Officer", "description": "Represents their country's interests and manages international relations." },
          { "name": "International NGO Lead", "description": "Manages and coordinates programs for international non-governmental organizations." }
        ],
        "gcse": { "mandatory": ["History", "English"], "helpful": ["Languages"] },
        "a_level": { "mandatory": ["History or English Lit"], "helpful": ["A Language"] }
      }
    ]
  }
];
