
var vehicle : GameObject;

function SetSelected() {
	print("I got selected... " + vehicle.name);
	//vehicle.SendMessage("SetSelected");
	
	// add the object to the list of selected GOs
	var go : GameObject = GameObject.Find("UnitManager");
	go.SendMessage("AddSelectedUnit", vehicle);
}
