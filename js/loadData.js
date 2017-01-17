/**
 * @author Diego Migliavacca (https://github.com/diegomigliavacca)
 * @copyright SP7 Ritmare (http://www.ritmare.it)
 */

storage.check();
sessionStorage.clear();
// localStorage.clear();
if (localStorage.getItem("session") == null) {
	localStorage.setItem("session", "s");
} else if (localStorage.getItem("session") == "l" && localStorage.getItem("sessionName") != null) {
	storage.reloadWidgets();
}

var query_widgetoptions = "PREFIX def: <http://sp7.irea.cnr.it/rdfdata/schemas#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX sp7: <http://sp7.irea.cnr.it/rdfdata/project/> SELECT ?widget ?itemLabel ?isVisible ?itemTooltip ?icon ?label ?color ?address WHERE { ?widget rdf:type def:Widget . { ?widget def:icon ?icon; rdfs:label ?label; def:color ?color; def:address ?address; def:tooltip ?itemTooltip . } OPTIONAL { ?widget def:apiList/rdf:rest*/rdf:first ?item . ?item def:itemLabel ?itemLabel; def:isVisible ?isVisible . } }";
$.ajax({
	url : utils.endpoint,
	dataType : "json",
	type : "POST",
	data : {
		query : query_widgetoptions,
		format : "json"
	},
	success : function(result) {
		$.each(result, function(index, element) {
			$.each(element.bindings, function(i, el) {
				if (el.itemTooltip != undefined && el.icon != undefined && el.label != undefined && el.color != undefined && el.address != undefined) {
					var itemVal = el.widget.value;
					var widget = {
						widget : itemVal.substr(itemVal.lastIndexOf("#") + 1),
						itemTooltip : el.itemTooltip.value,
						icon : el.icon.value,
						color : el.color.value,
						address : el.address.value
					};
					if (el.itemLabel != undefined && el.isVisible != undefined && el.isVisible.value == "true") {
						widget["itemLabel"] = el.itemLabel.value;
						widget["isVisible"] = el.isVisible.value;
					};
				};
				if (jQuery.isEmptyObject(widget) == false) {
					var record = JSON.stringify(widget);
					sessionStorage.setItem(el.label.value + i, record);
				};
			});
		});
	}
}); 