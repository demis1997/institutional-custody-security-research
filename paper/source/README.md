# Authoring source

`paper_content.json` contains the revised manuscript and the publication's recorded measurements. `build_paper.py` and `research_tables.py` build the editable document using `python-docx` and `lxml`, with the root `figures/` assets. The repository edition changes only paths in the builder; the published PDF/DOCX are the previously checked artifacts, copied byte for byte.

```sh
python3 -m venv /tmp/custody-paper-venv
/tmp/custody-paper-venv/bin/pip install python-docx==1.2.0 lxml==6.0.2
/tmp/custody-paper-venv/bin/python paper/source/build_paper.py
```

Regeneration replaces `paper/custody-security-research.docx`; it does not regenerate PDF. Open it in Apple Pages, Word, or LibreOffice, update the contents if reflow occurs, then export and review every page. The cached `toc-pages.json` refers to the delivered 26-page layout. The title page's research repository link identifies the examined implementation; this repository is the publication home.

The original package's `RESEARCH_LIMITATIONS.md` and `results/` references map to `docs/RESEARCH_LIMITATIONS.md` and root `results/` here. Read the scope statements before interpreting or extending the experiments.
