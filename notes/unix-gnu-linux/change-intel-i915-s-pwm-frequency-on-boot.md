---
comments: true
tags:
  - linux
  - thinkpad
---

# Change Intel i915's PWM Frequency on Boot

The problem with PWM frequency is described in [ArchLinux
Wiki](https://wiki.archlinux.org/index.php/backlight#Backlight_PWM_modulation_frequency_.28Intel_i915_only.29)[^archlinux-wiki].

[^archlinux-wiki]: Backlight - ArchWiki, [no
    date]. Online. [Accessed 9 June 2023]. Available from:
    https://wiki.archlinux.org/title/backlight#Backlight_PWM_modulation_frequency_.28Intel_i915_only.29


To set desired PWM frequency on boot, create a `systemd` service file:

```
/etc/systemd/system/pwmfrequency@.service
```

with the following content:

```
[Unit]
Description=LED PWM frequency
After=graphical.target

[Service]
ExecStart=/usr/bin/intel_reg write 0xC8254 %I
Type=oneshot
RemainAfterExit=yes

[Install]
WantedBy=default.target
```

Finally, create a `systemd` service:

```
systemctl enable pwmfrequency@0x7a107a1
```

The hex number after the '@' symbol is the desired PWM frequency value. You can
calculate it here: [Eliminate backlight flicker with Intel i915 |
127.0.0.1](https://127001.me/post/eliminate-backlight-flicker-with-i915/)[^1].

[^1]: Eliminate backlight flicker with Intel i915 | 127.0.0.1, [no
    date]. Online. [Accessed 9 June 2023]. Available from:
    https://127001.me/post/eliminate-backlight-flicker-with-i915/
