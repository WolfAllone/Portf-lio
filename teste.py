import os

# 1. Define the folder where your files are located and the new base name
video_folder = '/path/to/your/folder/of/raw_files'
project_base_name = 'SummerProject_Scene05'

# 2. List all files in the folder
files = os.listdir(video_folder)
files.sort()  # Ensures files are in order

counter = 1
for file in files:
    # Get the file extension (e.g., .MOV)
    old_name, extension = os.path.splitext(file)

    # Assemble the new file name, with a counter
    new_name = f"{project_base_name}_Take{counter:02d}{extension}"

    # Complete old and new file paths
    old_path = os.path.join(video_folder, file)
    new_path = os.path.join(video_folder, new_name)

    # Rename the file
    os.rename(old_path, new_path)

    print(f'Renamed: {file} -> {new_name}')
    counter += 1

print("Process finished!")