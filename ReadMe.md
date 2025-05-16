# AI Customer Live Chat Backend

## Overview
This Live Chat Agent is a Customer Support Expert that attends to any inquiries that a user asks. The Agent is trained to answer common questions, smartly using Google Gemini API.

## Goals
1. Ask the customer's basic details, then proceed to basic questions about his problems with the orders.
2. Assist customer inquiries regarding their order's data.
3. If the customer's inquiry may lead to a scenario that the AI will not be able to answer, the AI will create a Customer Support ticket as last resort.
4. Record user prompts, chat history and simplified chat contexts in a MongoDB database.


## Deployment Setup
This is setup to run in an AWS EC2 virtual machine. To mimic the server locally in Windows, you can install WSL by running:
```bash
wsl --install Ubuntu
```
Ubuntu here is the distro used to develop this server. You may use other Linux distros you might prefer.

The server can be cloned from a Github repository. Execute the following steps in an EC2 instance:

1. This clones the Github repository.
```bash
git clone -b backend https://github.com/lalala0095/customer-support-chat-bot
```

2. Go to the created directory.
```bash
cd ai-chat-bot-clone
```

3. Create and activate a Python virtual environment.
```bash
python3 -m venv venv
source venv/bin/activate
```

4. Install the dependencies
```bash
pip install -r requirements.txt
```

5. You need to create an `.env` file for the environment variables.
```bash
sudo nano .env
```

Write the following to the `.env` file:
```env
GEMINI_API_KEY='YOUR_GEMINI_API_KEY'
FOURSQUARE_API_KEY='YOUR_FOURSQUARE_API_KEY'
MONGO_DB_URI='YOUR_MONGO_DB_URI'
MONGO_DB_NAME='YOUR_MONGO_DB_NAME'
CUSTOM_SEARCH_API_KEY='YOUR_CUSTOM_SEARCH_API_KEY'
CX_SEARCH_ID='YOUR_CX_SEARCH_ID'
```

Make sure to replace the placeholder values with your actual configuration.

6. Run the uvicorn server.
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

7. To keep the server running, you can use `nohup` to run the server in the background and log the output to a file. Additionally, you can save the process ID (PID) to a file for easier management.

```bash
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > fastapi.log 2>&1 & echo $! > fastapi.pid
```

- `fastapi.log` will contain the server's output logs.
- `fastapi.pid` will store the PID of the running process, which can be used to stop the server later.

8. In order for this backend server to communicate with the frontend, you need to setup cloudflared tunnel. This will auto-generate an https URL for the FastAPI server.
Follow this documentations for setting up cloudflared tunnels:
`https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/`

9. Run cloudflared tunnel with nohup.
```bash
nohup cloudflared tunnel --url http://localhost:8002 > cloudflared.log 2>&1 & echo $! > cloudflared.pid
```

10. This will generate a log named `cloudflared.log`. View the log and get the auto-generated URL.:
```bash
cat cloudflared.log
```
This URL will be the main API base URL for the frontend.


## Notes on how to deploy to production.
In main.py file, you can add the frontend's URL so that the FastAPI server will accept the requests coming from the frontend.
Add it in allow_origins of this section:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'https://your-frontend-url'],
    allow_methods=['*'],
    allow_headers=['*']
)
```