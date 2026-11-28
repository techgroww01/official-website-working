import os
import subprocess
import glob

# Script to generate a smooth 1080p Ken-Burns video reel from public/images
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
img_dir = os.path.join(base_dir, "public", "images")
output_video = os.path.join(base_dir, "public", "videos", "studio-showcase.mp4")

# Images to include
images = [
    os.path.join(img_dir, "team-strategy.jpg"),
    os.path.join(img_dir, "studio-collaboration.jpg"),
    os.path.join(img_dir, "product-workspace.jpg"),
    os.path.join(img_dir, "mobile-experience.jpg"),
]

# Verify all images exist
existing_images = [img for img in images if os.path.exists(img)]
print(f"Found {len(existing_images)} images for video synthesis: {existing_images}")

if len(existing_images) < 2:
    print("Error: Need at least 2 images.")
    exit(1)

# Build an ffmpeg filter complex for Ken-Burns (subtle zoom) + smooth crossfades
# Each image 3 seconds, 0.75s crossfade
duration_per_clip = 3.5
transition_duration = 0.75
fps = 30
width = 1920
height = 1080

# For simplicity and maximum compatibility, let's create 3.5s video clips per image, then concatenate with xfade
clips = []
for i, img in enumerate(existing_images):
    clip_path = os.path.join(base_dir, "public", "videos", f"clip_{i}.mp4")
    clips.append(clip_path)
    
    # Alternate zoom in vs subtle zoom out
    if i % 2 == 0:
        zoom_filter = f"scale=8000:-1,zoompan=z='min(zoom+0.0012,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={int(duration_per_clip * fps)}:s={width}x{height}:fps={fps}"
    else:
        zoom_filter = f"scale=8000:-1,zoompan=z='if(lte(zoom,1.0),1.15,max(1.001,zoom-0.0012))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={int(duration_per_clip * fps)}:s={width}x{height}:fps={fps}"
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", img,
        "-vf", zoom_filter,
        "-t", str(duration_per_clip),
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-preset", "faster",
        clip_path
    ]
    print(f"Generating clip {i}...")
    subprocess.run(cmd, check=True)

# Now combine clips with xfade transitions
# clip 0 + clip 1 at offset (3.5 - 0.75 = 2.75)
# then result + clip 2 at (2.75 + 3.5 - 0.75 = 5.5)
# then result + clip 3 at (5.5 + 3.5 - 0.75 = 8.25)
filter_str = ""
inputs = []
for i, c in enumerate(clips):
    inputs.extend(["-i", c])

num_clips = len(clips)
if num_clips == 4:
    offset1 = duration_per_clip - transition_duration
    offset2 = offset1 + duration_per_clip - transition_duration
    offset3 = offset2 + duration_per_clip - transition_duration
    filter_complex = (
        f"[0:v][1:v]xfade=transition=fade:duration={transition_duration}:offset={offset1}[v01];"
        f"[v01][2:v]xfade=transition=fade:duration={transition_duration}:offset={offset2}[v02];"
        f"[v02][3:v]xfade=transition=fade:duration={transition_duration}:offset={offset3}[vfinal]"
    )
    final_cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[vfinal]",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-movflags", "+faststart",
        output_video
    ]
else:
    # simple concat fallback
    final_cmd = ["ffmpeg", "-y", "-i", clips[0], "-c:v", "libx264", output_video]

print("Assembling final video...")
subprocess.run(final_cmd, check=True)

# Cleanup clips
for c in clips:
    try:
        os.remove(c)
    except Exception:
        pass

print(f"Showcase video created successfully at: {output_video}")
