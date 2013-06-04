private var mouseButton1DownPoint : Vector2;
private var mouseButton1UpPoint : Vector2;
private var mouseButton1DownTerrainHitPoint : Vector3;
private var mouseButton2DownPoint : Vector2;
private var mouseButton2UpPoint : Vector2;
private var selectionPointStart : Vector3;
private var selectionPointEnd : Vector3;
private var mouseLeftDrag : boolean = false;
private var terrainLayerMask = 1 << 8;
private var nonTerrainLayerMask = ~terrainLayerMask;
private var raycastLength : float = 200.0;
// semi transparent texture for the selection rectangle
var selectionTexture : Texture;
// range in which a mouse down and mouse up event will be treated as "the same location" on the map.
private var mouseButtonReleaseBlurRange : int = 20;


function OnGUI() {
	if (mouseLeftDrag) {
		
		var width : int = mouseButton1UpPoint.x - mouseButton1DownPoint.x;
		var height : int = (Screen.height - mouseButton1UpPoint.y) - (Screen.height - mouseButton1DownPoint.y);
		var rect : Rect = Rect(mouseButton1DownPoint.x, Screen.height - mouseButton1DownPoint.y, width, height);
		GUI.DrawTexture (rect, selectionTexture, ScaleMode.StretchToFill, true);
	}
}

function Update ()
{
	// Left mouse button
	if (Input.GetButtonDown("Fire1")) {
			Mouse1Down(Input.mousePosition);
	}
	
	if (Input.GetButtonUp("Fire1")) {
			Mouse1Up(Input.mousePosition);
	}
	
	if (Input.GetButton("Fire1")) {
		// Used to determine if there is some mouse drag operation going on. 
		Mouse1DownDrag(Input.mousePosition);
	}
	
	// Right mouse button
	if (Input.GetButtonDown("Fire2")) {
		mouseButton2DownPoint = Input.mousePosition;
		Mouse2Down(Input.mousePosition);
	}
	
	if (Input.GetButtonUp("Fire2")) {
		mouseButton2UpPoint = Input.mousePosition;
		Mouse2Up(Input.mousePosition);
		// De-selection if right mouse button is pressed at the same point (more or less) where it was clicked down.
		// Use this inRange with a slight offset so if right mb was not released _exactly_ at the button down position, but with a slight offset.
//		if (IsInRange(mouseButton2DownPoint, mouseButton2UpPoint)) 
//		{
//			UnitManager.GetInstance().ClearSelectedUnitsList();
//		}
	}
}

function Mouse1DownDrag(screenPosition : Vector2) {
	// Only show the drag selection texture if the mouse has been moved and not if the user made only a single left mouse click
	if (screenPosition != mouseButton1DownPoint) {
		mouseLeftDrag = true;
		// while dragging, update the current mouse pos for the selection rectangle.
		mouseButton1UpPoint = screenPosition;
		
		var hit : RaycastHit;
		ray = Camera.main.ScreenPointToRay (screenPosition); 		
		if ( Physics.Raycast (ray, hit, raycastLength, terrainLayerMask) )
		{ 
			//print ("Hit Terrain 2 " + hit.point);
			selectionPointEnd = hit.point;
			UnitManager.GetInstance().ClearSelectedUnitsList();
			UnitManager.GetInstance().SelectUnitsInArea(selectionPointStart, selectionPointEnd);
		}	
	}
}

function Mouse1Down(screenPosition : Vector2) {
		
		mouseButton1DownPoint = screenPosition;
		
		var hit : RaycastHit;
		var ray = Camera.main.ScreenPointToRay (mouseButton1DownPoint); 
		//Debug.DrawRay (ray.origin, ray.direction * 100.0, Color.green); 
		if ( Physics.Raycast (ray, hit, raycastLength) ) // terrainLayerMask
		{ 
			if (hit.collider.name == "Terrain")
			{
				mouseButton1DownTerrainHitPoint = hit.point;
				selectionPointStart = hit.point;
			} 
			else
			{
				//print ("Mouse Down Hit something: " + hit.collider.name);

				// Ray hit a unit, not the terrain. Deselect all units as the fire 1 up 
				// event will then select that just recently clicked unit!
				UnitManager.GetInstance().ClearSelectedUnitsList();
			}
			//Debug.DrawRay (ray.origin, ray.direction * 100.0, Color.green); 	
		}
}

function Mouse1Up(screenPosition : Vector2) {
	
	mouseButton1UpPoint = screenPosition;
	var hit : RaycastHit;
	
	//print("currently selected units: " + UnitManager.GetInstance().GetSelectedUnitsCount());	
	mouseLeftDrag = false;
	
	if (IsInRange(mouseButton1DownPoint, mouseButton1UpPoint)) {
		// user just did a click, no dragging. mouse 1 down and up pos are equal.
		// if units are selected, move them. If not, select that unit.
		if (UnitManager.GetInstance().GetSelectedUnitsCount() == 0) {
			// no units selected, select the one we clicked - if any.
			ray = Camera.main.ScreenPointToRay (mouseButton1DownPoint);
			if ( Physics.Raycast (ray, hit, raycastLength, nonTerrainLayerMask) )
			{ 
				// Ray hit something. Try to select that hit target. 
				//print ("Hit something: " + hit.collider.name);
				hit.collider.gameObject.SendMessage("SetSelected");
			}
							
		} else {
			// untis are selected, move them. Unit Manager's unit count is > 0!
			UnitManager.GetInstance().MoveSelectedUnitsToPoint(mouseButton1DownTerrainHitPoint);
		}	
	}	
}


function IsInRange(v1 : Vector2, v2 : Vector2) : boolean {
	var dist = Vector2.Distance(v1, v2);
	print("Left click release button distance: " + dist);
	if (Vector2.Distance(v1, v2) < mouseButtonReleaseBlurRange) {
		return true;
	}
	return false;
}

function Mouse2Down(screenPosition : Vector2)
{

}

function Mouse2Up(screenPosition : Vector2)
{
	ray = Camera.main.ScreenPointToRay (screenPosition);
	var hit : RaycastHit;
	
	if ( Physics.Raycast (ray, hit, raycastLength, nonTerrainLayerMask) )
	{ 
		// Ray hit something. Try to select that hit target. 
		//print ("Hit something: " + hit.collider.name);
//		hit.collider.gameObject.SendMessage("SetSelected");
//		print(hit.collider.gameObject.tag);
		UnitManager.GetInstance().SetTarget(hit.collider.gameObject);
	}
}