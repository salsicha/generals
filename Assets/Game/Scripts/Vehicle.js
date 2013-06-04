var moveToTarget : boolean = false;
var targetPosition : Vector3;
private var turretRotationForce = 83.5; // 53.5
private var barrelRotationForce = 43.5; // 53.5
private var barrelMinRotation = 20.0;
private var barrelMaxRotation = 330.0;
private var rotationForce = 1.1; // 2.5
private var targetReachedRadius : float = 2.0;
private var maxEngineForce : float = 10.0;// 14.0
private var engineForce : float = 0.0;
private var pitchForce : float = 0.0;
private var accelerationForce : float = 6.0; // 9.0
private var brakeForce : float = 20.0;
private var distanceToDestiantion : float = 0.0;
private var moveMode : MoveModeType = MoveModeType.STOP;
private var maximumFireRange = 80.0;
private var maximumEnemyDetectionRange = 130.0; // TODO HIER WEITERMACHEN MIT ENEMY SCANNING!
var tankHealth : float = 100;
//private var healthPercentage : float = 100;
//gameObject.tag = "tank";

var turret : GameObject;
var target : GameObject;
var barrel : GameObject;

var gunMuzzlePoint : GameObject;

// projectiles
var mainGunProjectile : Rigidbody;

var isSelected : boolean = false;

var healthBarPrefab : GameObject;
private var healthBar : GameObject;

// Skidmarks object
var skidmarks : Skidmarks;
public var lastSkidMark : int = -1;

enum MoveModeType {
	STOP = 1,
	FORWARD = 2	
};

var radarBubble : Transform;
radarBubble = Instantiate(radarBubble);

//print("turret: " + turret);

function Start() {
	//print("Tank start called...");
	var go : GameObject = GameObject.Find("UnitManager");
	go.SendMessage("AddUnit", gameObject);
	
	healthBar = Instantiate(healthBarPrefab, transform.position, Quaternion.identity);
	healthBar.transform.parent = gameObject.transform;
	healthBar.transform.position.y += 5;
	
	SetUnitSelected(false);
	
	//find skidmark object
    //var skidmarks : Skidmarks = GameObject.Find("Skidmarks").GetComponent(Skidmarks);
	skidmarks = GameObject.FindObjectOfType(Skidmarks);
	skidmarks.TestSkidmarks();
	//(Skidmarks)
}

function Update () {

	radarBubble.transform.position = transform.position;

	if (moveToTarget) {
		
		var rotation = Quaternion.LookRotation(targetPosition - transform.position);
		str = Mathf.Min (rotationForce * Time.deltaTime, 1); 
		transform.rotation = Quaternion.Lerp(transform.rotation, rotation, str);
		
		// Check direction angle. If greater than 60° then first turn without moving, otherwise full throttle ahead.
		var targetDir = targetPosition - transform.position;
		var forward = transform.forward;
		var angle = Vector3.Angle(targetDir, forward);
		if (angle > 60.0) {
			moveMode = MoveModeType.STOP;
		} else {
			moveMode = MoveModeType.FORWARD;
		}
		
		// Add tank tracks
		//lastSkidMark = skidmarks.AddSkidMark(rigidbody.position, rigidbody.rotation.eulerAngles, 1, lastSkidMark);
		
		// check the distance
		distanceToDestiantion = Vector3.Distance(targetPosition, transform.position);
		//print ("Distance to other: " + dist);
		if (distanceToDestiantion < targetReachedRadius) {
			moveMode = MoveModeType.STOP;
			moveToTarget = false;
			distanceToDestiantion = 0.0;
		}
	}
	
	// If enemy is set, turn turret
	if (target) {

		// Rotation (Yaw) of the turret
		var targetVectorTurret : Vector3 = target.transform.position - turret.transform.position;
		var localTurretHeading : Vector3 = turret.transform.InverseTransformDirection(targetVectorTurret);
		var requiredYaw : float = Mathf.Rad2Deg * Mathf.Atan2(localTurretHeading.x, localTurretHeading.z);
		//var requiredPitch : float = Vector3.Angle(Vector3.up, localTurretHeading) - 90.0;
			//var deltaYaw = (requiredYaw / 10) * turretRotationForce * Time.deltaTime;
			//deltaYaw = Mathf.Clamp(deltaYaw, -2.0, 2.0);
		var deltaYaw = Mathf.Clamp((requiredYaw / 10) * turretRotationForce, -45.0, 45.0) * Time.deltaTime;
		turret.transform.Rotate(Vector3.up, deltaYaw, Space.Self);
		
		// Pitch of the barrel
		var targetVectorBarrel : Vector3 = target.transform.position - barrel.transform.position;
		var localBarrelHeading : Vector3 = barrel.transform.InverseTransformDirection(targetVectorBarrel);
		var requiredPitch : float = Vector3.Angle(Vector3.up, localBarrelHeading) - 90.0;
		
		var deltaPitch = Mathf.Clamp((requiredPitch / 10) * barrelRotationForce, -45.0, 45.0) * Time.deltaTime;
		//print("requiredPitch: " + requiredPitch + " barrel.x: " + barrel.transform.localEulerAngles.x + " " + deltaPitch);
		//if (barrel.transform.localEulerAngles.x > 20 && barrel.transform.localEulerAngles.x < 340) {
		//	deltaPitch = 0;
		//}
		barrel.transform.Rotate(Vector3.right, deltaPitch, Space.Self);
		
		// Check pitch bounds
		var pitchBounds : Vector3 = barrel.transform.localEulerAngles;
		//print("pitchBounds: " + pitchBounds);
		if (barrel.transform.localEulerAngles.x > barrelMinRotation && barrel.transform.localEulerAngles.x < 180) {
			pitchBounds.x = barrelMinRotation;
		} else if (barrel.transform.localEulerAngles.x < barrelMaxRotation && barrel.transform.localEulerAngles.x > 180) {
			pitchBounds.x = barrelMaxRotation;
		}		
		barrel.transform.localEulerAngles = pitchBounds;
		
		// Draw Debug Ray
		//var forward = barrel.transform.TransformDirection(Vector3.forward) * 10;
		//Debug.DrawRay (barrel.transform.position, Vector3.forward * 10, Color.green);
		//Debug.DrawRay (barrel.transform.position, barrel.transform.eulerAngles, Color.green);
	}
}


function OnCollisionEnter(other : Collision) 
{

//	networkView.RPC ("recordDamage", RPCMode.All, tankHealth);

	print("collision, this network player: " + Network.player);
	
	print("this game object name: " + gameObject.name);
		
	if (other.gameObject.tag == "bullet")
	{
		
//		if (Network.isServer)
//		{

		if (Network.player != other.gameObject.networkView.group)
		{
			print("network player: " + Network.player);
			print("other group id: " + other.gameObject.networkView.group);
			
			networkView.RPC ("recordDamage", RPCMode.All, tankHealth);
		}
					
//			print("collision owner number: " + other.gameObject.networkView.owner);
//
//			tankHealth -= 30;
//			
//			print("this tank health: " + gameObject.GetComponent("Vehicle").tankHealth);
//			
//			healthPercentage = tankHealth/100.00;
//			
//			healthBar.GetComponent("HealthBar").transform.localScale.x = tankHealth/100.0;
//
//			if (tankHealth < 1)
//			{
//				DestroyObject(gameObject);
//			}
//		}


		
//		if (Network.player != other.gameObject.networkView.group)
//		{			
//			print("tank was hit by an opponent");
		
//			print("bullet network group: " + other.gameObject.networkView.group);
			
//			print("bullet hit");
			
//			tankHealth -= 30;
			
//			healthPercentage = tankHealth/100.00;
	
//			print("this tank's health: " + tankHealth);
			
//			healthBar.GetComponent("HealthBar").transform.localScale.x = tankHealth/100.0;
//			
//			print(gameObject.name + " health: " + tankHealth);
//			
//			if (tankHealth < 1)
//			{
//				DestroyObject(gameObject);
//			}
//		}

	}
}


@RPC
function recordDamage (myTankHealth : float, info : NetworkMessageInfo)
{
//			print("collision owner number: " + other.gameObject.networkView.owner);

//			print(" this game object name: " + this.gameObject.name);

			tankHealth -= 30;
			
//			gameObject.GetComponent("Vehicle").tankHealth -= 30;
			
			print("this tank health: " + gameObject.GetComponent("Vehicle").tankHealth);
			
			healthPercentage = tankHealth/100.00;
			
			healthBar.GetComponent("HealthBar").transform.localScale.x = tankHealth/100.0;

			if (tankHealth < 1)
			{
				DestroyObject(gameObject);
			}
	
	
	
//	print("my tank health: " + myTankHealth);
	
//	print(" this game object health: " + tankObject.GetComponent("Vehicle").tankHealth);
//	print("record damage to tank");
//	print("damage from: " + info.sender + ", -1 is Terrain");

}

function OnCollisionStay(collision : Collision) 
{	
    // Debug-draw all contact points and normals
    for (var contact : ContactPoint in collision.contacts) {
        Debug.DrawRay(contact.point, contact.normal, Color.white);
    }
}

function Awake() {
	
	FireMainGun();
}

function FireMainGun() {

	var playerNumber = Network.player;
	
//	print("player number during fire: " + playerNumber);

	if (isTargetInFiringArc()) {
		var instantiatedProjectile : Rigidbody = Network.Instantiate (mainGunProjectile, gunMuzzlePoint.transform.position, gunMuzzlePoint.transform.rotation, 0);
		instantiatedProjectile.velocity = gunMuzzlePoint.transform.TransformDirection(Vector3 (0, 0, 80.0));
		audio.Play();
		 //instantiatedProjectile.velocity = transform.TransformDirection (Vector3.forward * 10);
	
		//var direction = transform.TransformDirection(Vector3.forward); 
		//instantiatedProjectile.velocity = direction;
		//Physics.IgnoreCollision(instantiatedProjectile.collider, barrel.transform.root.collider); 
	}
	yield WaitForSeconds(3.5);
	//FireMainGun();
	StartCoroutine("FireMainGun");
	//yield 
}

function isTargetInFiringArc()
{
	if (target)
	{
		var position : Vector3 = barrel.transform.position;
		var direction : Vector3 = target.transform.position - position;
		var distance : float = direction.magnitude;

		var angle : float = Vector3.Angle(barrel.transform.forward, direction);
		var halfFireingArc = 5.0;
		//print("angle: " + angle);
		if (angle < halfFireingArc && distance < maximumFireRange)
		{
			return true;
			// RaycastHit hit;
			// if(Physics.Raycast(position, direction, out hit, distance))
			// {
			// 	if(hit.distance > distance - 3.0f)
			// 		return true;
			// }
		}
	}

	return false;
}

function FixedUpdate() {
	
	switch (moveMode)  {
		case MoveModeType.STOP:
			engineForce -= brakeForce * Time.deltaTime;
			if (engineForce < 0) {
				engineForce = 0;
			}
			// no pitchforce if we stop!
			pitchForce = 0.0;
			break;
		case MoveModeType.FORWARD:
			engineForce += accelerationForce * Time.deltaTime;
			if (engineForce > maxEngineForce) {
				engineForce = maxEngineForce;
			}
			
			var pitchAngle = transform.localEulerAngles.x;
			if (pitchAngle > 180) {
				// vehicle's nose is up, value is below 360°. Normalize to -x degree.
				pitchAngle = -(360 - pitchAngle); // now normalized to (+/-)0-x degree
			}
			pitchForce = maxEngineForce * pitchAngle / 100.0;
			// if (pitchForce > (maxEngineForce / 2.0)) {
			// 				pitchForce = maxEngineForce / 2.0;
			// 			}
			//print("pitchAngle: " + pitchAngle + " pitchForce: " + pitchForce);
			break;
	}

	//if (moveToTarget && allowedToMove) {
		//rigidbody.AddRelativeForce (0, 0, 10);
		//var speed = Vector3 (3, 0, 0);
		//rigidbody.MovePosition(rigidbody.position + speed * Time.deltaTime);
		transform.Translate(Vector3.forward * Time.deltaTime * (engineForce + pitchForce));
	//}
}

function MoveToPoint(newTarget : Vector3) {
	moveToTarget = true;
	moveMode = MoveModeType.FORWARD;
	targetPosition = newTarget;
	//print ("Tank moving to: " + targetPosition);
}

// Gets called from the unit manager when this unit gets selected
function SetUnitSelected(selected : boolean) {
	isSelected = selected;
	healthBar.GetComponent("HealthBar").SetHealthEnabled(isSelected);
}

function SetSelected() {
	print("I got selected... " + name);
	var go : GameObject = GameObject.Find("UnitManager");
	go.SendMessage("AddSelectedUnit", gameObject);
}

function SetTarget(newTarget : UnityEngine.GameObject)
{	
	
	print("old target: " + target);
	
	target = newTarget;

	print("new target: " + target);

}

