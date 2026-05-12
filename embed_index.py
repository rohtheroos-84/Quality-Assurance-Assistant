# embed_index.py
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from load_docs import extract_text_from_pdfs
from qa_bot import get_embeddings  # must return an object with embed_documents & embed_query

INDEX_DIR = "vector_index"

def safe_delete_index(path=INDEX_DIR):
    if os.path.exists(path):
        shutil.rmtree(path)

def build_faiss_index():
    safe_delete_index()

    docs = extract_text_from_pdfs("pdf/")
    texts = [d["content"] for d in docs]
    metas = [{"source": d["filename"]} for d in docs]

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents(texts, metadatas=metadata)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    db = FAISS.from_documents(chunks, embeddings)
    db.save_local("vector_index")

if __name__ == "__main__":
    build_faiss_index()
    test_load_and_query()
