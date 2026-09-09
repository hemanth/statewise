#!/bin/sh
set -eu
# Smooth camera moves: state details, then the answer feedback in the map quiz.
ffmpeg -y -hide_banner -loglevel warning -i media/statewise-demo-source.webm \
  -vf "fps=30,zoompan=z='1+if(between(on,135,360),0.2*sin(PI*(on-135)/225),0)+if(between(on,540,900),0.12*sin(PI*(on-540)/360),0)':x='if(between(on,135,360),iw-iw/zoom,(iw-iw/zoom)/2)':y='(ih-ih/zoom)/2':d=1:s=1600x900:fps=30,format=yuv420p" \
  -c:v libx264 -preset medium -crf 20 -movflags +faststart -an public/statewise-demo.mp4
