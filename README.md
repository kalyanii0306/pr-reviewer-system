pr-review-system/
│
├── python-service/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│
├── node-worker/
│   ├── index.js
│   ├── package.json


ADD YOUR .env FILE IN python-service

PART 1 — RUN PYTHON SERVICE
✅ STEP 1 — Open VS Code

Open VS Code

Click File → Open Folder

Select pr-review-system

STEP 2 — Open Terminal

In VS Code:

Terminal → New Terminal

✅ STEP 3 — Go To Python Folder
cd python-service

✅ STEP 4 — Install Dependencies

If not already installed:

pip install -r requirements.txt

✅ STEP 5 — Make Sure .env Exists

Inside python-service/.env:

OPENAI_API_KEY=sk-proj-your_actual_key_here

✅ STEP 6 — Run Python Server
uvicorn main:app --reload --port 8000


You should see:

Uvicorn running on http://127.0.0.1:8000


🔥 Python is now running.

Keep this terminal open.
Open browser:

http://localhost:8000/docs


Click:

POST /review

Click:

Try it out

Paste:

{
  "title": "Fix login bug",
  "description": "Corrected token validation logic",
  "diff": "- if(token = null)\n+ if(token === null)"
}


Click Execute

If you get score + review → ✅ Python working.

🟩 PART 2 — RUN NODE SERVICE
✅ STEP 1 — Open NEW Terminal Tab

In VS Code:

Terminal → New Terminal

✅ STEP 2 — Go To Node Folder
cd node-worker

✅ STEP 3 — Install Node Dependencies
npm install

✅ STEP 4 — Make Sure index.js Has Localhost URL

Check inside index.js:

Make sure it calls:

"http://localhost:8000/review"


NOT:

http://python-service:8000


(That is only for Docker)

✅ STEP 5 — Run Node Server
node index.js


You should see:

Node server running on port 3000

🧪 TEST FULL SYSTEM (Without GitHub)

Now open browser:

http://localhost:3000/test


If working, you will see:

{
  "score": 8.4,
  "review": "The PR fixes the comparison issue..."
}

🎉 What Just Happened

Browser → Node
Node → Python
Python → OpenAI
OpenAI → Python
Python → Node
Node → Browser

Complete flow working 🚀
