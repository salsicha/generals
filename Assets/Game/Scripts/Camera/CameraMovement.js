//private var mouseButton2DownPoint : Vector2;
//private var mouseButton2UpPoint : Vector2;
//private var mouseRightDrag : boolean = false;

private var moveKeyDown : boolean = false;
private var moveKeyDirection : Vector3 = Vector3(0,0,0);

private var cameraMoveSpeed : int = 40;
private var cameraRotateSpeed : int = 1;

// private var moveKeyDirectionZ;
// private var moveKeyDirectionX;
// private var moveKeyDirection;

private var rotateKeyDown : boolean = false;

private var rotateKeyDirection;
// A speed factor for moving the camera over the terrain. Higher = faster.
var cameraMoveSpeedDamper = 0.02;
var minMaxZoomHeight : Vector2;
var mouseWheelSpeed : float = 150.0;


function Update () {

//	if (Input.GetButtonDown("Fire2")) 
//	{
//		mouseButton2DownPoint = Input.mousePosition;
//		mouseRightDrag = true;
//	}
//	
//	if (Input.GetButtonUp("Fire2")) 
//	{
//		mouseRightDrag = false;
//		mouseButton2UpPoint = Input.mousePosition;
//	}
	
	
	if (Input.GetKeyDown("w") || Input.GetKeyDown("up"))
	{
		// print("w");
		moveKeyDown = true;
		moveKeyDirection += Vector3(0, 0, cameraMoveSpeed); 
		// moveKeyDirectionZ = 50;
	}
	
	if (Input.GetKeyUp("w") || Input.GetKeyUp("up"))
	{
		moveKeyDown = false;
		moveKeyDirection -= Vector3(0, 0, cameraMoveSpeed); 
		// moveKeyDirectionZ = 0;
	}
	
	if (Input.GetKeyDown("s") || Input.GetKeyDown("down"))
	{
		// print("s");
		moveKeyDown = true;
		moveKeyDirection += Vector3(0, 0, -cameraMoveSpeed);
		// moveKeyDirectionZ = -50;
	} 
	
	if (Input.GetKeyUp("s") || Input.GetKeyUp("down"))
	{
		moveKeyDown = false;
		moveKeyDirection -= Vector3(0, 0, -cameraMoveSpeed);
		// moveKeyDirectionZ = 0;
	}
	
	if (Input.GetKeyDown("a") || Input.GetKeyDown("left"))
	{
		// print("a");
		moveKeyDown = true;
		moveKeyDirection += Vector3(-cameraMoveSpeed, 0, 0);
		// moveKeyDirectionX = -50;
	}
	
	if (Input.GetKeyUp("a") || Input.GetKeyUp("left"))
	{
		moveKeyDown = false;
		moveKeyDirection -= Vector3(-cameraMoveSpeed, 0, 0);
		// moveKeyDirectionX = 0;
	}
	
	if (Input.GetKeyDown("d") || Input.GetKeyDown("right"))
	{
		// print("d");
		moveKeyDown = true;
		moveKeyDirection += Vector3(cameraMoveSpeed, 0, 0);
		// moveKeyDirectionX = 50;
	}
	
	if (Input.GetKeyUp("d") || Input.GetKeyUp("right"))
	{
		moveKeyDown = false;
		moveKeyDirection -= Vector3(cameraMoveSpeed, 0, 0);
		// moveKeyDirectionX = 0;
	}
	
	if (Input.GetKeyDown("q"))
	{
		rotateKeyDown = true;
		rotateKeyDirection = new Vector3(0,-cameraRotateSpeed,0);
		// rotateKeyDirection = -1;
	}
	
	if (Input.GetKeyUp("q"))
	{
		rotateKeyDown = false;
		// rotateKeyDirection = 0;
	}
	
	if (Input.GetKeyDown("e"))
	{
		rotateKeyDown = true;
		rotateKeyDirection = new Vector3(0,cameraRotateSpeed,0);
		// rotateKeyDirection = 1;
	}
	
	if (Input.GetKeyUp("e"))
	{
		rotateKeyDown = false;
		// rotateKeyDirection = 0;
	}
	
	if (moveKeyDown)
	{
		transform.Translate(moveKeyDirection * cameraMoveSpeedDamper);
	}
	
	if (rotateKeyDown)
	{
		transform.Rotate(rotateKeyDirection);
	}
	
	
//	if (mouseRightDrag)
//	{
//		
//		var dragDifference : Vector2 = mouseButton2DownPoint - Input.mousePosition;
//		// set the move vector by the drag difference
//		moveDirection = new Vector3(-dragDifference.x, 0, -dragDifference.y); 
//		// Translating so move relative to where the camera currently is located
//		transform.Translate(moveDirection * cameraMoveSpeedDamper); 
//	}
	
	var mouseWheel : float = Input.GetAxis ("Mouse ScrollWheel");
	if (mouseWheel != 0)
	{
		var currentHeight : float = transform.position.y;
		// change the height of the cam according to the movement of the mouse wheel
		currentHeight -= mouseWheel * mouseWheelSpeed * Time.deltaTime;
		// Set (and clamp) min/max height values
		currentHeight = Mathf.Clamp(currentHeight, minMaxZoomHeight.x, minMaxZoomHeight.y);

		transform.position = Vector3(transform.position.x, currentHeight, transform.position.z);
	}
}

