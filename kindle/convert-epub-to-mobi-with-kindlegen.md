# Convert ePub to MOBI with KindleGen

[KindleGen](https://www.amazon.com/gp/feature.html?docId=1000765211) is an
official Amazon’s converter. KindleGen is pretty easy to use.

Run `kindlegen` to see all the program options.

KindleGen has an _undocumented_ key `-dont_append_source` with which you can
avoid storing an ePub copy within the generated MOBI file.

Another option I personally recommend to always use is `-c0` which disables
compression. The thing is that books converted without compression are opened
by Kindle faster and turning over the pages is faster too.

So, the full command you should use is the following:

```bash
kindlegen -verbose -locale en -dont_append_source -c0 book.epub
```

The `-verbose` and `-locale` options are used for verbose output, so when
something goes wrong it is easier to find out why.

::: tip Bonus
I have also made a simple [Automator
workflow](/files/kindle/kindlegen.workflow.zip) that allows to
convert books within Finder.
:::

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
