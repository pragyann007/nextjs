from fastapi import FastAPI
app = FastAPI(
    title="My demo app",
    description ="This is my ppp myyy ",
) 

@app.get("/")
def courses():
    return "HII"

@app.get("/health")
def health():
    """This is health endpoint to get health of api"""
    # Health Endpoint
    return {"status":"OK","isHealthy":True}