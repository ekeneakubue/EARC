export const site = {
  name: "Education And Research Consortium",
  shortName: "EARC",
  tagline: "Transforming data into knowledge, knowledge into action.",
  email: "info@earc.org",
  location: "Africa & Beyond",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Our Story", href: "#story" },
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Commitment", href: "#commitment" },
  { label: "Contact", href: "#contact" },
] as const;

export const about = {
  title: "Who We Are",
  paragraphs: [
    "Education And Research Consortium (EARC) is a multidisciplinary research, education, and development organization dedicated to advancing evidence-based decision-making, capacity development, and sustainable community transformation. Founded on the belief that access to quality research, data, and professional skills should not be limited by geography or economic circumstances, EARC works to bridge the knowledge and capacity gap that exists in many underserved communities across Africa and beyond.",
    "We partner with educational institutions, government ministries, non-governmental organizations (NGOs), development agencies, researchers, scholars, and community-based organizations to design and implement innovative solutions that address educational, social, environmental, and developmental challenges. Through research, monitoring and evaluation, professional training, policy support, and community engagement, we empower institutions and individuals to generate knowledge, strengthen systems, and create measurable impact.",
    "At EARC, we recognize that sustainable development requires more than good intentions—it requires reliable evidence, robust data systems, skilled professionals, and informed decision-making. Our work is therefore centered on providing affordable, high-quality, and contextually relevant services that enable our clients to transform data into knowledge, knowledge into action, and action into lasting impact.",
  ],
} as const;

export const story = {
  title: "Our Story",
  chapters: [
    {
      chapter: 1,
      title: "Identifying the Gap",
      paragraph:
        "The Education And Research Consortium was established in response to the growing need for accessible research expertise, data analytics, and professional capacity development within educational and development sectors. While many organizations recognize the value of evidence-based planning and evaluation, limited access to technical expertise, analytical tools, and professional training often constrains their ability to achieve desired outcomes.",
      image: "/images/journey/chapter-1.jpg",
      alt: "Data analytics dashboard illustrating research and evaluation insights",
    },
    {
      chapter: 2,
      title: "Building Accessible Solutions",
      paragraph:
        "EARC was created to address these challenges by providing practical, affordable, and innovative research solutions that empower institutions and communities to become active producers and users of knowledge. We believe that high-quality research and analytical skills should be available to all stakeholders, regardless of location or resource constraints.",
      image: "/images/journey/chapter-2.jpg",
      alt: "Black professional reviewing research data and analytics on a tablet",
    },
    {
      chapter: 3,
      title: "Expanding Our Reach",
      paragraph:
        "Today, EARC continues to expand its reach by supporting educational reforms, strengthening monitoring and evaluation systems, advancing environmental sustainability initiatives, and equipping professionals with cutting-edge analytical and technological competencies required in the modern knowledge economy.",
      image: "/images/journey/chapter-3.jpg",
      alt: "Black professional leading a training session at a whiteboard",
    },
  ],
} as const;

export const services = [
  {
    id: "educational-research",
    title: "Educational Research and Consultancy",
    description:
      "We provide comprehensive educational consultancy services designed to improve the quality, effectiveness, and relevance of educational programs and institutions.",
    items: [
      "Curriculum development",
      "Academic quality assurance",
      "Educational assessments & learning evaluations",
      "Institutional reviews & policy analysis",
      "Research project support",
    ],
    note: "We collaborate with universities, colleges, schools, ministries of education, and development partners to strengthen educational systems and improve learning outcomes through evidence-based interventions.",
  },
  {
    id: "mel",
    title: "Monitoring, Evaluation, and Learning (MEL)",
    description:
      "EARC offers professional Monitoring, Evaluation, and Learning services to governments, NGOs, donor-funded projects, and educational institutions.",
    items: [
      "MEL framework design",
      "Indicator development",
      "Baseline, midline, and endline studies",
      "Program effectiveness evaluation",
      "Actionable insights for continuous improvement",
    ],
    note: "Our MEL services help organizations measure impact, improve accountability, and make informed decisions that maximize development outcomes.",
  },
  {
    id: "research-analytics",
    title: "Research Design, Data Collection, and Analytics",
    description:
      "We support clients throughout the entire research cycle—from concept development and proposal writing to data collection, analysis, interpretation, and dissemination.",
    items: [
      "Survey design and implementation",
      "Impact evaluations & needs assessments",
      "Policy research",
      "Experimental and quasi-experimental studies",
      "Mixed-methods research",
      "Statistical analysis and modeling",
      "Academic and scientific writing",
    ],
    note: "We utilize advanced analytical tools and software to ensure rigorous and reliable results that meet international research standards.",
  },
  {
    id: "training",
    title: "Professional Training and Capacity Development",
    description:
      "A core component of our mission is building the capacity of individuals and institutions to conduct high-quality research and data-driven decision-making.",
    items: [
      "SPSS, R Statistics, Python for Data Science",
      "GIS & Spatial Analysis (ArcGIS Pro, QGIS, GEE)",
      "Tableau, Power BI, KoboToolbox, ODK",
      "CLIMADA & Environmental Modeling Tools",
      "Monitoring and Evaluation Methods",
      "Research Methodology",
      "Academic Writing and Publication",
    ],
    note: "Our training programs combine theoretical understanding with practical application, ensuring participants acquire skills immediately transferable to their professional environments.",
  },
  {
    id: "geospatial",
    title: "Geospatial and Environmental Analytics",
    description:
      "EARC leverages geospatial technologies, remote sensing, and environmental data science to support sustainable development planning and environmental management.",
    items: [
      "Geographic Information Systems (GIS)",
      "Remote sensing and satellite image analysis",
      "Environmental impact assessment",
      "Climate risk analysis",
      "Ecosystem mapping and monitoring",
      "Natural resource management",
      "Land-use planning",
      "Environmental data visualization",
    ],
    note: "By integrating geospatial intelligence with research and policy analysis, we provide innovative solutions to complex environmental and development challenges.",
  },
  {
    id: "community",
    title: "Environmental Sustainability and Community Development",
    description:
      "We are committed to promoting sustainable communities through environmental education, advocacy, and policy support.",
    items: [
      "Environmental awareness and education",
      "Climate change adaptation and resilience",
      "Community-based environmental monitoring",
      "Biodiversity conservation",
      "Sustainable resource management",
      "Ecosystem protection",
      "Environmental advocacy campaigns",
      "Community participation in environmental decision-making",
    ],
    note: "We work closely with communities, schools, civil society organizations, and policymakers to foster environmental stewardship and sustainable development practices.",
  },
  {
    id: "policy",
    title: "Environmental Policy and Strategic Advisory Services",
    description:
      "EARC provides technical support for the design, review, implementation, and evaluation of environmental and educational policies.",
    items: [
      "Policy research and analysis",
      "Stakeholder consultations",
      "Regulatory assessments",
      "Strategic planning",
      "Evidence synthesis",
      "Policy monitoring and evaluation",
      "Environmental governance support",
    ],
    note: "We help decision-makers develop policies that are informed by scientific evidence, community needs, and sustainable development principles.",
  },
] as const;

export type Service = (typeof services)[number];

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getAllServiceIds(): string[] {
  return services.map((service) => service.id);
}

export const approach = {
  title: "Our Approach",
  intro:
    "At EARC, our work is guided by a commitment to excellence, innovation, collaboration, and social impact. We adopt a multidisciplinary approach that integrates research, technology, education, policy, and community engagement to address complex development challenges.",
  detail:
    "By combining local knowledge with global best practices, we develop solutions that are both scientifically rigorous and contextually relevant.",
  pillars: [
    "Evidence-based decision-making",
    "Capacity strengthening",
    "Inclusive participation",
    "Technological innovation",
    "Ethical practice",
    "Sustainable development",
    "Community empowerment",
  ],
} as const;

export const commitment = {
  title: "Our Commitment",
  paragraphs: [
    "We are committed to making high-quality research, data analytics, and professional development opportunities accessible to individuals and organizations that need them most. Through our services, partnerships, and training programs, we seek to empower researchers, educators, institutions, governments, and communities to generate evidence, solve problems, and create sustainable change.",
    "At Education And Research Consortium, we believe that knowledge is a powerful tool for transformation. By strengthening research capacity, advancing educational excellence, supporting environmental sustainability, and promoting evidence-based policies, we contribute to building a future where informed decisions lead to stronger institutions, resilient communities, and sustainable development for all.",
  ],
} as const;

export const stats = [
  { value: "7+", label: "Core Service Areas" },
  { value: "15+", label: "Training Programs" },
  { value: "Global", label: "Research Standards" },
  { value: "Africa+", label: "Regional Focus" },
] as const;

export const partners = [
  "Universities & Colleges",
  "Government Ministries",
  "NGOs & Development Agencies",
  "Community Organizations",
  "Researchers & Scholars",
] as const;
