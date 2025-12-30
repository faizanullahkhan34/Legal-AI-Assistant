import PyPDF2
import os

def load_pdf_text(source_path: str):
    texts = []

    def read_pdf(file_path):
        pdf_texts = []
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        pdf_texts.append(text)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
        return pdf_texts

    if os.path.isdir(source_path):
        for root, _, files in os.walk(source_path):
            for file in files:
                if file.lower().endswith(".pdf"):
                    full_path = os.path.join(root, file)
                    texts.extend(read_pdf(full_path))
    elif os.path.isfile(source_path) and source_path.lower().endswith(".pdf"):
        texts.extend(read_pdf(source_path))
    
    return texts
