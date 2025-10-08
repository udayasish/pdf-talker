import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  dimensions: 512,
});

// const pinecone = new PineconeClient();
const pinecone = new PineconeClient({
  apiKey:
    "pcsk_6NAc4Q_9E45At54uHLq7C27JSk2hSDvfqyt6swiCaWUPBEittgm3pzgN2XMSPJCv7drwwG",
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

// console.log("pineconeIndex: ", pineconeIndex);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function getVectorStore(namespace?: string) {
  if (!namespace) {
    return vectorStore;
  }

  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    namespace,
  });
}
