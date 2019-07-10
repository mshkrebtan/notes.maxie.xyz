# Silence the Startup Chime on a Mac

Run: 

``` bash
sudo nvram SystemAudioVolume=%80
```

To get the chime back:

``` bash
sudo nvram -d SystemAudioVolume
```
