# Enable Russian Hyphenation on Kobo

If you add a book in Russian onto your Kobo e-reader, you may notice that, when text justification is enabled, there are large, uneven spaces between words and no hyphenation is used. The reason for this is that, by default, Kobo e-readers do not have Russian hyphenation dictionaries installed.

## Install the dictionary

You can install a Russian hyphenation dictionary by copying the [KoboRoot.tgz](assets/KoboRoot.tgz "KoboRoot.tgz") file to the `.kobo` directory on your e-reader.

If you look inside the archive, it contains a dictionary file at the filesystem path `usr/local/Kobo/hyphenDicts/hyph_ru.dic`:

``` shell title="tar -tf KoboRoot.tgz"
usr/
usr/local/
usr/local/Kobo/
usr/local/Kobo/hyphenDicts/
usr/local/Kobo/hyphenDicts/hyph_ru.dic
```

As soon as you copy the archive and eject your Kobo e-reader from the computer, the e-reader will extract the contents of the archive to its root filesystem, i.e. `/usr/local/Kobo/hyphenDicts/hyph_ru.dic`.

## Where to find hyphenation dictionaries

Kobo e-readers use hyphenation dictionaries in the Hunspell format. These can be found, for example, in the [LibreOffice dictionaries](https://git.libreoffice.org/dictionaries/+/refs/heads/master) Git repository.

To download a hyphenation dictionary and create a `KoboRoot.tgz` archive yourself, run the following commands:
``` shell
git clone --depth 1 https://git.libreoffice.org/dictionaries
mkdir -p usr/local/Kobo/hyphenDicts
cp dictionaries/ru_RU/hyph_ru_RU.dic usr/local/Kobo/hyphenDicts/hyph_ru.dic
tar --exclude='.DS_Store' -cvzf KoboRoot.tgz usr/
```
