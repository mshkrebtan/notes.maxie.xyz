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

MPD is a server application (hence the name — Music Player **Daemon**), and it
does not have a GUI to interact with. Instead, you need to edit its
configuration file located at `/etc/mpd.conf/`. It's not the only file you need
to edit, so the best way to go is to open a terminal emulator and use a
terminal text editor, such as Vim, Emacs or Nano.

::: warning
This guide assumes that you are using Ubuntu or any other Debian-based Linux
distro and use Vim as text editor. If you are using a different editor (say,
Emacs) just substitute `vim` for it in the command line instructions cited
in this guide.

If you do not know how to exit Vim, press `:q!` to quit without saving changes.

If you want to use a simple and friendly editor, use Nano (`nano`).
:::

::: tip
If you want to learn Vim and find out why so many people love it, run
`vimtutor` and have a tutorial on how to use Vim.
:::

::: tip
If you do not feel comfortable with a command-line interface at all, you can
run a file browser as the superuser and edit files in graphical text editors.
To do this on Ubuntu 18.04, for example, open a terminal emulator and run:

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


### MPD Configuration

First, you need to install MPD on your computer.

You can either build MPD from source code or install it from the official
repositories of your Linux distribusion.

To install MPD on Ubuntu, run:

```
sudo apt-get update
sudo apt-get install mpd
```

Check the status of the `mpd` service. If your Linux distro has the `systemd`
service manager (Ubuntu switched to `systemd` in version 15.04), run the
following command:

```
sudo systemctl status mpd.service
```

::: output If MPD is running, you will see a similar output:
```
● mpd.service - Music Player Daemon
   Loaded: loaded (/lib/systemd/system/mpd.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2019-10-04 00:45:52 MSK; 14s ago
     Docs: man:mpd(1)
           man:mpd.conf(5)
           file:///usr/share/doc/mpd/user-manual.html
 Main PID: 11181 (mpd)
    Tasks: 3 (limit: 4915)
   Memory: 12.6M
      CPU: 511ms
   CGroup: /system.slice/mpd.service
           └─11181 /usr/bin/mpd --no-daemon

Oct 04 00:45:52 nuc systemd[1]: Starting Music Player Daemon...
Oct 04 00:45:52 nuc mpd[11181]: hybrid_dsd: The Hybrid DSD decoder is disabled because it was not explicitly enabled
Oct 04 00:45:52 nuc systemd[1]: Started Music Player Daemon.
```
:::

Now you need to configure your MPD server. Refer to the official [MPD
documentation](https://www.musicpd.org/doc/html/user.html#configuration) to
learn about the supported settings and their values.

MPD reads its configuration from a text file. Usually, that is `/etc/mpd.conf`,
unless a different path is specified on the command line. To edit the
configuration file, run:

```
sudo vim /etc/mpd.conf
```

The following example shows my personal MPD configuration:

<<< @/audio/files/mpd.conf

Now let us analyse it line by line. Here I will quote the official
documentation quite a lot.


#### Music directory

When you play local files, you should organize them within a directory called
the “music directory”. This is configured in MPD with the
[`music_directory`](https://www.musicpd.org/doc/html/user.html#configuring-the-music-directory)
setting:

@[code transclude={1-1}](@/audio/files/mpd.conf)

Here `/media/Media` is where my external HDD drive is mounted into the root
filesystem. Ubuntu usually mounts external drives to `/media`. `Music` is the
folder where I keep most of my music on the drive.


#### Database

If a music directory is configured, one database plugin is used. To configure
this plugin, add a
[database](https://www.musicpd.org/doc/html/user.html#configuring-database-plugins) block to mpd.conf:

@[code transclude={3-6}](@/audio/files/mpd.conf)

`simple` is the default plugin. It stores a copy of the database in memory. A
file is used for permanent storage.


#### The state file

The [state file](https://www.musicpd.org/doc/html/user.html#the-state-file) is
a file where MPD saves and restores its state (play queue, playback position
etc.) to keep it persistent across restarts and reboots. It is an optional
setting.

MPD will attempt to load the state file during startup, and will save it
when shutting down the daemon. Additionally, the state file is refreshed
every two minutes (after each state change).

@[code transclude={8-8}](@/audio/files/mpd.conf)


#### The sticker database

[“Stickers”](https://www.musicpd.org/doc/html/user.html#the-sticker-database)
are pieces of information attached to songs. Some clients use them to store
ratings and other volatile data.

@[code transclude={9-9}](@/audio/files/mpd.conf)


#### Playlist directory

Stored playlists are some kind of secondary playlists which can be created,
saved, edited and deleted by the client. They are addressed by their names. Its
contents can be loaded into the queue, to be played back. The
[playlist_directory](https://www.musicpd.org/doc/html/user.html#stored-playlists)
setting specifies where those playlists are stored:

@[code transclude={10-10}](@/audio/files/mpd.conf)

#### Log file

The `log_file` parameter specifies where the log file should be located. The
special value `syslog` makes MPD use the local syslog daemon:

@[code transclude={12-12}](@/audio/files/mpd.conf)

::: tip
If you set the `log_file` to `syslog` and your Linux distro runs `systemd`
service manager (Ubuntu switched to `systemd` in version 15.04), you can use
`journalctl` to view logs in real time:

```
sudo journalctl -u mpd.service -f
```
:::

#### Log level

The `log_level` parameter specifies how verbose the logs are. Set `log_level`
to `verbose` to make MPD record excessive amounts of information for debugging
purposes, in case you need to find out why your MPD is not working.

@[code transclude={13-13}](@/audio/files/mpd.conf)

In my configuration I commented out the `log_level` parameter completely with
the `#` symbol.

::: tip
When MPD loads its configuration, it ignores lines that start with the `#`
symbol. If an optional parameter is not set in the configuration or you
commented it out, MPD will use a default value for it.

The default value for `log_level` is… `default`, which means minimal logging.
:::

When I was doing my initial setup of MPD, I set `log_level` to `verbose` to
understand how different configuration parameters change the way MPD works.
When I was done with the configuration, I commented `log_level` out and
restarted MPD to return it back to the default minimal logging.


#### MPD process user

The `user` parameter specifies the user that MPD will run as, if set. MPD
should never run as root, and you may use this option to make MPD change its
user id after initialization.

@[code transclude={15-15}](@/audio/files/mpd.conf)

To create a system user for MPD, run:

```
sudo useradd -G audio -r mpd
```

This will create a system user `mpd` and add it to group `audio`, which allows
direct access to sound hardware.


#### Zeroconf name

Via Zeroconf, MPD can announce its presence on the network. Zeroconf in MPD is
enabled by default. You can specify the service name to publish via Zeroconf
with the `zeroconf_name` setting. This is the name that MPD clients display
when you connect to your MPD server.

@[code transclude={16-16}](@/audio/files/mpd.conf)

Now restart MPD:

#### Auto update

MPD supports automatic update of music database when files are changed in
the `music_directory`. You can freely enable automatic update unless you mount
network filesystems, such as NFS, inside your music directory. The thing is
that for automatic updates MPD relies on the Linux kernel subsystem `inotify`
which provides a mechanism for monitoring filesystem events. Unfortunately,
`inotify` cannot track changes on remote filesystems.

I store a part of my music library on a remote server and mount it via NFS. I
had issues with automatic update because of that and had to disable this
feature.

@[code transclude={17-17}](@/audio/files/mpd.conf)

#### Resampler

Sometimes, music needs to be resampled before it can be played; for example,
when you want to play high-res audio with 192 kHz sampling rate, while your DAC
can only handle 96 kHz. Resampling reduces the quality and consumes a lot of
CPU. There are different options, some of them optimized for high quality and
others for low CPU usage, but you can’t have both at the same time. Often, the
resampler is the component that is responsible for most of MPD’s CPU usage.
Since MPD comes with high quality defaults, it may appear that MPD consumes
more CPU than other software.

Check the [Resampler
plugins](https://www.musicpd.org/doc/html/plugins.html#resampler-plugins)
reference for a list of resamplers and how to configure them. Out of all the
resampler plugins, `libsamplerate`, also known as Secret Rabbit Code (SRC),
with the "Best Sinc" interpolator (interpolator type `0`) provides the best
quality.

The resampler can be configured in a block named `resampler`:

@[code transclude={19-22}](@/audio/files/mpd.conf)


#### ReplayGain

If `replaygain` is specified, MPD will adjust the volume of songs played
using ReplayGain tags. We do not want our audio signal to change until it
reaches the analog stage, so we disable ReplayGain completely:

@[code transclude={23-23}](@/audio/files/mpd.conf)


#### Input plugins

By default, MPD runs with Tidal and Qobuz plugins enabled. If you don't use
these services, just disable the plugins:

@[code transclude={25-33}](@/audio/files/mpd.conf)

#### Audio outputs

Now it's time to configure audio outputs!

Each audio output is configured in a separate `audio_output` block. You can
configure multiple outputs and turn them on/off via your MPD client
application.

Each output's functionality is provided by an output plugin. You can find more information in the [Output plugins](https://www.musicpd.org/doc/html/plugins.html#output-plugins) reference.

::: tip
There are several rules you need to follow to achieve bit-perfect playback with
MPD:

- Use the ALSA output plugin.
- Disable sound processing inside ALSA by configuring a “hardware” device
  (`hw:0,0` or similar).
- Don't use software volume control (setting `mixer_type`).
- If you control volume on a pre-amp, set the souncard's (i. e. “hardware”)
  mixer volume to 0 dB full scale. For that run `alsamixer`, press F6, choose
  your soundcard, select the mixer and adjust the volume.
- Don't force MPD to use a specific audio format (settings `format`,
  `audio_output_format`).

:::

Below is the audio output configuration that I use for my Arcam irDAC-II:

@[code transclude={35-47}](@/audio/files/mpd.conf)

Let's analyse it line by line.

- (2) `type` is the name of the audio output plugin.

- (3) `name` sets the name of the audio output. You will see it in an MPD
  client.

- (4) `device` sets the device name.

   This can be any valid ALSA device name, but we need to tell ALSA to access
   the hardware device directly, by specifying PCM type `hw` followed by the
   sound card number and the device number. A third number can be added
   (`hw:0,0,0`) for the sub-device number, but it defaults to the next
   sub-device available. The numbers start from zero, so, for example, to
   access the first device on the second sound card, you would use `hw:1,0`.

   Refer to the [Permanent index value for the sound
   card](./#permanent-index-value-for-the-sound-card-recommended) section on
   how to find and permanently set the sound card index number. Usually, sound
   cards in DACs control only one device, so the device number would be `0`.

   For my Arcam irDAC's sound card, I permanently set the index value to `1`,
   so I address to it as `hw:1,0`.

- (6, 7, 8) The `auto_resample`, `auto_channels` and `auto_format` settings are
    disabled, so ALSA will not attempt to resample, convert between different
    channel numbers and sample formats (16 bit, 24 bit, etc.)

- (9) If `dop` is set to yes, then DSD over PCM according to the [DoP
  standard](http://dsd-guide.com/dop-open-standard) is enabled. This wraps DSD
  samples in fake 24 bit PCM, and is understood by some DSD capable products,
  but may be harmful to other hardware. The default value is `no` and you can
  enable the option at your own risk.

   Although Arcam lists DSD128 in the audio formats supported by irDAC, irDAC
   does not support native DSD and plays DSD128 only via DoP. That is why I
   enabled it.

- (11) `mixer_type` specifies which mixer should be used for the audio
    output: hardware, software, null or none.

   The rule of thumb here is not to
   use sound card mixers, if possible, and adjust the volume on a pre-amp. This
   is what I do with the irDAC.

   However, sometimes you might want to use the mixer on your device. See the
   next audio output configuration for an example on that.

- (12) `replay_gain_handler` specifies how replay gain is applied. The default
  is `software`, which uses an internal software volume control. `mixer` uses
  the configured (hardware) mixer control. `none` disables replay gain on this
  audio output.

   As I do not use neither software, nor hardware mixers, I explicitly disable
   replay gain on this audio output.

---

The next configuration example is the audio output configuration I use for my
second DAC — AudioQuest DragonFly Black v1.5:

@[code transclude={49-63}](@/audio/files/mpd.conf)

As you can see, it’s almost the same as the previous configuration. What’s
different here is the `device` name , `mixer_type` and `replay_gain_handler`:

- (4) The `device` is set to `hw:2,0`, as the DragonFly’s soundcard is using
  index number `2`.

- (10) As I cannot control the volume on the DragonFly’s pre-amp physically,
  I need to use its mixer. That’s why `mixer_type` is set to `hardware`.

- (11) `mixer_device` should address the soundcard (without the subdevice
  index).

- (12) `mixer_control` specifies a mixer control, defaulting to `PCM`. Run
  `amixer --card N scontrols` to get a list of available mixer controls on the
  soundcard.

- (13) `mixer_index` specifies a mixer control index. This is necessary if
  there is more than one control with the same name. Defaults to 0 (the first
  one).

- (14) `replay_gain_handler` is set to `mixer`. If I enable
    [ReplayGain](./#replaygain), MPD will adjust the volume using the hardware
    mixer specified above.

---

When you are done with configuration, save the changes in the file (in Vim,
type `:wq`) and restart MPD:

```
sudo systemctl restart mpd.service
```

Now connect to it with your client and put some music on playback!

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
