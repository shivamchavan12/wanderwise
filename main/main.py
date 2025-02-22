from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# Allow CORS for development; adjust in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

def scrape_images(query: str, limit: int = 5):
    url = f"https://www.pexels.com/search/{query}/"
    headers = {
        "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/115.0.0.0 Safari/537.36")
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {e}")
    
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: status code {res.status_code}")
    
    soup = BeautifulSoup(res.text, "html.parser")
    images = []
    
    # Primary selector (this may need updating if Pexels changes its layout)
    for img in soup.select("article div.photo-item a.js-photo-link img"):
        src = img.get("src")
        if src:
            images.append(src)
    
    # Fallback selector if no images are found with the primary selector
    if not images:
        for img in soup.select("img.photo-item__img"):
            src = img.get("src")
            if src:
                images.append(src)
    
    return images[:limit]

@app.get("/api/images")
def get_images(query: str = Query("travel", description="Search query for images"),
               limit: int = Query(5, description="Number of images to return")):
    try:
        images = scrape_images(query, limit)
        if not images:
            raise HTTPException(status_code=404, detail="No images found.")
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
