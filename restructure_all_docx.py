import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os
import glob

# Predefined headings in order with their level and display title
TOC_ITEMS = [
    # (Level, Text, Chapter Number for S.No)
    (1, "2. CERTIFICATE FROM ORGANIZATION", "2"),
    (1, "3. ACKNOWLEDGMENT", "3"),
    (1, "4. ABSTRACT", "4"),
    (1, "5. ORGANIZATION PROFILE", "5"),
    (2, "5.1 Overview", ""),
    (2, "5.2 Technologies Used", ""),
    (1, "6. INTERNSHIP OBJECTIVES", "6"),
    (1, "7. WORK CARRIED OUT", "7"),
    (2, "7.1 Tools and Technologies Used", ""),
    (2, "7.2 Engineering Methods Applied", ""),
    (1, "8. TECHNICAL LEARNING OUTCOMES", "8"),
    (2, "8.1 Engineering Knowledge", ""),
    (2, "8.2 Problem-Solving", ""),
    (2, "8.3 Modern Tool Usage", ""),
    (2, "8.4 Teamwork and Communication", ""),
    (1, "9. CHALLENGES FACED AND SOLUTIONS", "9"),
    (1, "10. KEY SOURCE CODE & IMPLEMENTATION DETAILS", "10"),
    (1, "11. CONCLUSION", "11"),
    (1, "12. REFERENCES", "12"),
    (1, "13. APPENDIX", "13"),
    (2, "13.1 Work Log", ""),
    (2, "13.2 Screenshots / Designs", ""),
    (1, "14. DECLARATION", "14")
]

# Set of chapter heading strings
CHAPTERS = {item[1] for item in TOC_ITEMS if item[0] == 1}
TOC_TEXT_TO_ITEM = {item[1]: item for item in TOC_ITEMS}

def has_hard_page_break(p):
    for run in p.runs:
        for br in run._r.findall(qn('w:br')):
            if br.get(qn('w:type')) == 'page':
                return True
    return False

def has_page_break_before(p):
    pPr = p._p.get_or_add_pPr()
    if pPr.find(qn('w:pageBreakBefore')) is not None:
        return True
    return False

def clean_and_format_document(filepath):
    print(f"\nProcessing file: {filepath}")
    doc = docx.Document(filepath)
    
    # 1. Set page_break_before = True on all chapter headings present in the document
    for idx, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        if text in CHAPTERS:
            p.paragraph_format.page_break_before = True
            
    # 2. Simulate document to identify redundant page breaks
    sim = []
    for idx, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        is_ch = text in CHAPTERS
        has_br = has_hard_page_break(p)
        has_before = has_page_break_before(p)
        
        sim.append({
            "idx": idx,
            "text": text,
            "is_chapter": is_ch,
            "has_hard_br": has_br,
            "page_break_before": is_ch or has_before,
            "keep": True
        })
        
    for i in range(len(sim)):
        item = sim[i]
        if item["has_hard_br"] and not item["text"]:
            # Check lookahead for next break or chapter heading
            next_has_break = False
            next_has_content = False
            for j in range(i + 1, len(sim)):
                next_item = sim[j]
                if next_item["text"]:
                    next_has_content = True
                    if next_item["is_chapter"]:
                        next_has_break = True
                    break
                if next_item["has_hard_br"] or next_item["page_break_before"]:
                    next_has_break = True
                    break
            
            if not next_has_content:
                item["keep"] = False
                item["has_hard_br"] = False
                continue
                
            if next_has_break:
                item["keep"] = False
                item["has_hard_br"] = False
                continue
                
            # Check lookback for previous break
            prev_has_break = False
            prev_has_content = False
            for j in range(i - 1, -1, -1):
                prev_item = sim[j]
                if prev_item["text"]:
                    prev_has_content = True
                    break
                if prev_item["has_hard_br"] or prev_item["page_break_before"]:
                    prev_has_break = True
                    break
                    
            if not prev_has_content or prev_has_break:
                item["keep"] = False
                item["has_hard_br"] = False
                continue

    # Delete the redundant empty paragraphs (working backwards so indices don't shift)
    to_delete = sorted([x["idx"] for x in sim if not x["keep"]], reverse=True)
    print(f"  Deleting {len(to_delete)} redundant empty paragraphs/breaks...")
    for idx in to_delete:
        p = doc.paragraphs[idx]
        p_element = p._element
        p_element.getparent().remove(p_element)

    # 3. Find the first chapter heading to insert the INDEX before it
    target_idx = None
    for idx, p in enumerate(doc.paragraphs):
        if p.text.strip() == "2. CERTIFICATE FROM ORGANIZATION":
            target_idx = idx
            break
            
    if target_idx is None:
        print(f"  Warning: Certificate heading not found in {filepath}. Skipping.")
        return

    # 4. Perform a dry-run page trace to compute page numbers of all present headings
    # We initialize the page counter. Cover page is Page 1. INDEX is Page 2. Certificate starts Page 3.
    current_page = 2
    headings_pages = []
    
    # We trace from target_idx onwards
    for idx in range(target_idx, len(doc.paragraphs)):
        p = doc.paragraphs[idx]
        if has_page_break_before(p):
            current_page += 1
            
        text = p.text.strip()
        if text in TOC_TEXT_TO_ITEM:
            headings_pages.append((current_page, text))
            
        if has_hard_page_break(p):
            current_page += 1
            
    # 5. Build Table of Contents data
    toc_data = [("S. No.", "Chapter / Topic", "Page No.")]
    # Add Cover page explicitly
    toc_data.append(("1", "COVER PAGE", "1"))
    
    for page, heading_text in headings_pages:
        item = TOC_TEXT_TO_ITEM[heading_text]
        level = item[0]
        s_no = item[2]
        
        # Format subheading indentation in the title column
        title = heading_text
        if level == 2:
            title = "   " + heading_text # Indent sub-sections slightly
            
        toc_data.append((s_no, title, str(page)))
        
    print(f"  Generated Index with {len(toc_data)-1} entries (total estimated pages: {current_page})")

    # 6. Insert INDEX heading before the Certificate page
    p_cert = doc.paragraphs[target_idx]
    p_index = p_cert.insert_paragraph_before("")
    p_index.paragraph_format.page_break_before = True
    p_index.paragraph_format.space_before = Pt(12)
    p_index.paragraph_format.space_after = Pt(18)
    p_index.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    run_h = p_index.add_run("INDEX")
    run_h.font.name = "Times New Roman"
    run_h.font.size = Pt(18)
    run_h.font.bold = True
    
    rPr = run_h._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), 'Times New Roman')
    rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    rPr.append(rFonts)

    # 7. Insert the TOC table
    tbl = doc.add_table(len(toc_data), 3, style='Table Grid')
    p_cert._element.addprevious(tbl._tbl)
    
    # Format table columns and rows
    col_widths = [Inches(1.0), Inches(5.0), Inches(1.0)]
    for r_idx, row in enumerate(tbl.rows):
        data = toc_data[r_idx]
        
        # Set height / spacing
        trPr = row._tr.get_or_add_trPr()
        trHeight = OxmlElement('w:trHeight')
        trHeight.set(qn('w:val'), '360') # 18 pt height
        trPr.append(trHeight)
        
        for c_idx, cell in enumerate(row.cells):
            cell.text = "" # Clear default text paragraph
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            
            p_cell = cell.paragraphs[0]
            p_cell.paragraph_format.space_before = Pt(4)
            p_cell.paragraph_format.space_after = Pt(4)
            
            # Text alignment
            if c_idx == 0 or c_idx == 2:
                p_cell.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p_cell.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            text_val = data[c_idx]
            run = p_cell.add_run(text_val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(12)
            
            rPr = run._r.get_or_add_rPr()
            rFonts = OxmlElement('w:rFonts')
            rFonts.set(qn('w:ascii'), 'Times New Roman')
            rFonts.set(qn('w:hAnsi'), 'Times New Roman')
            rPr.append(rFonts)
            
            # Style header row
            if r_idx == 0:
                run.font.bold = True
                shading_xml = f'<w:shd {nsdecls("w")} w:fill="F2F2F2"/>'
                cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))
            else:
                # Chapter headings can be bold
                if c_idx == 1 and data[0] != "":
                    run.font.bold = True
                elif c_idx == 0:
                    run.font.bold = True
                    
            cell.width = col_widths[c_idx]

    # Save modified document
    doc.save(filepath)
    print(f"  Successfully saved restructured file: {filepath}")

# Process all docx files in workspace root
if __name__ == "__main__":
    files = glob.glob("*.docx")
    processed_count = 0
    for f in files:
        if not f.startswith("~$") and f != "HealHub_Internship_Report_Test.docx":
            clean_and_format_document(f)
            processed_count += 1
    print(f"\nCompleted processing of {processed_count} files.")
