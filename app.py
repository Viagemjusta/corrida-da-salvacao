from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, FileResponse
import uvicorn
import subprocess
import os
import uuid

app = FastAPI()

HTML = """
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px;">
    <h2>Cortador Viral Simples ❤️</h2>
    
    <form action="/cut" method="post">
        <label>Link do YouTube:</label><br>
        <input name="url" style="width: 100%; padding: 8px;"><br><br>

        <label>Início do corte (segundos):</label><br>
        <input name="start" type="number" style="width: 100%; padding: 8px;"><br><br>

        <label>Fim do corte (segundos):</label><br>
        <input name="end" type="number" style="width: 100%; padding: 8px;"><br><br>

        <label>Formato:</label><br>
        <select name="ratio" style="width: 100%; padding: 8px;">
            <option value="9:16">9:16 (Reels/TikTok)</option>
            <option value="1:1">1:1 (Quadrado)</option>
            <option value="16:9">16:9 (normal)</option>
        </select><br><br>

        <button style="padding: 10px 20px;">Gerar Corte</button>
    </form>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
def home():
    return HTML

@app.post("/cut")
def cut(url: str = Form(...), start: int = Form(...), end: int = Form(...), ratio: str = Form(...)):
    video_id = str(uuid.uuid4())
    output_file = f"cut_{video_id}.mp4"
    temp_file = f"temp_{video_id}.mp4"

    # 1. Baixar vídeo do YouTube
    subprocess.run(["yt-dlp", "-f", "mp4", url, "-o", temp_file])

    # 2. Definir filtros do formato
    if ratio == "9:16":
        crop = "crop=in_w:in_w*16/9"
        scale = "scale=1080:1920"
    elif ratio == "1:1":
        crop = "crop=in_h:in_h"
        scale = "scale=1080:1080"
    else:
        crop = "crop=in_w:in_h*16/9"
        scale = "scale=1280:720"

    vf = f"{crop}, {scale}"

    # 3. Cortar trecho e aplicar formato
    subprocess.run([
        "ffmpeg", "-y", "-i", temp_file,
        "-vf", vf,
        "-ss", str(start),
        "-to", str(end),
        "-c:a", "copy",
        output_file
    ])

    os.remove(temp_file)

    return FileResponse(output_file, filename="corte_pronto.mp4")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)