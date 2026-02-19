import os
import json
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Logging
logging.basicConfig(level=logging.INFO)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


app = FastAPI()

class ReviewRequest(BaseModel):
    title: str
    description: str
    diff: str

class ReviewResponse(BaseModel):
    score: float
    review: str

def generate_review(title, description, diff):
    prompt = f"""
You are a strict senior software engineer.

Review this Pull Request.

Title:
{title}

Description:
{description}

Diff:
{diff}

Return ONLY valid JSON in this format:

{{
  "score": number between 0-10,
  "review": "detailed feedback"
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional code reviewer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()
        parsed = json.loads(content)

        return parsed["score"], parsed["review"]

    except Exception as e:
        logging.error(str(e))
        raise HTTPException(status_code=500, detail="LLM review failed")

@app.post("/review", response_model=ReviewResponse)
async def review_pr(data: ReviewRequest):
    score, review = generate_review(
        data.title,
        data.description,
        data.diff
    )

    return ReviewResponse(score=score, review=review)
