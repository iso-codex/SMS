import { BookOpen, GraduationCap, Rocket, Target, Globe, Award } from 'lucide-react';

export const programs = [
    {
        title: "Cambridge Checkpoint Preparation",
        description: "Primary and Secondary checkpoint examination tutors preparation.",
        extendedDescription: "Our Cambridge Checkpoint program offers rigorous preparation for both Primary and Lower Secondary checkpoint exams. We focus on building a strong foundation in core subjects, ensuring students are well-equipped to tackle the curriculum's demands. Our expert tutors use past papers and targeted exercises to boost confidence and performance, paving the way for IGCSE success.",
        icon: GraduationCap,
        color: "emerald",
        tags: ["Mathematics", "English", "Science"],
        students: "1,500+",
        delay: 0.1
    },
    {
        title: "Cambridge IGCSE Preparation",
        description: "International GCSE preparation with expert Cambridge tutors.",
        extendedDescription: "The IGCSE Preparation course is designed to guide students through the complexities of the International GCSE curriculum. We provide comprehensive support across a wide range of subjects, helping students understand key concepts, master exam techniques, and achieve top grades. Our personalized approach ensures that every student receives the attention they need to excel.",
        icon: BookOpen,
        color: "violet",
        tags: ["Mathematics", "Sciences", "Languages", "Business Studies", "ICT"],
        students: "2,200+",
        delay: 0.2
    },
    {
        title: "11+ Entrance Preparation",
        description: "UK Grammar & Independent school entrance exam preparation.",
        extendedDescription: "Secure a spot at top UK Grammar and Independent schools with our specialized 11+ Entrance Preparation. We cover all four main areas: English, Mathematics, Verbal Reasoning, and Non-Verbal Reasoning. Our strategic coaching familiarizes students with various exam formats, improving speed and accuracy under time pressure.",
        icon: Target,
        color: "amber",
        tags: ["English", "Maths", "Verbal Reasoning", "Non-Verbal Reasoning"],
        students: "800+",
        delay: 0.3
    },
    {
        title: "IELTS Preparation",
        description: "Academic and General Training IELTS preparation.",
        extendedDescription: "Whether you need IELTS for university admission or migration, our preparation course covers all four modules: Listening, Reading, Writing, and Speaking. We provide authentic practice materials, feedback on writing tasks, and mock speaking tests to help you achieve your target band score. Our strategies focus on time management and understanding the specific requirements of the test.",
        icon: Globe,
        color: "cyan",
        tags: ["Listening", "Reading", "Writing", "Speaking"],
        students: "1,800+",
        delay: 0.4
    },
    {
        title: "SAT Preparation",
        description: "US college admissions standardized test preparation.",
        extendedDescription: "Prepare for US college success with our intensive SAT coaching. We break down the Evidence-Based Reading and Writing and Math sections, teaching critical strategies to tackle complex questions. Our program includes diagnostic tests to identify strengths and weaknesses, allowing for a tailored study plan that maximizes score improvement.",
        icon: Rocket,
        color: "rose",
        tags: ["Reading", "Writing", "Mathematics"],
        students: "600+",
        delay: 0.5
    },
    {
        title: "A-Level Support",
        description: "In-depth advanced level tutoring across STEM and Humanities for university preparation.",
        extendedDescription: "Our A-Level Support program provides advanced tutoring for students aiming for top universities. We offer in-depth subject knowledge and exam preparation for both AS and A2 levels. Our tutors foster critical thinking and analytical skills, ensuring students not only understand the material but can apply it effectively in exams and future academic pursuits.",
        icon: Award,
        color: "blue",
        tags: ["Cognitive Abilities", "Achievement Tests", "Critical Thinking", "Subject Mastery"],
        students: "400+",
        delay: 0.6
    }
];
