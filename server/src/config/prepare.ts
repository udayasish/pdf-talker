import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "./embeddings.js";

export async function IndexTheDocument(filePath: string, fileName: string) {
  try {
    const singleDocPerFileLoader = new PDFLoader(filePath, {
      splitPages: false,
    });

    // console.log("1");

    const singleDoc = await singleDocPerFileLoader.load();
    //   console.log(singleDoc);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const splitDocs = await textSplitter.splitDocuments(singleDoc);
    // console.log("2");

    const documents = splitDocs.map((chunk) => {
      return {
        pageContent: chunk.pageContent,
        metadata: {
          ...singleDoc[0].metadata,
          fileName: fileName,
        },
      };
    });
  
    // Create namespace from filename (remove extension and sanitize)
    const namespace = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");

    const res = await vectorStore.addDocuments(documents, {
      namespace: namespace
    });
    console.log("from prepare: ", res);

    return res;
  } catch (error) {
    console.log(error);
  }
}
