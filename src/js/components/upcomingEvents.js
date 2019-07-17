import handleTemplate from "./handleTemplate";
export default function upcomingEvents( events, topicId ) {

    const populateRandomEvents = [];

 
  
		//if standard event
	if(topicId !== 212) {
		var filteredEvents = events.filter(x => x.topic.id !== topicId);
	} else {
		var filteredEvents = events;
	}
 
  for (var i = 0; i < events.length; i++) {
    populateRandomEvents.push(
      filteredEvents[Math.floor(Math.random() * filteredEvents.length)]
    );
  }

  
 
  for (var i = 0; i < 4; i++) {
    const options = {
      identifier: populateRandomEvents[i].identifier,
      groupSize: populateRandomEvents[i].maxGroupSize,
      eventId: populateRandomEvents[i].id,
      image: populateRandomEvents[i].imageURL
        ? populateRandomEvents[i].imageURL
        : "https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
      title: populateRandomEvents[i].title,
      startDate:
        moment(populateRandomEvents[i].startDate).format("Do MMMM") ==
        moment(Date.now()).format("Do MMMM")
          ? "TODAY"
          : moment(populateRandomEvents[i].startDate).format("Do MMMM"),
      startTime: populateRandomEvents[i].startTime,
      passion: populateRandomEvents[i].passions,
      suitables: populateRandomEvents[i].extra.eventtype,
      suitablesName: populateRandomEvents[i].extra.eventtypeName,
      passionColor: populateRandomEvents[i].extra.passionColor,
      description: populateRandomEvents[i].description
    };

    $(".relatedEvents__container").append(handleTemplate("eventTile", options));
}

}