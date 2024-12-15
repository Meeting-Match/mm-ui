import os
import sys
import argparse


def is_text_file(file_path):
    """Check if a file is a text file by attempting to read it."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read(1024)
        return True
    except UnicodeDecodeError:
        return False
    except:
        return False


def consolidate_files(folder_path, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(folder_path):
            for filename in files:
                file_path = os.path.join(root, filename)

                # Skip the output file itself
                if os.path.abspath(file_path) == os.path.abspath(output_file):
                    continue

                # Write the file path as a header
                relative_path = os.path.relpath(file_path, folder_path)
                outfile.write(f"\n\n===== {relative_path} =====\n\n")

                if is_text_file(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            outfile.write(content)
                    except Exception as e:
                        outfile.write(f"\n[Could not read file: {e}]\n")
                else:
                    outfile.write(
                        "[Binary or non-text file content not included]\n")

    print(f"All text files have been consolidated into {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Consolidate all text files in a directory into a single text file.")
    parser.add_argument('folder', help='Path to the target folder')
    parser.add_argument(
        '-o', '--output', help='Path to the output file', default='consolidated_output.txt')

    args = parser.parse_args()

    folder_path = args.folder
    output_file = args.output

    if not os.path.isdir(folder_path):
        print(f"Error: The folder '{
              folder_path}' does not exist or is not a directory.")
        sys.exit(1)

    consolidate_files(folder_path, output_file)
