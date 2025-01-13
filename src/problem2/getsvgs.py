import os


def write_filenames_to_txt(directory, output_filename):
    try:
        # List all files and folders in the directory
        files = os.listdir(directory)

        # Filter only files (ignore directories)
        file_names = [
            file for file in files if os.path.isfile(os.path.join(directory, file))
        ]

        # Open the output text file in write mode
        with open(output_filename, "w") as output_file:
            # Write the filenames to the text file
            output_file.write(str(file_names) + "\n")

        print(f"File names have been written to {output_filename}")
    except Exception as e:
        print(f"Error: {e}")


# Example usage
directory_path = (
    "I:\Interview\code-challenge\src\problem2\icons"  # Change this to your folder path
)
output_file = "output.txt"  # The file where names will be saved

write_filenames_to_txt(directory_path, output_file)
