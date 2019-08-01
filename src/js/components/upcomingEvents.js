import handleTemplate from "./handleTemplate";

let upcomingEventsPopulated = false
export default function upcomingEvents( events, topicId ) {

  // dont want to recall & populate events
  if (upcomingEventsPopulated) {
    return
  }
  upcomingEventsPopulated = true

    var populateRandomEvents = [];
    var filteredEvents = [];



		//if standard event
	if(topicId !== 212) {
		  filteredEvents = events.filter(x => x.topic.id !== topicId);
	} else {
		  filteredEvents = events;
  }

  //console.log('filteredEvents', filteredEvents.length);
 if(window.location.pathname === "/uk/explore/kings-cross/") {
  //homepage
  for (var i = 0; i < 4; i++) {
    populateRandomEvents.push(
      filteredEvents[i]
    );
  }



 } else {

  for (var i = 0; i < 4; i++) {
    populateRandomEvents.push(
      filteredEvents[Math.floor(Math.random() * filteredEvents.length)]
    );
  }

 }

 // get newest events & filter out any falsy elements
  var sorted_dates = populateRandomEvents.sort(function(a, b) {
    return  new Date(a.startISO) - new Date(b.startISO);
  }).filter(Boolean)

  // console.log("sorted dates", sorted_dates);

  // if there are no events, hide the related Events element
  if (!sorted_dates.length) {
    // assuming all related events are within a container with classes .section & .relatedEvents
    $(".section.relatedEvents").hide();
  } else {
    // if there are less than 4 events, add different layout style to container
    if (sorted_dates.length < 4) {
      $(".relatedEvents__container").addClass('relatedEvents__container--fewerThanFourEvents');
    }
    for (var i = 0; i < 4; i++) {
      // if element doesnt exist continue (shouldnt happen with filtering above ^^)
      if (!sorted_dates[i]) {
        continue;
      }
      const options = {
        identifier: sorted_dates[i].identifier,
        groupSize:  sorted_dates[i].maxGroupSize,
        eventId: sorted_dates[i].id,
        image: sorted_dates[i].imageURL
        ? sorted_dates[i].imageURL
        : "https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
        title: sorted_dates[i].title,
        startDate:
        moment(sorted_dates[i].startDate).format("Do MMMM") ==
        moment(Date.now()).format("Do MMMM")
        ? "TODAY"
        : moment(sorted_dates[i].startDate).format("Do MMMM"),
        // startTime: sorted_dates[i].startTime,
        startTime: (sorted_dates[i].startTime[0] == '0' ?  sorted_dates[i].startTime.substr(1) : sorted_dates[i].startTime),
        passion: sorted_dates[i].passions,
        suitables: sorted_dates[i].extra.eventtype,
        suitablesName: sorted_dates[i].extra.eventtypeName,
        passionColor: sorted_dates[i].extra.passionColor,
        description: sorted_dates[i].description
      };

      $(".relatedEvents__container").append(handleTemplate("eventTile", options));

  }

}

$(".relatedEvents__header__see").click(function() {
  window.location.href = "/uk/explore/kings-cross/whats-on/";
});

}
