"""
Production Waitress Application Runner for "Digitalization in Healthcare"
Configured for multi-threaded production workloads.
Execute on Windows PowerShell via:
    python run_server.py
"""

from waitress import serve
from app import app
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

if __name__ == '__main__':
    port = 5000
    threads = 8
    print(f"================================================================")
    print(f" Starting 'Digitalization in Healthcare' Production Server")
    print(f" Serving on http://localhost:{port} (Threads: {threads})")
    print(f" Emergency Universal Dispatch: Dial 112")
    print(f" Educational Platform: Not a Medical Diagnostic Device")
    print(f"================================================================")
    serve(app, host='0.0.0.0', port=port, threads=threads)
