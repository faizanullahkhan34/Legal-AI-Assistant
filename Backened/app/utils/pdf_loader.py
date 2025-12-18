import PyPDF2

def load_pdf_text(pdf_path: str):
    texts = []
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            texts.append(page.extract_text())
    return texts
