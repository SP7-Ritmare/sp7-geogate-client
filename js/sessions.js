/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

$("#menusave").click(function() {
	if ($("#save-session-div").is(":visible")) {
		$("#save-session-div").fadeOut(1000);
		$(".wrap-icons").animate({
			"top" : "140px"
		}, "slow", "linear");
	} else {
		$("#save-session-div").fadeIn(1000);
		$(".wrap-icons").animate({
			"top" : "170px"
		}, "slow", "linear");
	}
	$("#save-session-input").val('');
});

function getVarValue(widget, variable) {
	if (widget == "Test") {
		if (localStorage.getItem("widgetTest_message") == null || variable != "message") {
			var arr = "[]";
		} else {
			var arr = localStorage.getItem("widgetTest_message").toString();
		}
	} else {
		var arr = "[]";
	}
	return arr;
};

function getVariablesValues(widget) {
	var vars = widgetOptions.varlabel(widget);
	var str = "";
	if ( typeof vars !== 'undefined' && vars.length > 0) {
		for (var i = 0; i < vars.length; i++) {
			var arrValues = getVarValue(widget, vars[i]);
			str += "[ def:varLabel '" + vars[i] + "'; def:varValue '" + arrValues + "'; def:varType xsd:string ]";
		};
	}
	return str;
};

function getWidgetList() {
	var widgetNames = storage.getWidgetNames();
	var str = "";
	for (var i = 0; i < widgetNames.length; i++) {
		if (widgetNames[i] == "My data") {
			var name = "Mydata";
		} else {
			var name = widgetNames[i];
		}
		str += "[ def:widgetName <http://sp7.irea.cnr.it/rdfdata/schemas/widget" + name + ">; def:stateVars ( " + getVariablesValues(widgetNames[i]) + " ) ]";
	};
	return str;
};

$('#save-session-btn').click(function() {
	var sessionName = $('#save-session-input').val();
	var query_insert = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> PREFIX ses: <http://sp7.irea.cnr.it/rdfdata/sessionData/> INSERT DATA { GRAPH <http://sp7.irea.cnr.it/rdfdata/sessionData> { <http://sp7.irea.cnr.it/rdfdata/sessions/session_" + Math.random() + "> a def:Session; def:sessionName '" + sessionName + "'; def:sessionOwner <" + localStorage.getItem("sessionOwner") + ">; def:widgetList ( " + getWidgetList() + " ) } }";
	$.ajax({
		url : utils.endpoint_update,
		type : "POST",
		headers : {
			Accept : "application/sparql-results+json"
		},
		data : {
			update : query_insert,
			format : "json"
		},
		success : function(result) {
			alert("session saved");
		}
	});
});