# Edit Encoded Audio with FFmpeg and Audacity

## Installation

### FFmpeg

#### macOS

Get [Homebrew](http://brew.sh) if you have not installed it yet. Then run:

```
brew install ffmpeg
```

::: tip Tip
FFmpeg brew formula has many options, e. g. `--with-opencore-amr`. To get all
the information about the formula, run:

```
brew info ffmpeg | less
```
:::


#### Other platforms

Download from <https://www.ffmpeg.org/download.html>.


### Audacity

Download from <http://www.audacityteam.org/download/>.

Then download Audacity-compatible FFmpeg 2.3._x_ shared libraries. See more
[here](http://manual.audacityteam.org/man/faq_installation_and_plug_ins.html#ffdown).

## Quick introduction to FFmpeg

### Terminology

::: tip

- **Format** describes a container.

- **Coder** encodes raw data (packets) and puts it in a container.

- **Muxers** take encoded data in the form of AVPackets and write it into files
or other output byte streams in the specified container format.

- **Decoder** decodes (demuxes) lossy or lossless compressed data stored in a
container.

- **Demuxers** read a media file and split it into chunks of data (packets).

There can be multiple codecs for the same format. If you don't specify what
codec to use, ffmpeg will use the format's default codec.

:::

### List all formats (actually, muxers)

Run:

```
ffmpeg -formats
```

or better:

```
ffmpeg -hide_banner -formats
```

::: output Output:

```
 D. = Demuxing supported
 .E = Muxing supported
 --
 D  3dostr          3DO STR
  E 3g2             3GP2 (3GPP2 file format)
  E 3gp             3GP (3GPP file format)
 D  4xm             4X Technologies
  E a64             a64 - video for Commodore 64
 D  aa              Audible AA format files
...
```
:::

- _D_ stands for decoding/demuxing.
- _E_ stands for encoding/muxing.

### List all codecs

Run:

```
ffmpeg -codecs
```

or better:

```
ffmpeg -hide_banner -codecs
```

::: output Output:

```
Codecs:
 D..... = Decoding supported
 .E.... = Encoding supported
 ..V... = Video codec
 ..A... = Audio codec
 ..S... = Subtitle codec
 ...I.. = Intra frame-only codec
 ....L. = Lossy compression
 .....S = Lossless compression
 -------
 D.VI.. 012v                 Uncompressed 4:2:2 10-bit
 D.V.L. 4xm                  4X Movie
 D.VI.S 8bps                 QuickTime 8BPS video
 .EVIL. a64_multi            Multicolor charset for Commodore 64 (encoders: a64multi )
 .EVIL. a64_multi5           Multicolor charset for Commodore 64, extended with 5th color (colram) (encoders: a64multi5 )
 D.V..S aasc                 Autodesk RLE
 D.VIL. aic                  Apple Intermediate Codec
 DEVI.S alias_pix            Alias/Wavefront PIX image
 DEVIL. amv                  AMV Video
 D.V.L. anm                  Deluxe Paint Animation
```
:::

Some codecs cannot encode, i. e. they are just decoders.
Some codecs cannot decode, i. e. they are just coders.

---

The `amr` format is supported as well:

```
ffmpeg -hide_banner -formats | grep -i amr
```

::: output Output:

```
 DE amr             3GPP AMR
```
:::

It is supported by 2 codes:

```
ffmpeg -hide_banner -codecs | grep -i amr
```

::: output Output:

```
 DEA.L. amr_nb               AMR-NB (Adaptive Multi-Rate NarrowBand) (decoders: amrnb amr_nb_at libopencore_amrnb ) (encoders: libopencore_amrnb )
 D.A.L. amr_wb               AMR-WB (Adaptive Multi-Rate WideBand) (decoders: amrwb libopencore_amrwb )
```
:::


## Edit encoded audio

Let us cut a section from an `.amr` audio stored in a file with the name
`incondite.amr`. It was recorded on an Android device. This means we'd better
use the `opencore-amr` codecs — audio codecs extracted from Android Open Source
Project, which should be installed along with FFmpeg.

### Probe the file

Get the basic information, such as sample rate or number of channels.

With `ffprobe`:

```
ffprobe incondite.amr
```

::: output Output:

```
[amr @ 0x7f9a25000000] Estimating duration from bitrate, this may be inaccurate
Input #0, amr, from 'incondite.amr':

    Stream #0:0: Audio: amr_nb (samr / 0x726D6173), 8000 Hz, mono, flt
```
:::

As this `incodite.amr` file came from an Android device, better specify the
`libopencore_amrnb` codec for probing. But this won't work with `ffprobe` for
some reason. Well, we can use `ffmpeg`, like this:

```
ffmpeg -acodec libopencore_amrnb -i incondite.amr
```

::: output Output:

```
[amr @ 0x7fb42c000000] Estimating duration from bitrate, this may be inaccurate
Input #0, amr, from 'incondite.amr':

    Stream #0:0: Audio: amr_nb (samr / 0x726D6173), 8000 Hz, mono, s16
At least one output file must be specified
```
:::

Different in this output is the `sample_fmt` — `s16` vs. `flt`. I assume the
opencore-amr probe is more correct.

::: tip Tip

To see all the sample formats run:

```
ffmpeg -sample_fmts
```

Output:
```
name   depth
u8        8
s16      16
s32      32
flt      32
dbl      64
u8p       8
s16p     16
s32p     32
fltp     32
dblp     64
s64      64
s64p     64
```

The letters mean:

 - `u` — **u**nsigned,
 - `s` — **s**igned,
 - `flt` — **fl**oa**t**,
 - `dbl` - **d**ou**bl**e,
 - `p` — **p**lanar.

For planar sample formats, each audio channel is in a separate data plane, and
linesize is the buffer size, in bytes, for a single plane. All data planes must
be the same size. For packed sample formats, only the first data plane is used,
and samples for each channel are interleaved. In this case, linesize is the
buffer size, in bytes, for the 1 plane.
:::

Back to the probe results:

 - 8000 Hz — the **sample rate**,
 - mono — means **1 channel**,
 - s16 — the **sample format** (expressed by native C types).

### Decode

Okay, now as we know the audio parameters let us decode the
`incondite.amr`:

```
ffmpeg \
  -acodec libopencore_amrnb \
  -i incondite.amr \
  -ar 8000 \
  -ac 1 \
  -f s16le \
  incondite.raw
```

The options mean:

 - `-acodec` or `-codec:a` — the audio codec (if it stands before the `-i`
   option it defines the decoder);
 - `-i` — the input file;
 - `-ar` — the audio sampling frequency (sample rate);
 - `-ac` — the number of channels;
 - `-f` — format.

See more on audio options [here](https://ffmpeg.org/ffmpeg.html#Audio-Options).

Format `s16le` means _PCM signed 16-bit little-endian_. The output will be a
container with raw data (in the _s16le_ format) as we do not specify any codec
(encoder).

Let's run the command above and see the output:

::: output Output:

```
 1  [amr @ 0x7f9cfa000000] Estimating duration from bitrate, this may be inaccurate
 2  Input #0, amr, from 'incondite.amr':

 4      Stream #0:0: Audio: amr_nb (samr / 0x726D6173), 8000 Hz, mono, s16
 5  Output #0, s16le, to 'incondite.raw':
 6    Metadata:
 7      encoder         : Lavf57.56.100
 8      Stream #0:0: Audio: pcm_s16le, 8000 Hz, mono, s16, 128 kb/s
 9      Metadata:
10        encoder         : Lavc57.64.101 pcm_s16le
11  Stream mapping:
12    Stream #0:0 -> #0:0 (amr_nb (libopencore_amrnb) -> pcm_s16le (native))
13  Press [q] to stop, [?] for help
14  incondite.amr: Input/output errorbitrate= 128.0kbits/s speed= 503x
```
:::

Oops! There is an error on line 14. What is wrong? Well, let us run the same
command again but with the `-v` (verbose) option set to `debug`:

```
ffmpeg \
  -v debug \
  -acodec libopencore_amrnb \
  -i incondite.amr \
  -ar 8000 \
  -ac 1 \
  -f s16le \
  incondite.raw
```

::: output Output:
```
24  Opening an input file: incondite.amr.
25  [file @ 0x7fd2054051c0] Setting default whitelist 'file,crypto'
26  [amr @ 0x7fd206004200] Format amr probed with size=2048 and score=100
27  [amr @ 0x7fd206004200] Before avformat_find_stream_info() pos: 6 bytes read:32768 seeks:0 nb_streams:1
28  [amr @ 0x7fd206004200] All info found
29  [amr @ 0x7fd206004200] Estimating duration from bitrate, this may be inaccurate
30  [amr @ 0x7fd206004200] After avformat_find_stream_info() pos: 1606 bytes read:32768 seeks:0 frames:50
31  Input #0, amr, from 'incondite.amr':

33      Stream #0:0, 50, 1/8000: Audio: amr_nb (samr / 0x726D6173), 8000 Hz, mono, s16

53  Output #0, s16le, to 'incondite.raw':
54    Metadata:
55      encoder         : Lavf57.56.100
56      Stream #0:0, 0, 1/8000: Audio: pcm_s16le, 8000 Hz, mono, s16, 128 kb/s
57      Metadata:
58        encoder         : Lavc57.64.101 pcm_s16le
59  Stream mapping:
60    Stream #0:0 -> #0:0 (amr_nb (libopencore_amrnb) -> pcm_s16le (native))
61  Press [q] to stop, [?] for help
62  cur_dts is invalid (this is harmless if it occurs once at the start per stream)
incondite.amr: Input/output errorbitrate= 128.0kbits/s speed= 159x
64  [output stream 0:0 @ 0x7fd205603b00] EOF on sink link output stream 0:0:default.
65  No more output streams to write to, finishing.

68  Input file #0 (incondite.amr):
69    Input stream #0:0 (audio): 49713 packets read (1590816 bytes); 49713 frames decoded (7954080 samples);
70    Total: 49713 packets (1590816 bytes) demuxed
71  Output file #0 (incondite.raw):
72    Output stream #0:0 (audio): 49713 frames encoded (7954080 samples); 49713 packets muxed (15908160 bytes);
73    Total: 49713 packets (15908160 bytes) muxed
74  49713 frames successfully decoded, 0 decoding errors
75  [AVIOContext @ 0x7fd205700080] Statistics: 0 seeks, 49713 writeouts
76  [AVIOContext @ 0x7fd205506840] Statistics: 1590822 bytes read, 0 seeks
```
:::

And here wee see the reason and the explanation in parenthesis on line 62:

::: output
```
62  cur_dts is invalid (this is harmless if it occurs once at the start per stream)
```
:::

It's nothing.

In the end, we have the statistics:

::: output
```
74  49713 frames successfully decoded, 0 decoding errors
```
:::

### Edit

Import in Audacity, open waveform (dB), fit vertically, cut the unnecessary,
export as raw:

![Audacity: Waveform (dB)](./img/audacity-cut.png)


### Encode back

```
ffmpeg \
  -v verbose \
  -ar 8000 \
  -ac 1 \
  -f s16le \
  -i cut.raw \
  -acodec libopencore_amrnb \
  cut.amr
```

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
