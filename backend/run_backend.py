import uvicorn
import os
import sys

# Ensure backend root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    print("Starting Ragada Tobacco SupplyChain OS Backend on port 8002...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8002, reload=False)
