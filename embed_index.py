import os
import genai
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from load_docs import extract_text_from_pdfs

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

_EMBED_CACHE = {}

class GeminiEmbeddings:
    def __init__(self, model: str = "models/text-embedding-004"):
        self.model = model

    def _embed(self, text: str) -> np.ndarray:
        if text in _EMBED_CACHE:
            return _EMBED_CACHE[text]
        res = genai.embed_content(model=self.model, content=text)
        emb = np.array(res["embedding"], dtype=np.float32)
        _EMBED_CACHE[text] = emb
        return emb

    def embed_documents(self, texts):
        return [self._embed(t).tolist() for t in texts]

    def embed_query(self, text):
        return self._embed(text).tolist()

def build_faiss_index():
    docs = extract_text_from_pdfs("pdf/")

    texts = [d["content"] for d in docs]
    metadata = [{"source": d["filename"]} for d in docs]

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents(texts, metadatas=metadata)

    embeddings = GeminiEmbeddings(model="models/text-embedding-004")
    db = FAISS.from_documents(chunks, embeddings)
    db.save_local("vector_index")

if __name__ == "__main__":
    build_faiss_index()
