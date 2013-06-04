var speed = 1.0; 
private var sensitivity = (Screen.width / 15.0);//10.0;   // Number of pixels from edge 
private var moveDirection = Vector3.zero; 

var tank : GameObject;

var mouseButton1DownPoint : Vector2;
var mouseButton1UpPoint : Vector2;
var mouseButton1DownTerrainHitPoint : Vector3;

var mouseButton2DownPoint : Vector2;
var mouseButton2UpPoint : Vector2;

var mouseLeftDrag : boolean = false;
var mouseRightDrag : boolean = false;

var leftRectStart : Vector3;
var leftRectEnd : Vector3;

var lineRenderer : LineRenderer;

private var unitManager : UnitManager;

private var terrainLayerMask = 1 << 8;
private var nonTerrainLayerMask = ~terrainLayerMask;
private var raycastLength : float = 1000.0;



function Start() {
	unitManager = GameObject.Find("UnitManager").GetComponent(UnitManager);
}

function Awake () 
{ 
   //~ var controller : CharacterController = GetComponent(CharacterController); 
   //~ if (!controller) 
      //~ gameObject.AddComponent("CharacterController"); 
	
	// Set initial position / height
	//transform.position = Vector3(432, 53, -46);
}

function FixedUpdate() { 

	mousePos = Input.mousePosition; 
	moveX = 0.0; 
	moveY = 0.0; 
	
	//print("Mouse Pos: " + mousePos.x + " " + mousePos.y);

	if (mousePos.x <= sensitivity) { 
		//moveX = Input.GetAxis("Mouse X")*10; 
		moveY = -1.0 * speed;
	}
	if (mousePos.x >= Screen.width - sensitivity) { 
		moveY = 1.0 * speed;         
	} 
	if (mousePos.y <= sensitivity) { 
		moveX = 1.0 * speed; 
	} 
	if (mousePos.y >= Screen.height - sensitivity) { 
		moveX = -1.0 * speed; 
	} 

	//moveDirection = new Vector3(moveY, 0, -moveX); 
	// Translating so move relative to where the camera currently is located
	//transform.Translate(moveDirection); 
	//moveDirection *= speed; 
    
	// Move the controller 
	//var controller : CharacterController = GetComponent(CharacterController); 
	//controller.Move(moveDirection * Time.deltaTime); 
} 

// function OnDrawGizmos () {
// 	Gizmos.color = Color.red;
// 	Gizmos.DrawRay(rectStart, Vector3.up * 10);
// }

function Update ()
{
	if (Input.GetButtonDown("Fire1"))
	{
		mouseButton1DownPoint = Input.mousePosition;
		
		var hit : RaycastHit;
		var ray = Camera.main.ScreenPointToRay (Input.mousePosition); 
		//Debug.DrawRay (ray.origin, ray.direction * 100.0, Color.green); 
		if ( Physics.Raycast (ray, hit, raycastLength) ) // terrainLayerMask
		{ 
			if (hit.collider.name == "Terrain")
			{
				print ("Mouse Down Hit Terrain " + hit.point);
				
				//MoveSelectedUnitsToPoint(hit.point);
				mouseButton1DownTerrainHitPoint = hit.point;
				
				leftRectStart = hit.point;
				lineRenderer.SetPosition(0, leftRectStart);
				lineRenderer.SetPosition(1, leftRectEnd);
				mouseLeftDrag = true;
			} 
			else
			{
				print ("Mouse Down Hit something: " + hit.collider.name);
				//hit.collider.gameObject.SendMessage("SetSelected");
				// Ray hit a unit, not the terrain. Deselect all units as the fire 1 up 
				// event will then select that just recently clicked unit!
				ClearSelectedUnitsList();
			}
			//Debug.DrawRay (ray.origin, ray.direction * 100.0, Color.green); 	
		}
	}
	
	if (Input.GetButtonUp("Fire1")) 
	{
		mouseButton1UpPoint = Input.mousePosition;
		print("units? " + unitManager.GetSelectedUnitsCount());
		
		if (mouseButton1DownPoint == mouseButton1UpPoint) {
			// user just did a click, no dragging. mouse 1 down and up pos are equal.
			// if units are selected, move them. If not, select that unit.
			if (unitManager.GetSelectedUnitsCount() == 0) {
				// no units selected, select the one we clicked - if any.
				ray = Camera.main.ScreenPointToRay (Input.mousePosition);
				if ( Physics.Raycast (ray, hit, raycastLength, nonTerrainLayerMask) )
				{ 
					// Ray hit something. Try to select that hit target. 
					//print ("Hit something: " + hit.collider.name);
					hit.collider.gameObject.SendMessage("SetSelected");
				}
								
			} else {
				// untis are selected, move them. Unit Manager's unit count is > 0!
				MoveSelectedUnitsToPoint(mouseButton1DownTerrainHitPoint);
			}
			
		} else {
			// mouse is dragged
			ray = Camera.main.ScreenPointToRay (Input.mousePosition); 
			
			if ( Physics.Raycast (ray, hit, raycastLength, terrainLayerMask) )
			{ 
				//if (hit.collider.name == "Terrain")
				//{
					print ("Hit Terrain 2 " + hit.point);
					//MoveSelectedUnitsToPoint(hit.point);
					leftRectEnd = hit.point;
					ClearSelectedUnitsList();
					SelectUnitsInArea(leftRectStart, leftRectEnd);
				
					lineRenderer.SetPosition(1, leftRectEnd);
				//} 
				//else
				//{
				//	print ("Hit something: " + hit.collider.name);
				//}	
			}			
		}		
		

		
		// if start mousepos = end mousepos (in screen coords) the do a move of the units
		//if (mouseButton1DownPoint == mouseButton1UpPoint) {
			//MoveSelectedUnitsToPoint(mouseButton1DownTerrainHitPoint);
		//}
	}
	
	//if (mouseLeftDrag) {
	//}
	
	
	// Debug rays for selection rect
	Debug.DrawRay(leftRectStart, Vector3.up * 10, Color.red);
	Debug.DrawRay(leftRectEnd, Vector3.up * 10, Color.red);
	//WorldToScreenPoint
	
	
	if (Input.GetButtonDown("Fire2")) 
	{
		mouseButton2DownPoint = Input.mousePosition;
		mouseRightDrag = true;
	}
	
	if (Input.GetButtonUp("Fire2")) 
	{
		mouseRightDrag = false;
		mouseButton2UpPoint = Input.mousePosition;
		if (mouseButton2DownPoint == mouseButton2UpPoint) {
			ClearSelectedUnitsList();
		}
	}
	
	if (mouseRightDrag)
	{
		
		var dragDifference : Vector2 = mouseButton2DownPoint - Input.mousePosition;
		//print("Mouse drag distance: " + dragDifference.x + " " + dragDifference.y);
		
		dragDifference /= 40.0;
		
		moveDirection = new Vector3(-dragDifference.x, 0, -dragDifference.y); 
		// Translating so move relative to where the camera currently is located
		transform.Translate(moveDirection); 
		var speed = 1.0;
		moveDirection *= speed; 

		// Move the controller 
		var controller : CharacterController = GetComponent(CharacterController); 
		controller.Move(moveDirection * Time.deltaTime);
	}
	
	var mouseWheelSpeed : float = 150.0;
	var mouseWheel : float = Input.GetAxis ("Mouse ScrollWheel");
	if (mouseWheel != 0)
	{
		//print("mouse wheel value: " + mouseWheel);
		var currentHeight = transform.position.y;
		currentHeight -= mouseWheel * mouseWheelSpeed * Time.deltaTime;
		if (currentHeight > 150.0) {
			currentHeight = 150.0;
		}
		if (currentHeight < 20.0) {
			currentHeight = 20.0;
		}

		transform.position = Vector3(transform.position.x, currentHeight, transform.position.z);
	}
}

function MoveSelectedUnitsToPoint(targetPoint : Vector3) {
	// For all units that are currently selected, do move to targetPoint
	//tank.SendMessage("MoveToPoint", targetPoint);	
	//var go : GameObject = GameObject.Find("UnitManager");
	//go.SendMessage("MoveSelectedUnits", targetPoint);
	unitManager.MoveSelectedUnitsToPoint(targetPoint);
}

function SelectUnitsInArea(p1 : Vector3, p2 : Vector3) {
	//var um = GameObject.Find("UnitManager").GetComponent("UnitManager");
	// : UnitManager 
	print("SelectUnitsInArea...");
	//um.SelectUnitsInArea(p1, p2);
	unitManager.SelectUnitsInArea(p1, p2);
}

function ClearSelectedUnitsList() {
	//var go : GameObject = GameObject.Find("UnitManager");
	//go.SendMessage("ClearSelectedUnitList");
	unitManager.ClearSelectedUnitsList();
}


