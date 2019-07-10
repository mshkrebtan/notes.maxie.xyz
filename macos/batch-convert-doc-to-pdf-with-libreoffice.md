# Batch Convert Doc to PDF with LibreOffice

First, make a symlink for the LibreOffice binary.

``` bash
ln -s /Applications/LibreOffice.app/Contents/MacOS/soffice /usr/local/bin
```

Now you can convert the files:

``` bash
soffice --invisible --convert-to pdf --outdir ./PDF *.doc
```

---

To get more on `soffice`:

``` bash
soffice --help
```
