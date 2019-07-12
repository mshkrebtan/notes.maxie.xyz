# Change Intel i915's PWM Frequency on Boot

The problem with PWM frequency is described in ArchLinux Wiki:
[Backlight](https://wiki.archlinux.org/index.php/backlight#Backlight_PWM_modulation_frequency_.28Intel_i915_only.29)

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
calculate it here: [Eliminate LED screen flicker with Intel
i915](http://devbraindom.blogspot.ru/2013/03/eliminate-led-screen-flicker-with-intel.html).


## References

- Random thoughts: Eliminate LED screen flicker with Intel i915

    <http://devbraindom.blogspot.com/2013/03/eliminate-led-screen-flicker-with-intel.html>

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" />
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
