import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
const isDemoMode = !apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_key_here' || apiKey.trim() === 'your_gemini_api_key_here';

let aiClient: GoogleGenAI | null = null;
if (!isDemoMode) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client, falling back to Demo Mode.');
  }
}

export const getAIStatus = () => {
  return {
    mode: isDemoMode ? 'demo' : 'live',
    message: isDemoMode ? 'Running in Demo Mode (Mock AI active)' : 'Connected to Gemini AI API',
  };
};

// 1. AI Tutor Response
export const generateTutorResponse = async (
  userMessage: string,
  subject: string = 'General',
  history: { sender: string; text: string }[] = []
): Promise<string> => {
  if (!isDemoMode && aiClient) {
    try {
      const formattedHistory = history
        .slice(-6)
        .map((h) => `${h.sender === 'user' ? 'User' : 'Gemini AI'}: ${h.text}`)
        .join('\n');

      const prompt = `You are Gemini, an intelligent, articulate, and friendly AI study assistant powering StudyGenius.
Subject Context: ${subject}

Previous Conversation:
${formattedHistory}

User Query: ${userMessage}

Respond in the signature Google Gemini AI persona:
- Friendly, direct, encouraging, and intelligent tone.
- Clear structured Markdown with headers (###), bold key terms, and bullet points.
- Provide a concise explanation first, followed by code/examples if relevant.
- Include a 💡 **Gemini Recommendation** section at the end suggesting the next logical study step or practice quiz.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
      });
      if (response.text) return response.text;
    } catch (err) {
      console.warn('Gemini API call failed, using demo fallback:', err);
    }
  }

  // Fallback Demo Response
  return generateMockTutorResponse(userMessage, subject);
};

// 2. PDF Summarizer AI Generator
export const generatePDFSummary = async (pdfText: string, fileName: string) => {
  if (!isDemoMode && aiClient) {
    try {
      const prompt = `Analyze the following study material text from "${fileName}".
Provide a JSON output with the exact format:
{
  "title": "Title of the topic",
  "summaryText": "A comprehensive 2-3 paragraph summary",
  "importantPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "keyTerms": [{"term": "Term 1", "definition": "Def 1"}, {"term": "Term 2", "definition": "Def 2"}],
  "reviewQuestions": ["Question 1?", "Question 2?"],
  "shortNotes": "Quick bullet notes for revision"
}

Document Text:
${pdfText.slice(0, 8000)}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
      });

      if (response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.warn('Gemini PDF summary failed, using mock:', err);
    }
  }

  return generateMockPDFSummary(fileName, pdfText);
};

// 3. Quiz AI Generator
export const generateQuizAI = async (
  subject: string,
  topic: string,
  numQuestions: number = 5,
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
) => {
  if (!isDemoMode && aiClient) {
    try {
      const prompt = `Generate a ${difficulty} difficulty multiple choice quiz on the topic "${topic}" in subject "${subject}".
Generate exactly ${numQuestions} questions.
Return ONLY valid JSON formatted as:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why Option A is correct."
  }
]`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
      });

      if (response.text) {
        const jsonMatch = response.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.warn('Gemini Quiz generator failed, using mock:', err);
    }
  }

  return generateMockQuiz(subject, topic, numQuestions, difficulty);
};

// 4. Flashcards AI Generator
export const generateFlashcardsAI = async (topic: string, count: number = 6) => {
  if (!isDemoMode && aiClient) {
    try {
      const prompt = `Generate ${count} study flashcards for the topic "${topic}".
Return ONLY valid JSON format:
[
  {
    "question": "Question or term on front of card",
    "answer": "Clear, concise answer or definition on back"
  }
]`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
      });

      if (response.text) {
        const jsonMatch = response.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.warn('Gemini Flashcard generator failed, using mock:', err);
    }
  }

  return generateMockFlashcards(topic, count);
};

// MOCK GENERATORS FOR DEMO MODE
function generateMockTutorResponse(userMessage: string, subject: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `Hello! 👋 I'm **Gemini AI**, your study tutor for **${subject}**.

I can break down complex university topics, explain code step-by-step, or generate revision strategies for your exams.

💡 **Gemini Recommendation**: Ask me *"Explain Binary Search in C++"* or *"What is MongoDB indexing?"* to get started!`;
  }

  // C++ Code / C++ Programming Queries
  if (lowerMsg.includes('c++') || lowerMsg.includes('cpp')) {
    return `### C++ Fundamentals 💻 — Gemini Breakdown

**C++** is a powerful compiled programming language that combines low-level memory control with high-level object-oriented abstractions.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from Gemini AI Study Assistant! 🚀" << endl;
    return 0; // Standard exit status
}
\`\`\`

#### Key Concepts:
- \`#include <iostream>\`: Includes standard input/output stream capabilities (\`cin\`/\`cout\`).
- \`main()\`: Mandatory entry point for executable execution.

💡 **Gemini Recommendation**: Practice writing C++ functions and understanding pointer memory management next!`;
  }

  // Computer Science Definition
  if (lowerMsg.includes('computer science') || lowerMsg.includes('what is cs')) {
    return `### Computer Science (CS) 🌐 — Gemini Overview

**Computer Science** is the systematic study of computation, information processing, data structures, and software system architecture.

#### Core Pillars:
- **Algorithms & Data Structures**: Efficient problem-solving instructions and data storage.
- **Software Engineering**: Designing scalable, maintainable application systems.
- **Database Architecture**: Organizing and querying structured (SQL) and NoSQL datasets.

💡 **Gemini Recommendation**: Focus on Data Structures & Algorithms (DSA) — it forms the core of university exams and technical interviews!`;
  }

  if (lowerMsg.includes('database') || lowerMsg.includes('sql') || lowerMsg.includes('mongodb')) {
    return `### Database Systems 🗄️ — Gemini Breakdown

- **Relational Databases (SQL)**: Structured tables with fixed schemas and ACID transaction guarantees (e.g., PostgreSQL, MySQL).
- **NoSQL Databases (MongoDB)**: Document-oriented JSON/BSON storage for high horizontal scalability and flexible schemas.

💡 **Gemini Recommendation**: Design a database Schema or ER Diagram before writing queries for your projects!`;
  }

  return `### ${userMessage} 📘 — Gemini Explanation

**Core Concept**: ${userMessage} is a fundamental concept in **${subject}** focused on systematic computational logic and efficiency.

- **Primary Goal**: Ensures operational reliability, data consistency, and performance optimization.
- **Practical Application**: Applied in software engineering to build robust, scalable applications.

💡 **Gemini Recommendation**: Try generating a 5-question Quiz on **${userMessage}** in the Quizzes tab to test your active recall!`;
}

function generateMockPDFSummary(fileName: string, pdfText: string) {
  const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return {
    title: cleanTitle || 'Study Material Summary',
    summaryText: `This study document focuses on the core principles of ${cleanTitle}. It presents key theoretical models, architectural blueprints, and algorithmic patterns relevant for university exams. The text emphasizes practical application, system constraints, and performance optimization techniques.`,
    importantPoints: [
      `Primary focus on foundational mechanics and domain definitions in ${cleanTitle}.`,
      'Systematic breakdown of modern industry implementations and design trade-offs.',
      'Comparison between traditional synchronous workflows and optimized reactive architectures.',
      'Crucial exam takeaway: Focus on operational edge cases and error bounds.',
    ],
    keyTerms: [
      { term: 'Architecture Layer', definition: 'Structural organization dividing code into independent modular boundaries.' },
      { term: 'Throughput', definition: 'The rate of successful transaction processing over a given time period.' },
      { term: 'State Persistence', definition: 'Mechanism for retaining application data state across server restarts.' },
    ],
    reviewQuestions: [
      `What are the three primary objectives discussed in ${cleanTitle}?`,
      'How does state management impact overall system performance?',
      'Which trade-off is most critical when scaling throughput vs latency?',
    ],
    shortNotes: `• Topic: ${cleanTitle}\n• High Priority: Master key terminology & architectural boundaries.\n• Exam Tip: Review comparison tables and code snippets for practical questions.`,
  };
}

function generateMockQuiz(subject: string, topic: string, count: number, difficulty: string) {
  const questions = [
    {
      question: `What is the primary characteristic of "${topic}" in ${subject}?`,
      options: [
        'Modular abstraction and predictable performance',
        'Unbounded execution time without error handling',
        'Direct physical hardware override without operating system calls',
        'Global state mutation without thread safety',
      ],
      correctAnswer: 0,
      explanation: `Modular abstraction and predictable performance are essential principles when implementing ${topic} in modern software architecture.`,
    },
    {
      question: `Which data structure or model is optimal when working with ${topic}?`,
      options: [
        'Unsorted Linked List',
        'Hash Table / Dictionary',
        'Single Cell Variable',
        'Sequential File System Scan',
      ],
      correctAnswer: 1,
      explanation: 'Hash Tables provide O(1) average lookup time, making them the preferred data structure for indexed access.',
    },
    {
      question: `What is a common potential bottleneck in ${topic}?`,
      options: [
        'Memory leaks due to unmanaged references',
        'Excessive color contrast in UI',
        'Overly clear code documentation',
        'Static type checking at compile time',
      ],
      correctAnswer: 0,
      explanation: 'Unmanaged references or unclosed handles lead to memory leaks and resource exhaustion.',
    },
    {
      question: `When evaluating ${difficulty} scenarios in ${subject}, what should be prioritized?`,
      options: [
        'Security, correctness, and performance optimization',
        'Hardcoding arbitrary values',
        'Ignoring boundary condition tests',
        'Disabling server-side input validation',
      ],
      correctAnswer: 0,
      explanation: 'Correctness and robust security validation are non-negotiable standards for software systems.',
    },
    {
      question: `How can developers verify the reliability of ${topic}?`,
      options: [
        'Writing comprehensive unit, integration, and edge-case tests',
        'Deploying to production without testing',
        'Removing log trace output',
        'Increasing CPU clock speed manually',
      ],
      correctAnswer: 0,
      explanation: 'Comprehensive test suites ensure regression prevention and verify system stability under heavy load.',
    },
  ];

  return questions.slice(0, count);
}

function generateMockFlashcards(topic: string, count: number) {
  const cards = [
    {
      question: `What is the definition of ${topic}?`,
      answer: `${topic} refers to the core concepts and methodologies used to structure, process, and optimize study tasks and computing logic.`,
    },
    {
      question: `Key Principle of ${topic}`,
      answer: 'Separation of concerns, modular design, and efficient resource allocation.',
    },
    {
      question: `Common Advantage of ${topic}`,
      answer: 'Improves maintainability, reduces complexity, and boosts learning retention.',
    },
    {
      question: `What is a potential challenge with ${topic}?`,
      answer: 'Initial setup complexity and the requirement for consistent practice to master.',
    },
    {
      question: `Best Practice for ${topic}`,
      answer: 'Break down complex problems into smaller sub-problems and review iteratively.',
    },
    {
      question: `Exam Takeaway for ${topic}`,
      answer: 'Focus on understanding trade-offs and real-world application scenarios.',
    },
  ];

  return cards.slice(0, count);
}
