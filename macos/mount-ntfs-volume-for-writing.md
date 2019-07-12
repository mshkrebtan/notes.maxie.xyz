# Mount NTFS Volume for Writing

```
sudo umount /Volumes/NTFS_VOLUME
sudo mount -t ntfs -o rw,auto,nobrowse /dev/disk3s1 ~/ntfs-volume
```

## References

- How to Enable NTFS Write Support in Mac OS X

    <https://osxdaily.com/2013/10/02/enable-ntfs-write-support-mac-os-x/>

- Mounty for NTFS

    <https://mounty.app/>

<br/>
<ClientOnly>
<Disqus shortname="notes-maxie-xyz" />
</ClientOnly>

<br/>
<div style="text-align: center; font-size: x-small">
    Allow loading scripts from disqus.com to see the comments.
</div>
