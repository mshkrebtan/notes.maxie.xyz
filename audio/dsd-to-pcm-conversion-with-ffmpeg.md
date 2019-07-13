# DSD to PCM Conversion with FFmpeg

## Conversion

```
ffmpeg -i audio.dsf -codec:a pcm_f32be -f f32be audio.pcm
```

In parallel:

```
find . -name "*.dsf" -print0 \
  | parallel -0 --tmux --eta \
      "ffmpeg -i {} -codec:a pcm_f32be -f f32be {//}/{/.}.pcm"
```

DSD to PCM conversion results in a change to the sample rate. For example:

 - 2.8224 MHz 1-bit DSD samples will be converted to 352.8 kHz PCM samples; and

 - 5.6448 MHz 1-bit DSD samples will be converted to 705.6 kHz PCM samples.

## Downsampling with SoX

```
find . -name "*.pcm" -print0 \
  | parallel -0 --tmux --eta \
      "sox --show-progress \
        -c 2 -r 705600 -e float -b 32 -B -t raw \
        {} \
        -b 24 -t flac -C 5 \
        {//}/{/.}.flac \
        rate -v 88200"
```

Or you may want to change bit depth to 16 bit:

```
find . -name "*.pcm" -print0 \
  | parallel -0 --tmux --eta \
      "mkdir -p {//}/sox-out ; \
       mkdir -p {//}/sox-out/logs ; \
       sox --show-progress \
         --guard \
         -c 2 -r 705600 -e float -b 32 -B -t raw \
         {} \
         -b 16 -t flac -C 0 \
         {//}/sox-out/{/.}.flac \
         rate -v 44100 \
         dither -s \
         2>&1 \
           | tee {//}/sox-out/logs/{/.}.sox.log"
```

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
