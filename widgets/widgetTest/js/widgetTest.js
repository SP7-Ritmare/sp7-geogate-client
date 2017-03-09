$("#dropdown-menu").on("click", "li a", function(e) {
	e.preventDefault();
	if (localStorage.getItem("widgetTest_message") == null) {
		var htmlArr = [];
	} else {
		var htmlArr = JSON.parse(localStorage.getItem("widgetTest_message"));
	}
	if ($(this).text() == "Add message") {
		var htmlString = '<p style="font-size:15px; color:navy;">added text number: ' + Math.random() + '</p>';
		$('#draggable1 iframe').contents().find('#messages').append(htmlString);
		htmlArr.push(htmlString);
	} else if ($(this).text() == "Delete message") {
		$('#draggable1 iframe').contents().find('#messages').children().last().remove();
		htmlArr.pop();
	} else if ($(this).text() == "Clear messages") {
		$('#draggable1 iframe').contents().find('#messages').empty();
		htmlArr = [];
	}
	localStorage.setItem("widgetTest_message", JSON.stringify(htmlArr));
});