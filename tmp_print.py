from pathlib import Path
lines = Path('src/css/Dashboard.css').read_text().splitlines()
for i, line in enumerate(lines, 1):
    if 200 <= i <= 320:
        print(f"{i:3}: {line}")
