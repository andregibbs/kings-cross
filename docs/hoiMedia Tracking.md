# KX HOI Media Tracking Events

Uses `src/js/util/GATracking.js` to fire GA events

<hr>

## PLAY

Will fire when media playback is started from stopped/paused

Includes percentage playback progress value [0-100] at time of event

```
{
  eventAction: "[0-100]%"
  eventCategory: "Media Play"
  eventLabel: MEDIA_FILE_NAME
}
```

<hr>

## PAUSE

Will fire when media playback is paused

Includes percentage playback progress value 0-100] at time of event

```
{
  eventAction: [0-100]%
  eventCategory: "Media Pause"
  eventLabel: MEDIA_FILE_NAME
}
```

<hr>

## PROGRESS

Will fire during playback when progress of the media passes 10% intervals

Includes percentage playback progress value of every 10% interval passed

```
{
  eventAction: [0,10,20,30,40,50,60,70,80,90,100]%
  eventCategory: "Media Progress"
  eventLabel: MEDIA_FILE_NAME
}
```

<hr>

## SEEK

Will fire when the playback position is manually changed

Includes percentage playback progress value of the playback position seeked to

```
{
  eventAction: [0-100]%
  eventCategory: "Media Seek"
  eventLabel: MEDIA_FILE_NAME
}
```

<hr>

## ENDED

Will fire when playback completes

```
{
  eventAction: 'Ended'
  eventCategory: "Media Ended"
  eventLabel: MEDIA_FILE_NAME
}
```
