# Bit-Perfect Hi-Res Audio Player on Linux with MPD

_Build a custom audiophile quality digital audio player with a Linux PC,
MPD and a USB DAC._


## Problem

If you have a growing digital collection of music titles, you might be
considering buying a network audio player to provide audiophile quality
playback. However, being an excellent all-in-one and easy to set up devices,
network audio players still have limitations:

- they might have a built-in DAC, which you cannot swap;

- they might not support some storage devices, such as external HDD;

- they might not support some audio formats, take DSD128 for example;

- they are usually controlled with a mobile app, which might be inconvenient or
  buggy;

- they are rather expensive!


## Solution

An alternative to a ready-made network audio player would be a PC with proper
software and a USB DAC.

When it comes to the software, my personal recommendation would be to go with
[Music Player Daemon (MPD)](https://www.musicpd.org/). It is an extremely
flexible, powerful, server-side application for playing music.

MPD features:

- support of
  [ALSA](https://en.wikipedia.org/wiki/Advanced_Linux_Sound_Architecture)
  output and hence bit-perfect playback;

- a great variety of audio formats supported (plays virtually anything);

- a wide selection of clients available, from console to mobile apps, for
  remote playback control;

- you can play music from any storage device, be it an external HDD, a USB
  drive, a memory card, an optical disk or a NAS volume.

And it is free! Just as Linux.


## Prerequisites


### Computer

MPD runs on Windows, macOS, BSD, Linux and other UNIX-like operating systems.
But if you want to achieve *bit-perfect* playback, the best and (probably) the
only option is to run it on Linux.

A part of Linux is ALSA (Advanced Linux Sound Architecture) — a set of
built-in Linux kernel modules that provide an interface (API) for sound card
device drivers. ALSA handles automatic configuration of sound-card hardware and
multiple sound devices.

With ALSA you can configure a direct sound output without any processing
(e. g. resampling) in between the audio player and the sound card. ALSA is
supported by all Linux audio players including MPD.

That said, you will need any computer that can run Linux. Even a single-board
ARM-powered computer, such as Raspberry Pi, will do.

As for me, I needed something more powerful than a Raspberry Pi, that's why I
bought an Intel NUC mini-PC unit with an x86-64 CPU, and installed RAM and SSD
in it — payed less than $250 for everything. My NUC is running Debain Linux. I
installed strongSwan VPN server and an NFS server on it to make my media
library available throughout the network, and PLEX server for video streaming.
And of course, I installed MPD and configured it to output audio through ALSA
to my Arcam irDAC-II connected via USB.


### Linux Distro

So, you will need to install a Linux distribusion on your computer, if you
are not using it already.

Linux by itself is just a kernel. If you want a complete operating system, you
need to choose and install a Linux distribusion which includes the Linux
kernel, package manager and a collection of software. My personal choice is
[Debian](https://www.debian.org/). If you are new to Linux, I would recommend
you to start with [Ubuntu](https://ubuntu.com/).

In case you are going to run MPD on a server, consider installing a server
variant of the distribusion of your choice. Although my Intel NUC has an HDMI
output for connecting a display, I do not use it as a desktop computer.
Instead, I interact with it through remote command-line interface (via SSH) and
I control MPD playback on my iPhone. I do not need a window system, a window
manager, or a desktop environment, and server distribusions do not include
these.


### USB DAC

If you want to get the best sonic quality, you will need an good external
Digital-to-analog converter (DAC). There are plenty of DACs available and you
have to choose one by yourself. The one I use is [Arcam
irDAC-II](https://www.arcam.co.uk/products,rSeries,USB-DAC,irdacii.htm). Back
in the day, I bought it for a very good price. If you want to get a very good
value for money, consider a DAC from [Emotiva](https://emotiva.com/) or
[Schiit](https://www.schiit.com/).


## Setup

So, you have Linux running on your computer, a DAC attached to it via USB and
your music library mounted in the filesystem. Time to set up MPD!

MPD is a server application (hence the name — Music Player Deamon), and it does
not have a GUI to interact with. Instead, you need to edit its configuration
file located at `/etc/mpd.conf/`. It's not the only file you need to edit, so
the best way to go is to open a terminal emulator and use a terminal text
editor, such as Vim, Emacs or Nano.

This guide assumes that you are using Ubuntu or any other Debian-based Linux
distro and use `vim` as text editor.

::: tip
If you don't feel comfortable with a command-line interface, you can run a file
browser as the superuser and edit files in graphical text editors. To do this
on Ubuntu 18.04, for example, open a terminal emulator and run:

```
sudo nautilus
```
:::


### Permanent index value for the sound card (Recommended)

::: tip Optional step
This step is optional and you might skip it if you have
only one external audio device that you connect to your computer. However, I do
recommend to set up permanent index values for your sound devices if you have
many of them.
:::

Every time you connect your DAC to your computer, the _Generic USB Audio
Driver_ (the `snd-usb-audio` kernel module) assigns an index value to the DAC's
sound card. You will need to specify this value in the output configration of
MPD. When you have multiple audio devices and you connect and disconnect them
often, the `snd-usb-audio` module might assign different index values for the
same device each time you reconnect it. To make sure that an MPD output (and
you can configure multiple outputs!) is always using the same device, you might
want to assign permanent index values to each device.

To assign permanent index values, you need to set them in the `snd-usb-audio`
module options.


#### List the soundcards

First, find out which index values are already used for other sound devices.
Disconnect your DAC(s) and list all the soundcards:

```
aplay -l
```

::: output Example output:
```
**** List of PLAYBACK Hardware Devices ****
card 0: PCH [HDA Intel PCH], device 0: ALC283 Analog [ALC283 Analog]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 1: ALC283 Digital [ALC283 Digital]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 3: HDMI 0 [HDMI 0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 7: HDMI 1 [HDMI 1]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 8: HDMI 2 [HDMI 2]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
:::

In the example output above you see that index `0` is assigned to the `HDA
Intel PCH` soundcard. This is a soundcard integrated into the motherboard.

When you connect your DAC, its sound card gets a free index. Let's see what
happens when I connect my Arcam irDAC-II:

::: output A USB DAC connected
```
**** List of PLAYBACK Hardware Devices ****
card 0: PCH [HDA Intel PCH], device 0: ALC283 Analog [ALC283 Analog]
  Subdevices: 1/1
...
card 1: II [irDAC II], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
:::

From this output you see that soundcard `irDAC II` got an index value of `1`
and it controls only one audio device `0` named simply `USB Audio`.

Let's make the soundcard index `1` permanent for `irDAC II`.

#### Find the VID and PID of your DAC

To do this you need to find out the Vendor ID (VID) and the Product ID (PID) of
your USB DAC. These values identify a plugged USB device. List all the attached
USB devices and try to find your DAC. For example:

```
lsusb
```

::: output Output:
```
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 8087:0aa7 Intel Corp.
Bus 001 Device 073: ID 25c4:0008
Bus 001 Device 058: ID 1058:25a2 Western Digital Technologies, Inc.
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```
:::

Most likely, you will not see the vendor name of your device in the list. To
understand which device is your DAC, try to disconnect the DAC, list the USB
devices, reconnect the DAC and print the list again to see what IDs appeared in
the list. You can also increase the verbosity of `lsusb` output with the
`--verbose` option:

```
lsusb --verbose
```

In the verbose output try to search for terms `Audio` and/or `Control Device`.

With the help of the disconnect-list-connect-list-again method I found out that
my DAC is denoted as `Bus 001 Device 073: ID 25c4:0008` line in the `lsusb`
output. Here `25c4` is the Vendor ID and `0008` is the Product ID.


#### Set a permanent index for your DAC

Let's edit the `/etc/modprobe.d/alsa-base.conf` and set options for the
`snd-usb-audio` module. First, open the file in a text editor:

```
sudo vim /etc/modprobe.d/alsa-base.conf
```

According to the [ALSA Project
documentation](https://alsa-project.org/wiki/Matrix:Module-usb-audio), the
values of module options for `snd-usb-audio`, such as `index`, `vid` and `pid`,
should be arrays of integers. Below is an example of how to set the options,
just add that single line to the file:

::: output /etc/modprobe.d/alsa-base.conf:
```
options snd-usb-audio index=1 vid=0x25c4 pid=0x0008
```
:::

Note that VID and PID are hexadecimal numbers, so you need to prefix them with
`0x`.

If you want to assign another permanent index value to another sound device of
yours, add its index number, VID and PID to the corresponding arrays. Use
commas to separate the values in the arrays.

In the following example I assign index `2` to my second DAC — a Dragonfly
Black — which has a VID `21b4` and PID `0083`:

::: output /etc/modprobe.d/alsa-base.conf:
```
options snd-usb-audio index=1,2 vid=0x25c4,0x21b4 pid=0x0008,0x0083
```
:::

When you set the proper values, write the file (use `:wq` in Vim) and reload
the `snd-usb-audio` kernel module:

```
sudo modprobe -r snd-usb-audio
sudo modprobe snd-usb-audio
```

That's it! You can now check your USB devices list while
disconnecting/connecting your audio devices in random order and see that each
device gets the same index number every time you connect it.


### MPD

Install MPD:

```
sudo apt-get update
sudo apt-get install mpd
```

Edit the MPD configuration file (`/etc/mpd.conf`) in order to specify the
required and optional files and directories. Here is my configuration, for
example:

<<< @/audio/files/mpd.conf

Now restart MPD:

```
sudo systemctl restart mpd.service
```

Connect to it with your client!

::: warning
This guide is being updated. Stay tuned!‥
:::

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" language="en"/>
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
