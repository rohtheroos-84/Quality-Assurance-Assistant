# embed_index.py
import os
import shutil
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
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
    chunks = splitter.create_documents(texts, metadatas=metas)

    emb_obj = get_embeddings()  # GeminiEmbeddings-like object

    # Pass the object for building (this matches your environment)
    db = FAISS.from_documents(chunks, embedding=emb_obj)
    db.save_local(INDEX_DIR)
    print("Built and saved index to", INDEX_DIR)

def load_index_with_fallback(emb_obj):
    """
    Try multiple load signatures and ensure that embedding_function is a callable.
    Prefer to pass emb_obj.embed_query as embedding_function so internal code
    calls a function (avoids 'object is not callable').
    """
    emb_callable = getattr(emb_obj, "embed_query", None)

    # Try preferred approach: give callable
    try:
        return FAISS.load_local(
            INDEX_DIR,
            embedding_function=emb_callable,
            allow_dangerous_deserialization=True
        )
    except Exception:
        pass

    # Next, try passing the object under 'embeddings' (newer APIs)
    try:
        return FAISS.load_local(
            INDEX_DIR,
            embeddings=emb_obj,
            allow_dangerous_deserialization=True
        )
    except Exception:
        pass

    # Fallback: try 'embedding' keyword (older APIs)
    try:
        return FAISS.load_local(
            INDEX_DIR,
            embedding=emb_obj,
            allow_dangerous_deserialization=True
        )
    except Exception as e:
        raise RuntimeError("Failed to load FAISS index with any fallback") from e

def test_load_and_query():
    emb_obj = get_embeddings()
    db = load_index_with_fallback(emb_obj)

    # Ensure the store has a callable for embedding; if not, force it
    if not callable(getattr(db, "embedding_function", None)):
        # replace the attribute with the callable version
        if getattr(emb_obj, "embed_query", None):
            db.embedding_function = emb_obj.embed_query

    res = db.similarity_search("hello", k=2)
    print("Sample search results:", res[:1])

if __name__ == "__main__":
    build_faiss_index()
    test_load_and_query()
