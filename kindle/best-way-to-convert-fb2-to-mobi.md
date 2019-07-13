# Best Way to Convert FB2 to MOBI

FictionBook is an open XML-based e-book format which originated and gained
popularity in Russia. FictionBook files have the .fb2 filename extension.

From my experience, when converting FictionBook to MOBI, many tools usually
lose the original formatting such as of footnotes, text alignment, headings,
indented line, etc.

Personally, I found that the best FB2 to MOBI converter that preserves the
original formatting is the
[fb2converter](https://github.com/rupor-github/fb2converter).

## Configure

To use it, you need to specify a configuration file. Here is mine:
[fb2c-configuration.toml](/files/kindle/fb2c/configuration.toml)

## Convert

To convert all the `.fb2` files in a folder, provide the configuration file,
run the `convert` subcommand and specify the output file type. For example:

```
fb2c --config /opt/fb2c/configuration.toml convert --to mobi .
```

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
