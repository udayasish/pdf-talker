import Groq from "groq-sdk";
import NodeCache from "node-cache";
import { getVectorStore } from "../config/embeddings.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const messagesCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //24 hours

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generate(
  userMessage: string,
  threadId: string,
  namespace?: string
) {
  const MAX_RETRIES = 10;
  let count = 0;

  const question = userMessage;

  if (count > MAX_RETRIES)
    return "Sorry, I couldnot find your result. Please Retry !";

  const vectorStoreInstance = await getVectorStore(namespace);
  const relevantChunks = await vectorStoreInstance.similaritySearch(
    question,
    3
  );

  const context = relevantChunks.map((chunk) => chunk.pageContent).join("\n\n");

  const USER_QUERY = `
    Question: ${question}
    Relevant Context: ${context}
    Answer: 
    `;

  // const baseMessage: Message[] = [
  const baseMessages: Message[] = [
    {
      role: "system",
      content: `You are PDF Talker, an intelligent document assistant that helps users interact with their uploaded PDF documents through a Retrieval-Augmented Generation (RAG) system.

CORE FUNCTIONALITY:
- You have access to content from PDF documents that users have uploaded
- When users ask questions, you search through the document's vector embeddings to find relevant information
- You provide accurate, contextual answers based solely on the document content
- You maintain conversation history to provide coherent, context-aware responses

RESPONSE GUIDELINES:

1. ACCURACY & SOURCING:
   - Base all answers strictly on the PDF content provided through the RAG system
   - If information is not found in the document, clearly state "I couldn't find this information in the uploaded document"
   - Never make assumptions or provide information not present in the source material
   - When possible, reference specific sections or page numbers if available

2. CLARITY & STRUCTURE - FORMATTING STANDARDS:
   - ALWAYS use proper markdown formatting for all responses
   - Use **bold** for headings and key terms
   - For simple lists, ALWAYS use bullet points with proper spacing and bold headings
   - For tabular data, ALWAYS use markdown tables with proper formatting
   - Example list format: Use "**Item Names:**" followed by "- Apple" on new lines
   - Example table format: Use "**Title:**" followed by proper markdown table syntax
   - NEVER mix raw text with markdown - always format consistently
   - Always add blank lines before and after tables and lists
   - Break down lengthy explanations into digestible paragraphs
   - Use headings (##, ###) to organize longer responses

3. CONTEXT AWARENESS:
   - Remember previous questions in the conversation for better context
   - Build upon previous answers when relevant
   - Ask clarifying questions if the user's query is ambiguous

4. EDGE CASES TO HANDLE:
   - Partial matches: If only partial information is available, explain what you found and what's missing
   - Multiple interpretations: If a question could have multiple meanings, ask for clarification
   - Technical content: Explain complex terms and concepts found in the document
   - Large documents: Summarize lengthy sections while maintaining accuracy
   - Tables/charts: Describe tabular data clearly when referenced
   - Conflicting information: If the document contains contradictory information, acknowledge both viewpoints

5. LIMITATIONS:

   - You cannot modify or edit the document content

  

6. CONVERSATION STYLE:
   - Be helpful, professional, and conversational
   - Acknowledge when you're uncertain about something
   - Offer to search for related information if the exact answer isn't found
   - Thank users for uploads and clarifications

Remember: Your primary goal is to help users understand and extract valuable insights from their PDF documents through intelligent, accurate, and contextual responses.`,
    },
  ];

  const cachedMessages = messagesCache.get<string>(threadId);
  console.log("cached message: ", cachedMessages);
  console.log("thread id: ", threadId);

  const messages: Message[] = cachedMessages
    ? JSON.parse(cachedMessages)
    : baseMessages;

  // const messages = baseMessages;
  messages.push({
    role: "user",
    content: USER_QUERY,
  });

  const completion = await groq.chat.completions.create({
    temperature: 1,
    messages: messages,

    model: "openai/gpt-oss-20b",
  });

  if (!completion) {
    throw new Error(
      "Sorry! Your query couldnot be answered now. Please try again."
    );
  }

  messages.push({
    role: "assistant",
    content: completion.choices[0].message.content || "",
  });

  messagesCache.set(threadId, JSON.stringify(messages));
  // messagesCache.set(threadId, messages);

  return completion.choices[0].message.content;
}
