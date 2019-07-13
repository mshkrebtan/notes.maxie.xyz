# Downsample Audio with SoX

## Tools you need

For audio downsampling you need these tools:

  * `ffprobe` (of the _FFmpeg_ framework);
  * `sox` (_SoX_ — Sound eXchange).

On a Mac install it with Homebrew:

```
brew install ffmpeg
brew install sox \
  --with-flac \
  --with-lame \
  --with-libao \
  --with-libsndfile \
  --with-libvorbis \
  --with-opencore-amr \
  --with-opusfile
```

## Probe the original audio file

To get the sampling rate of the original audio file, use the `ffprobe`
utility:

```
ffprobe -hide_banner original.flac
```
Output:
```
Input #0, flac, from 'original.flac':
  Duration: 00:41:49.26, start: 0.000000, bitrate: 5019 kb/s
    Stream #0:0: Audio: flac, 192000 Hz, stereo, s32 (24 bit)
```

## Determine the sampling rate your device supports

First, you have to find out the maximum sampling rate your device supports. For
example, the maximum playback sampling rate the iPod Classic (Gen. 6) supports
is 48 kHz.

The rule of thumb when downsampling is to divide the original sampling rate by
a power of 2. Hence, when downsampling a 192 kHz audio, the target sampling rate
should be 96 kHz (2:1 decimation) or 48 kHz (4:1 decimation). When downsampling
a 176 kHz (176.4 kHz, actually) audio, the target sampling rate should be 88.2
kHz or 44.1 kHz (2:1 and 4:1 decimation, respectively).

## Downsample with SoX

Downsampling with `sox` is relatively easy, you just have to use the _rate
effect_. You also have to set the phase and the quality. The [SoX
FAQ](http://sox.sourceforge.net/Docs/FAQ) states:

> Resampling is a series of compromises so there's no one true answer for all
situations, but the following rules of thumb should cover most people's needs
for 99% of the time:
> - Phase setting: if resampling to < 40k, use intermediate phase (`-I`)
otherwise use linear phase (`-L`, or don't specify; linear phase is the
default).
> - Quality setting: if resampling (or changing speed, as it amounts to the
  same thing) at/to > 16 bit depth (i. e. most commonly 24-bit), use VHQ
  (`-v`), otherwise, use HQ (`-h`, or don't specify).
> - Bandwidth setting: don't change from the default setting (95%).
> - If you're mastering to 16-bit, you also need to add _dither_ (and in most
cases noise-shaping) after the rate.

If you want to downsample a Hi-Res 192 kHz audio to 48 kHz (e. g. for an iPod
Classic), you should use the _rate_ effect with linear phase (the default one)
and the highest quality (VHQ). You can use the `--guard` option to
automatically invoke the _gain_ effect to guard against clipping.

```
sox --show-progress --guard original.flac downsampled.aiff rate -v 48k
```

If you're mastering to 16-bit depth:

```
sox --show-progress \
  --guard original.flac \
  -b 16 \
  downsampled.aiff \
  rate -v 48k \
  dither -s
```

### Downsample multiple files in parallel

To downsample a bunch of files in parallel you can use the GNU `parallel`
utility to run `sox`. By default `parallel` will run as many jobs as
possible bringing all the CPU cores into play.

On a Mac you can install `parallel` with Homebrew:

```
brew install parallel
```

For example, let us downsample all the Hi-Res FLAC files in the current
directory and its subdirectories and set the bit depth to 16 bits.

Use `find` to find all the files with names ending in `.flac` and pipe the
output to `parallel`:

```
find . -name "*.flac" -print0 \
  | parallel -0 --tmux --eta \
      "mkdir -p {//}/sox-out ; \
       mkdir -p {//}/sox-out/logs ; \
       sox --show-progress \
         --guard {} \
         -b 16 \
         -t flac \
         -C 0 \
         {//}/sox-out/{/.}.flac \
         rate -v 48k \
         dither -s \
         2>&1 \
           | tee {//}/sox-out/logs/{/.}.sox.log"
```

Use the `parallel` option `--tmux` to be able to view all the jobs in a `tmux`
session in real time. Use the option `--eta` to see the progress information.

After the downsampling is finished, you can inspect the logs for errors and
warnings.

You can use `grep`:

```
grep -r --include "*.log" -i "err \| warn" .
```

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
