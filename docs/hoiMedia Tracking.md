# KX HOI Media Tracking Events

Uses `src/js/util/GATracking.js` to fire GA events

<hr>

## PLAY

Will fire when media playback is started from stopped/paused

Includes percentage playback progress value [0-100] at time of event

```
{
  eventAction: "Play"
  eventCategory: "Media Event"
  eventLabel: MEDIA_FILE_NAME
  progress: [0-100]
}
```

<hr>

## PAUSE

Will fire when media playback is paused

Includes percentage playback progress value 0-100] at time of event

```
{
  eventAction: "Pause"
  eventCategory: "Media Event"
  eventLabel: MEDIA_FILE_NAME
  progress: [0-100]
}
```

<hr>

## PROGRESS

Will fire during playback when progress of the media passes 10% intervals

Includes percentage playback progress value of every 10% interval passed

```
{
  eventAction: "Progress"
  eventCategory: "Media Event"
  eventLabel: MEDIA_FILE_NAME
  progress: [0,10,20,30,40,50,60,70,80,90,100]
}
```

<hr>

## SEEK

Will fire when the playback position is manually changed

Includes percentage playback progress value of the playback position seeked to

```
{
  eventAction: "Seek"
  eventCategory: "Media Event"
  eventLabel: MEDIA_FILE_NAME
  progress: [0-100]
}
```

<hr>

## ENDED

Will fire when playback completes

```
{
  eventAction: "Ended"
  eventCategory: "Media Event"
  eventLabel: MEDIA_FILE_NAME
}
```
