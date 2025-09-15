from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
from typing import Dict, Any, List, Optional
from qa_bot import ask_bot_with_escalation, ask_bot_with_tool_generation
import fitz
import pandas as pd
import io
import base64

app = FastAPI(title="Quality Assurance Assistant API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat_endpoint(
    message: str = Form(...),
    chat_history: str = Form("[]"),
    persona: str = Form("Novice Guide"),
    recipient_email: str = Form(None),
    csv_context: str = Form("")
):
    try:
        # Parse chat history
        history = json.loads(chat_history) if chat_history else []
        
        response = await ask_bot_with_escalation(
            message,
            chat_history=history,
            persona=persona,
            recipient_email=recipient_email,
            csv_context=csv_context
        )
        
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return {"text": text, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        # Convert to JSON-serializable format
        csv_data = df.to_dict('records')
        return {"data": csv_data, "columns": list(df.columns), "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.post("/api/test-tool")
async def test_tool_generation():
    try:
        from qa_bot import generate_qc_tool
        from data_extractor import ProcessData
        
        # Create test data and add it to chat history
        test_measurements = [1.1, 1.3, 1.25, 1.4, 1.0, 1.1, 1.22, 1.33, 1.11]
        test_chat_history = [
            {"role": "user", "content": f"Generate a histogram for these measurements: {', '.join(map(str, test_measurements))}"}
        ]
        
        result, error = await generate_qc_tool("histogram", test_chat_history)
        
        if result and result.success:
            return {"success": True, "message": "Tool generation works", "tool_type": result.tool_type}
        else:
            return {"success": False, "error": error}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)