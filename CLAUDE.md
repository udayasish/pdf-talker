# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a **PDF Talker** application - a full-stack AI-powered document chat system that allows users to interact with PDF documents through RAG (Retrieval-Augmented Generation).

### High-Level Architecture
- **Client**: Next.js 15 (React 19) frontend with TypeScript, Tailwind CSS 4, and Turbopack
- **Server**: Express.js backend with TypeScript, utilizing LangChain for document processing
- **AI Stack**: OpenAI embeddings + Groq LLM + Pinecone vector database
- **Document Processing**: PDF parsing, text chunking, and vector storage pipeline

### Key Components

**Server (Express + TypeScript):**
- `server/src/server.ts`: Main Express server with `/index-document` and `/chat` endpoints
- `server/src/config/prepare.ts`: PDF document indexing pipeline (load → chunk → embed → store)
- `server/src/config/embeddings.ts`: Pinecone vector store configuration with OpenAI embeddings
- `server/src/chat/chat.ts`: RAG-powered chat interface using Groq LLM with similarity search

**Client (Next.js):**
- Landing page with components: Highlight, Spotlight, ProductInfo, Pricing, Footer
- `/chat` page with PdfChat component for document interaction
- FileUpload component with react-dropzone integration
- Motion/Framer Motion animations throughout UI

## Development Commands

### Server
```bash
cd server
npm run build      # Compile TypeScript to dist/
npm run dev        # Development with tsc-watch and auto-restart
npm run start      # Run production build from dist/
```

### Client
```bash
cd client
npm run dev        # Next.js dev server with Turbopack on port 3001
npm run build      # Production build with Turbopack
npm run start      # Serve production build
npm run lint       # ESLint (basic command)
```

## Environment Configuration

**Server requires `.env` file:**
- `GROQ_API_KEY`: Groq API key for LLM inference
- `PINECONE_INDEX`: Pinecone index name for vector storage
- OpenAI API key (inferred from LangChain OpenAI usage)

**Note**: Pinecone API key is currently hardcoded in `embeddings.ts` (line 14) - should be moved to environment variables.

## Technical Stack Details

**Document Processing Pipeline:**
1. PDF loaded via LangChain PDFLoader (splitPages: false)
2. Text split using RecursiveCharacterTextSplitter (chunk size: 500, overlap: 100)
3. Documents embedded using OpenAI text-embedding-3-small (512 dimensions)
4. Vectors stored in Pinecone with metadata preservation

**RAG Chat Flow:**
1. User query → similarity search (top 3 chunks)
2. Context compilation → Groq LLM (openai/gpt-oss-20b model)
3. Specialized system prompt for PDF document assistant behavior
4. Response generation with conversation memory support

**Client Architecture:**
- App Router (Next.js 13+) with TypeScript
- Component-based architecture with reusable UI elements
- Tailwind CSS 4 with PostCSS integration
- Motion library for animations
- File upload handling with drag-and-drop support