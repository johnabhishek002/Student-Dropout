"""
EduGuard AI - Local HTTP Development & Hackathon Demo Server
"""
import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for smooth local evaluation
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    port = PORT
    for attempt in range(5):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"EduGuard AI server running at: http://localhost:{port}")
                sys.stdout.flush()
                httpd.serve_forever()
        except OSError:
            port += 1
            print(f"Port busy, trying http://localhost:{port}...")

if __name__ == '__main__':
    run_server()
