// the one and only instance for the unit manager
private static var instance : UnitManager;
private var allUnitsList = new Array();
private var selectedUnitsList = new Array();
private var debugMode = false;

// accessor that delivers always the one and only instance of the UnitManager
// Use it like this: UnitManager.GetInstance().<function name>
static function GetInstance() : UnitManager {
	if (instance == null) {
		instance =  FindObjectOfType(UnitManager);
	}
	return instance;
}

function GetSelectedUnitsCount() {
	return selectedUnitsList.length;
}

function AddUnit(go : GameObject) {
	allUnitsList.Add(go);
	
	if (debugMode) {
		print("UnitManager: added unit: " + go.name);
	}
}

function AddSelectedUnit(go : GameObject) {
	selectedUnitsList.Push(go);
	go.SendMessage("SetUnitSelected", true);
	
	if (debugMode) {
		print("UnitManager: added selected unit: " + go.name);
	}
}

function ClearSelectedUnitsList() {
	if (debugMode) {
		print("ClearSelectedUnitsList");
	}
	
	for (var go : GameObject in allUnitsList) {
		go.SendMessage("SetUnitSelected", false);
	}
	selectedUnitsList.Clear();
}

function MoveSelectedUnitsToPoint(destinationPoint : Vector3) {
	for (var go : GameObject in selectedUnitsList) {
		if (debugMode) {
			print("MoveSelectedUnits: Moving unit " + go.name);
		}
		go.SendMessage("MoveToPoint", destinationPoint);
	}
}

function SelectUnitsInArea(point1 : Vector3, point2 : Vector3) {
	if (debugMode) {
		print("Select Units in area...");
	}
	
	if (point2.x < point1.x) {
		// swap x positions. Selection rectangle is beeing drawn from right to left
		var x1 = point1.x;
		var x2 = point2.x;
		point1.x = x2;
		point2.x = x1;
	}
	
	if (point2.z > point1.z) {
		// swap z positions. Selection rectangle is beeing drawn from bottom to top
		var z1 = point1.z;
		var z2 = point2.z;
		point1.z = z2;
		point2.z = z1;
	}
	
	for (var go : GameObject in allUnitsList) {
		var goPos : Vector3 = go.transform.position;
		//print("goPos:" + goPos + " 1:" + point1 + " 2:" + point2);
		if (goPos.x > point1.x && goPos.x < point2.x && goPos.z < point1.z && goPos.z > point2.z) {
			selectedUnitsList.Push(go);
	
			if (debugMode)
				print("Unit inside: " + go.name);
				
			go.SendMessage("SetUnitSelected", true);
		}
	}
}	

function Test() {
	print("UnitManager: Test!");
}

function OnApplicationQuit() {
	instance = null;
}


function SetTarget(newTarget : UnityEngine.GameObject)
{
//	print("new target: " + newTarget.name);
	
	for (var go : GameObject in selectedUnitsList) 
	{
		go.SendMessage("SetTarget", newTarget);
	}
}
